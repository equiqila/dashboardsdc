import type {
  TouristArrivalRecord,
  InitialInvestmentRecord,
  AttractivenessRecord,
  SectorInvestmentRecord,
  InvestmentEventRecord,
  CountryInvestmentRecord,
  InvestorRecord,
  InvestmentOpportunityRecord,
  SearchIntensityRecord,
} from "./types";
import { DESTINATIONS } from "./constants";

const arrivalBase: Record<string, number> = {
  mandala: 850000,
  "labuan-bajo": 720000,
  borobudur: 980000,
  "danau-toba": 650000,
  likupang: 420000,
  "tanjung-kelayang": 380000,
  morotai: 180000,
  wakatobi: 220000,
  "raja-ampat": 310000,
  bunaken: 290000,
  bali: 6200000,
  yogyakarta: 4100000,
  jakarta: 2800000,
};

export const touristArrivalsData: TouristArrivalRecord[] = DESTINATIONS.flatMap(
  (dest) =>
    [2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => {
      const base = arrivalBase[dest.id] ?? 500000;
      const yearFactor =
        year === 2020 ? 0.55 : year === 2021 ? 0.72 : 1 + (year - 2019) * 0.08;
      const noise = 1 + (dest.id.charCodeAt(0) % 5) * 0.02;
      return {
        destinationId: dest.id,
        year,
        arrivals: Math.round(base * yearFactor * noise),
      };
    }),
);

export const initialInvestmentData: InitialInvestmentRecord[] = DESTINATIONS.flatMap(
  (dest) =>
    [2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => {
      const baseValue = dest.type === "DPR" ? 420 : 85 + dest.id.length * 8;
      const yearFactor = year <= 2020 ? 0.6 : 1 + (year - 2020) * 0.12;
      return {
        destinationId: dest.id,
        year,
        investmentValue: Math.round(baseValue * yearFactor),
        launchCount: Math.max(1, Math.round((3 + dest.id.length % 4) * yearFactor)),
      };
    }),
);

export const attractivenessData: AttractivenessRecord[] = DESTINATIONS.flatMap(
  (dest) =>
    [2022, 2023, 2024, 2025].map((year) => {
      const base =
        55 +
        (dest.type === "DPP" ? 15 : 25) +
        (dest.id.charCodeAt(0) % 20);
      const yearBoost = (year - 2022) * 4;
      return {
        destinationId: dest.id,
        year,
        score: Math.min(98, base + yearBoost),
        newsFrequency: 40 + base + yearBoost * 2,
        newInvestments: 8 + Math.round(base / 8),
        searchIndex: 45 + Math.round(base / 2),
      };
    }),
);

export const sectorInvestmentData: SectorInvestmentRecord[] = DESTINATIONS.flatMap(
  (dest) => {
    const sectors = [
      { sector: "Accommodation" as const, amount: 1200, frequency: 45 },
      { sector: "Transportation" as const, amount: 680, frequency: 28 },
      { sector: "Attractions" as const, amount: 920, frequency: 35 },
      { sector: "Restaurants" as const, amount: 540, frequency: 52 },
      { sector: "Supporting Services" as const, amount: 380, frequency: 22 },
    ];
    const multiplier = dest.type === "DPR" ? 2.5 : 1 + (dest.id.length % 5) * 0.15;
    return sectors.map((s) => ({
      destinationId: dest.id,
      sector: s.sector,
      amount: Math.round(s.amount * multiplier),
      frequency: Math.round(s.frequency * multiplier),
    }));
  },
);

export const investmentEventData: InvestmentEventRecord[] = DESTINATIONS.flatMap(
  (dest) => {
    const eventTypes = [
      { eventType: "New Investment" as const, count: 28 },
      { eventType: "Expansion" as const, count: 18 },
      { eventType: "Partnership" as const, count: 12 },
      { eventType: "Investment Opportunity" as const, count: 14 },
    ];
    const scale = dest.type === "DPR" ? 1.8 : 1 + (dest.id.length % 4) * 0.1;
    return eventTypes.map((e) => ({
      destinationId: dest.id,
      year: 2024,
      eventType: e.eventType,
      count: Math.round(e.count * scale),
    }));
  },
);

