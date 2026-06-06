/**
 * excelDataLoader.ts
 *
 * Loads all 4 Excel files from the /public directory and parses them
 * into typed arrays matching the existing data structure in types.ts.
 *
 * Province → Destination mapping for data_jumlah_wisatawan.xlsx:
 * - Sumatera Utara         → Danau Toba
 * - Jawa Tengah & DI Yogyakarta → Borobudur, Yogyakarta (split)
 * - NTB                   → Mandalika
 * - NTT                   → Labuan Bajo
 * - Sulawesi Utara        → Bunaken / Likupang (split)
 * - Kepulauan Bangka Belitung → Tanjung Kelayang
 * - Papua Barat & Papua Barat Daya → Raja Ampat / Morotai (split)
 * - Sulawesi Tenggara     → Wakatobi
 * - Maluku Utara          → Morotai
 * - Bali                  → Bali
 * - Jakarta               → Jakarta (DKI)
 * - Kepulauan Riau        → (general data, not in DESTINATIONS, use small fraction)
 * - Jawa Timur            → (Bromo region – not DPP, skip)
 */

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

// Dynamic XLSX loader – works without npm install by using CDN script
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

// ─── Country coordinate lookup ────────────────────────────────────────────────
const COUNTRY_COORDS: Record<string, { lat: number; lng: number; code: string }> = {
    Singapore: { lat: 1.35, lng: 103.8, code: "SG" },
    China: { lat: 35.86, lng: 104.19, code: "CN" },
    Japan: { lat: 36.2, lng: 138.25, code: "JP" },
    Malaysia: { lat: 4.21, lng: 101.97, code: "MY" },
    Australia: { lat: -25.27, lng: 133.77, code: "AU" },
    "United States": { lat: 37.09, lng: -95.71, code: "US" },
    Netherlands: { lat: 52.13, lng: 5.29, code: "NL" },
    "South Korea": { lat: 35.9, lng: 127.77, code: "KR" },
    "United Kingdom": { lat: 55.37, lng: -3.43, code: "GB" },
    France: { lat: 46.22, lng: 2.21, code: "FR" },
    "United Arab Emirates": { lat: 23.42, lng: 53.84, code: "AE" },
    Thailand: { lat: 15.87, lng: 100.99, code: "TH" },
    India: { lat: 20.59, lng: 78.96, code: "IN" },
    Germany: { lat: 51.16, lng: 10.45, code: "DE" },
    "Hong Kong": { lat: 22.31, lng: 114.16, code: "HK" },
    Spain: { lat: 40.46, lng: -3.74, code: "ES" },
    "Switzerland": { lat: 46.82, lng: 8.23, code: "CH" },
    Canada: { lat: 56.13, lng: -106.35, code: "CA" },
};

// ─── Province → destination mapping ──────────────────────────────────────────
const PROVINCE_TO_DEST: Record<string, { id: string; fraction?: number }[]> = {
    "Sumatera Utara": [{ id: "danau-toba" }],
    "Jawa Tengah & DI Yogyakarta": [
        { id: "borobudur", fraction: 0.5 },
        { id: "yogyakarta", fraction: 0.5 },
    ],
    "NTB": [{ id: "mandala" }],
    "NTT": [{ id: "labuan-bajo" }],
    "Sulawesi Utara": [
        { id: "bunaken", fraction: 0.5 },
        { id: "likupang", fraction: 0.5 },
    ],
    "Kepulauan Bangka Belitung": [{ id: "tanjung-kelayang" }],
    "Papua Barat & Papua Barat Daya": [
        { id: "raja-ampat", fraction: 0.6 },
        { id: "morotai", fraction: 0.4 },
    ],
    "Sulawesi Tenggara": [{ id: "wakatobi" }],
    "Maluku Utara": [{ id: "morotai" }],
    "Bali": [{ id: "bali" }],
    "Jakarta": [{ id: "jakarta" }],
    // Kepulauan Riau → Tanjung Lesung not in DESTINATIONS, skip
    // Jawa Timur → Bromo not in DESTINATIONS, skip
};

