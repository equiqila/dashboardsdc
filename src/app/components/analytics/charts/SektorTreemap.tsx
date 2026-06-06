import { memo, useMemo } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import type { SektorMappingRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: SektorMappingRecord[];
    filter: string; // "Semua" or specific destination name
}

// Darkest → lightest: largest sector gets darkest color
const GRADIENT_COLORS = [
    "#062e27", "#0a4a3e", "#0e5e54", "#1a7a6d", "#22a894",
    "#22c4ab", "#4dd4c0", "#78d6c8", "#a8e6df", "#d4f5f0",
];

function SektorTreemapComponent({ data, filter }: Props) {
    const filtered = useMemo(() => {
        if (filter === "Semua") return data;
        return data.filter((r) => r.destination === filter);
    }, [data, filter]);

    // Aggregate by sector (sum across all destinations in current filter)
    const bySector = useMemo(() => {
        const m = new Map<string, number>();
        filtered.forEach((r) => {
            m.set(r.sektor, (m.get(r.sektor) ?? 0) + r.jumlah_berita_investasi);
        });
        const total = Array.from(m.values()).reduce((s, v) => s + v, 0);
        return Array.from(m.entries())
            .map(([sektor, jumlah]) => ({ name: sektor, size: jumlah, total }))
            .sort((a, b) => b.size - a.size); // largest first
    }, [filtered]);

    if (!bySector.length) return <ChartEmptyState message="Tidak ada data sektor investasi." />;

    const CustomContent = (props: any) => {
        const { x, y, width, height, name, index, size, total } = props;
        if (!width || !height || width < 30 || height < 30) return <g />;
        const pct = total > 0 ? ((size / total) * 100).toFixed(1) : "0";
        const isLarge = width > 100 && height > 60;
        const isMedium = width > 60 && height > 40;
        // Assign color by rank: index 0 (largest) = darkest
        const color = GRADIENT_COLORS[Math.min(index, GRADIENT_COLORS.length - 1)];
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} fill={color} rx={4} />
                {isMedium && (
                    <text x={x + width / 2} y={y + height / 2 - (isLarge ? 10 : 0)} textAnchor="middle" fill="white" fontSize={isLarge ? 13 : 10} fontWeight="bold" style={{ pointerEvents: "none" }}>
                        {name}
                    </text>
                )}
                {isLarge && (
                    <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={11} style={{ pointerEvents: "none" }}>
                        {pct}%
                    </text>
                )}
            </g>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <Treemap
                data={bySector}
                dataKey="size"
                aspectRatio={4 / 3}
                content={<CustomContent />}
            >
                <Tooltip
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        const pct = d.total > 0 ? ((d.size / d.total) * 100).toFixed(1) : "0";
                        return (
                            <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                                <p className="font-semibold">{d.name}</p>
                                <p className="text-muted-foreground">Jumlah Berita Investasi: {d.size}</p>
                                <p className="text-muted-foreground">Persentase: {pct}%</p>
                            </div>
                        );
                    }}
                />
            </Treemap>
        </ResponsiveContainer>
    );
}

export const SektorTreemap = memo(SektorTreemapComponent);
