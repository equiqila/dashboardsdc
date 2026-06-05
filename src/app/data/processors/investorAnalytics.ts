import type {
  CountryMapPoint,
  CountryDetailData,
  InvestorFrequencyPoint,
  InvestorSectorHeatmapCell,
  InvestorCategory,
  SearchIntensityChartPoint,
  TourismSector,
} from "../types";
import {
  countryInvestmentData,
  investorData,
  investmentOpportunityData,
  searchIntensityData,
} from "../mockData";
import { DESTINATIONS, DESTINATION_LINE_COLORS, TOURISM_SECTORS } from "../constants";

const COUNTRY_ALIASES: Record<string, string> = {
  UAE: "United Arab Emirates",
  "United States of America": "United States",
  "U.A.E.": "United Arab Emirates",
};

function normalizeCountry(name: string): string {
  return COUNTRY_ALIASES[name] ?? name;
}

export function processCountryDetail(country: string, year: string): CountryDetailData | null {
  const yearNum = parseInt(year);
  const normalized = normalizeCountry(country);

  const summary = countryInvestmentData.find(
    (r) => r.country === normalized && r.year === yearNum,
  );
  if (!summary) return null;

  const foreignInvestors = investorData.filter(
    (r) =>
      r.category === "Foreign" &&
      r.year === yearNum &&
      normalizeCountry(r.country ?? "") === normalized,
  );

  const sectorTotals = new Map<TourismSector, { projects: number; value: number }>();
  TOURISM_SECTORS.forEach((s) => sectorTotals.set(s, { projects: 0, value: 0 }));

  foreignInvestors.forEach((inv) => {
    Object.entries(inv.sectorInvestments).forEach(([sector, count]) => {
      const entry = sectorTotals.get(sector as TourismSector)!;
      const projects = count ?? 0;
      entry.projects += projects;
      entry.value += Math.round((projects / inv.investmentCount) * inv.totalValue);
    });
  });

  // Fill sector breakdown — distribute summary if no investor rows
  let sectors = TOURISM_SECTORS.map((sector) => {
    const t = sectorTotals.get(sector)!;
    return {
      sector,
      projectCount: t.projects,
      investmentValue: t.value,
    };
  }).filter((s) => s.projectCount > 0);

  if (sectors.length === 0) {
    const weights = [0.35, 0.15, 0.2, 0.12, 0.18];
    sectors = TOURISM_SECTORS.map((sector, i) => ({
      sector,
      projectCount: Math.max(1, Math.round(summary.projectCount * weights[i])),
      investmentValue: Math.round(summary.totalInvestment * weights[i]),
    }));
  }

  const companies = foreignInvestors.length
    ? foreignInvestors.map((inv) => {
        const topSector = (Object.entries(inv.sectorInvestments) as [TourismSector, number][])
          .sort((a, b) => b[1] - a[1])[0];
        return {
          company: inv.name,
          sector: topSector?.[0] ?? "Accommodation",
          projectCount: inv.investmentCount,
          investmentValue: Math.round(inv.totalValue),
        };
      })
    : generateFallbackCompanies(normalized, summary.projectCount, summary.totalInvestment);

  return {
    country: normalized,
    year: yearNum,
    totalInvestment: summary.totalInvestment,
    totalProjects: summary.projectCount,
    sectors: sectors.sort((a, b) => b.projectCount - a.projectCount),
    companies: companies.sort((a, b) => b.projectCount - a.projectCount),
  };
}

function generateFallbackCompanies(
  country: string,
  projectCount: number,
  totalInvestment: number,
) {
  const prefixes = ["Global", "Pacific", "Asia", "International", "Premier"];
  const suffixes = ["Hospitality Group", "Tourism Corp", "Resort Holdings", "Travel Ventures"];
  const count = Math.min(5, Math.max(3, Math.round(projectCount / 8)));
  const sectors = TOURISM_SECTORS;

  return Array.from({ length: count }, (_, i) => ({
    company: `${prefixes[i % prefixes.length]} ${country.split(" ")[0]} ${suffixes[i % suffixes.length]}`,
    sector: sectors[i % sectors.length],
    projectCount: Math.max(1, Math.round(projectCount / count)),
    investmentValue: Math.round(totalInvestment / count),
  }));
}

export function processCountryMap(year: string): CountryMapPoint[] {
  const yearNum = parseInt(year);
  const filtered = countryInvestmentData.filter((r) => r.year === yearNum);
  const maxInvestment = Math.max(...filtered.map((r) => r.totalInvestment), 1);

  return filtered.map((r) => ({
    country: r.country,
    countryCode: r.countryCode,
    totalInvestment: r.totalInvestment,
    projectCount: r.projectCount,
    lat: r.lat,
    lng: r.lng,
    intensity: r.totalInvestment / maxInvestment,
  }));
}

