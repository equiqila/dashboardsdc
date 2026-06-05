import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { EventTypeStackedPoint } from "../../../data/types";
import { EVENT_TYPE_COLORS, TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
  data: EventTypeStackedPoint[];
}

const EVENT_TYPES = [
  "New Investment",
  "Expansion",
  "Partnership",
  "Investment Opportunity",
] as const;

function EventTypeStackedBarComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No event data for selected destination." />;

  return (
    <ResponsiveContainer width="100%" height={Math.max(320, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="destination"
          type="category"
          width={120}
          tick={{ fontSize: 11 }}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {EVENT_TYPES.map((type, i) => (
          <Bar
            key={type}
            dataKey={type}
            stackId="events"
            fill={EVENT_TYPE_COLORS[type]}
            name={type}
            radius={i === EVENT_TYPES.length - 1 ? [0, 4, 4, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export const EventTypeStackedBar = memo(EventTypeStackedBarComponent);
