import { useEffect, useState } from "react";

/**
 * Simulates async data refresh on filter changes for loading state UX.
 */
export function useChartLoading(deps: unknown[], delay = 280): boolean {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}

export function formatNumber(n: number): string {
  const format = (val: number, unit: string) => {
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1);
    return `${formatted}${unit}`;
  };

  if (n >= 1_000_000_000) return format(n / 1_000_000_000, "B");
  if (n >= 1_000_000) return format(n / 1_000_000, "M");
  if (n >= 1_000) return format(n / 1_000, "K");
  return n.toLocaleString();
}

export function formatCurrency(n: number): string {
  if (n >= 1000) return `Rp${(n / 1000).toFixed(1)}T`;
  return `Rp${n}B`;
}
