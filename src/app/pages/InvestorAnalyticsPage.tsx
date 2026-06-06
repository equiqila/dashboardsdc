import { useState, useMemo } from "react";
import { useExcelData } from "../data/ExcelDataContext";
import { ChartCard } from "../components/analytics/ChartCard";
import { ChartFilterSelect } from "../components/analytics/ChartFilterSelect";
import { ChartLoadingState } from "../components/analytics/ChartLoadingState";
import { WorldInvestmentMap } from "../components/analytics/charts/WorldInvestmentMap";
import { PerusahaanInvestorBar } from "../components/analytics/charts/PerusahaanInvestorBar";
import { InvestorSektorHeatmap } from "../components/analytics/charts/InvestorSektorHeatmap";
import { DominasiDonut } from "../components/analytics/charts/DominasiDonut";
import { IntensitasPencarianLine } from "../components/analytics/charts/IntensitasPencarianLine";

const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];

export function InvestorAnalyticsPage() {
  const { data, loading } = useExcelData();

  // Filters
  const [negaraTahun, setNegaraTahun] = useState<string>("Semua");
  const [perusahaanFilter, setPerusahaanFilter] = useState<"Semua" | "Lokal" | "Asing">("Semua");
  const [heatmapFilter, setHeatmapFilter] = useState<"Semua" | "Lokal" | "Asing">("Semua");
  const [dominasiTahun, setDominasiTahun] = useState<number>(2024);
  const [intensitasFilter, setIntensitasFilter] = useState<string>("Semua");

  const tahunOptions = [
    { label: "Semua Tahun", value: "Semua" },
    ...YEARS.map((y) => ({ label: y, value: y })),
  ];

  const dominasiTahunOptions = YEARS
    .filter((y) => Number(y) <= 2025)
    .map((y) => ({ label: y, value: y }));

  const investorCategoryOptions = [
    { label: "Semua", value: "Semua" },
    { label: "Investor Dalam Negeri", value: "Lokal" },
    { label: "Investor Asing", value: "Asing" },
  ];

  const intensitasOptions = useMemo(() => {
    if (!data) return [];
    const dests = [...new Set(data.intensitasPencarian.map((r) => r.destination))].sort();
    return [{ label: "Semua Destinasi", value: "Semua" }, ...dests.map((d) => ({ label: d, value: d }))];
  }, [data]);

  if (loading) return <div className="p-8"><ChartLoadingState height={400} /></div>;

  return (
    <div className="space-y-6 p-6">
      {/* Row 1: World Map */}
      <ChartCard
        title="Peta Sebaran Negara Asal Investor Terbesar (PMA)"
        subtitle="Analisis geospasial asal negara investor pada sektor pariwisata"
        className="min-h-[620px] h-auto"
        action={
          <ChartFilterSelect
            value={negaraTahun}
            options={tahunOptions}
            onChange={setNegaraTahun}
          />
        }
      >
        <WorldInvestmentMap
          negaraData={data?.negaraInvestor ?? []}
          perusahaanData={data?.perusahaanInvestor ?? []}
          hubunganSektorData={data?.hubunganInvestorSektor ?? []}
          year={negaraTahun}
        />
      </ChartCard>

      {/* Row 2: Perusahaan Bar (col-span-2) + Dominasi Donut (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard
            title="Perusahaan dengan Frekuensi Investasi Paling Banyak"
            className="h-[480px]"
            action={
              <ChartFilterSelect
                value={perusahaanFilter}
                options={investorCategoryOptions}
                onChange={(v) => setPerusahaanFilter(v as "Semua" | "Lokal" | "Asing")}
              />
            }
          >
            <PerusahaanInvestorBar data={data?.perusahaanInvestor ?? []} filter={perusahaanFilter} />
          </ChartCard>
        </div>

        <div className="lg:col-span-1">
          <ChartCard
            title="Dominasi Investor Asing (PMA) dan Domestik (PMDN)"
            className="h-[480px]"
            action={
              <ChartFilterSelect
                value={String(dominasiTahun)}
                options={dominasiTahunOptions}
                onChange={(v) => setDominasiTahun(Number(v))}
              />
            }
          >
            <DominasiDonut data={data?.dominasiInvestor ?? []} tahun={dominasiTahun} />
          </ChartCard>
        </div>
      </div>

      {/* Row 3: Heatmap (full width) */}
      <ChartCard
        title="Hubungan Investor dan Sektor Pariwisata Indonesia"
        className="min-h-[300px]"
        action={
          <ChartFilterSelect
            value={heatmapFilter}
            options={investorCategoryOptions}
            onChange={(v) => setHeatmapFilter(v as "Semua" | "Lokal" | "Asing")}
          />
        }
      >
        <InvestorSektorHeatmap data={data?.hubunganInvestorSektor ?? []} filter={heatmapFilter} />
      </ChartCard>

      {/* Row 4: Intensitas Line */}
      <ChartCard
        title="Perkembangan Intensitas Pencarian Peluang Investasi"
        className="h-[380px]"
        action={
          <ChartFilterSelect
            value={intensitasFilter}
            options={intensitasOptions}
            onChange={setIntensitasFilter}
          />
        }
      >
        <IntensitasPencarianLine data={data?.intensitasPencarian ?? []} filter={intensitasFilter} />
      </ChartCard>
    </div>
  );
}
