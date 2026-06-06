import { memo, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { X, Building2, Layers } from "lucide-react";
import type { CountryMapPoint, CountryDetailData, CountryInvestmentRecord, InvestorRecord } from "../../../data/types";
import { CHART_COLORS } from "../../../data/constants";
import { processCountryDetail } from "../../../data/processors/investorAnalytics";
import { ChartEmptyState } from "../ChartEmptyState";
import { formatCurrency } from "../useChartLoading";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NAME_ALIASES: Record<string, string> = {
  "United States of America": "United States",
  "U.A.E.": "United Arab Emirates",
};

interface Props {
  data: CountryMapPoint[];
  year: string;
  countryInvestmentData: CountryInvestmentRecord[];
  investorData: InvestorRecord[];
}

function getFillColor(intensity: number, hasData: boolean, selected: boolean): string {
  if (selected) return "#0a4a4b";
  if (!hasData) return "#e5e7eb";
  if (intensity >= 0.75) return CHART_COLORS.primary;
  if (intensity >= 0.5) return CHART_COLORS.secondary;
  if (intensity >= 0.25) return CHART_COLORS.chart4;
  return "#93c5fd";
}

function CountryDetailPanel({
  detail,
  onClose,
}: {
  detail: CountryDetailData;
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
            {detail.totalProjects} projects · {formatCurrency(detail.totalInvestment)} total · {detail.year}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Sectors */}
        <div className="p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-primary" />
            <h5 className="text-sm font-semibold text-foreground">Projects by Sector</h5>
          </div>
          <div className="space-y-2">
            {detail.sectors.map((s) => (
              <div key={s.sector} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s.sector}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{s.projectCount} projects</span>
                  <span className="text-xs text-primary font-mono">{formatCurrency(s.investmentValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="p-5 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h5 className="text-sm font-semibold text-foreground">Companies & Projects</h5>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {detail.companies.map((c) => (
              <div
                key={c.company}
                className="flex items-start justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-medium text-foreground truncate">{c.company}</p>
                  <p className="text-xs text-muted-foreground">{c.sector}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-foreground">{c.projectCount}</p>
                  <p className="text-xs text-primary">{formatCurrency(c.investmentValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldInvestmentMapComponent({ data, year, countryInvestmentData, investorData }: Props) {
  const [hovered, setHovered] = useState<CountryMapPoint | null>(null);
  const [selected, setSelected] = useState<CountryMapPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const dataByName = useMemo(() => {
    const map = new Map<string, CountryMapPoint>();
    data.forEach((d) => map.set(d.country, d));
    return map;
  }, [data]);

  const detail = useMemo(
    () => (selected ? processCountryDetail(countryInvestmentData, investorData, selected.country, year) : null),
    [selected, year, countryInvestmentData, investorData],
  );

  if (!data.length) {
    return <ChartEmptyState message="No country investment data for selected year." height={400} />;
  }

  const resolveCountry = (geoName: string): CountryMapPoint | undefined => {
    const alias = NAME_ALIASES[geoName] ?? geoName;
    return dataByName.get(alias) ?? dataByName.get(geoName);
  };

  const handleClick = (countryData: CountryMapPoint) => {
    setSelected((prev) =>
      prev?.country === countryData.country ? null : countryData,
    );
    setHovered(null);
  };

  return (
    <div className="relative w-full">
      <p className="text-xs text-muted-foreground mb-2">
        Klik negara untuk melihat perincian proyek per sektor dan perusahaan
      </p>

      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160 }}
        width={900}
        height={420}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup center={[20, 10]} zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const name = geo.properties.name as string;
                const countryData = resolveCountry(name);
                const intensity = countryData?.intensity ?? 0;
                const isSelected = selected?.country === countryData?.country;

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
                        fill: countryData ? (isSelected ? "#0a4a4b" : CHART_COLORS.primary) : "#d1d5db",
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
        </ZoomableGroup>
      </ComposableMap>

      {hovered && !selected && (
        <div
          className="absolute z-10 bg-white border border-border rounded-lg p-3 shadow-lg text-sm pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
        >
          <p className="font-semibold text-foreground">{hovered.country}</p>
          <p className="text-muted-foreground">
            Total Investment: {formatCurrency(hovered.totalInvestment)}
          </p>
          <p className="text-muted-foreground">Projects: {hovered.projectCount}</p>
          <p className="text-xs text-primary mt-1">Klik untuk detail</p>
        </div>
      )}

      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
        <span>Investment Intensity:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: CHART_COLORS.primary }} />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: CHART_COLORS.secondary }} />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: CHART_COLORS.chart4 }} />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>No Data</span>
        </div>
      </div>

      {detail && <CountryDetailPanel detail={detail} onClose={() => setSelected(null)} />}
    </div>
  );
}

export const WorldInvestmentMap = memo(WorldInvestmentMapComponent);