// ─── Destination name → id mapping (for data_awal.xlsx) ─────────────────────
const DEST_NAME_TO_ID: Record<string, string> = {
    "LABUAN BAJO": "labuan-bajo",
    "LOMBOK": "mandala", // NTB → Mandalika
    "BANGKA BELITUNG": "tanjung-kelayang",
    "MOROTAI": "morotai",
    "LIKUPANG": "likupang",
    "WAKATOBI": "wakatobi",
    "BALI": "bali",
    "JAKARTA": "jakarta",
    "RIAU": "tanjung-kelayang", // closest match
    "BROMO - TENGGER SEMERU": "borobudur", // nearest DPP
    "RAJA AMPAT": "raja-ampat",
    "DANAU TOBA": "danau-toba",
    "BOROBUDUR-JOGJA-PRAMBANAN": "borobudur",
};

// ─── Destination name in Data_Kemenpar_UPDATED.xlsx → id ────────────────────
const KEMENPAR_DEST_TO_ID: Record<string, string> = {
    "Borobudur": "borobudur",
    "Bromo": "borobudur", // map to nearest
    "DKI Jakarta": "jakarta",
    "Danau Toba": "danau-toba",
    "Kepulauan Riau": "tanjung-kelayang",
    "Kepulauan Seribu": "jakarta",
    "Labuan Bajo": "labuan-bajo",
    "Mandalika": "mandala",
    "Morotai": "morotai",
    "Tanjung Kelayang": "tanjung-kelayang",
    "Tanjung Lesung": "tanjung-kelayang",
    "Wakatobi": "wakatobi",
    "Bali": "bali",
};

// ─── Sector name normalization ───────────────────────────────────────────────
const SECTOR_MAP: Record<string, string> = {
    "Hotel": "Accommodation",
    "Resort": "Accommodation",
    "Villa": "Accommodation",
    "Homestay": "Accommodation",
    "Hospitality": "Accommodation",
    "Airport & Accessibility": "Transportation",
    "Transportation": "Transportation",
    "Cruise Tourism": "Transportation",
    "Yacht Tourism": "Transportation",
    "Marine Tourism": "Transportation",
    "Theme Park": "Attractions",
    "Tourism Area": "Attractions",
    "Tourism Attraction": "Attractions",
    "Mixed Use Development": "Attractions",
    "Wellness Tourism": "Attractions",
    "Food & Beverage": "Restaurants",
    "Culinary": "Restaurants",
};

function normalizeSector(s: string | null): string {
    if (!s) return "Supporting Services";
    return SECTOR_MAP[s] ?? "Supporting Services";
}

// ─── Excel fetch helper ───────────────────────────────────────────────────────
async function fetchWorkbook(filename: string): Promise<any> {
    await loadXLSX();
    const XLSX = getXLSX();
    const resp = await fetch(`/${filename}`);
    if (!resp.ok) throw new Error(`Failed to fetch ${filename}: ${resp.status}`);
    const ab = await resp.arrayBuffer();
    return XLSX.read(ab, { type: "array" });
}

// ─── Tourist Arrivals from data_jumlah_wisatawan.xlsx ────────────────────────
export async function loadTouristArrivals(): Promise<TouristArrivalRecord[]> {
    const wb = await fetchWorkbook("data_jumlah_wisatawan.xlsx");
    const ws = wb.Sheets[wb.SheetNames[0]];
    const XLSX = getXLSX();
    const rows = XLSX.utils.sheet_to_json(ws, {
        header: 1,
        defval: null,
    }) as (string | number | null)[][];

    if (rows.length < 2) return [];

    // Row 0: [null, "Provinsi", 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    const yearCols = rows[0].slice(2) as number[]; // [2019, 2020, ...]
    const records: TouristArrivalRecord[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const provinsi = row[1] as string;
        if (!provinsi) continue;

        const mapping = PROVINCE_TO_DEST[provinsi];
        if (!mapping) continue;

        yearCols.forEach((year, yIdx) => {
            const rawVal = row[yIdx + 2] as number | null;
            const totalVal = rawVal ? Math.round(rawVal * 1_000_000) : 0; // stored in millions

            mapping.forEach(({ id, fraction = 1 }) => {
                records.push({
                    destinationId: id,
                    year: Number(year),
                    arrivals: Math.round(totalVal * fraction),
                });
            });
        });
    }

    // Merge duplicate destinationId+year (from split provinces)
    const merged = new Map<string, TouristArrivalRecord>();
    records.forEach((r) => {
        const key = `${r.destinationId}-${r.year}`;
        const existing = merged.get(key);
        merged.set(key, {
            destinationId: r.destinationId,
            year: r.year,
            arrivals: (existing?.arrivals ?? 0) + r.arrivals,
        });
    });

    return Array.from(merged.values());
}

