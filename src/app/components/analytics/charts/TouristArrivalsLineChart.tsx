import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TouristArrivalChartPoint } from "../../../data/types";
import { TOOLTIP_STYLE, CHART_COLORS } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";
import { formatNumber } from "../useChartLoading";

interface Props {
  data: TouristArrivalChartPoint[];
}

function TouristArrivalsLineChartComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No tourist arrival data for selected destination." />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatNumber(v)}
          label={{
            value: "Number of Tourists",
            angle: -90,
            position: "insideLeft",
            fontSize: 12,
          }}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: number) => [formatNumber(value), "Tourist Arrivals"]}
        />
        <Line
          type="monotone"
          dataKey="arrivals"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Tourist Arrivals"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export const TouristArrivalsLineChart = memo(TouristArrivalsLineChartComponent);
