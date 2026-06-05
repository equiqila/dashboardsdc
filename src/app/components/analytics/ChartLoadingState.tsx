interface ChartLoadingStateProps {
  height?: number;
}

export function ChartLoadingState({ height = 280 }: ChartLoadingStateProps) {
  return (
    <div className="space-y-4 animate-pulse" style={{ height }}>
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-full bg-muted/60 rounded-lg min-h-[200px]" />
    </div>
  );
}
