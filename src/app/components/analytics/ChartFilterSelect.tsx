import type { FilterOption } from "./FilterBar";

interface ChartFilterSelectProps {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export function ChartFilterSelect({
  label = "Filter",
  value,
  options,
  onChange,
}: ChartFilterSelectProps) {
  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px]"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
