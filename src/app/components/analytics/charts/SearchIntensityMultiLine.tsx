import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SearchIntensityChartPoint } from "../../../data/types";
import { TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface LineConfig {
  key: string;
  name: string;
  color: string;
}

interface Props {
  data: SearchIntensityChartPoint[];
  lines: LineConfig[];
}

function SearchIntensityMultiLineComponent({ data, lines }: Props) {
  if (!data.length || !lines.length) {
    return <ChartEmptyState message="Select destinations to compare search intensity trends." />;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: "Search Intensity",
            angle: -90,
            position: "insideLeft",
            fontSize: 12,
          }}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: "11px" }} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            name={line.name}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export const SearchIntensityMultiLine = memo(SearchIntensityMultiLineComponent);
