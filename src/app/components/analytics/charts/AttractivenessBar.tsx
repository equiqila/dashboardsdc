import { memo, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { AttractivenessRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: AttractivenessRecord[];
    tahun: number | "Semua";
}

const PRIMARY_COLOR = "#1a7a6d";

function AttractivenessBarComponent({ data, tahun }: Props) {
    const chartData = useMemo(() => {
        const filtered = tahun === "Semua"
            ? data
            : data.filter((r) => r.tahun === tahun);

        // Sum investment per destination if multiple years shown
        const byDest = new Map<string, number>();
        filtered.forEach((r) => {
            byDest.set(r.provinsi, (byDest.get(r.provinsi) ?? 0) + r.investment);
        });

        return Array.from(byDest.entries())
            .map(([provinsi, investment]) => ({ provinsi, investment }))
            .sort((a, b) => b.investment - a.investment);
    }, [data, tahun]);

    if (!chartData.length) return <ChartEmptyState message="Tidak ada data attractiveness untuk tahun ini." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 70, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                    type="category"
                    dataKey="provinsi"
                    width={180}
                    tick={{ fontSize: 10 }}
                />
                <Tooltip formatter={(v: number) => [v, "Investment Score"]} />
                <Bar dataKey="investment" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} maxBarSize={28}>
                    <LabelList dataKey="investment" position="right" style={{ fontSize: 11, fill: "#374151" }} />
                    {chartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "#0e5e54" : i === 1 ? "#1a7a6d" : PRIMARY_COLOR} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export const AttractivenessBar = memo(AttractivenessBarComponent);
