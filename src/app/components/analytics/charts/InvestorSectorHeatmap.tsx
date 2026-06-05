import { memo, useMemo } from "react";
import type { InvestorSectorHeatmapCell } from "../../../data/types";
import { TOURISM_SECTORS } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
  cells: InvestorSectorHeatmapCell[];
  investors: string[];
  maxValue: number;
}

function interpolateColor(value: number, max: number): string {
  if (max <= 0 || value <= 0) return "#f3f4f6";
  const ratio = value / max;
  if (ratio >= 0.75) return "#0F5D5E";
  if (ratio >= 0.5) return "#2A9D8F";
  if (ratio >= 0.25) return "#60a5fa";
  return "#bfdbfe";
}

function InvestorSectorHeatmapComponent({ cells, investors, maxValue }: Props) {
  const matrix = useMemo(() => {
    const getValue = (investor: string, sector: string) =>
      cells.find((c) => c.investor === investor && c.sector === sector)?.value ?? 0;

    return investors.map((investor) =>
      TOURISM_SECTORS.map((sector) => ({
        investor,
        sector,
        value: getValue(investor, sector),
      })),
    );
  }, [cells, investors]);

  if (!cells.length || !investors.length) {
    return <ChartEmptyState message="No investor-sector data for selected filters." height={360} />;
  }

  const labelWidth = 130;
  const labelHeight = 28;
  const cellW = 72;
  const cellH = 32;
  const chartW = labelWidth + TOURISM_SECTORS.length * cellW;
  const chartH = labelHeight + investors.length * cellH;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartW} ${chartH + 24}`}
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Investor sector heatmap"
      >
        {/* Column headers */}
        {TOURISM_SECTORS.map((sector, col) => (
          <text
            key={sector}
            x={labelWidth + col * cellW + cellW / 2}
            y={18}
            textAnchor="middle"
            fontSize={9}
            fill="#6b7280"
            fontWeight={600}
          >
            {sector.length > 12 ? `${sector.slice(0, 10)}…` : sector}
          </text>
        ))}

        {/* Heatmap grid — seamless cells */}
        {matrix.map((row, rowIdx) => (
          <g key={row[0]?.investor ?? rowIdx}>
            <text
              x={labelWidth - 8}
              y={labelHeight + rowIdx * cellH + cellH / 2 + 4}
              textAnchor="end"
              fontSize={10}
              fill="#374151"
              fontWeight={500}
            >
              {row[0]?.investor}
            </text>
            {row.map((cell, colIdx) => (
              <g key={`${cell.investor}-${cell.sector}`}>
                <rect
                  x={labelWidth + colIdx * cellW}
                  y={labelHeight + rowIdx * cellH}
                  width={cellW}
                  height={cellH}
                  fill={interpolateColor(cell.value, maxValue)}
                  stroke="#fff"
                  strokeWidth={1}
                >
                  <title>{`${cell.investor} — ${cell.sector}: ${cell.value}`}</title>
                </rect>
                <text
                  x={labelWidth + colIdx * cellW + cellW / 2}
                  y={labelHeight + rowIdx * cellH + cellH / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill={cell.value / maxValue >= 0.25 ? "#fff" : "#6b7280"}
                  fontWeight={600}
                >
                  {cell.value}
                </text>
              </g>
            ))}
          </g>
        ))}

        {/* Color scale legend */}
        <g transform={`translate(${labelWidth}, ${chartH + 8})`}>
          <text x={0} y={10} fontSize={9} fill="#6b7280">Low</text>
          {[0, 0.25, 0.5, 0.75, 1].map((step, i) => (
            <rect
              key={step}
              x={30 + i * 28}
              y={0}
              width={28}
              height={12}
              fill={interpolateColor(step * maxValue, maxValue)}
              stroke="#fff"
              strokeWidth={0.5}
            />
          ))}
          <text x={30 + 5 * 28 + 4} y={10} fontSize={9} fill="#6b7280">High</text>
        </g>
      </svg>
    </div>
  );
}

export const InvestorSectorHeatmap = memo(InvestorSectorHeatmapComponent);
