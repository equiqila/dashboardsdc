import { useMemo, useState } from "react";
import { DESTINATIONS, YEARS } from "../data/constants";
import { useExcelData } from "../data/ExcelDataContext";
import {
  processTouristArrivals,
  processArrivalsVsInvestment,
  processAttractivenessRanking,
  processLaunchFrequencyMulti,
  processSectorTreemap,
  processEventTypeStacked,
} from "../data/processors/destinationAnalytics";
import { ChartCard } from "../components/analytics/ChartCard";
import { ChartFilterSelect } from "../components/analytics/ChartFilterSelect";
import { ChartLoadingState } from "../components/analytics/ChartLoadingState";
import { useChartLoading } from "../components/analytics/useChartLoading";
import { TouristArrivalsLineChart } from "../components/analytics/charts/TouristArrivalsLineChart";
import { ArrivalsVsInvestmentScatter } from "../components/analytics/charts/ArrivalsVsInvestmentScatter";
import { AttractivenessRankingBar } from "../components/analytics/charts/AttractivenessRankingBar";
import { InvestmentLaunchFrequencyArea } from "../components/analytics/charts/InvestmentLaunchFrequencyArea";
import { SectorTreemapChart } from "../components/analytics/charts/SectorTreemapChart";
import { EventTypeStackedBar } from "../components/analytics/charts/EventTypeStackedBar";

const destinationOptions = [
  { label: "Semua Destinasi", value: "All" },
  ...DESTINATIONS.map((d) => ({ label: d.name, value: d.id })),
];

const yearOptions = YEARS.map((y) => ({ label: y, value: y }));

export function DestinationAnalyticsPage() {
  const { data, loading: dataLoading } = useExcelData();

  const [arrivalsDest, setArrivalsDest] = useState("All");
  const [scatterYear, setScatterYear] = useState("2024");
  const [rankingYear, setRankingYear] = useState("2024");
  const [launchDest, setLaunchDest] = useState("All");
  const [sectorDest, setSectorDest] = useState("All");
  const [eventDest, setEventDest] = useState("All");

  const loadingArrivals = useChartLoading([arrivalsDest]);
  const loadingScatter = useChartLoading([scatterYear]);
  const loadingRanking = useChartLoading([rankingYear]);
  const loadingLaunch = useChartLoading([launchDest]);
  const loadingSector = useChartLoading([sectorDest]);
  const loadingEvent = useChartLoading([eventDest]);

  const touristArrivals = useMemo(
    () =>
      data
        ? processTouristArrivals(data.touristArrivalsData, arrivalsDest, "All")
        : [],
    [arrivalsDest, data],
  );

  const arrivalsVsInvestment = useMemo(
    () =>
      data
        ? processArrivalsVsInvestment(
          data.touristArrivalsData,
          data.initialInvestmentData,
          "All",
          scatterYear,
          "All",
        )
        : [],
    [scatterYear, data],
  );

  const attractivenessRanking = useMemo(
    () =>
      data
        ? processAttractivenessRanking(data.attractivenessData, rankingYear, "All")
        : [],
    [rankingYear, data],
  );

  const launchFrequency = useMemo(
    () =>
      data
        ? processLaunchFrequencyMulti(data.initialInvestmentData, launchDest)
        : { data: [], lines: [] },
    [launchDest, data],
  );

  const sectorTreemap = useMemo(
    () =>
      data
        ? processSectorTreemap(data.sectorInvestmentData, sectorDest, "All")
        : [],
    [sectorDest, data],
  );

  const eventTypeStacked = useMemo(
    () =>
      data
        ? processEventTypeStacked(data.investmentEventData, eventDest, "All")
        : [],
    [eventDest, data],
  );

  if (dataLoading) {
    return (
      <div className="space-y-6">
        {[320, 320, 360, 340, 320, 400].map((h, i) => (
          <ChartLoadingState key={i} height={h} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: 60% + 40% */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <ChartCard
          className="lg:col-span-3"
          title="Jumlah Wisatawan"
          action={
            <ChartFilterSelect
              value={arrivalsDest}
              options={destinationOptions}
              onChange={setArrivalsDest}
            />
          }
        >
          {loadingArrivals ? <ChartLoadingState /> : <TouristArrivalsLineChart data={touristArrivals} />}
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Jumlah Wisatawan vs New Investment"
          action={
            <ChartFilterSelect
              value={scatterYear}
              options={yearOptions}
              onChange={setScatterYear}
            />
          }
        >
          {loadingScatter ? <ChartLoadingState height={320} /> : <ArrivalsVsInvestmentScatter data={arrivalsVsInvestment} />}
        </ChartCard>
      </div>

      {/* Row 2: 40% ranking + 60% launch frequency */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <ChartCard
          className="lg:col-span-4"
          title="Peringkat Daya Tarik Investasi per Destinasi"
          action={
            <ChartFilterSelect
              value={rankingYear}
              options={yearOptions}
              onChange={setRankingYear}
            />
          }
        >
          {loadingRanking ? <ChartLoadingState height={360} /> : <AttractivenessRankingBar data={attractivenessRanking} />}
        </ChartCard>

        <ChartCard
          className="lg:col-span-6"
          title="Frekuensi Peluncuran Investasi Baru"
          action={
            <ChartFilterSelect
              value={launchDest}
              options={destinationOptions}
              onChange={setLaunchDest}
            />
          }
        >
          {loadingLaunch ? (
            <ChartLoadingState height={340} />
          ) : (
            <InvestmentLaunchFrequencyArea
              data={launchFrequency.data}
              lines={launchFrequency.lines}
            />
          )}
        </ChartCard>
      </div>

      {/* Row 3: treemap */}
      <ChartCard
        title="Pemetaan Sektor Pariwisata"
        subtitle={sectorDest === "All" ? "13 Destinasi Prioritas (10 DPP + 3 DPR)" : "Sektor per destinasi"}
        action={
          <ChartFilterSelect
            value={sectorDest}
            options={destinationOptions}
            onChange={setSectorDest}
          />
        }
      >
        {loadingSector ? <ChartLoadingState height={320} /> : <SectorTreemapChart data={sectorTreemap} />}
      </ChartCard>

      {/* Row 4: jenis investasi */}
      <ChartCard
        title="Jenis Investasi"
        action={
          <ChartFilterSelect
            value={eventDest}
            options={destinationOptions}
            onChange={setEventDest}
          />
        }
      >
        {loadingEvent ? <ChartLoadingState height={400} /> : <EventTypeStackedBar data={eventTypeStacked} />}
      </ChartCard>
    </div>
  );
}
