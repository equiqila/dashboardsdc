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
        content={(props: any) => {
          const { x, y, width, height, name, value, index } = props;
          if (width < 30 || height < 20) return null;
          const item = data[index ?? 0];
          const isLarge = width > 120 && height > 80;
          const isMedium = width > 80 && height > 50;

          return (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={item?.fill ?? "#6b7280"}
                stroke="#fff"
                strokeWidth={1}
                rx={2}
              />
              {height > 30 && (
                <text
                  x={x + width / 2}
                  y={y + height / 2 - (isMedium ? 10 : 0)}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={isLarge ? 14 : isMedium ? 12 : 10}
                  fontWeight={600}
                  style={{ pointerEvents: 'none' }}
                >
                  {name}
                </text>
              )}
              {isMedium && (
                <text
                  x={x + width / 2}
                  y={y + height / 2 + 6}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={10}
                  style={{ pointerEvents: 'none', opacity: 0.9 }}
                >
                  {item?.percentage}%
                </text>
              )}
            </g>
          );
        }}
      />
    </ResponsiveContainer>
  );
}

export const SectorTreemapChart = memo(SectorTreemapChartComponent);
