import { memo, useMemo } from "react";
import type { HubunganInvestorSektorRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: HubunganInvestorSektorRecord[];
    filter: "Semua" | "Lokal" | "Asing";
}

const SECTORS = [
    "Daya Tarik Wisata",
    "Kawasan Pariwisata",
    "Penyediaan Akomodasi",
    "Transportasi Wisata",
    "Wisata Tirta",
    "Other",
];

function InvestorSektorHeatmapComponent({ data, filter }: Props) {
    const filtered = useMemo(() => {
        if (filter === "Semua") return data;
        return data.filter((r) => r.lokalAsing === filter);
    }, [data, filter]);

    const companies = useMemo(() => {
        const map = new Map<string, number>();
        filtered.forEach((r) => {
            map.set(r.perusahaan, (map.get(r.perusahaan) ?? 0) + r.jumlah);
        });
        // Sort by total descending (highest at top)
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
    }, [filtered]);

    const lookupMap = useMemo(() => {
        const m = new Map<string, number>();
        filtered.forEach((r) => {
            const key = `${r.perusahaan}||${r.sektor}`;
            m.set(key, (m.get(key) ?? 0) + r.jumlah);
        });
        return m;
    }, [filtered]);

    const maxVal = useMemo(() => {
        let max = 0;
        lookupMap.forEach((v) => { if (v > max) max = v; });
        return max || 1;
    }, [lookupMap]);

    if (!companies.length) return <ChartEmptyState message="Tidak ada data hubungan investor dan sektor." />;

    // Vibrant Green gradient
    const getColor = (val: number): string => {
        if (val === 0) return "#f0fdf4"; // baseline very light green
        const ratio = val / maxVal;
        if (ratio >= 0.8) return "#064e3b"; // darkest green
        if (ratio >= 0.6) return "#065f46";
        if (ratio >= 0.4) return "#047857";
        if (ratio >= 0.2) return "#10b981";
        return "#d1fae5";               // lightest green
    };

    const getTextColor = (val: number): string => {
        if (val === 0) return "#9ca3af";
        const ratio = val / maxVal;
        return ratio >= 0.4 ? "white" : "#064e3b";
    };

    return (
        <div className="w-full flex gap-4 overflow-auto">
            {/* Main heatmap table - SEAMLESS DESIGN (No gaps) */}
            <div className="flex-1 overflow-auto border border-border rounded-md">
                <table className="text-xs w-full" style={{ borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 text-muted-foreground font-semibold min-w-[180px] sticky left-0 bg-white z-10 border-b border-r border-border">
                                Investor / Perusahaan
                            </th>
                            {SECTORS.map((s) => (
                                <th
                                    key={s}
                                    className="text-center py-3 px-1 text-muted-foreground font-semibold min-w-[100px] text-[10px] border-b border-border bg-white"
                                >
                                    {s}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <tr key={company}>
                                <td className="py-2 px-4 font-medium sticky left-0 z-10 text-foreground whitespace-nowrap border-r border-b border-border bg-white">
                                    {company}
                                </td>
                                {SECTORS.map((sektor) => {
                                    const val = lookupMap.get(`${company}||${sektor}`) ?? 0;
                                    return (
                                        <td
                                            key={sektor}
                                            className="p-0 border-r border-b border-border/30 last:border-r-0"
                                            style={{ backgroundColor: getColor(val) }}
                                        >
                                            <div
                                                className="w-full h-10 flex items-center justify-center font-bold transition-all hover:brightness-95"
                                                style={{
                                                    color: getTextColor(val),
                                                    fontSize: 11,
                                                }}
                                                title={`${company} • ${sektor}: ${val}`}
                                            >
                                                {val}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vertical color legend bar - Green Gradient */}
            <div className="flex flex-col items-center gap-1 shrink-0 pt-8 pr-2">
                <span className="text-[10px] text-muted-foreground font-medium mb-1">{maxVal}</span>
                <div
                    className="w-5 rounded"
                    style={{
                        height: 200,
                        background: "linear-gradient(to bottom, #064e3b 0%, #047857 50%, #f0fdf4 100%)",
                    }}
                />
                <span className="text-[10px] text-muted-foreground font-medium mt-1">0</span>
            </div>
        </div>
    );
}

export const InvestorSektorHeatmap = memo(InvestorSektorHeatmapComponent);
