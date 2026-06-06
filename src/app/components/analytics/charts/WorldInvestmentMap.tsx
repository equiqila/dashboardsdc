import { memo, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { X, Building2, Layers } from "lucide-react";
import type {
  NegaraInvestorRecord,
  PerusahaanInvestorRecord,
  HubunganInvestorSektorRecord,
} from "../../../data/types";
import { ChartEmptyState } from "../ChartEmptyState";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_ALIASES: Record<string, string> = {
  "United States of America": "Amerika Serikat",
  "United States": "Amerika Serikat",
  "U.A.E.": "Uni Emirat Arab",
  "United Arab Emirates": "Uni Emirat Arab",
  "China": "Tiongkok",
  "Hongkong": "Hong Kong",
  "United Kingdom": "Inggris",
  "South Korea": "Korea Selatan",
  "Singapore": "Singapura",
  "Japan": "Jepang",
  "Malaysia": "Malaysia",
  "Australia": "Australia",
  "Netherlands": "Belanda",
  "Germany": "Jerman",
  "Canada": "Kanada",
  "Switzerland": "Swiss",
  "France": "Prancis",
  "India": "India",
};

interface ComputedMapPoint {
  country: string;
  totalInvestment: number;
  projectCount: number;
  intensity: number;
}

interface ComputedDetail {
  country: string;
  year: string;
  totalInvestment: number;
  totalProjects: number;
  sectors: { sector: string; projectCount: number; investmentValue: number }[];
  companies: { company: string; sector: string; projectCount: number; investmentValue: number }[];
}

interface Props {
  negaraData: NegaraInvestorRecord[];
  perusahaanData: PerusahaanInvestorRecord[];
  hubunganSektorData: HubunganInvestorSektorRecord[];
  year: string;
}

// Green + Yellow Palette from user upload
function getFillColor(intensity: number, hasData: boolean, selected: boolean): string {
  if (selected) return "#000000"; // black/very dark when selected
  if (!hasData) return "#f1f5f9";

  // Levels: #1C2414, #394E2C, #647A4C, #77905B, #F0D003, #FAE526
  if (intensity >= 0.8) return "#1C2414";
  if (intensity >= 0.6) return "#394E2C";
  if (intensity >= 0.4) return "#647A4C";
  if (intensity >= 0.2) return "#77905B";
  if (intensity > 0) return "#F0D003";
  return "#FAE526"; // baseline/sangat rendah
}

function CountryDetailPanel({
  detail,
  onClose,
}: {
  detail: ComputedDetail;
  onClose: () => void;
}) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-muted/30 overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 bg-white border-b border-border">
        <div>
          <h4 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            {detail.country}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {detail.totalProjects} aktivitas · Skala Investasi: {detail.totalInvestment.toLocaleString("id-ID")} · {detail.year === "Semua Tahun" ? "Semua Tahun" : detail.year}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Sectors */}
        <div className="p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-primary" />
            <h5 className="text-sm font-semibold text-foreground">Aktivitas per Sektor</h5>
          </div>
          <div className="space-y-2">
            {detail.sectors.map((s) => (
              <div key={s.sector} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.sector}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{s.projectCount} aktivitas</span>
                </div>
              </div>
            ))}
            {detail.sectors.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Tidak ada rincian sektor.</p>
            )}
          </div>
        </div>

        {/* Companies */}
        <div className="p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h5 className="text-sm font-semibold text-foreground">Perusahaan Top</h5>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {detail.companies.map((c) => (
              <div
                key={c.company}
                className="flex items-start justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-medium text-foreground truncate">{c.company}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-foreground">{c.projectCount} aktivitas</p>
                </div>
              </div>
            ))}
            {detail.companies.length === 0 && (
              <p className="text-xs text-muted-foreground italic">Data perusahaan belum tersedia khusus negara ini.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldInvestmentMapComponent({ negaraData, perusahaanData, hubunganSektorData, year }: Props) {
  const [hovered, setHovered] = useState<ComputedMapPoint | null>(null);
  const [selected, setSelected] = useState<ComputedMapPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isAllYears = year === "Semua" || year === "Semua Tahun";

  const mapData = useMemo(() => {
    let maxInv = 0;

    const computed: ComputedMapPoint[] = negaraData.map((n) => {
      // Use grandTotal for "Semua", otherwise use the specific year's value
      const val = isAllYears
        ? (n.grandTotal || Object.values(n.byYear).reduce((s, v) => s + v, 0))
        : (n.byYear[year] ?? 0);

      if (val > maxInv) maxInv = val;

      // Sum project counts mapped to this country
      const companies = perusahaanData.filter((p) =>
        p.negaraAsal.toLowerCase() === n.negara.toLowerCase() ||
        NAME_ALIASES[p.negaraAsal]?.toLowerCase() === n.negara.toLowerCase()
      );
      const projectCount = companies.reduce((sum, c) => sum + (c.jumlah || 0), 0) || val;

      return {
        country: n.negara,
        totalInvestment: val,
        projectCount,
        intensity: 0,
      };
    }).filter((x) => x.totalInvestment > 0);

    return computed.map(c => ({
      ...c,
      intensity: maxInv > 0 ? c.totalInvestment / maxInv : 0
    }));
  }, [negaraData, perusahaanData, year, isAllYears]);

  const detail = useMemo(() => {
    if (!selected) return null;

    const companiesFromCountry = perusahaanData.filter(p =>
      p.negaraAsal.toLowerCase() === selected.country.toLowerCase() ||
      NAME_ALIASES[p.negaraAsal]?.toLowerCase() === selected.country.toLowerCase()
    );
    const selectedCompanyNames = companiesFromCountry.map(c => c.perusahaan);

    // Calculate sector breakdown based on these companies
    const sectorMap = new Map<string, number>();
    const normalizedCompanyNames = selectedCompanyNames.map(n => n.toLowerCase().replace(/\s+/g, '').replace(/s$/, ''));

    hubunganSektorData.forEach((h) => {
      const hn = h.perusahaan.toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
      if (normalizedCompanyNames.includes(hn)) {
        sectorMap.set(h.sektor, (sectorMap.get(h.sektor) ?? 0) + h.jumlah);
      }
    });

    const sectors = Array.from(sectorMap.entries()).map(([sector, count]) => ({
      sector,
      projectCount: count,
      investmentValue: 0,
    })).sort((a, b) => b.projectCount - a.projectCount);

    const companies = companiesFromCountry.map(c => ({
      company: c.perusahaan,
      sector: "Mixed",
      projectCount: c.jumlah,
      investmentValue: 0
    })).sort((a, b) => b.projectCount - a.projectCount);

    return {
      country: selected.country,
      year,
      totalInvestment: selected.totalInvestment,
      totalProjects: selected.projectCount,
      sectors,
      companies,
    };
  }, [selected, perusahaanData, hubunganSektorData, year]);

  if (!mapData.length) {
    return <ChartEmptyState message="Tidak ada data negara untuk tahun terpilih." height={400} />;
  }

  const resolveCountry = (geoName: string): ComputedMapPoint | undefined => {
    const searchName = NAME_ALIASES[geoName] ?? geoName;
    return mapData.find((d) =>
      d.country.toLowerCase() === searchName.toLowerCase() ||
      d.country.toLowerCase() === geoName.toLowerCase()
    );
  };

  const handleClick = (countryData: ComputedMapPoint) => {
    setSelected((prev) => prev?.country === countryData.country ? null : countryData);
    setHovered(null);
  };

  return (
    <div className="relative flex flex-col min-h-0">
      <p className="text-xs text-muted-foreground mb-4 shrink-0">
        Klik wilayah negara untuk melihat rincian aktivitas perusahaan dan fokus sektornya.
      </p>

      <div className="w-full h-[480px] relative">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 235 }}
          style={{ width: "100%", height: "100%" }}
          className="w-full h-full"
        >
          <ZoomableGroup center={[12, 0]} zoom={1} minZoom={1} maxZoom={4}>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const name = geo.properties.name as string;
                  const countryData = resolveCountry(name);
                  const intensity = countryData?.intensity ?? 0;
                  const isSelected = !!selected && !!countryData && selected.country === countryData.country;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getFillColor(intensity, !!countryData, isSelected)}
                      stroke="#fff"
                      strokeWidth={isSelected ? 1.2 : 0.4}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: countryData ? (isSelected ? "#000" : "#394E2C") : "#d1d5db",
                          outline: "none",
                          cursor: countryData ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e: React.MouseEvent) => {
                        if (!countryData) return;
                        setHovered(countryData);
                        const rect = (e.target as SVGElement).getBoundingClientRect();
                        const parent = (e.target as SVGElement)
                          .closest(".relative")
                          ?.getBoundingClientRect();
                        if (parent) {
                          setTooltipPos({
                            x: rect.left - parent.left + rect.width / 2,
                            y: rect.top - parent.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        if (countryData) handleClick(countryData);
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Marker for small regions like Singapore and Hong Kong */}
            {mapData.map((d) => {
              if (d.country === "Singapura" || d.country === "Hong Kong") {
                const coords: [number, number] = d.country === "Singapura" ? [103.8198, 1.3521] : [114.1694, 22.3193];
                return (
                  <Marker key={d.country} coordinates={coords}>
                    <circle
                      cx={0}
                      cy={0}
                      r={3}
                      className="cursor-pointer"
                      fill={getFillColor(d.intensity, true, selected?.country === d.country)}
                      stroke="#fff"
                      strokeWidth={1}
                      onClick={() => handleClick(d)}
                      onMouseEnter={(e) => {
                        setHovered(d);
                        const rect = (e.target as SVGCircleElement).getBoundingClientRect();
                        const parent = (e.target as SVGCircleElement).closest(".relative")?.getBoundingClientRect();
                        if (parent) {
                          setTooltipPos({
                            x: rect.left - parent.left + rect.width / 2,
                            y: rect.top - parent.top,
                          });
                        }
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                  </Marker>
                );
              }
              return null;
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {hovered && !selected && (
        <div
          className="absolute z-10 bg-white border border-border rounded-lg p-3 shadow-lg text-sm pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
        >
          <p className="font-semibold text-foreground mb-1">{hovered.country}</p>
          <p className="text-muted-foreground flex items-center justify-between gap-4">
            Skala Aktivitas: <span className="font-medium text-foreground">{hovered.totalInvestment.toLocaleString("id-ID")}</span>
          </p>
          <div className="h-px bg-border my-2" />
          <p className="text-xs text-primary font-medium">Klik untuk rincian perusahaan</p>
        </div>
      )}

      {/* Color gradient legend */}
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
        <span>Intensitas Investasi:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#1C2414" }} />
          <span>Sangat Tinggi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#394E2C" }} />
          <span>Tinggi</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#647A4C" }} />
          <span>Menengah</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#77905B" }} />
          <span>Rendah</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FAE526" }} />
          <span>Sangat Rendah</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#f1f5f9]" />
          <span>Tidak Ada</span>
        </div>
      </div>

      {detail && <div className="mt-4"><CountryDetailPanel detail={detail} onClose={() => setSelected(null)} /></div>}
    </div>
  );
}

export const WorldInvestmentMap = memo(WorldInvestmentMapComponent);
