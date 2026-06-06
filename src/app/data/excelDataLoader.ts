/**
 * excelDataLoader.ts
 *
 * Loads all data from a single Data_Dashboard.xlsx file.
 * Each sheet maps directly to one chart with no manual calculations.
 */

import type {
    TouristRecord,
    WisatawanInvestmentRecord,
    AttractivenessRecord,
    NewInvestmentLaunchRecord,
    SektorMappingRecord,
    InvestmentEventRecord,
    NegaraInvestorRecord,
    PerusahaanInvestorRecord,
    HubunganInvestorSektorRecord,
    DominasiInvestorRecord,
    IntensitasPencarianRecord,
    DashboardData,
} from "./types";

// ─── SheetJS Dynamic Loader ────────────────────────────────────────────────────
let xlsxLoaded = false;

async function loadXLSX(): Promise<void> {
    if (typeof (window as any).XLSX !== "undefined") {
        xlsxLoaded = true;
        return;
    }
    if (xlsxLoaded) return;
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
        script.onload = () => { xlsxLoaded = true; resolve(); };
        script.onerror = () => reject(new Error("Failed to load SheetJS from CDN"));
        document.head.appendChild(script);
    });
}

function getXLSX(): any {
    return (window as any).XLSX;
}

async function fetchWorkbook(filename: string): Promise<any> {
    await loadXLSX();
    const XLSX = getXLSX();
    const resp = await fetch(`/${filename}`);
    if (!resp.ok) throw new Error(`Failed to fetch ${filename}: ${resp.status}`);
    const ab = await resp.arrayBuffer();
    return XLSX.read(ab, { type: "array" });
}

// ─── Helper: parse sheet rows ──────────────────────────────────────────────────
function getRows(wb: any, sheetName: string): any[] {
    const XLSX = getXLSX();
    // Find sheet case-insensitively, trimming spaces and normalizing internal spaces
    const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
    const target = normalize(sheetName);
    const actualName = wb.SheetNames.find(
        (s: string) => normalize(s) === target
    );

    if (!actualName) {
        console.warn(`Sheet "${sheetName}" not found. Available:`, wb.SheetNames);
        return [];
    }
    const ws = wb.Sheets[actualName];
    return XLSX.utils.sheet_to_json(ws, { defval: null });
}

// ─── Helper: parse pivot sheet (negara investor) ──────────────────────────────
function getRowsRaw(wb: any, sheetName: string): (string | number | null)[][] {
    const XLSX = getXLSX();
    const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "");
    const target = normalize(sheetName);
    const actualName = wb.SheetNames.find(
        (s: string) => normalize(s) === target
    );
    if (!actualName) return [];
    const ws = wb.Sheets[actualName];
    return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
}

