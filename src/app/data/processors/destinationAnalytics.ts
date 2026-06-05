import type {
  TouristArrivalChartPoint,
  ArrivalsVsInvestmentPoint,
  AttractivenessRankingPoint,
  LaunchFrequencyPoint,
  LaunchFrequencyMultiPoint,
  LaunchFrequencyLineConfig,
  SectorTreemapPoint,
  EventTypeStackedPoint,
  DestinationType,
} from "../types";
import {
  touristArrivalsData,
  initialInvestmentData,
  attractivenessData,
  sectorInvestmentData,
  investmentEventData,
} from "../mockData";
import { DESTINATIONS, SECTOR_COLORS, EVENT_TYPE_COLORS, DESTINATION_LINE_COLORS, getDestinationKey } from "../constants";

function getDestinationName(id: string): string {
  return DESTINATIONS.find((d) => d.id === id)?.name ?? id;
}

function filterByDestinationType(type: DestinationType | "All"): string[] {
  if (type === "All") return DESTINATIONS.map((d) => d.id);
  return DESTINATIONS.filter((d) => d.type === type).map((d) => d.id);
}

export function processTouristArrivals(
  destinationId: string,
  destinationType: DestinationType | "All" = "All",
): TouristArrivalChartPoint[] {
  const allowedIds = filterByDestinationType(destinationType);
  const filtered =
    destinationId === "All"
      ? touristArrivalsData.filter((r) => allowedIds.includes(r.destinationId))
      : touristArrivalsData.filter((r) => r.destinationId === destinationId);

  const byYear = new Map<number, number>();
  filtered.forEach((r) => {
    byYear.set(r.year, (byYear.get(r.year) ?? 0) + r.arrivals);
  });

  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, arrivals]) => ({
      year: String(year),
      arrivals,
    }));
}

export function processArrivalsVsInvestment(
  destinationId: string,
  year: string,
  destinationType: DestinationType | "All" = "All",
): ArrivalsVsInvestmentPoint[] {
  const yearNum = parseInt(year);
  const allowedIds = filterByDestinationType(destinationType);
  const destIds =
    destinationId === "All"
      ? allowedIds
      : allowedIds.filter((id) => id === destinationId);

  return destIds.map((id) => {
    const arrivals =
      touristArrivalsData.find(
        (r) => r.destinationId === id && r.year === yearNum,
      )?.arrivals ?? 0;
    const investment =
      initialInvestmentData.find(
        (r) => r.destinationId === id && r.year === yearNum,
      )?.investmentValue ?? 0;
    return {
      destination: getDestinationName(id),
      arrivals,
      investmentValue: investment,
    };
  });
}

export function processAttractivenessRanking(
  year: string,
  destinationType: DestinationType | "All" = "All",
): AttractivenessRankingPoint[] {
  const yearNum = parseInt(year);
  const allowedIds = filterByDestinationType(destinationType);

  const ranked = attractivenessData
    .filter((r) => r.year === yearNum && allowedIds.includes(r.destinationId))
    .sort((a, b) => b.score - a.score)
    .map((r, index) => ({
      rank: index + 1,
      destination: `#${index + 1} ${getDestinationName(r.destinationId)}`,
      score: r.score,
    }));

  return ranked;
}

export function processLaunchFrequencyMulti(
  destinationId: string,
): { data: LaunchFrequencyMultiPoint[]; lines: LaunchFrequencyLineConfig[] } {
  const years = [...new Set(initialInvestmentData.map((r) => r.year))].sort();

  if (destinationId === "All") {
    const destList = DESTINATIONS;
    const data: LaunchFrequencyMultiPoint[] = years.map((year) => {
      const point: LaunchFrequencyMultiPoint = { year: String(year) };
      destList.forEach((dest) => {
        const key = getDestinationKey(dest.id);
        const record = initialInvestmentData.find(
          (r) => r.destinationId === dest.id && r.year === year,
        );
        point[key] = record?.launchCount ?? 0;
      });
      return point;
    });

    const lines = destList.map((dest, i) => ({
      key: getDestinationKey(dest.id),
      name: dest.name,
      color: DESTINATION_LINE_COLORS[i % DESTINATION_LINE_COLORS.length],
    }));

    return { data, lines };
  }

  const dest = DESTINATIONS.find((d) => d.id === destinationId);
  const key = getDestinationKey(destinationId);
  const colorIndex = DESTINATIONS.findIndex((d) => d.id === destinationId);

  const data: LaunchFrequencyMultiPoint[] = years.map((year) => {
    const record = initialInvestmentData.find(
      (r) => r.destinationId === destinationId && r.year === year,
    );
    return { year: String(year), [key]: record?.launchCount ?? 0 };
  });

  return {
    data,
    lines: [{
      key,
      name: dest?.name ?? destinationId,
      color: DESTINATION_LINE_COLORS[Math.max(colorIndex, 0) % DESTINATION_LINE_COLORS.length],
    }],
  };
}

