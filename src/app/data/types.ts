/**
 * types.ts - Data types for Data_Dashboard.xlsx
 * Each type matches the column structure of a specific sheet.
 */

// ── Page 1: Destination Analytics ────────────────────────────────────────────

/** Sheet: Page1_jumlahwisatawan */
export interface TouristRecord {
  provinsi: string;    // "Danau Toba (DPP)" | "Bali (DPR)" etc.
  tahun: number;
  jumlah_wisatawan: number;
}

/** Sheet: Page1wisatawan_investment */
export interface WisatawanInvestmentRecord {
  provinsi: string;
  tahun: number;
  jumlah_wisatawan: number;
  investment: number;
}

/** Sheet: Page1_investment attractiveness */
export interface AttractivenessRecord {
  provinsi: string;
  tahun: number;
  investment: number;
}

/** Sheet: Page1_new investment launch */
export interface NewInvestmentLaunchRecord {
  destinasi: string;
  tahun: number;
  frekuensi_peluncuran: number;
}

/** Sheet: Page 1_Sektor Mapping */
export interface SektorMappingRecord {
  destination: string;
  sektor: string;
  jumlah_berita_investasi: number;
}

/** Sheet: Page 1_event */
export interface InvestmentEventRecord {
  destination: string;
  aktivitas_investasi: string;
  jumlah_berita_investasi: number;
}

// ── Page 2: Investor Analytics ────────────────────────────────────────────────

/** Sheet: Page2_Negara Investor Terbesar (pivot format) */
export interface NegaraInvestorRecord {
  negara: string;
  byYear: Record<string, number>; // { "2019": 62, "2020": 31, ... }
  grandTotal: number;
}

/** Sheet: Page 2_PerusahaanTopInvestLokal */
export interface PerusahaanInvestorRecord {
  perusahaan: string;
  negaraAsal: string;
  jumlah: number;
  kategori: "Lokal" | "Asing";
}

/** Sheet: Page2_Hubungan Investor-Sektor */
export interface HubunganInvestorSektorRecord {
  sektor: string;
  lokalAsing: "Lokal" | "Asing";
  perusahaan: string;
  jumlah: number;
}

/** Sheet: Page 2_Dominasi Investor Asing */
export interface DominasiInvestorRecord {
  tahun: number;
  jumlah_pma: number;
  jumlah_pmdn: number;
}

/** Sheet: Page 2_Perkembangan Intensitas */
export interface IntensitasPencarianRecord {
  destination: string;
  year: number;
  count: number;
}

// ── Aggregated dashboard data exposed by context ──────────────────────────────
export interface DashboardData {
  // Page 1
  touristRecords: TouristRecord[];
  wisatawanInvestment: WisatawanInvestmentRecord[];
  attractiveness: AttractivenessRecord[];
  newInvestmentLaunch: NewInvestmentLaunchRecord[];
  sektorMapping: SektorMappingRecord[];
  investmentEvent: InvestmentEventRecord[];

  // Page 2
  negaraInvestor: NegaraInvestorRecord[];
  perusahaanInvestor: PerusahaanInvestorRecord[];
  hubunganInvestorSektor: HubunganInvestorSektorRecord[];
  dominasiInvestor: DominasiInvestorRecord[];
  intensitasPencarian: IntensitasPencarianRecord[];
}
