import { memo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TOOLTIP_STYLE } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";
import { formatCurrency } from "../useChartLoading";

interface PieDataPoint {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

interface Props {
  data: PieDataPoint[];
}

function ForeignDomesticPieComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No investment dominance data for selected year." />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
          label={({ name, percentage }) => `${name.split(" ")[0]}: ${percentage}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(value: number, name: string, props) => [
            `${formatCurrency(value)} (${props.payload.percentage}%)`,
            name,
          ]}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "13px", fontWeight: 600, fill: "#6b7280" }}
        >
          Investment
        </text>
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "12px", fill: "#9ca3af" }}
        >
          Share
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

export const ForeignDomesticPie = memo(ForeignDomesticPieComponent);