export const countryInvestmentData: CountryInvestmentRecord[] = [
  { country: "Singapore", countryCode: "SG", year: 2024, totalInvestment: 4200, projectCount: 38, lat: 1.35, lng: 103.8 },
  { country: "China", countryCode: "CN", year: 2024, totalInvestment: 3800, projectCount: 42, lat: 35.86, lng: 104.19 },
  { country: "Japan", countryCode: "JP", year: 2024, totalInvestment: 2900, projectCount: 31, lat: 36.2, lng: 138.25 },
  { country: "Malaysia", countryCode: "MY", year: 2024, totalInvestment: 2100, projectCount: 28, lat: 4.21, lng: 101.97 },
  { country: "Australia", countryCode: "AU", year: 2024, totalInvestment: 1850, projectCount: 22, lat: -25.27, lng: 133.77 },
  { country: "United States", countryCode: "US", year: 2024, totalInvestment: 1650, projectCount: 19, lat: 37.09, lng: -95.71 },
  { country: "Netherlands", countryCode: "NL", year: 2024, totalInvestment: 980, projectCount: 12, lat: 52.13, lng: 5.29 },
  { country: "South Korea", countryCode: "KR", year: 2024, totalInvestment: 1420, projectCount: 18, lat: 35.9, lng: 127.77 },
  { country: "United Kingdom", countryCode: "GB", year: 2024, totalInvestment: 890, projectCount: 11, lat: 55.37, lng: -3.43 },
  { country: "France", countryCode: "FR", year: 2024, totalInvestment: 720, projectCount: 9, lat: 46.22, lng: 2.21 },
  { country: "United Arab Emirates", countryCode: "AE", year: 2024, totalInvestment: 1100, projectCount: 14, lat: 23.42, lng: 53.84 },
  { country: "Thailand", countryCode: "TH", year: 2024, totalInvestment: 650, projectCount: 15, lat: 15.87, lng: 100.99 },
  { country: "India", countryCode: "IN", year: 2024, totalInvestment: 580, projectCount: 13, lat: 20.59, lng: 78.96 },
  { country: "Germany", countryCode: "DE", year: 2024, totalInvestment: 520, projectCount: 8, lat: 51.16, lng: 10.45 },
  { country: "Hong Kong", countryCode: "HK", year: 2024, totalInvestment: 780, projectCount: 10, lat: 22.31, lng: 114.16 },
  // Historical year variants
  ...["2023", "2022", "2021"].flatMap((y) => {
    const year = parseInt(y);
    const factor = year === 2023 ? 0.85 : year === 2022 ? 0.72 : 0.58;
    return [
      { country: "Singapore", countryCode: "SG", year, totalInvestment: Math.round(4200 * factor), projectCount: Math.round(38 * factor), lat: 1.35, lng: 103.8 },
      { country: "China", countryCode: "CN", year, totalInvestment: Math.round(3800 * factor), projectCount: Math.round(42 * factor), lat: 35.86, lng: 104.19 },
      { country: "Japan", countryCode: "JP", year, totalInvestment: Math.round(2900 * factor), projectCount: Math.round(31 * factor), lat: 36.2, lng: 138.25 },
    ];
  }),
];

const domesticInvestors = [
  "PT Avina Persada", "PT Toba Lake Resort", "PT Borobudur Heritage",
  "PT Mandalika Development", "PT Likupang Tourism", "PT Raja Ampat Eco",
  "PT Wakatobi Marine", "PT Morotai Ventures", "PT Bunaken Dive",
  "PT Tanjung Kelayang Group",
];

const foreignInvestors = [
  { name: "Accor Hotels Group", country: "France" },
  { name: "Marriott International", country: "United States" },
  { name: "CapitaLand", country: "Singapore" },
  { name: "Mitsubishi Estate", country: "Japan" },
  { name: "Genting Group", country: "Malaysia" },
  { name: "Minor International", country: "Thailand" },
  { name: "Hyatt Hotels Corp", country: "United States" },
  { name: "Shangri-La Hotels", country: "Hong Kong" },
  { name: "IHG Hotels", country: "United Kingdom" },
  { name: "Emaar Properties", country: "UAE" },
];

export const investorData: InvestorRecord[] = [
  ...domesticInvestors.flatMap((name, i) =>
    [2022, 2023, 2024, 2025].map((year) => ({
      id: `dom-${i}-${year}`,
      name,
      category: "Domestic" as const,
      year,
      investmentCount: 8 + (i % 5) + Math.floor((year - 2022) * 1.5),
      totalValue: (120 + i * 45) * (1 + (year - 2022) * 0.15),
      sectorInvestments: {
        Accommodation: 30 + i * 5,
        Transportation: 12 + i * 2,
        Attractions: 18 + i * 3,
        Restaurants: 22 + i * 2,
        "Supporting Services": 10 + i,
      },
    })),
  ),
  ...foreignInvestors.flatMap((inv, i) =>
    [2022, 2023, 2024, 2025].map((year) => ({
      id: `for-${i}-${year}`,
      name: inv.name,
      category: "Foreign" as const,
      country: inv.country,
      year,
      investmentCount: 12 + (i % 6) + Math.floor((year - 2022) * 2),
      totalValue: (280 + i * 80) * (1 + (year - 2022) * 0.18),
      sectorInvestments: {
        Accommodation: 45 + i * 8,
        Transportation: 15 + i * 3,
        Attractions: 20 + i * 4,
        Restaurants: 18 + i * 2,
        "Supporting Services": 8 + i * 2,
      },
    })),
  ),
];

export const investmentOpportunityData: InvestmentOpportunityRecord[] = [
  { year: 2019, pmdn: 1850, pma: 920 },
  { year: 2020, pmdn: 1420, pma: 680 },
  { year: 2021, pmdn: 1680, pma: 810 },
  { year: 2022, pmdn: 2150, pma: 1050 },
  { year: 2023, pmdn: 2680, pma: 1280 },
  { year: 2024, pmdn: 3120, pma: 1520 },
  { year: 2025, pmdn: 3580, pma: 1780 },
];

const searchBase: Record<string, number> = {
  mandala: 78, "labuan-bajo": 72, borobudur: 85, "danau-toba": 68,
  likupang: 52, "tanjung-kelayang": 48, morotai: 38, wakatobi: 42,
  "raja-ampat": 58, bunaken: 55, bali: 95, yogyakarta: 88, jakarta: 82,
};

export const searchIntensityData: SearchIntensityRecord[] = DESTINATIONS.flatMap(
  (dest) =>
    [2019, 2020, 2021, 2022, 2023, 2024, 2025].map((year) => {
      const base = searchBase[dest.id] ?? 50;
      const yearFactor =
        year === 2020 ? 0.65 : year === 2021 ? 0.78 : 1 + (year - 2019) * 0.06;
      return {
        destinationId: dest.id,
        year,
        intensity: Math.round(base * yearFactor),
      };
    }),
);