// ─── Investment data from data_awal.xlsx ─────────────────────────────────────
interface RawAwalRow {
    Destination?: string;
    Year?: number | string;
    Business_Type?: string;
    Secondary_Sector?: string;
    Event_Type?: string;
    Investment_Value_Billion_IDR?: number | string | null;
    Confidence?: number | string;
}

export async function loadDataAwal(): Promise<{
    initialInvestment: InitialInvestmentRecord[];
    attractiveness: AttractivenessRecord[];
}> {
    const wb = await fetchWorkbook("data_awal.xlsx");

    const investMap = new Map<string, { value: number; count: number }>();
    const attrMap = new Map<
        string,
        { totalConf: number; count: number; newsFreq: number }
    >();

    for (const sname of wb.SheetNames) {
        const destId = DEST_NAME_TO_ID[sname.trim().toUpperCase()];
        if (!destId) continue;

        const ws = wb.Sheets[sname];
        const rows: RawAwalRow[] = getXLSX().utils.sheet_to_json(ws, { defval: null });

        rows.forEach((row) => {
            const yearRaw = row.Year;
            if (!yearRaw) return;
            const year = Number(yearRaw);
            if (isNaN(year) || year < 2019 || year > 2025) return;

            const key = `${destId}-${year}`;
            const rowAny = row as any;
            const valRaw =
                row.Investment_Value_Billion_IDR ?? rowAny["Investment Value (Billion IDR)"];
            const val = parseFloat(String(valRaw ?? "0")) || 0;
            const conf = parseFloat(String(row.Confidence ?? "50")) || 50;

            // Investment aggregation
            const inv = investMap.get(key) ?? { value: 0, count: 0 };
            inv.value += val;
            inv.count += 1;
            investMap.set(key, inv);

            // Attractiveness aggregation
            const atr = attrMap.get(key) ?? { totalConf: 0, count: 0, newsFreq: 0 };
            atr.totalConf += conf;
            atr.count += 1;
            atr.newsFreq += 1;
            attrMap.set(key, atr);
        });
    }

    const initialInvestment: InitialInvestmentRecord[] = [];
    const attractiveness: AttractivenessRecord[] = [];

    investMap.forEach((v, key) => {
        const [destId, yearStr] = key.split("-");
        const year = Number(yearStr);
        initialInvestment.push({
            destinationId: destId,
            year,
            investmentValue: Math.round(v.value * 10) / 10, // keep 1 decimal
            launchCount: v.count,
        });
    });

    attrMap.forEach((v, key) => {
        const [destId, yearStr] = key.split("-");
        const year = Number(yearStr);
        const avgConf = v.count > 0 ? v.totalConf / v.count : 50;
        attractiveness.push({
            destinationId: destId,
            year,
            score: Math.round(avgConf),
            newsFrequency: v.newsFreq,
            newInvestments: Math.round(v.newsFreq * 0.4),
            searchIndex: Math.round(avgConf * 0.8),
        });
    });

    return { initialInvestment, attractiveness };
}

// ─── Investor & sector data from data_investasi.xlsx ─────────────────────────
interface RawInvestRow {
    investor?: string;
    destination?: string;
    query_year?: number | string;
    news_year?: number | string;
    sector?: string;
    event_type?: string;
}

