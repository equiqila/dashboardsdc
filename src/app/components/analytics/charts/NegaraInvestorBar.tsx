import { memo, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { NegaraInvestorRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: NegaraInvestorRecord[];
    tahun: string; // "Semua" or specific year like "2024"
}

const TOP3_COLORS = ["#0e5e54", "#1a7a6d", "#22c4ab"];
const DEFAULT_COLOR = "#78d6c8";

function NegaraInvestorBarComponent({ data, tahun }: Props) {
    const chartData = useMemo(() => {
        return data
            .map((r) => ({
                negara: r.negara,
                jumlah: tahun === "Semua" ? r.grandTotal : (r.byYear[tahun] ?? 0),
            }))
            .filter((r) => r.jumlah > 0)
            .sort((a, b) => b.jumlah - a.jumlah);
    }, [data, tahun]);

    if (!chartData.length) return <ChartEmptyState message="Tidak ada data negara investor untuk tahun ini." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="negara" width={130} tick={{ fontSize: 11 }} />
                <Tooltip
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                            <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                                <p className="font-semibold">{d.negara}</p>
                                <p className="text-muted-foreground">Tahun: {tahun}</p>
                                <p className="text-muted-foreground">Jumlah Aktivitas: {d.jumlah}</p>
                            </div>
                        );
                    }}
                />
                <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    <LabelList dataKey="jumlah" position="right" style={{ fontSize: 11, fill: "#374151" }} />
                    {chartData.map((_, i) => (
                        <Cell key={i} fill={i < 3 ? TOP3_COLORS[i] : DEFAULT_COLOR} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export const NegaraInvestorBar = memo(NegaraInvestorBarComponent);
