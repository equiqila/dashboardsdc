import { useState, useMemo } from "react";
import { useExcelData } from "../data/ExcelDataContext";
import { ChartCard } from "../components/analytics/ChartCard";
import { ChartFilterSelect } from "../components/analytics/ChartFilterSelect";
import { ChartLoadingState } from "../components/analytics/ChartLoadingState";
import { TouristLineChart } from "../components/analytics/charts/TouristLineChart";
import { WisatawanScatter } from "../components/analytics/charts/WisatawanScatter";
import { AttractivenessBar } from "../components/analytics/charts/AttractivenessBar";
import { NewInvestmentLaunchArea } from "../components/analytics/charts/NewInvestmentLaunchArea";
import { SektorTreemap } from "../components/analytics/charts/SektorTreemap";
import { InvestmentEventStackedBar } from "../components/analytics/charts/InvestmentEventStackedBar";

type DppDprFilter = "Semua" | "DPP" | "DPR";

export function DestinationAnalyticsPage() {
  const { data, loading } = useExcelData();

  // Filters
  const [touristFilter, setTouristFilter] = useState<DppDprFilter>("Semua");
  const [scatterFilter, setScatterFilter] = useState<string>("Semua");
  const [attractYear, setAttractYear] = useState<string>("Semua");
  const [launchFilter, setLaunchFilter] = useState<string>("Semua");
  const [sektorFilter, setSektorFilter] = useState<DppDprFilter>("Semua");

  // Destination options from data
  const destinationOptions = useMemo(() => {
    if (!data) return [];
    const dests = [...new Set(data.wisatawanInvestment.map((r) => r.provinsi))].sort();
    return [{ label: "Semua Destinasi", value: "Semua" }, ...dests.map((d) => ({ label: d, value: d }))];
  }, [data]);

  const launchOptions = useMemo(() => {
    if (!data) return [];
    const dests = [...new Set(data.newInvestmentLaunch.map((r) => r.destinasi))].sort();
    return [{ label: "Semua Destinasi", value: "Semua" }, ...dests.map((d) => ({ label: d, value: d }))];
  }, [data]);

  const yearOptions = useMemo(() => {
    if (!data) return [];
    const years = [...new Set(data.attractiveness.map((r) => r.tahun))].sort();
    return [{ label: "Semua Tahun", value: "Semua" }, ...years.map((y) => ({ label: String(y), value: String(y) }))];
  }, [data]);

  const dppDprOptions = [
    { label: "Semua", value: "Semua" },
    { label: "DPP", value: "DPP" },
    { label: "DPR", value: "DPR" },
  ];

  if (loading) return <div className="p-8"><ChartLoadingState height={400} /></div>;

  return (
    <div className="space-y-6 p-6">
      {/* Row 1: Tourist Line Chart (full width) */}
      <ChartCard
        title="Tren Jumlah Wisatawan pada Destinasi Pariwisata Prioritas Indonesia (2019-2025)"
        className="h-[500px]"
        action={
          <ChartFilterSelect
            label="Filter"
            value={touristFilter}
            options={dppDprOptions}
            onChange={(v) => setTouristFilter(v as DppDprFilter)}
          />
        }
      >
        <TouristLineChart data={data?.touristRecords ?? []} filter={touristFilter} />
      </ChartCard>

      {/* Row 2: Scatter + Attractiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Hubungan Jumlah Wisatawan dan Aktivitas Investasi Pariwisata"
          className="h-[420px]"
          action={
            <ChartFilterSelect
              value={scatterFilter}
              options={destinationOptions}
              onChange={setScatterFilter}
            />
          }
        >
          <WisatawanScatter data={data?.wisatawanInvestment ?? []} filter={scatterFilter} />
        </ChartCard>

        <ChartCard
          title="Peringkat Daya Tarik Investasi per Destinasi"
          className="h-[420px]"
          action={
            <ChartFilterSelect
              value={attractYear}
              options={yearOptions}
              onChange={setAttractYear}
            />
          }
        >
          <AttractivenessBar
            data={data?.attractiveness ?? []}
            tahun={attractYear === "Semua" ? "Semua" : Number(attractYear)}
          />
        </ChartCard>
      </div>

      {/* Row 3: Area + Treemap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Frekuensi Peluncuran Investasi Baru"
          className="h-[380px]"
          action={
            <ChartFilterSelect
              value={launchFilter}
              options={launchOptions}
              onChange={setLaunchFilter}
            />
          }
        >
          <NewInvestmentLaunchArea data={data?.newInvestmentLaunch ?? []} filter={launchFilter} />
        </ChartCard>

        <ChartCard
          title="Pemetaan Sektor Investasi Pariwisata"
          className="h-[380px]"
          action={
            <ChartFilterSelect
              value={sektorFilter}
              options={dppDprOptions}
              onChange={(v) => setSektorFilter(v as DppDprFilter)}
            />
          }
        >
          <SektorTreemap data={data?.sektorMapping ?? []} filter={sektorFilter} />
        </ChartCard>
      </div>

      {/* Row 4: Stacked Bar (full width) */}
      <ChartCard
        title="Distribusi Aktivitas Investasi Pariwisata per Destinasi"
        className="h-[440px]"
      >
        <InvestmentEventStackedBar data={data?.investmentEvent ?? []} />
      </ChartCard>
    </div>
  );
}
