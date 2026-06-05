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
import type { AttractivenessRankingPoint } from "../../../data/types";
import { CHART_COLORS, TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
  data: AttractivenessRankingPoint[];
}

function AttractivenessRankingBarComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No ranking data for selected year." />;

  const chartData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height={Math.max(280, data.length * 36)}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="destination"
          type="category"
          width={160}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: number) => [value, "Attractiveness Score"]}
        />
        <Bar
          dataKey="score"
          fill={CHART_COLORS.primary}
          radius={[0, 4, 4, 0]}
          name="Score"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const AttractivenessRankingBar = memo(AttractivenessRankingBarComponent);