export async function loadInvestorData(): Promise<{
    investorData: InvestorRecord[];
    sectorInvestment: SectorInvestmentRecord[];
    investmentEvent: InvestmentEventRecord[];
    investmentOpportunity: InvestmentOpportunityRecord[];
    countryInvestment: CountryInvestmentRecord[];
}> {
    const wb = await fetchWorkbook("data_investasi.xlsx");

    const investorAgg = new Map<
        string,
        {
            name: string;
            category: "Domestic" | "Foreign";
            country?: string;
            year: number;
            sectorCounts: Record<string, number>;
            eventCount: number;
        }
    >();

    const sectorAgg = new Map<string, { amount: number; frequency: number }>();
    const eventAgg = new Map<string, { [et: string]: number }>();
    const pmdn = new Map<number, number>(); // year → count
    const pma = new Map<number, number>(); // year → count
    const countryAgg = new Map<
        string,
        { totalInvestment: number; projectCount: number }
    >();

    // Map destination string in data_investasi to DESTINATIONS id
    const destToId = (raw: string | undefined): string => {
        if (!raw) return "bali";
        const r = raw.trim();
        if (r === "Bali") return "bali";
        if (r === "Jakarta" || r === "DKI Jakarta") return "jakarta";
        if (r === "Labuan Bajo") return "labuan-bajo";
        if (r === "Mandalika" || r === "Lombok") return "mandala";
        if (r === "Borobudur" || r === "Jogja" || r.includes("Yogya"))
            return "borobudur";
        if (r === "Danau Toba" || r === "Toba") return "danau-toba";
        if (r.includes("Wakatobi")) return "wakatobi";
        if (r.includes("Morotai")) return "morotai";
        if (r.includes("Likupang")) return "likupang";
        if (r.includes("Raja Ampat")) return "raja-ampat";
        if (r.includes("Bunaken")) return "bunaken";
        if (r.includes("Bangka") || r.includes("Kelayang")) return "tanjung-kelayang";
        return "bali";
    };

    const processSheet = (
        rows: RawInvestRow[],
        category: "Domestic" | "Foreign"
    ) => {
        rows.forEach((row) => {
            const yearRaw = row.query_year ?? row.news_year;
            const year = Number(yearRaw);
            if (isNaN(year) || year < 2019 || year > 2025) return;

            const investor = row.investor ?? "Unknown";
            const destId = destToId(row.destination);
            const sectorRaw = normalizeSector(row.sector ?? null);
            const event = row.event_type ?? "New Investment";

            // Investor aggregation
            const invKey = `${investor}-${year}`;
            const existing = investorAgg.get(invKey);
            if (existing) {
                existing.eventCount += 1;
                existing.sectorCounts[sectorRaw] =
                    (existing.sectorCounts[sectorRaw] ?? 0) + 1;
            } else {
                investorAgg.set(invKey, {
                    name: investor,
                    category,
                    country:
                        category === "Foreign"
                            ? extractCountry(investor, rows)
                            : undefined,
                    year,
                    sectorCounts: { [sectorRaw]: 1 },
                    eventCount: 1,
                });
            }

            // Sector aggregation per destination
            const secKey = `${destId}-${sectorRaw}`;
            const sec = sectorAgg.get(secKey) ?? { amount: 0, frequency: 0 };
            sec.frequency += 1;
            sec.amount += 20; // ~20 B Rp per event as proxy
            sectorAgg.set(secKey, sec);

            // Event aggregation per destination per year
            const evtKey = `${destId}-${year}`;
            const evt = eventAgg.get(evtKey) ?? {};
            evt[event] = (evt[event] ?? 0) + 1;
            eventAgg.set(evtKey, evt);

            // PMDN / PMA split
            if (category === "Domestic") {
                pmdn.set(year, (pmdn.get(year) ?? 0) + 1);
            } else {
                pma.set(year, (pma.get(year) ?? 0) + 1);
            }
        });
    };

    // Country extraction from investor name for foreign
    function extractCountry(
        investorName: string,
        allRows: RawInvestRow[]
    ): string {
        // Simple heuristic based on known company names
        const name = investorName.toLowerCase();
        if (
            name.includes("singapore") ||
            name.includes("capitaland") ||
            name.includes("singha")
        )
            return "Singapore";
        if (
            name.includes("japan") ||
            name.includes("mitsubishi") ||
            name.includes("mitsui")
        )
            return "Japan";
        if (
            name.includes("china") ||
            name.includes("chinese") ||
            name.includes("alibaba")
        )
            return "China";
        if (
            name.includes("malaysia") ||
            name.includes("genting") ||
            name.includes("petronas")
        )
            return "Malaysia";
        if (
            name.includes("australia") ||
            name.includes("aussie") ||
            name.includes("qantas")
        )
            return "Australia";
        if (
            name.includes("america") ||
            name.includes("marriott") ||
            name.includes("hilton") ||
            name.includes("hyatt")
        )
            return "United States";
        if (name.includes("france") || name.includes("accor"))
            return "France";
        if (
            name.includes("four seasons") ||
            name.includes("hong kong") ||
            name.includes("shangri")
        )
            return "Hong Kong";
        if (name.includes("minor") || name.includes("thailand") || name.includes("thai"))
            return "Thailand";
        if (name.includes("emaar") || name.includes("emirates") || name.includes("uae"))
            return "United Arab Emirates";
        if (name.includes("ihg") || name.includes("intercontinental") || name.includes("uk") || name.includes("british"))
            return "United Kingdom";
        if (name.includes("deutsche") || name.includes("germany") || name.includes("german"))
            return "Germany";
        if (name.includes("korea") || name.includes("lotte") || name.includes("samsung"))
            return "South Korea";
        // Default
        return "Singapore";
    }

    // Process lokal sheet
    if (wb.SheetNames.includes("lokal") || wb.SheetNames.includes("Lokal")) {
        const sname =
            wb.SheetNames.find(
                (s: string) => s.toLowerCase() === "lokal"
            ) ?? wb.SheetNames[0];
        const ws = wb.Sheets[sname];
        const rows: RawInvestRow[] = getXLSX().utils.sheet_to_json(ws, { defval: null });
        processSheet(rows, "Domestic");
    }

    // Process Asing sheet
    if (wb.SheetNames.includes("Asing") || wb.SheetNames.includes("asing")) {
        const sname =
            wb.SheetNames.find(
                (s: string) => s.toLowerCase() === "asing"
            ) ?? wb.SheetNames[1];
        const ws = wb.Sheets[sname];
        const rows: RawInvestRow[] = getXLSX().utils.sheet_to_json(ws, { defval: null });
        processSheet(rows, "Foreign");

        // Build country investment from foreign investors
        rows.forEach((row) => {
            const yearRaw = row.query_year ?? row.news_year;
            const year = Number(yearRaw);
            if (isNaN(year) || year < 2019 || year > 2025) return;

            const investorName = row.investor ?? "";
            const country = extractCountry(investorName, rows);
            const cKey = `${country}-${year}`;
            const existing = countryAgg.get(cKey) ?? {
                totalInvestment: 0,
                projectCount: 0,
            };
            existing.projectCount += 1;
            existing.totalInvestment += 80; // ~80 B Rp per project as proxy
            countryAgg.set(cKey, existing);
        });
    }

    // Build InvestorRecord[]
    const investorData: InvestorRecord[] = Array.from(
        investorAgg.entries()
    ).map(([key, inv], i) => ({
        id: `${inv.category.slice(0, 3).toLowerCase()}-${i}`,
        name:
            inv.name.length > 40 ? inv.name.slice(0, 38) + "…" : inv.name,
        category: inv.category,
        country: inv.country,
        year: inv.year,
        investmentCount: inv.eventCount,
        totalValue: inv.eventCount * (inv.category === "Foreign" ? 280 : 120),
        sectorInvestments: Object.entries(inv.sectorCounts).reduce(
            (acc, [s, c]) => {
                acc[s as keyof typeof acc] = c * 20;
                return acc;
            },
            {} as Record<string, number>
        ),
    }));

    // Build SectorInvestmentRecord[]
    const sectorInvestment: SectorInvestmentRecord[] = Array.from(
        sectorAgg.entries()
    ).map(([key, v]) => {
        const [destId, ...sectorParts] = key.split("-");
        const sector = sectorParts.join("-") as SectorInvestmentRecord["sector"];
        return { destinationId: destId, sector, amount: v.amount, frequency: v.frequency };
    });

    // Build InvestmentEventRecord[]
    const EVENT_MAP: Record<string, string> = {
        "New Investment": "New Investment",
        Partnership: "Partnership",
        Acquisition: "Investment Opportunity",
        Expansion: "Expansion",
    };

    const investmentEvent: InvestmentEventRecord[] = [];
    eventAgg.forEach((evts, key) => {
        const parts = key.split("-");
        const year = Number(parts[parts.length - 1]);
        const destId = parts.slice(0, -1).join("-");
        Object.entries(evts).forEach(([et, count]) => {
            const mappedType =
                (EVENT_MAP[et] as InvestmentEventRecord["eventType"]) ??
                "Investment Opportunity";
            investmentEvent.push({
                destinationId: destId,
                year,
                eventType: mappedType,
                count,
            });
        });
    });

    // Build InvestmentOpportunityRecord[]
    const allYears = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const investmentOpportunity: InvestmentOpportunityRecord[] = allYears.map(
        (year) => ({
            year,
            pmdn: pmdn.get(year) ?? 0,
            pma: pma.get(year) ?? 0,
        })
    );

    // Build CountryInvestmentRecord[]
    const countryInvestment: CountryInvestmentRecord[] = Array.from(
        countryAgg.entries()
    ).map(([key, v]) => {
        const dashIdx = key.lastIndexOf("-");
        const country = key.slice(0, dashIdx);
        const year = Number(key.slice(dashIdx + 1));
        const coords = COUNTRY_COORDS[country] ?? { lat: 0, lng: 0, code: "XX" };
        return {
            country,
            countryCode: coords.code,
            year,
            totalInvestment: v.totalInvestment,
            projectCount: v.projectCount,
            lat: coords.lat,
            lng: coords.lng,
        };
    });

    return {
        investorData,
        sectorInvestment,
        investmentEvent,
        investmentOpportunity,
        countryInvestment,
    };
}

