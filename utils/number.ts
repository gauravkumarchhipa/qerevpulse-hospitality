// utils/number.ts
export function formatKM(n?: number | null): string {
  if (n == null || isNaN(Number(n))) return "0.00";
  const v = Number(n);
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);

  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000)     return `${sign}${(abs / 1_000).toFixed(2)}K`;
  return `${sign}${abs.toFixed(2)}`;
}
