import { memo, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { InvestmentEventRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: InvestmentEventRecord[];
}

const ACTIVITY_COLORS: Record<string, string> = {
    "Expansion": "#1a7a6d",
    "New Investment": "#22c4ab",
    "Partnership": "#3498db",
    "Investment Opportunity": "#e07b39",
    "Others": "#9b59b6",
};

function InvestmentEventStackedBarComponent({ data }: Props) {
    const activities = useMemo(() =>
        [...new Set(data.map((r) => r.aktivitas_investasi))].sort(),
        [data]
    );

    const chartData = useMemo(() => {
        const byDest = new Map<string, Record<string, any>>();
        data.filter((r) => r.destination.toLowerCase() !== "indonesia").forEach((r) => {
            if (!byDest.has(r.destination)) byDest.set(r.destination, { destination: r.destination });
            byDest.get(r.destination)![r.aktivitas_investasi] = r.jumlah_berita_investasi;
        });
        return Array.from(byDest.values())
            .sort((a, b) => {
                const totalA = activities.reduce((s, act) => s + (a[act] ?? 0), 0);
                const totalB = activities.reduce((s, act) => s + (b[act] ?? 0), 0);
                return totalB - totalA;
            });
    }, [data, activities]);

    if (!chartData.length) return <ChartEmptyState message="Tidak ada data aktivitas investasi." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                    type="category"
                    dataKey="destination"
                    width={200}
                    tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {activities.map((act) => (
                    <Bar
                        key={act}
                        dataKey={act}
                        stackId="a"
                        fill={ACTIVITY_COLORS[act] ?? "#94a3b8"}
                        maxBarSize={24}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

export const InvestmentEventStackedBar = memo(InvestmentEventStackedBarComponent);
