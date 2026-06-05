import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  source?: string;
  icon: LucideIcon;
  loading?: boolean;
}

export function KpiCard({ title, value, source, icon: Icon, loading }: KpiCardProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          {loading ? (
            <div className="h-9 w-32 bg-muted animate-pulse rounded mb-1" />
          ) : (
            <p
              className="text-3xl font-semibold text-foreground mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {value}
            </p>
          )}
          {source && !loading && (
            <p className="text-xs text-muted-foreground">{source}</p>
          )}
        </div>
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
