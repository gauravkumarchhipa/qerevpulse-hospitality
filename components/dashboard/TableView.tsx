"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "@/layout/common/BaseDialog";
import {
  expenseCategoriesDataNew,
  expenseCategoriesDataNewYTD,
} from "@/lib/dashboard/overview/table2";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AnimatePresence, motion } from "framer-motion";

const headers = [
  "Description",
  "Actual 2024",
  "Actual 2024 %",
  "Actual 2023",
  "Actual 2023 %",
  "Budget 2024",
  "%",
  "Act. '24 vs Act.'23",
  "Act. Vs Bud. 2024",
  "Remarks",
];

const numericKeys = new Set(headers.slice(1, 9));

const rowColors = [
  "bg-[#f0f9ff] dark:bg-[#02042e]",
  "bg-[#fdf2f8] dark:bg-[#29074a]",
  "bg-[#ecfdf5] dark:bg-[#232c3f]",
  "bg-[#f3f4f6] dark:bg-[#374151]",
  "bg-[#fef2f2] dark:bg-[#08215b]",
  "bg-[#fefce8] dark:bg-[#854d0e]",
];

const formatValue = (val: any, forceSign = false) => {
  if (val === null || val === undefined || val === "") {
    return { display: "-", isNegative: false, isPositive: false, icon: null };
  }

  const num = Number(val);
  if (isNaN(num)) {
    return { display: val, isNegative: false, isPositive: false, icon: null };
  }

  const isInteger = Number.isInteger(num);
  const abs = isInteger ? Math.abs(num) : Math.abs(num).toFixed(2);
  const display = forceSign
    ? `${num > 0 ? "+" : num < 0 ? "-" : ""}${abs}`
    : isInteger
    ? num.toString()
    : num.toFixed(2);

  const icon =
    forceSign && num > 0 ? (
      <ArrowUpIcon className="inline w-3 h-3 ml-1" />
    ) : forceSign && num < 0 ? (
      <ArrowDownIcon className="inline w-3 h-3 ml-1" />
    ) : null;

  return { display, isNegative: num < 0, isPositive: num > 0, icon };
};

const safeAverage = (values: any[]) =>
  values
    .map(Number)
    .filter((v) => !isNaN(v) && v !== 0)
    .reduce((a, b) => a + b, 0) / values.length || 0;

const computeGroupSummary = (rows: any[], keys: string[], groupKey: string) => {
  const summary: Record<string, string> = {};

  if (groupKey === "Revenue") {
    const directRevenueRow = rows.find(
      (row) => row.Description === "Direct Revenue"
    );
    if (directRevenueRow) {
      keys.forEach((key) => {
        const val = directRevenueRow[key];
        summary[key] =
          val !== undefined && val !== null && val !== "" ? String(val) : "0";
      });
    } else {
      keys.forEach((key) => (summary[key] = "0"));
    }
    return summary;
  }

  keys.forEach((key) => {
    const values = rows.map((row) => Number(row[key])).filter((v) => !isNaN(v));
    if (key.includes("%")) {
      const avg =
        values.length > 0
          ? values.reduce((a, b) => a + b, 0) / values.length
          : 0;
      summary[key] = avg.toFixed(4);
    } else {
      const total = values.reduce((a, b) => a + b, 0);
      summary[key] = total.toFixed(2);
    }
  });

  return summary;
};