// ─── Main Loader Function ──────────────────────────────────────────────────────
export async function loadDashboardData(): Promise<DashboardData> {
    const wb = await fetchWorkbook("Data_Dashboard.xlsx");

    // ── Page 1 ─────────────────────────────────────────────────────────────────

    // Sheet 1: Tren Jumlah Wisatawan
    const touristRecords: TouristRecord[] = getRows(wb, "Page1_jumlahwisatawan").map((r) => ({
        provinsi: String(r["Provinsi"] ?? r["provinsi"] ?? ""),
        tahun: Number(r["Tahun"] ?? r["tahun"] ?? 0),
        jumlah_wisatawan: Number(r["Jumlah_Wisatawan"] ?? r["jumlah_wisatawan"] ?? 0),
    })).filter((r) => r.provinsi && r.tahun > 0);

    // Sheet 2: Wisatawan vs Investasi
    const wisatawanInvestment: WisatawanInvestmentRecord[] = getRows(wb, "Page1wisatawan_investment").map((r) => ({
        provinsi: String(r["Provinsi"] ?? r["provinsi"] ?? ""),
        tahun: Number(r["Tahun"] ?? r["tahun"] ?? 0),
        jumlah_wisatawan: Number(r["Jumlah_Wisatawan"] ?? r["jumlah_wisatawan"] ?? 0),
        investment: Number(r["Investment"] ?? r["investment"] ?? 0),
    })).filter((r) => r.provinsi && r.tahun > 0);

    // Sheet 3: Investment Attractiveness
    const attractiveness: AttractivenessRecord[] = getRows(wb, "Page1_investment attractiveness").map((r) => ({
        provinsi: String(r["Provinsi"] ?? r["provinsi"] ?? ""),
        tahun: Number(r["Tahun"] ?? r["tahun"] ?? 0),
        investment: Number(r["Investment"] ?? r["investment"] ?? 0),
    })).filter((r) => r.provinsi && r.tahun > 0);

    // Sheet 4: New Investment Launch
    const newInvestmentLaunch: NewInvestmentLaunchRecord[] = getRows(wb, "Page1_new investment launch").map((r) => ({
        destinasi: String(r["Destinasi"] ?? r["destinasi"] ?? ""),
        tahun: Number(r["Tahun"] ?? r["tahun"] ?? 0),
        frekuensi_peluncuran: Number(r["Frekuensi Peluncuran"] ?? r["frekuensi_peluncuran"] ?? 0),
    })).filter((r) => r.destinasi && r.tahun > 0);

    // Sheet 5: Sektor Mapping
    const sektorMapping: SektorMappingRecord[] = getRows(wb, "Page 1_Sektor Mapping").map((r) => ({
        destination: String(r["Destination"] ?? r["destination"] ?? ""),
        sektor: String(r["Sektor"] ?? r["sektor"] ?? ""),
        jumlah_berita_investasi: Number(r["Jumlah_Berita_Investasi"] ?? r["jumlah_berita_investasi"] ?? 0),
    })).filter((r) => r.destination && r.sektor);

    // Sheet 6: Event/Aktivitas Investasi
    const investmentEvent: InvestmentEventRecord[] = getRows(wb, "Page 1_event").map((r) => ({
        destination: String(r["Destination"] ?? r["destination"] ?? ""),
        aktivitas_investasi: String(r["Aktivitas_Investasi"] ?? r["aktivitas_investasi"] ?? ""),
        jumlah_berita_investasi: Number(r["Jumlah_Berita_Investasi"] ?? r["jumlah_berita_investasi"] ?? 0),
    })).filter((r) => r.destination && r.aktivitas_investasi);

    // ── Page 2 ─────────────────────────────────────────────────────────────────

    // Sheet 7: Negara Investor (pivot format)
    const negaraInvestor: NegaraInvestorRecord[] = [];
    const wsNegara = wb.Sheets["Page 2_Negara Investor Terbesar"];
    const negaraRaw = XLSX.utils.sheet_to_json(wsNegara, { header: 1, defval: null }) as (string | number | null)[][];

    if (negaraRaw.length >= 2) {
        // Find the header row (where the first cell is "negara" or "Negara")
        let headerRowIdx = -1;
        for (let i = 0; i < negaraRaw.length; i++) {
            const firstCell = String(negaraRaw[i][0] ?? "").toLowerCase().trim();
            if (firstCell === "negara") {
                headerRowIdx = i;
                break;
            }
        }

        if (headerRowIdx !== -1) {
            const headers = negaraRaw[headerRowIdx];
            const yearCols: { idx: number; year: string }[] = [];
            let grandTotalIdx = -1;

            headers.forEach((h, i) => {
                if (i === 0) return;
                const s = String(h ?? "").trim();
                if (/^20\d{2}$/.test(s)) {
                    yearCols.push({ idx: i, year: s });
                } else if (s.toLowerCase().includes("grand") || s.toLowerCase().includes("total")) {
                    grandTotalIdx = i;
                }
            });

            for (let i = headerRowIdx + 1; i < negaraRaw.length; i++) {
                const row = negaraRaw[i];
                const negara = String(row[0] ?? "").trim();
                // Stop at empty rows or grand total rows
                if (!negara || negara.toLowerCase() === "grand total") continue;

                const byYear: Record<string, number> = {};
                yearCols.forEach(({ idx, year }) => {
                    byYear[year] = Number(row[idx] ?? 0);
                });
                const grandTotal = grandTotalIdx >= 0 ? Number(row[grandTotalIdx] ?? 0) : 0;
                negaraInvestor.push({ negara, byYear, grandTotal });
            }
        }
    }

    // Sheet 8: Perusahaan Investor (Stacked Table layout: [ASING] ... [Local])
    const perusahaanInvestor: PerusahaanInvestorRecord[] = [];
    const wsPerusahaan = wb.Sheets["Page 2_PerusahaanTopInvestLokal"];
    const perusahaanRaw = XLSX.utils.sheet_to_json(wsPerusahaan, { header: 1, defval: null }) as (string | number | null)[][];

    if (perusahaanRaw.length > 0) {
        let currentCategory: "Lokal" | "Asing" | null = null;
        let isHeaderRow = false;

        perusahaanRaw.forEach((row) => {
            const firstCell = String(row[0] ?? "").trim();
            const lower = firstCell.toLowerCase();

            // Category switchers
            if (lower === "asing" || lower === "[asing]") {
                currentCategory = "Asing";
                isHeaderRow = true;
                return;
            }
            if (lower === "local" || lower === "[local]" || lower === "lokal" || lower === "[lokal]") {
                currentCategory = "Lokal";
                isHeaderRow = true;
                return;
            }

            // Skip header row or empty rows
            if (isHeaderRow || !firstCell || lower === "perusahaan") {
                isHeaderRow = false;
                return;
            }

            if (currentCategory && firstCell) {
                perusahaanInvestor.push({
                    perusahaan: firstCell,
                    negaraAsal: String(row[1] ?? (currentCategory === "Lokal" ? "Indonesia" : "")).trim(),
                    jumlah: Number(row[2] ?? 0),
                    kategori: currentCategory,
                });
            }
        });
    }

    // Sheet 9: Hubungan Investor - Sektor
    const hubunganInvestorSektor: HubunganInvestorSektorRecord[] = getRows(wb, "Page2_Hubungan Investor-Sektor").map((r) => ({
        sektor: String(r["Sektor"] ?? r["sektor"] ?? ""),
        lokalAsing: String(r["Lokal_Asing"] ?? r["lokal_asing"] ?? "").toLowerCase().includes("lokal") ? "Lokal" : "Asing" as "Lokal" | "Asing",
        perusahaan: String(r["Perusahaan"] ?? r["perusahaan"] ?? ""),
        jumlah: Number(r["Jumlah"] ?? r["jumlah"] ?? 0),
    })).filter((r) => r.sektor && r.perusahaan);

    // Sheet 10: Dominasi PMA vs PMDN
    const dominasiInvestor: DominasiInvestorRecord[] = getRows(wb, "Page 2_Dominasi Investor Asing ").map((r) => ({
        tahun: Number(r["Tahun"] ?? r["tahun"] ?? 0),
        jumlah_pma: Number(r["Jumlah PMA"] ?? r["jumlah_pma"] ?? 0),
        jumlah_pmdn: Number(r["Jumlah PMDN"] ?? r["jumlah_pmdn"] ?? 0),
    })).filter((r) => r.tahun > 0).sort((a, b) => a.tahun - b.tahun);

    // Sheet 11: Perkembangan Intensitas Pencarian
    const intensitasPencarian: IntensitasPencarianRecord[] = getRows(wb, "Page 2_Perkembangan Intensitas ").map((r) => ({
        destination: String(r["destination"] ?? r["Destination"] ?? ""),
        year: Number(r["year"] ?? r["Year"] ?? 0),
        count: Number(r["count"] ?? r["Count"] ?? 0),
    })).filter((r) => r.destination && r.year > 0);

    return {
        touristRecords,
        wisatawanInvestment,
        attractiveness,
        newInvestmentLaunch,
        sektorMapping,
        investmentEvent,
        negaraInvestor,
        perusahaanInvestor,
        hubunganInvestorSektor,
        dominasiInvestor,
        intensitasPencarian,
    };
}