export function processInvestorFrequency(
  category: InvestorCategory | "All",
  year: string,
  limit = 10,
): InvestorFrequencyPoint[] {
  const yearNum = parseInt(year);

  const aggregated = new Map<string, { count: number; totalValue: number }>();

  investorData
    .filter(
      (r) =>
        r.year === yearNum &&
        (category === "All" || r.category === category),
    )
    .forEach((r) => {
      const existing = aggregated.get(r.name) ?? { count: 0, totalValue: 0 };
      aggregated.set(r.name, {
        count: existing.count + r.investmentCount,
        totalValue: existing.totalValue + r.totalValue,
      });
    });

  return Array.from(aggregated.entries())
    .map(([name, data]) => ({
      name: name.length > 22 ? `${name.slice(0, 20)}…` : name,
      count: data.count,
      totalValue: Math.round(data.totalValue),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function processInvestorSectorHeatmap(
  category: InvestorCategory | "All",
  year: string,
  limit = 10,
): { cells: InvestorSectorHeatmapCell[]; investors: string[]; maxValue: number } {
  const yearNum = parseInt(year);

  const filtered = investorData.filter(
    (r) =>
      r.year === yearNum &&
      (category === "All" || r.category === category),
  );

  const byInvestor = new Map<string, typeof filtered>();
  filtered.forEach((r) => {
    const list = byInvestor.get(r.name) ?? [];
    list.push(r);
    byInvestor.set(r.name, list);
  });

  const topInvestors = Array.from(byInvestor.entries())
    .map(([name, records]) => ({
      name,
      total: records.reduce((s, r) => s + r.investmentCount, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((i) => i.name);

  const cells: InvestorSectorHeatmapCell[] = [];
  let maxValue = 0;

  topInvestors.forEach((investorName) => {
    const records = byInvestor.get(investorName) ?? [];
    const merged: Record<string, number> = {};
    records.forEach((r) => {
      Object.entries(r.sectorInvestments).forEach(([sector, val]) => {
        merged[sector] = (merged[sector] ?? 0) + (val ?? 0);
      });
    });
    Object.entries(merged).forEach(([sector, value]) => {
      maxValue = Math.max(maxValue, value);
      cells.push({
        investor: investorName.length > 18 ? `${investorName.slice(0, 16)}…` : investorName,
        sector: sector as InvestorSectorHeatmapCell["sector"],
        value,
      });
    });
  });

  return {
    cells,
    investors: topInvestors.map((n) => (n.length > 18 ? `${n.slice(0, 16)}…` : n)),
    maxValue,
  };
}

export function processForeignDomesticPie(year: string) {
  const yearNum = parseInt(year);
  const record = investmentOpportunityData.find((r) => r.year === yearNum);
  if (!record) return [];

  const total = record.pmdn + record.pma;
  return [
    {
      name: "PMDN (Domestic)",
      value: record.pmdn,
      percentage: Math.round((record.pmdn / total) * 100),
      fill: "#0F5D5E",
    },
    {
      name: "PMA (Foreign)",
      value: record.pma,
      percentage: Math.round((record.pma / total) * 100),
      fill: "#2A9D8F",
    },
  ];
}

export function processSearchIntensityTrend(
  selectedDestinations: string[],
): { data: SearchIntensityChartPoint[]; lines: { key: string; name: string; color: string }[] } {
  const destIds =
    selectedDestinations.length > 0
      ? selectedDestinations
      : DESTINATIONS.filter((d) => d.type === "DPP")
          .slice(0, 5)
          .map((d) => d.id);

  const years = [...new Set(searchIntensityData.map((r) => r.year))].sort();

  const data: SearchIntensityChartPoint[] = years.map((year) => {
    const point: SearchIntensityChartPoint = { year: String(year) };
    destIds.forEach((id) => {
      const dest = DESTINATIONS.find((d) => d.id === id);
      const key = dest?.name.replace(/\s+/g, "") ?? id;
      const record = searchIntensityData.find(
        (r) => r.destinationId === id && r.year === year,
      );
      point[key] = record?.intensity ?? 0;
    });
    return point;
  });

  const lines = destIds.map((id, i) => {
    const dest = DESTINATIONS.find((d) => d.id === id);
    return {
      key: dest?.name.replace(/\s+/g, "") ?? id,
      name: dest?.name ?? id,
      color: DESTINATION_LINE_COLORS[i % DESTINATION_LINE_COLORS.length],
    };
  });

  return { data, lines };
}

export function computeInvestorKpis(year: string, category: InvestorCategory | "All") {
  const yearNum = parseInt(year);
  const filtered = investorData.filter((r) => r.year === yearNum);
  const categoryFiltered =
    category === "All" ? filtered : filtered.filter((r) => r.category === category);

  const uniqueInvestors = new Set(categoryFiltered.map((r) => r.name)).size;
  const foreignCount = new Set(
    filtered.filter((r) => r.category === "Foreign").map((r) => r.name),
  ).size;
  const domesticCount = new Set(
    filtered.filter((r) => r.category === "Domestic").map((r) => r.name),
  ).size;
  const totalProjects = categoryFiltered.reduce((s, r) => s + r.investmentCount, 0);

  return {
    totalInvestors: uniqueInvestors,
    totalForeignInvestors: foreignCount,
    totalDomesticInvestors: domesticCount,
    totalProjects,
  };
}

export function getHeatColor(value: number, max: number): string {
  const ratio = max > 0 ? value / max : 0;
  if (ratio >= 0.75) return "#0F5D5E";
  if (ratio >= 0.5) return "#2A9D8F";
  if (ratio >= 0.25) return "#60a5fa";
  return "#d1d5db";
}
