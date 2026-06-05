import { memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { LaunchFrequencyMultiPoint, LaunchFrequencyLineConfig } from "../../../data/types";
import { TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
  data: LaunchFrequencyMultiPoint[];
  lines: LaunchFrequencyLineConfig[];
}

function InvestmentLaunchFrequencyAreaComponent({ data, lines }: Props) {
  if (!data.length || !lines.length) {
    return <ChartEmptyState message="No launch frequency data for selected destination." />;
  }

  const isMulti = lines.length > 1;

  return (
    <ResponsiveContainer width="100%" height={isMulti ? 340 : 280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: "Launch Frequency",
            angle: -90,
            position: "insideLeft",
            fontSize: 12,
          }}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        {isMulti && <Legend wrapperStyle={{ fontSize: "10px" }} />}
        {lines.map((line) => (
          <Area
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            fill={line.color}
            fillOpacity={isMulti ? 0.15 : 0.25}
            strokeWidth={2}
            name={line.name}
            stackId={isMulti ? undefined : "launch"}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const InvestmentLaunchFrequencyArea = memo(InvestmentLaunchFrequencyAreaComponent);
