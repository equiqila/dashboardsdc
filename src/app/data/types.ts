import type { LucideIcon } from "lucide-react";

export type DestinationType = "DPP" | "DPR";

export interface Destination {
  id: string;
  name: string;
  type: DestinationType;
}

export interface TouristArrivalRecord {
  destinationId: string;
  year: number;
  arrivals: number;
}

export interface InitialInvestmentRecord {
  destinationId: string;
  year: number;
  investmentValue: number; // billion Rp
  launchCount: number;
}

export interface AttractivenessRecord {
  destinationId: string;
  year: number;
  score: number;
  newsFrequency: number;
  newInvestments: number;
  searchIndex: number;
}

export type TourismSector =
  | "Accommodation"
  | "Transportation"
  | "Attractions"
  | "Restaurants"
  | "Supporting Services";

export interface SectorInvestmentRecord {
  destinationId: string;
  sector: TourismSector;
  amount: number;
  frequency: number;
}

export type InvestmentEventType =
  | "New Investment"
  | "Expansion"
  | "Partnership"
  | "Investment Opportunity";

export interface InvestmentEventRecord {
  destinationId: string;
  year: number;
  eventType: InvestmentEventType;
  count: number;
}

export type InvestorCategory = "Domestic" | "Foreign";

export interface CountryInvestmentRecord {
  country: string;
  countryCode: string;
  year: number;
  totalInvestment: number; // billion Rp
  projectCount: number;
  lat: number;
  lng: number;
}

export interface InvestorRecord {
  id: string;
  name: string;
  category: InvestorCategory;
  country?: string;
  year: number;
  investmentCount: number;
  totalValue: number;
  sectorInvestments: Partial<Record<TourismSector, number>>;
}

export interface InvestmentOpportunityRecord {
  year: number;
  pmdn: number;
  pma: number;
}

export interface SearchIntensityRecord {
  destinationId: string;
  year: number;
  intensity: number;
}

// Processed chart data types
export interface TouristArrivalChartPoint {
  year: string;
  arrivals: number;
}

export interface ArrivalsVsInvestmentPoint {
  destination: string;
  arrivals: number;
  investmentValue: number;
}

export interface AttractivenessRankingPoint {
  rank: number;
  destination: string;
  score: number;
}

export interface LaunchFrequencyPoint {
  year: string;
  frequency: number;
}

export interface LaunchFrequencyMultiPoint {
  year: string;
  [key: string]: string | number;
}

export interface LaunchFrequencyLineConfig {
  key: string;
  name: string;
  color: string;
}

export interface SectorTreemapPoint {
  name: string;
  value: number;
  percentage: number;
  fill: string;
}

export interface EventTypeStackedPoint {
  destination: string;
  "New Investment": number;
  Expansion: number;
  Partnership: number;
  "Investment Opportunity": number;
}

export interface CountryMapPoint {
  country: string;
  countryCode: string;
  totalInvestment: number;
  projectCount: number;
  lat: number;
  lng: number;
  intensity: number;
}

export interface CountrySectorBreakdown {
  sector: TourismSector;
  projectCount: number;
  investmentValue: number;
}

export interface CountryCompanyProject {
  company: string;
  sector: TourismSector;
  projectCount: number;
  investmentValue: number;
}

export interface CountryDetailData {
  country: string;
  year: number;
  totalInvestment: number;
  totalProjects: number;
  sectors: CountrySectorBreakdown[];
  companies: CountryCompanyProject[];
}

export interface InvestorFrequencyPoint {
  name: string;
  count: number;
  totalValue: number;
}

export interface InvestorSectorHeatmapCell {
  investor: string;
  sector: TourismSector;
  value: number;
}

export interface SearchIntensityChartPoint {
  year: string;
  [destinationKey: string]: string | number;
}

export interface KpiItem {
  title: string;
  value: string;
  source?: string;
  icon: LucideIcon;
}