const ExpenseTable = () => {
  const view = useSelector(
    (state: RootState) => state.filters.appliedFilters?.view,
    shallowEqual
  );

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [selectedRowTitle, setSelectedRowTitle] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  const [tableOneData] = useMemo(() => {
    const isMonth = view === "month";
    return [isMonth ? expenseCategoriesDataNew : expenseCategoriesDataNewYTD];
  }, [view]);

  const toggleRow = (groupKey: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex justify-between mb-2">
          <h2 className="text-base font-semibold  mb-4  text-black dark:text-white">
            Expense Categories
          </h2>
          <Button size="sm">Export</Button>
        </div>

        <div className="max-h-[450px] border rounded-md bg-white dark:bg-black  overflow-auto relative">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="sticky top-0 z-50 bg-blue-100 dark:bg-blue-900">
                <TableHead className="sticky top-0 left-0 z-50 bg-blue-100 dark:bg-blue-900 w-8" />
                {headers.map((header) => (
                  <TableHead
                    key={header}
                    className={`sticky top-0 z-50 bg-blue-100 dark:bg-blue-900 text-black dark:text-white font-semibold ${
                      numericKeys.has(header) ? "text-right" : "text-left"
                    } whitespace-nowrap`}
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.entries(tableOneData[0]).map(
                ([groupKey, rows], groupIdx) => {
                  const colorClass = rowColors[groupIdx % rowColors.length];

                  return (
                    <React.Fragment key={groupKey}>
                      <TableRow
                        className={`${colorClass} font-semibold text-black dark:text-white`}
                      >
                        <TableCell className="sticky left-0 bg-inherit text-center z-40">
                          <button onClick={() => toggleRow(groupKey)}>
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${
                                expandedRows[groupKey] ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                        </TableCell>
                        <TableCell className="text-left">{groupKey}</TableCell>

                        {headers.slice(1, 9).map((key) => {
                          const isVariance =
                            key === "Act. '24 vs Act.'23" ||
                            key === "Act. Vs Bud. 2024";

                          const { display, isNegative, isPositive, icon } =
                            formatValue(
                              computeGroupSummary(
                                rows as any[],
                                headers.slice(1, 9),
                                groupKey
                              )[key],
                              isVariance
                            );

                          const highlightClass = isVariance
                            ? isNegative
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : isPositive
                              ? "text-green-600 dark:text-green-400 font-semibold"
                              : ""
                            : "";

                          return (
                            <TableCell
                              key={key}
                              className={`text-right ${highlightClass}`}
                            >
                              <span className="flex justify-end items-center">
                                {display}
                                {isVariance && icon}
                              </span>
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">
                          <span
                            onClick={() => {
                              setSelectedRow(rows);
                              setSelectedRowTitle(groupKey);
                              setOpen(true);
                            }}
                            className="text-blue-600 underline cursor-pointer"
                          >
                            View
                          </span>
                        </TableCell>
                      </TableRow>

                      <AnimatePresence initial={false}>
                        {expandedRows[groupKey] &&
                          (rows as any[]).map((row, idx) => (
                            <motion.tr
                              key={`${groupKey}-${idx}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4 }}
                              className={`border-b border-gray-200 dark:border-gray-700 ${colorClass}`}
                            >
                              <TableCell className="sticky left-0 z-40 bg-inherit p-0">
                                <div className="p-4 text-center">
                                  <ChevronRight className="h-4 w-4 invisible" />
                                </div>
                              </TableCell>

                              {headers.slice(0, 9).map((key) => {
                                const isVariance =
                                  key === "Act. '24 vs Act.'23" ||
                                  key === "Act. Vs Bud. 2024";
                                const {
                                  display,
                                  isNegative,
                                  isPositive,
                                  icon,
                                } = formatValue(row[key], isVariance);
                                const highlightClass =
                                  isVariance && isNegative
                                    ? "text-red-600 dark:text-red-400 font-semibold"
                                    : isVariance && isPositive
                                    ? "text-green-600 dark:text-green-400 font-semibold"
                                    : "";
                                const justify = numericKeys.has(key)
                                  ? "justify-end"
                                  : "justify-start";

                                return (
                                  <TableCell key={key} className="p-0">
                                    <div
                                      className={`p-4 flex items-center ${highlightClass} ${
                                        numericKeys.has(key)
                                          ? "text-right"
                                          : "text-left"
                                      } ${justify}`}
                                    >
                                      {display}
                                      {isVariance && icon}
                                    </div>
                                  </TableCell>
                                );
                              })}

                              <TableCell className="p-0">
                                <div className="p-4 text-center">
                                  {row["AI_Remarks"] ? (
                                    <span
                                      onClick={() => {
                                        setSelectedRow(row);
                                        setOpen(true);
                                      }}
                                      className="text-blue-600 underline cursor-pointer"
                                    >
                                      View
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog */}
      {open && (
        <BaseDialog
          open={open}
          onOpenChange={setOpen}
          title="Insight"
          description={`Details for: ${
            selectedRow?.length > 0
              ? selectedRowTitle
              : selectedRow?.Description
          }`}
          onCancel={() => {
            setOpen(false);
          }}
          maxHeight={500}
          maxWidth={600}
        >
          <div className="text-sm whitespace-pre-line">
            {selectedRow?.length > 0 ? (
              <div className="space-y-4">
                {selectedRow.map((data: any, i: number) => (
                  <div key={i}>
                    <strong>{data?.Description} Remarks:</strong>{" "}
                    {data?.AI_Remarks || "-"}
                  </div>
                ))}
              </div>
            ) : (
              <p>
                <strong>AI Remarks:</strong> {selectedRow?.AI_Remarks || "-"}
              </p>
            )}
          </div>
        </BaseDialog>
      )}
    </>
  );
};

export default ExpenseTable;
