import { memo, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { DominasiInvestorRecord } from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

interface Props {
    data: DominasiInvestorRecord[];
    tahun: number;
}

const PMA_COLOR = "#22c4ab";   // teal terang
const PMDN_COLOR = "#0e5e54"; // teal gelap

function DominasiDonutComponent({ data, tahun }: Props) {
    const record = useMemo(() =>
        data.find((r) => r.tahun === tahun),
        [data, tahun]
    );

    if (!record) return <ChartEmptyState message={`Tidak ada data untuk tahun ${tahun}.`} />;

    const total = record.jumlah_pma + record.jumlah_pmdn;
    const pmaPct = total > 0 ? Math.round((record.jumlah_pma / total) * 100) : 0;
    const pmdnPct = total > 0 ? 100 - pmaPct : 0;

    const chartData = [
        { name: "PMA", value: pmaPct, raw: record.jumlah_pma },
        { name: "PMDN", value: pmdnPct, raw: record.jumlah_pmdn },
    ];

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="75%"
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                    >
                        <Cell fill={PMA_COLOR} />
                        <Cell fill={PMDN_COLOR} />
                    </Pie>
                    <Tooltip
                        formatter={(val: number, name: string, props: any) => [
                            `${val}% (${props.payload.raw} aktivitas)`,
                            name,
                        ]}
                    />
                    <Legend
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export const DominasiDonut = memo(DominasiDonutComponent);