// ─── Search intensity + attractiveness from Data_Kemenpar_UPDATED.xlsx ────────
interface RawKemenparRow {
    date?: string;
    year?: number | string;
    month?: string;
    destination?: string;
    sektor_aset?: string;
    kategori_intent?: string;
    investor_type?: string;
    keyword?: string;
    interest_score?: number | string;
}

export async function loadKemenparData(): Promise<{
    searchIntensity: SearchIntensityRecord[];
    attractivenessFromKemenpar: AttractivenessRecord[];
}> {
    const wb = await fetchWorkbook("Data_Kemenpar_UPDATED.xlsx");
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: RawKemenparRow[] = getXLSX().utils.sheet_to_json(ws, { defval: null });

    const byDestYear = new Map<
        string,
        { scores: number[]; count: number }
    >();

    rows.forEach((row) => {
        const yearRaw = row.year;
        const year = Number(yearRaw);
        if (isNaN(year) || year < 2019 || year > 2025) return;

        const destRaw = row.destination;
        if (!destRaw) return;

        const destId = KEMENPAR_DEST_TO_ID[destRaw.trim()];
        if (!destId) return;

        const score = parseFloat(String(row.interest_score ?? "0")) || 0;
        const key = `${destId}-${year}`;
        const existing = byDestYear.get(key) ?? { scores: [], count: 0 };
        existing.scores.push(score);
        existing.count += 1;
        byDestYear.set(key, existing);
    });

    const searchIntensity: SearchIntensityRecord[] = [];
    const attractivenessFromKemenpar: AttractivenessRecord[] = [];

    byDestYear.forEach((v, key) => {
        const [destId, yearStr] = key.split("-");
        const year = Number(yearStr);
        const avgScore =
            v.scores.length > 0
                ? v.scores.reduce((a, b) => a + b, 0) / v.scores.length
                : 0;

        searchIntensity.push({
            destinationId: destId,
            year,
            intensity: Math.round(avgScore),
        });

        attractivenessFromKemenpar.push({
            destinationId: destId,
            year,
            score: Math.round(avgScore),
            newsFrequency: v.count,
            newInvestments: Math.round(v.count * 0.3),
            searchIndex: Math.round(avgScore * 0.9),
        });
    });

    return { searchIntensity, attractivenessFromKemenpar };
}
