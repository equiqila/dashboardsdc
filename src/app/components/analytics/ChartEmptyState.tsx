import { BarChart3 } from "lucide-react";

interface ChartEmptyStateProps {
  message?: string;
  height?: number;
}

export function ChartEmptyState({
  message = "No data available for the selected filters.",
  height = 280,
}: ChartEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-muted-foreground"
      style={{ height }}
    >
      <BarChart3 className="h-10 w-10 mb-3 opacity-40" />
      <p className="text-sm text-center max-w-xs">{message}</p>
    </div>
  );
}
