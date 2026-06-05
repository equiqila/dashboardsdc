import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, children, action, className }: ChartCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-border p-6 shadow-sm ${className ?? ""}`}
    >
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h3
            className="text-lg font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
