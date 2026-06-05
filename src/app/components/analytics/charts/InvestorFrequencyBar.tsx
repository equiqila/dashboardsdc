import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { InvestorFrequencyPoint } from "../../../data/types";
import { CHART_COLORS, TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";
import { formatCurrency } from "../useChartLoading";

interface Props {
  data: InvestorFrequencyPoint[];
  compact?: boolean;
}

function InvestorFrequencyBarComponent({ data, compact }: Props) {
  if (!data.length) return <ChartEmptyState message="No investor data for selected category." />;

  const chartHeight = compact
    ? Math.max(200, data.length * 28 + 48)
    : Math.max(220, data.length * 32 + 56);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 9 }}
          angle={-40}
          textAnchor="end"
          height={compact ? 64 : 72}
          interval={0}
        />
        <YAxis tick={{ fontSize: 11 }} width={36} />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as InvestorFrequencyPoint;
            return (
              <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                <p className="font-semibold text-foreground mb-1">{d.name}</p>
                <p className="text-muted-foreground">Count: {d.count}</p>
                <p className="text-muted-foreground">
                  Total Value: {formatCurrency(d.totalValue)}
                </p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="count"
          fill={CHART_COLORS.secondary}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
          name="Investment Count"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const InvestorFrequencyBar = memo(InvestorFrequencyBarComponent);