export function processLaunchFrequency(
  destinationId: string,
  destinationType: DestinationType | "All" = "All",
): LaunchFrequencyPoint[] {
  const allowedIds = filterByDestinationType(destinationType);
  const filtered =
    destinationId === "All"
      ? initialInvestmentData.filter((r) => allowedIds.includes(r.destinationId))
      : initialInvestmentData.filter((r) => r.destinationId === destinationId);

  const byYear = new Map<number, number>();
  filtered.forEach((r) => {
    byYear.set(r.year, (byYear.get(r.year) ?? 0) + r.launchCount);
  });

  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, frequency]) => ({
      year: String(year),
      frequency,
    }));
}

export function processSectorTreemap(
  destinationId: string,
  destinationType: DestinationType | "All" = "All",
): SectorTreemapPoint[] {
  if (destinationId === "All") {
    const destList = filterByDestinationType(destinationType);
    const totals = destList.map((id) => {
      const records = sectorInvestmentData.filter((r) => r.destinationId === id);
      return {
        id,
        name: getDestinationName(id),
        value: records.reduce((s, r) => s + r.amount, 0),
      };
    });
    const grandTotal = totals.reduce((s, t) => s + t.value, 0);

    return totals.map((t, i) => ({
      name: t.name,
      value: t.value,
      percentage: grandTotal > 0 ? Math.round((t.value / grandTotal) * 100) : 0,
      fill: DESTINATION_LINE_COLORS[i % DESTINATION_LINE_COLORS.length],
    }));
  }

  const filtered = sectorInvestmentData.filter((r) => r.destinationId === destinationId);
  const total = filtered.reduce((s, r) => s + r.amount, 0);

  return filtered.map((r) => ({
    name: r.sector,
    value: r.amount,
    percentage: total > 0 ? Math.round((r.amount / total) * 100) : 0,
    fill: SECTOR_COLORS[r.sector] ?? "#6b7280",
  }));
}

export function processEventTypeStacked(
  destinationId: string,
  destinationType: DestinationType | "All" = "All",
): EventTypeStackedPoint[] {
  const allowedIds = filterByDestinationType(destinationType);
  const destIds =
    destinationId === "All"
      ? allowedIds
      : allowedIds.filter((id) => id === destinationId);

  return destIds.map((id) => {
    const events = investmentEventData.filter((e) => e.destinationId === id);
    const point: EventTypeStackedPoint = {
      destination: getDestinationName(id),
      "New Investment": 0,
      Expansion: 0,
      Partnership: 0,
      "Investment Opportunity": 0,
    };
    events.forEach((e) => {
      point[e.eventType] = e.count;
    });
    return point;
  });
}

export function computeDestinationKpis(
  destinationId: string,
  year: string,
  destinationType: DestinationType | "All" = "All",
) {
  const yearNum = parseInt(year);
  const allowedIds = filterByDestinationType(destinationType);
  const destFilter = (id: string) =>
    destinationId === "All" ? allowedIds.includes(id) : id === destinationId;

  const totalDestinations =
    destinationId === "All"
      ? allowedIds.length
      : 1;

  const totalArrivals = touristArrivalsData
    .filter((r) => destFilter(r.destinationId) && r.year === yearNum)
    .reduce((sum, r) => sum + r.arrivals, 0);

  const investments = initialInvestmentData.filter(
    (r) => destFilter(r.destinationId) && r.year === yearNum,
  );
  const totalNewInvestments = investments.reduce((s, r) => s + r.launchCount, 0);
  const totalInvestmentValue = investments.reduce((s, r) => s + r.investmentValue, 0);

  return {
    totalDestinations,
    totalArrivals,
    totalNewInvestments,
    totalInvestmentValue,
  };
}

export { EVENT_TYPE_COLORS };
