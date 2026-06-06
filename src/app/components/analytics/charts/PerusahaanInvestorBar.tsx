import { memo, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { PerusahaanInvestorRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: PerusahaanInvestorRecord[];
    filter: "Semua" | "Lokal" | "Asing";
}

const TOP3_COLORS = ["#0e5e54", "#1a7a6d", "#22c4ab"];
const DEFAULT_COLOR = "#78d6c8";

function PerusahaanInvestorBarComponent({ data, filter }: Props) {
    const chartData = useMemo(() => {
        const filtered = filter === "Semua" ? data : data.filter((r) => r.kategori === filter);
        // Merge by company name (in case same company appears in both)
        const byCompany = new Map<string, PerusahaanInvestorRecord>();
        filtered.forEach((r) => {
            const existing = byCompany.get(r.perusahaan);
            if (existing) {
                byCompany.set(r.perusahaan, { ...existing, jumlah: existing.jumlah + r.jumlah });
            } else {
                byCompany.set(r.perusahaan, { ...r });
            }
        });
        return Array.from(byCompany.values())
            .sort((a, b) => b.jumlah - a.jumlah)
            .slice(0, 10);
    }, [data, filter]);

    if (!chartData.length) return <ChartEmptyState message="Tidak ada data perusahaan investor." />;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                    dataKey="perusahaan"
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                />
                <YAxis tick={{ fontSize: 11 }} width={40} />
                <Tooltip
                    content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as PerusahaanInvestorRecord;
                        return (
                            <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                                <p className="font-semibold mb-1">Nama Perusahaan: {d.perusahaan}</p>
                                <p className="text-muted-foreground">Negara Asal: {d.negaraAsal}</p>
                                <p className="text-muted-foreground">Kategori: {d.kategori === "Lokal" ? "Investor Dalam Negeri" : "Investor Asing"}</p>
                                <p className="text-muted-foreground">Jumlah Aktivitas Investasi: {d.jumlah}</p>
                            </div>
                        );
                    }}
                />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    <LabelList dataKey="jumlah" position="top" style={{ fontSize: 11, fill: "#374151" }} />
                    {chartData.map((_, i) => (
                        <Cell key={i} fill={i < 3 ? TOP3_COLORS[i] : DEFAULT_COLOR} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export const PerusahaanInvestorBar = memo(PerusahaanInvestorBarComponent);
