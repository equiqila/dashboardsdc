import { memo, useMemo } from "react";
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ZAxis, Cell,
} from "recharts";
import type { WisatawanInvestmentRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: WisatawanInvestmentRecord[];
    filter: string; // "Semua" or specific destination
}

const COLORS = [
    "#1a7a6d", "#22c4ab", "#e07b39", "#9b59b6", "#e74c3c",
    "#3498db", "#f1c40f", "#2ecc71", "#e91e63", "#00bcd4",
    "#ff9800", "#607d8b", "#795548", "#009688",
];

function WisatawanScatterComponent({ data, filter }: Props) {
    const filtered = useMemo(() => {
        if (filter === "Semua") return data;
        return data.filter((r) => r.provinsi === filter);
    }, [data, filter]);

    const destinations = useMemo(() =>
        [...new Set(data.map((r) => r.provinsi))].sort(),
        [data]
    );

    if (!filtered.length) return <ChartEmptyState message="Tidak ada data untuk destinasi ini." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    type="number"
                    dataKey="jumlah_wisatawan"
                    name="Jumlah Wisatawan"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)}
                    label={{ value: "Jumlah Wisatawan", position: "bottom", offset: 20, fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                    type="number"
                    dataKey="investment"
                    name="Jumlah Investasi"
                    tick={{ fontSize: 11 }}
                    width={50}
                    label={{ value: "Jumlah Investasi", angle: -90, position: "insideLeft", offset: -10, fontSize: 12, fill: "#6b7280" }}
                />
                <ZAxis range={[60, 200]} />
                <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as WisatawanInvestmentRecord;
                        return (
                            <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                                <p className="font-semibold mb-1">{d.provinsi}</p>
                                <p className="text-muted-foreground">Tahun: {d.tahun}</p>
                                <p className="text-muted-foreground">Wisatawan: {d.jumlah_wisatawan.toLocaleString("id-ID")}</p>
                                <p className="text-muted-foreground">Investasi: {d.investment}</p>
                            </div>
                        );
                    }}
                />
                {filter === "Semua" ? destinations.map((dest, i) => (
                    <Scatter
                        key={dest}
                        name={dest}
                        data={filtered.filter((r) => r.provinsi === dest)}
                        fill={COLORS[i % COLORS.length]}
                    />
                )) : (
                    <Scatter data={filtered} fill={COLORS[0]}>
                        {filtered.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Scatter>
                )}
            </ScatterChart>
        </ResponsiveContainer>
    );
}

export const WisatawanScatter = memo(WisatawanScatterComponent);
