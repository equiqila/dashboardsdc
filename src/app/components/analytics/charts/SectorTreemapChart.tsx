import { memo } from "react";
import { Treemap, ResponsiveContainer } from "recharts";
import type { SectorTreemapPoint } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
  data: SectorTreemapPoint[];
}

function SectorTreemapChartComponent({ data }: Props) {
  if (!data.length) return <ChartEmptyState message="No sector data for selected destination." />;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <Treemap
        data={data}
        dataKey="value"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={({ x, y, width, height, name, value, index }) => {
          if (width < 50 || height < 35) return null;
          const item = data[index ?? 0];
          return (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={item?.fill ?? "#6b7280"}
                rx={4}
              />
              <text
                x={x + width / 2}
                y={y + height / 2 - 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={width > 90 ? 12 : 10}
                fontWeight={600}
              >
                {name}
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 8}
                textAnchor="middle"
                fill="#fff"
                fontSize={10}
              >
                {item?.percentage}%
              </text>
              <text
                x={x + width / 2}
                y={y + height / 2 + 22}
                textAnchor="middle"
                fill="rgba(255,255,255,0.85)"
                fontSize={9}
              >
                {value}B Rp
              </text>
            </g>
          );
        }}
      />
    </ResponsiveContainer>
  );
}

export const SectorTreemapChart = memo(SectorTreemapChartComponent);
