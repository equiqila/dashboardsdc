import type { Destination, TourismSector } from "./types";

export const CHART_COLORS = {
  primary: "#0F5D5E",
  secondary: "#2A9D8F",
  accent: "#D4A017",
  chart4: "#60a5fa",
  chart5: "#a78bfa",
  chart6: "#34d399",
  chart7: "#f87171",
  chart8: "#fb923c",
  chart9: "#6366f1",
  chart10: "#14b8a6",
} as const;

export const SECTOR_COLORS: Record<TourismSector, string> = {
  Accommodation: CHART_COLORS.primary,
  Transportation: CHART_COLORS.secondary,
  Attractions: CHART_COLORS.accent,
  Restaurants: CHART_COLORS.chart4,
  "Supporting Services": CHART_COLORS.chart5,
};

export const EVENT_TYPE_COLORS: Record<string, string> = {
  "New Investment": CHART_COLORS.primary,
  Expansion: CHART_COLORS.secondary,
  Partnership: CHART_COLORS.chart4,
  "Investment Opportunity": CHART_COLORS.accent,
};

export const DESTINATION_LINE_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.chart4,
  CHART_COLORS.chart5,
  CHART_COLORS.chart6,
  CHART_COLORS.chart7,
  CHART_COLORS.chart8,
  CHART_COLORS.chart9,
  CHART_COLORS.chart10,
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
];

export const DESTINATIONS: Destination[] = [
  // DPP – Destinasi Pariwisata Premium (10 destinasi/wilayah)
  { id: "sumut", name: "Sumatera Utara", type: "DPP", provinceMatch: "Sumatera Utara" },
  { id: "jateng-diy", name: "Jawa Tengah & DI Yogyakarta", type: "DPP", provinceMatch: ["Jawa Tengah", "DI Yogyakarta"] },
  { id: "ntb", name: "NTB", type: "DPP", provinceMatch: "NTB" },
  { id: "ntt", name: "NTT", type: "DPP", provinceMatch: "NTT" },
  { id: "sulut", name: "Sulawesi Utara", type: "DPP", provinceMatch: "Sulawesi Utara" },
  { id: "kep-babel", name: "Kepulauan Bangka Belitung", type: "DPP", provinceMatch: "Kepulauan Bangka Belitung" },
  { id: "papua-barat-pbd", name: "Papua Barat & Papua Barat Daya", type: "DPP", provinceMatch: ["Papua Barat", "Papua Barat Daya"] },
  { id: "sultra", name: "Sulawesi Tenggara", type: "DPP", provinceMatch: "Sulawesi Tenggara" },
  { id: "malut", name: "Maluku Utara", type: "DPP", provinceMatch: "Maluku Utara" },
  { id: "jatim", name: "Jawa Timur", type: "DPP", provinceMatch: "Jawa Timur" },
  // DPR – Destinasi Pariwisata Reguler (3 destinasi)
  { id: "bali", name: "Bali", type: "DPR", provinceMatch: "Bali" },
  { id: "jakarta", name: "Jakarta", type: "DPR", provinceMatch: "Jakarta" },
  { id: "kepri", name: "Kepulauan Riau", type: "DPR", provinceMatch: "Kepulauan Riau" },
];

export const YEARS = ["2019", "2020", "2021", "2022", "2023", "2024", "2025"];

export const TOURISM_SECTORS: TourismSector[] = [
  "Accommodation",
  "Transportation",
  "Attractions",
  "Restaurants",
  "Supporting Services",
];

export function getDestinationKey(id: string): string {
  const dest = DESTINATIONS.find((d) => d.id === id);
  return dest?.name.replace(/\s+/g, "") ?? id;
}

export const TOOLTIP_STYLE = {
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "12px",
} as const;
