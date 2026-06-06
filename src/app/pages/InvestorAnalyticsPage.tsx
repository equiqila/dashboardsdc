import { useMemo, useState } from "react";
import type { InvestorCategory } from "../data/types";
import { DESTINATIONS, YEARS } from "../data/constants";
import { useExcelData } from "../data/ExcelDataContext";
import {
  processCountryMap,
  processInvestorFrequency,
  processInvestorSectorHeatmap,
  processForeignDomesticPie,
  processSearchIntensityTrend,
} from "../data/processors/investorAnalytics";
import { ChartCard } from "../components/analytics/ChartCard";
import { ChartFilterSelect } from "../components/analytics/ChartFilterSelect";
import { ChartLoadingState } from "../components/analytics/ChartLoadingState";
import { useChartLoading } from "../components/analytics/useChartLoading";
import { WorldInvestmentMap } from "../components/analytics/charts/WorldInvestmentMap";
import { InvestorFrequencyBar } from "../components/analytics/charts/InvestorFrequencyBar";
import { InvestorSectorHeatmap } from "../components/analytics/charts/InvestorSectorHeatmap";
import { ForeignDomesticPie } from "../components/analytics/charts/ForeignDomesticPie";
import { SearchIntensityMultiLine } from "../components/analytics/charts/SearchIntensityMultiLine";

const yearOptions = YEARS.map((y) => ({ label: y, value: y }));

const investorOptions = [
  { label: "Semua", value: "All" },
  { label: "Investor Dalam Negeri", value: "Domestic" },
  { label: "Investor Asing", value: "Foreign" },
];

const destinationOptions = [
  { label: "Semua Destinasi", value: "All" },
  ...DESTINATIONS.map((d) => ({ label: `${d.name} (${d.type})`, value: d.id })),
];

export function InvestorAnalyticsPage() {
  const { data, loading: dataLoading } = useExcelData();

  const [mapYear, setMapYear] = useState("2024");
  const [frequencyCategory, setFrequencyCategory] = useState<InvestorCategory | "All">("All");
  const [heatmapCategory, setHeatmapCategory] = useState<InvestorCategory | "All">("All");
  const [pieYear, setPieYear] = useState("2024");
  const [searchDest, setSearchDest] = useState("All");

  const loadingMap = useChartLoading([mapYear]);
  const loadingFrequency = useChartLoading([frequencyCategory]);
  const loadingHeatmap = useChartLoading([heatmapCategory]);
  const loadingPie = useChartLoading([pieYear]);
  const loadingSearch = useChartLoading([searchDest]);

  const countryMap = useMemo(
    () => data ? processCountryMap(data.countryInvestmentData, mapYear) : [],
    [mapYear, data],
  );

  const investorFrequency = useMemo(
    () => data ? processInvestorFrequency(data.investorData, frequencyCategory, "2024") : [],
    [frequencyCategory, data],
  );

  const heatmap = useMemo(
    () => data ? processInvestorSectorHeatmap(data.investorData, heatmapCategory, "2024") : { cells: [], investors: [], maxValue: 0 },
    [heatmapCategory, data],
  );

  const foreignDomestic = useMemo(
    () => data ? processForeignDomesticPie(data.investmentOpportunityData, pieYear) : [],
    [pieYear, data],
  );

  const searchIntensity = useMemo(
    () =>
      data
        ? processSearchIntensityTrend(
          data.searchIntensityData,
          searchDest === "All" ? DESTINATIONS.map((d) => d.id) : [searchDest],
        )
        : { data: [], lines: [] },
    [searchDest, data],
  );

  if (dataLoading) {
    return (
      <div className="space-y-6">
        <ChartLoadingState height={400} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartLoadingState height={240} />
          <ChartLoadingState height={360} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartLoadingState />
          <ChartLoadingState height={320} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: world map */}
      <ChartCard
        title="Negara Mana yang Investasi Paling Besar"
        action={
          <ChartFilterSelect value={mapYear} options={yearOptions} onChange={setMapYear} />
        }
      >
        {loadingMap ? (
          <ChartLoadingState height={400} />
        ) : (
          <WorldInvestmentMap
            data={countryMap}
            year={mapYear}
            countryInvestmentData={data!.countryInvestmentData}
            investorData={data!.investorData}
          />
        )}
      </ChartCard>

      {/* Row 2: frequency + heatmap side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Perusahaan dengan Frekuensi Investasi Paling Banyak"
          className="h-full !pb-4"
          action={
            <ChartFilterSelect
              value={frequencyCategory}
              options={investorOptions}
              onChange={(v) => setFrequencyCategory(v as InvestorCategory | "All")}
            />
          }
        >
          {loadingFrequency ? (
            <ChartLoadingState height={240} />
          ) : (
            <InvestorFrequencyBar data={investorFrequency} compact />
          )}
        </ChartCard>

        <ChartCard
          title="Hubungan Investor dan Sektor"
          className="h-full"
          action={
            <ChartFilterSelect
              value={heatmapCategory}
              options={investorOptions}
              onChange={(v) => setHeatmapCategory(v as InvestorCategory | "All")}
            />
          }
        >
          {loadingHeatmap ? (
            <ChartLoadingState height={360} />
          ) : (
            <InvestorSectorHeatmap
              cells={heatmap.cells}
              investors={heatmap.investors}
              maxValue={heatmap.maxValue}
            />
          )}
        </ChartCard>
      </div>

      {/* Row 3: pie + line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Dominasi Investor Asing (PMA) dan Domestik (PMDN)"
          subtitle="Dalam pencarian peluang investasi pariwisata"
          action={
            <ChartFilterSelect value={pieYear} options={yearOptions} onChange={setPieYear} />
          }
        >
          {loadingPie ? <ChartLoadingState /> : <ForeignDomesticPie data={foreignDomestic} />}
        </ChartCard>

        <ChartCard
          title="Perkembangan Intensitas Pencarian Peluang Investasi"
          subtitle="10 DPP dan 3 DPR"
          action={
            <ChartFilterSelect
              value={searchDest}
              options={destinationOptions}
              onChange={setSearchDest}
            />
          }
        >
          {loadingSearch ? (
            <ChartLoadingState height={320} />
          ) : (
            <SearchIntensityMultiLine
              data={searchIntensity.data}
              lines={searchIntensity.lines}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
