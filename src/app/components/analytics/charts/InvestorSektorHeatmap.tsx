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
        const seen = new Set<string>();
        filtered.forEach((r) => seen.add(r.perusahaan));
        return [...seen].sort();
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

    const getColor = (val: number): string => {
        if (val === 0) return "#f0f0f0";
        const intensity = val / maxVal;
        if (intensity > 0.7) return "#0e5e54";
        if (intensity > 0.4) return "#1a7a6d";
        if (intensity > 0.2) return "#22c4ab";
        return "#a8e6df";
    };

    return (
        <div className="w-full overflow-auto">
            <table className="text-xs w-full border-collapse">
                <thead>
                    <tr>
                        <th className="text-left py-2 pr-3 text-muted-foreground font-medium min-w-[140px] sticky left-0 bg-white z-10">
                            Perusahaan
                        </th>
                        {SECTORS.map((s) => (
                            <th key={s} className="text-center py-2 px-1 text-muted-foreground font-medium min-w-[90px] text-[10px]">
                                {s}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company} className="hover:bg-gray-50">
                            <td className="py-1 pr-3 font-medium sticky left-0 bg-white z-10 text-foreground whitespace-nowrap">
                                {company}
                            </td>
                            {SECTORS.map((sektor) => {
                                const val = lookupMap.get(`${company}||${sektor}`) ?? 0;
                                return (
                                    <td key={sektor} className="py-1 px-1 text-center">
                                        <div
                                            className="rounded flex items-center justify-center mx-auto font-semibold transition-colors"
                                            style={{
                                                background: getColor(val),
                                                color: val > 0 ? "white" : "#9ca3af",
                                                width: 52,
                                                height: 28,
                                                fontSize: 11,
                                            }}
                                            title={`${company} • ${sektor}: ${val}`}
                                        >
                                            {val > 0 ? val : ""}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export const InvestorSektorHeatmap = memo(InvestorSektorHeatmapComponent);
