import { memo, useMemo, useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer,
} from "recharts";
import type { IntensitasPencarianRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: IntensitasPencarianRecord[];
    filter: string; // "Semua" or specific destination
}

const COLORS = [
    "#1a7a6d", "#22c4ab", "#e07b39", "#9b59b6", "#e74c3c",
    "#3498db", "#f1c40f", "#2ecc71", "#00bcd4", "#ff9800",
    "#607d8b", "#795548", "#009688", "#e91e63",
];

function IntensitasPencarianLineComponent({ data, filter }: Props) {
    const destinations = useMemo(() =>
        [...new Set(data.map((r) => r.destination))].sort(),
        [data]
    );

    const pivoted = useMemo(() => {
        const src = filter === "Semua" ? data : data.filter((r) => r.destination === filter);
        const byYear = new Map<number, Record<string, number>>();
        src.forEach((r) => {
            if (!byYear.has(r.year)) byYear.set(r.year, { year: r.year });
            byYear.get(r.year)![r.destination] = r.count;
        });
        return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
    }, [data, filter]);

    const visibleDests = filter === "Semua" ? destinations : [filter];

    const [hoveredLine, setHoveredLine] = useState<string | null>(null);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload.length) return null;

        let items = payload;
        if (hoveredLine) {
            items = payload.filter((p: any) => p.dataKey === hoveredLine);
            if (!items.length) items = payload.slice(0, 1);
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

    if (!pivoted.length) return <ChartEmptyState message="Tidak ada data intensitas pencarian." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pivoted} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                    tick={{ fontSize: 11 }}
                    width={45}
                    label={{ value: "Search Intensity", angle: -90, position: "insideLeft", offset: -10, fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {visibleDests.map((dest, i) => (
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

export const IntensitasPencarianLine = memo(IntensitasPencarianLineComponent);
