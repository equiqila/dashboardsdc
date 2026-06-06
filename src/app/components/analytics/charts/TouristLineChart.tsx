import { memo, useMemo, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer,
} from "recharts";
import type { TouristRecord } from "../../../data/types";
import { DESTINATIONS } from "../../../data/constants";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: TouristRecord[];
    filter: "Semua" | "DPP" | "DPR";
}

const COLORS = [
    "#1a7a6d", "#22c4ab", "#3d9986", "#54c6b1", "#0e5e54",
    "#2b8c7e", "#78d6c8", "#3a756b", "#1bd4b8", "#6ec9bb",
    "#a8e6df", "#c4f0ea", "#087265", "#47a89a",
];

function TouristLineChartComponent({ data, filter }: Props) {
    const filtered = useMemo(() => {
        if (filter === "Semua") return data;
        return data.filter((r) => {
            const destInfo = DESTINATIONS.find((d) =>
                // match by normalized name
                r.provinsi.toLowerCase().replace(/\s+/g, '') === d.name.toLowerCase().replace(/\s+/g, '') ||
                r.provinsi.toLowerCase().includes(d.name.toLowerCase()) ||
                (d.provinceMatch && r.provinsi.toLowerCase() === d.provinceMatch.toLowerCase())
            );
            if (!destInfo) return false;
            return destInfo.type === filter;
        });
    }, [data, filter]);

    // Pivot: { tahun: 2019, "Bali (DPR)": 1234, ... }
    const destinations = useMemo(() =>
        [...new Set(filtered.map((r) => r.provinsi))].sort(),
        [filtered]
    );

    const pivoted = useMemo(() => {
        const byYear = new Map<number, Record<string, number>>();
        filtered.forEach((r) => {
            if (!byYear.has(r.tahun)) byYear.set(r.tahun, { tahun: r.tahun });
            byYear.get(r.tahun)![r.provinsi] = r.jumlah_wisatawan;
        });
        return Array.from(byYear.values()).sort((a, b) => a.tahun - b.tahun);
    }, [filtered]);

    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload.length) return null;

        // If a specific line is hovered, strictly isolate it. Otherwise, fallback to top 3 to prevent overlap.
        let items = payload;
        if (hoveredLine) {
            items = payload.filter((p: any) => p.dataKey === hoveredLine);
            if (!items.length) items = payload.slice(0, 1); // fallback
        } else {
            items = [...payload].sort((a: any, b: any) => b.value - a.value).slice(0, 4);
        }

        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border border-teal-100 shadow-xl rounded-xl">
                <p className="font-semibold text-teal-900 mb-2 border-b border-teal-50 pb-1">Tahun {label}</p>
                <div className="space-y-2">
                    {items.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
                                <span className="text-gray-600 font-medium">{entry.name}</span>
                            </div>
                            <span className="font-bold text-teal-700">{entry.value.toLocaleString("id-ID")}</span>
                        </div>
                    ))}
                </div>
                {!hoveredLine && payload.length > 4 && (
                    <div className="text-gray-400 italic text-xs text-right mt-3 pt-2 border-t border-gray-50">
                        Arahkan kursor ke garis spesifik untuk detail
                    </div>
                )}
            </div>
        );
    };

    if (!pivoted.length) return <ChartEmptyState message="Tidak ada data wisatawan untuk filter ini." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pivoted} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
                    width={55}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {destinations.map((dest, i) => (
                    <Line
                        key={dest}
                        dataKey={dest}
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                        onMouseEnter={() => setHoveredLine(dest)}
                        onMouseLeave={() => setHoveredLine(null)}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}

export const TouristLineChart = memo(TouristLineChartComponent);
