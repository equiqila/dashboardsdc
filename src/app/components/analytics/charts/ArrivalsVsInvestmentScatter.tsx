import { memo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Cell,
} from "recharts";
import type { ArrivalsVsInvestmentPoint } from "../../../data/types";
import { CHART_COLORS, DESTINATION_LINE_COLORS, TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";
import { formatNumber, formatCurrency } from "../useChartLoading";

interface Props {
  data: ArrivalsVsInvestmentPoint[];
}

function ArrivalsVsInvestmentScatterComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No correlation data for selected filters." />;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          type="number"
          dataKey="arrivals"
          name="Tourist Arrivals"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => formatNumber(v)}
          label={{
            value: "Tourist Arrivals",
            position: "bottom",
            offset: 20,
            fontSize: 12,
            fill: "#6b7280"
          }}
        />
        <YAxis
          type="number"
          dataKey="investmentValue"
          name="Investment Value"
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => formatNumber(v)}
          width={60}
          label={{
            value: "New Investment (B Rp)",
            angle: -90,
            position: "insideLeft",
            offset: -10,
            fontSize: 12,
            fill: "#6b7280"
          }}
        />
        <ZAxis range={[80, 400]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as ArrivalsVsInvestmentPoint;
            return (
              <div
                className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm"
                style={TOOLTIP_STYLE}
              >
                <p className="font-semibold text-foreground mb-1">{d.destination}</p>
                <p className="text-muted-foreground">
                  Tourists: {formatNumber(d.arrivals)}
                </p>
                <p className="text-muted-foreground">
                  Investment: {formatCurrency(d.investmentValue)}
                </p>
              </div>
            );
          }}
        />
        <Scatter data={data} fill={CHART_COLORS.primary}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={DESTINATION_LINE_COLORS[index % DESTINATION_LINE_COLORS.length]}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export const ArrivalsVsInvestmentScatter = memo(ArrivalsVsInvestmentScatterComponent);
