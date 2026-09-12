"use client";

import { useMemo, useState, useRef, useLayoutEffect, useCallback } from "react";
import type { HierarchyNode } from "d3-hierarchy";
import { hierarchy, Tree } from "@visx/hierarchy";
import { Group } from "@visx/group";
import ResizeObserver from "resize-observer-polyfill";
import { useTheme } from "@/app/theme-provider";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { revenueTreeData as FALLBACK } from "@/lib/daily/DailyData";

type TreeNode = HierarchyNode<any>;

function Loader({ height = 500 }: { height?: number }) {
  return (
    <div className="w-full rounded-md border border-dashed" style={{ height }}>
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Loading hierarchy…
      </div>
    </div>
  );
}

const nodeKey = (n: TreeNode) =>
  n
    .ancestors()
    .map((a) => String(a.data.name))
    .reverse()
    .join(" > ");

const makeIsVisible =
  (activeAtDepth: Record<number, string | undefined>) =>
  (n: TreeNode): boolean => {
    if (n.depth <= 1) return true;
    const p = n.parent;
    if (!p) return false;
    return nodeKey(p) === activeAtDepth[p.depth];
  };

export default function RevenueHierarchyChart() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [activeAtDepth, setActiveAtDepth] = useState<
    Record<number, string | undefined>
  >({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { kpis }: any = useSelector((s: RootState) => s.dailyKpi);

  const src = kpis?.revenueHierarchy ?? FALLBACK;
  const root = useMemo(() => (src ? hierarchy(src) : null), [src]);

  useLayoutEffect(() => {
    if (!root) return;
    setActiveAtDepth((prev) => (Object.keys(prev).length ? prev : {}));
  }, [root]);

  // Resize observer
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        setDimensions({
          width: Math.max(320, width),
          height: Math.max(260, height),
        });
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const onToggle = useCallback((node: TreeNode) => {
    const depth = node.depth;
    const key = nodeKey(node);
    setActiveAtDepth((prev) => {
      const next = { ...prev, [depth]: key };
      for (const k of Object.keys(next))
        if (+k > depth) delete (next as any)[k];
      return next;
    });
  }, []);

  if (!root) return <Loader height={500} />;

  const { width, height } = dimensions;
  const leftPadding = 80;
  const rightPadding = 340;
  const topPadding = 20;
  const bottomPadding = 60;

  const chartTop = topPadding;
  const chartBottom = height - bottomPadding;
  const clampPad = 14; // breathing room for labels

  const isVisible = makeIsVisible(activeAtDepth);

  // bar width
  const barWidth = (n: TreeNode) => {
    const v = Number(n.data.value) || 0;
    const divisor = n.depth === 0 ? 120000 : n.depth === 1 ? 60000 : 20000;
    const w = Math.max(60, v / divisor);
    return Math.min(w, 260);
  };

  const hasChildren = (n: TreeNode) =>
    Array.isArray(n.children) && n.children.length > 0;

  // spacing (depth-2 & depth-3 only)
  const GAP_FOR_CHILDREN_OF: Record<number, number> = { 1: 36, 2: 28 };

  // labels under bars for root & level-1
  const renderUnderLabels = (
    w: number,
    h: number,
    name: string,
    value: number,
    dark: boolean
  ) => (
    <>
      <text
        x={w / 2}
        y={h / 2 + 14}
        fontSize={13}
        fontWeight={600}
        fill={dark ? "#eee" : "#111"}
        textAnchor="middle"
      >
        {name.length > 28 ? name.slice(0, 28) + "…" : name}
      </text>
      <text
        x={w / 2}
        y={h / 2 + 28}
        fontSize={12}
        fill={dark ? "#ccc" : "#444"}
        textAnchor="middle"
      >
        {(Number(value) || 0).toLocaleString()}
      </text>
    </>
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-md overflow-visible"
    >
      <svg
        width={width}
        height={height}
        style={{ overflow: "visible" }}
        preserveAspectRatio="xMinYMin"
      >
        <rect
          width={width}
          height={height}
          fill={"hsl(var(--background))"}
          rx={14}
        />

        <Tree
          root={root}
          size={[height - topPadding * 2, width - leftPadding - rightPadding]}
          separation={(a, b) => (a.parent === b.parent ? 1.2 : 1.6)}
        >
          {(tree) => {
            // visibility
            const hidden = new Set<string>();
            for (const n of tree.descendants()) {
              if (!isVisible(n))
                for (const d of n.descendants()) hidden.add(nodeKey(d));
            }
            const visible = (n: TreeNode) => !hidden.has(nodeKey(n));

            // Y positions (adjustable for depth>=2)
            const yByKey = new Map<string, number>();
            const getY = (n: TreeNode | any) =>
              yByKey.has(nodeKey(n)) ? (yByKey.get(nodeKey(n)) as number) : n.x;

            // identify topmost & bottommost level-1 nodes
            const level1 = tree
              .descendants()
              .filter((n) => n.depth === 1)
              .sort((a, b) => a.x - b.x);
            const topLevel1 = level1[0];
            const bottomLevel1 = level1[level1.length - 1];

            // helper: place kids with clamping (used for the top & bottom branches)
            const placeWithClamp = (kids: TreeNode[], desiredGap: number) => {
              if (!kids.length) return;

              const minTarget = chartTop + clampPad;
              const maxTarget = chartBottom - clampPad;

              // if only one child, just center within bounds closest to the parent
              if (kids.length === 1) {
                const parentY = getY(kids[0].parent!);
                const y = Math.min(Math.max(parentY, minTarget), maxTarget);
                yByKey.set(nodeKey(kids[0]), y);
                return;
              }

              // try with desired gap
              const parentY = getY(kids[0].parent!);
              let firstY = parentY - ((kids.length - 1) * desiredGap) / 2;
              let ys = kids.map((_, i) => firstY + i * desiredGap);

              let minY = Math.min(...ys);
              let maxY = Math.max(...ys);

              // if span doesn't fit, shrink gap to fit exactly
              const avail = maxTarget - minTarget;
              const span = (kids.length - 1) * desiredGap;
              if (span > avail) {
                const gap = avail / (kids.length - 1);
                firstY = minTarget;
                ys = kids.map((_, i) => firstY + i * gap);
              } else {
                // otherwise shift into window if needed
                if (minY < minTarget) {
                  const d = minTarget - minY;
                  ys = ys.map((v) => v + d);
                  minY += d;
                  maxY += d;
                }
                if (maxY > maxTarget) {
                  const d = maxTarget - maxY;
                  ys = ys.map((v) => v + d);
                }
              }

              ys.forEach((y, i) => yByKey.set(nodeKey(kids[i]), y));
            };

            // lay out children
            const nodesByDepthAsc = tree
              .descendants()
              .slice()
              .sort((a, b) => a.depth - b.depth);
            for (const parent of nodesByDepthAsc) {
              if (!(parent.depth in GAP_FOR_CHILDREN_OF) || !visible(parent))
                continue;

              const kids = (parent.children ?? []).filter(visible);
              if (!kids.length) continue;

              const gap = GAP_FOR_CHILDREN_OF[parent.depth];

              // clamp for the very first (top) and very last (bottom) level-1 parents
              if (
                (topLevel1 && parent === topLevel1) ||
                (bottomLevel1 && parent === bottomLevel1)
              ) {
                placeWithClamp(kids, gap);
                continue;
              }

              // default placement for other parents
              const centerY = getY(parent);
              const firstY = centerY - ((kids.length - 1) * gap) / 2;
              kids.forEach((child, i) =>
                yByKey.set(nodeKey(child), firstY + i * gap)
              );
            }

            return (
              <Group top={topPadding} left={leftPadding}>
                {/* links */}
                {tree.links().map((link, i) => {
                  if (!visible(link.source) || !visible(link.target))
                    return null;
                  const y1 = getY(link.source);
                  const y2 = getY(link.target);
                  return (
                    <line
                      key={i}
                      x1={link.source.y}
                      y1={y1}
                      x2={link.target.y}
                      y2={y2}
                      stroke="#d1d5db"
                    />
                  );
                })}

                {/* nodes */}
                {tree.descendants().map((node, i) => {
                  if (!visible(node)) return null;

                  const w = barWidth(node);
                  const h = 26;
                  const x = node.y;
                  const y = getY(node);

                  const activeHere =
                    activeAtDepth[node.depth] === nodeKey(node);
                  const isRootOrFirst = node.depth <= 1;

                  return (
                    <Group
                      key={i}
                      top={y}
                      left={x}
                      style={{
                        cursor: hasChildren(node) ? "pointer" : "default",
                      }}
                      onClick={() => hasChildren(node) && onToggle(node)}
                    >
                      {/* bar */}
                      <rect
                        y={-h / 2}
                        width={w}
                        height={h}
                        fill={node.data.color || "#999"}
                        rx={4}
                        opacity={node.depth > 1 && !activeHere ? 0.85 : 1}
                      />

                      {/* labels */}
                      {isRootOrFirst ? (
                        renderUnderLabels(
                          w,
                          h,
                          String(node.data.name),
                          Number(node.data.value) || 0,
                          isDark
                        )
                      ) : (
                        <>
                          <text
                            dx={w + 12}
                            dy={-2}
                            fontSize={13}
                            fontWeight={600}
                            fill={isDark ? "#eee" : "#111"}
                          >
                            {String(node.data.name).length > 28
                              ? String(node.data.name).slice(0, 28) + "…"
                              : String(node.data.name)}
                          </text>
                          <text
                            dx={w + 12}
                            dy={13}
                            fontSize={12}
                            fill={isDark ? "#ccc" : "#444"}
                          >
                            {(Number(node.data.value) || 0).toLocaleString()}
                          </text>
                        </>
                      )}

                      {/* toggle symbol */}
                      {hasChildren(node) && (
                        <text
                          x={w + 100}
                          dy={5}
                          fontSize={18}
                          fill={isDark ? "#888" : "#999"}
                          style={{ userSelect: "none" }}
                        >
                          {activeHere ? "×" : "+"}
                        </text>
                      )}
                    </Group>
                  );
                })}
              </Group>
            );
          }}
        </Tree>
      </svg>
    </div>
  );
}
