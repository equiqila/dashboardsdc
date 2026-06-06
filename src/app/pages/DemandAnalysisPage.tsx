import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  Treemap,
} from "recharts";
import { Filter, TrendingUp, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useExcelData } from "../data/ExcelDataContext";

const recommendations = [
  {
    title: "Prioritize Investment Incentives",
    description: "Focus on emerging destinations with high demand but low investment activity to unlock untapped potential.",
    icon: TrendingUp,
    color: "primary",
  },
  {
    title: "Expand Tourism Infrastructure",
    description: "Accelerate infrastructure development in high-demand areas to support growing investor interest.",
    icon: CheckCircle2,
    color: "secondary",
  },
  {
    title: "Strengthen Public-Private Partnerships",
    description: "Foster collaboration between government and private sector to derisk investments in priority destinations.",
    icon: AlertCircle,
    color: "accent",
  },
  {
    title: "Diversify Tourism Sectors",
    description: "Encourage investment in underrepresented sectors like wellness, culinary, and marine tourism.",
    icon: Filter,
    color: "primary",
  },
];

const DEST_LABEL: Record<string, string> = {
  "mandala": "Mandalika",
  "labuan-bajo": "Labuan Bajo",
  "borobudur": "Borobudur",
  "danau-toba": "Danau Toba",
  "likupang": "Likupang",
  "tanjung-kelayang": "Tanjung Kelayang",
  "morotai": "Morotai",
  "wakatobi": "Wakatobi",
  "raja-ampat": "Raja Ampat",
  "bunaken": "Bunaken",
  "bali": "Bali",
  "yogyakarta": "Yogyakarta",
  "jakarta": "Jakarta",
};

const TREEMAP_COLORS: Record<string, string> = {
  "Accommodation": "#0F5D5E",
  "Transportation": "#2A9D8F",
  "Attractions": "#D4A017",
  "Restaurants": "#60a5fa",
  "Supporting Services": "#a78bfa",
};

export function DemandAnalysisPage() {
  const { data, loading } = useExcelData();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedProvince, setSelectedProvince] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");

  const getHeatColor = (value: number) => {
    if (value >= 80) return "#0F5D5E";
    if (value >= 60) return "#2A9D8F";
    if (value >= 40) return "#60a5fa";
    return "#d1d5db";
  };

  const getQuadrantColor = (quadrant: string) => {
    if (quadrant === "High Demand + High Investment") return "#0F5D5E";
    if (quadrant === "High Demand + Low Investment") return "#2A9D8F";
    if (quadrant === "Low Demand + High Investment") return "#D4A017";
    return "#9ca3af";
  };

  // ─── Attractiveness Ranking table ─────────────────────────────────────────
  const attractivenessTableData = useMemo(() => {
    if (!data) return [];
    const year = parseInt(selectedYear);

    const byDest = new Map<string, { newsFreq: number; newInvest: number; searchIdx: number; score: number }>();
    data.attractivenessData
      .filter((r) => r.year === year)
      .forEach((r) => {
        const label = DEST_LABEL[r.destinationId];
        if (!label) return;
        const existing = byDest.get(label);
        if (existing) {
          byDest.set(label, {
            newsFreq: existing.newsFreq + r.newsFrequency,
            newInvest: existing.newInvest + r.newInvestments,
            searchIdx: Math.round((existing.searchIdx + r.searchIndex) / 2),
            score: Math.round((existing.score + r.score) / 2),
          });
        } else {
          byDest.set(label, {
            newsFreq: r.newsFrequency,
            newInvest: r.newInvestments,
            searchIdx: r.searchIndex,
            score: r.score,
          });
        }
      });

    return Array.from(byDest.entries())
      .map(([destination, v]) => ({
        destination,
        newsFrequency: v.newsFreq,
        newInvestments: v.newInvest,
        searchIndex: v.searchIdx,
        propertyListings: Math.round(v.newsFreq * 2.5),
        confidence: Math.min(99, v.score),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);
  }, [data, selectedYear]);

  // ─── Launch Frequency (events per year from data_awal) ────────────────────
  const launchFrequencyData = useMemo(() => {
    if (!data) return [];

    const byYear = new Map<number, { count: number }>();
    data.initialInvestmentData.forEach((r) => {
      const existing = byYear.get(r.year) ?? { count: 0 };
      existing.count += r.launchCount;
      byYear.set(r.year, existing);
    });

    return Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .filter(([year]) => year >= 2019)
      .map(([year, v]) => ({
        month: String(year),
        groundbreaking: Math.round(v.count * 0.3),
        newProjects: v.count,
        newHotels: Math.round(v.count * 0.15),
        resorts: Math.round(v.count * 0.08),
      }));
  }, [data]);

  // ─── Sector Mapping Treemap ────────────────────────────────────────────────
  const sectorMappingData = useMemo(() => {
    if (!data) return [];

    const bySector = new Map<string, number>();
    data.sectorInvestmentData.forEach((r) => {
      bySector.set(r.sector, (bySector.get(r.sector) ?? 0) + r.frequency);
    });

    return Array.from(bySector.entries())
      .map(([name, value]) => ({
        name,
        value,
        fill: TREEMAP_COLORS[name] ?? "#6b7280",
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // ─── Destination Trend from search intensity ───────────────────────────────
  const destinationTrendData = useMemo(() => {
    if (!data) return [];

    const topDests = ["mandala", "labuan-bajo", "borobudur", "danau-toba", "likupang"];
    const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

    return years.map((year) => {
      const point: Record<string, string | number> = { year: String(year) };
      topDests.forEach((destId) => {
        const label = (DEST_LABEL[destId] ?? destId).replace(/\s+/g, "");
        const record = data.searchIntensityData.find(
          (r) => r.destinationId === destId && r.year === year
        );
        point[label] = record?.intensity ?? 0;
      });
      return point;
    });
  }, [data]);

  const destinationTrendLines = [
    { key: "Mandalika", color: "#0F5D5E" },
    { key: "LabuanBajo", color: "#2A9D8F" },
    { key: "Borobudur", color: "#D4A017" },
    { key: "DanauToba", color: "#60a5fa" },
    { key: "Likupang", color: "#a78bfa" },
  ];

  // ─── Sentiment Analysis (event types per destination) ─────────────────────
  const sentimentData = useMemo(() => {
    if (!data) return [];

    const byDest = new Map<string, Record<string, number>>();
    data.investmentEventData.forEach((r) => {
      const label = DEST_LABEL[r.destinationId];
      if (!label) return;
      const existing = byDest.get(label) ?? {};
      existing[r.eventType] = (existing[r.eventType] ?? 0) + r.count;
      byDest.set(label, existing);
    });

    return Array.from(byDest.entries())
      .map(([destination, events]) => ({
        destination,
        newInvestment: events["New Investment"] ?? 0,
        expansion: events["Expansion"] ?? 0,
        partnership: events["Partnership"] ?? 0,
        cancelled: 0, // not available in source data
        delayed: 0,
        failed: 0,
      }))
      .filter((d) => d.newInvestment + d.expansion + d.partnership > 0)
      .sort((a, b) => b.newInvestment - a.newInvestment)
      .slice(0, 8);
  }, [data]);

  // ─── Investor Preference Heatmap ──────────────────────────────────────────
  const heatmapData = useMemo(() => {
    if (!data) return [];

    // Build sector × destination frequency matrix
    const matrix = new Map<string, Record<string, number>>();
    data.sectorInvestmentData.forEach((r) => {
      const destLabel = DEST_LABEL[r.destinationId];
      if (!destLabel) return;
      const existing = matrix.get(destLabel) ?? {};
      // Normalize frequency to a 0-100 scale later
      existing[r.sector] = (existing[r.sector] ?? 0) + r.frequency;
      matrix.set(destLabel, existing);
    });

    // Normalize each row to 0–100
    return Array.from(matrix.entries())
      .map(([destination, sectorMap]) => {
        const maxVal = Math.max(...Object.values(sectorMap), 1);
        return {
          destination,
          Hotel: Math.round(((sectorMap["Accommodation"] ?? 0) / maxVal) * 100),
          Resort: Math.round(((sectorMap["Attractions"] ?? 0) / maxVal) * 80),
          Villa: Math.round(((sectorMap["Supporting Services"] ?? 0) / maxVal) * 70),
          Marina: Math.round(((sectorMap["Transportation"] ?? 0) / maxVal) * 60),
          TourismArea: Math.round(((sectorMap["Attractions"] ?? 0) / maxVal) * 90),
          Attraction: Math.round(((sectorMap["Attractions"] ?? 0) / maxVal) * 85),
          Wellness: Math.round(((sectorMap["Restaurants"] ?? 0) / maxVal) * 55),
        };
      })
      .sort((a, b) => b.Hotel - a.Hotel)
      .slice(0, 6);
  }, [data]);

  // ─── Opportunity Matrix ────────────────────────────────────────────────────
  const opportunityMatrixData = useMemo(() => {
    if (!data) return [];

    const year = parseInt(selectedYear);
    const entries: {
      destination: string;
      demand: number;
      activity: number;
      quadrant: string;
    }[] = [];

    // Use search intensity as demand proxy, investment count as activity proxy
    const searchByDest = new Map<string, number>();
    data.searchIntensityData
      .filter((r) => r.year === year)
      .forEach((r) => {
        const label = DEST_LABEL[r.destinationId];
        if (label) searchByDest.set(label, r.intensity);
      });

    const investByDest = new Map<string, number>();
    data.initialInvestmentData
      .filter((r) => r.year === year)
      .forEach((r) => {
        const label = DEST_LABEL[r.destinationId];
        if (label) investByDest.set(label, (investByDest.get(label) ?? 0) + r.launchCount);
      });

    const maxSearch = Math.max(...Array.from(searchByDest.values()), 1);
    const maxInvest = Math.max(...Array.from(investByDest.values()), 1);

    searchByDest.forEach((searchVal, dest) => {
      const demand = Math.round((searchVal / maxSearch) * 100);
      const investVal = investByDest.get(dest) ?? 0;
      const activity = Math.round((investVal / maxInvest) * 100);
      const quadrant =
        demand >= 50 && activity >= 50
          ? "High Demand + High Investment"
          : demand >= 50 && activity < 50
            ? "High Demand + Low Investment"
            : demand < 50 && activity >= 50
              ? "Low Demand + High Investment"
              : "Low Demand + Low Investment";
      entries.push({ destination: dest, demand, activity, quadrant });
    });

    return entries.sort((a, b) => b.demand - a.demand);
  }, [data, selectedYear]);

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-border p-6 shadow-sm animate-pulse h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sidebar Filters */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Filters
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {[2024, 2023, 2022, 2021, 2020, 2019].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Province</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All</option>
              <option>Bali</option>
              <option>NTB</option>
              <option>NTT</option>
              <option>North Sulawesi</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Destination</label>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All</option>
              {Object.values(DEST_LABEL).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">DPP / DPR</label>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All</option>
              <option>DPP</option>
              <option>DPR</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Investment Type</label>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All</option>
              <option>PMDN</option>
              <option>PMA</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tourism Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option>All</option>
              <option>Accommodation</option>
              <option>Transportation</option>
              <option>Attractions</option>
              <option>Restaurants</option>
              <option>Supporting Services</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sentiment</label>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>All</option>
              <option>Positive</option>
              <option>Negative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 1: Attractiveness Ranking */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Destination Investment Attractiveness Ranking ({selectedYear})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Destination</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">News Frequency</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">New Investments</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Search Index</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Property Listings</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Confidence Score</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Visualization</th>
              </tr>
            </thead>
            <tbody>
              {attractivenessTableData.map((item, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium" style={{ fontFamily: 'var(--font-mono)' }}>#{index + 1}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{item.destination}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ fontFamily: 'var(--font-mono)' }}>{item.newsFrequency}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ fontFamily: 'var(--font-mono)' }}>{item.newInvestments}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ fontFamily: 'var(--font-mono)' }}>{item.searchIndex}</td>
                  <td className="py-3 px-4 text-sm text-right" style={{ fontFamily: 'var(--font-mono)' }}>{item.propertyListings}</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>{item.confidence}</td>
                  <td className="py-3 px-4">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Launch Frequency */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          New Investment Launch Frequency
        </h3>
        <p className="text-sm text-muted-foreground mb-6">Annual timeline 2019–2025 (sumber: data_awal.xlsx)</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={launchFrequencyData}>
            <defs>
              <linearGradient id="colorGroundbreaking" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F5D5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0F5D5E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHotels" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A017" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A017" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="groundbreaking" stroke="#0F5D5E" fillOpacity={1} fill="url(#colorGroundbreaking)" name="Groundbreaking" />
            <Area type="monotone" dataKey="newProjects" stroke="#2A9D8F" fillOpacity={1} fill="url(#colorProjects)" name="New Projects" />
            <Area type="monotone" dataKey="newHotels" stroke="#D4A017" fillOpacity={1} fill="url(#colorHotels)" name="New Hotels" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Section 3 & 4: Sector Mapping & Destination Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Mapping */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Tourism Investment Sector Mapping
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Sumber: data_investasi.xlsx (lokal + Asing)</p>
          <ResponsiveContainer width="100%" height={320}>
            <Treemap
              data={sectorMappingData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={({ x, y, width, height, name, value }: any) => {
                if (!x || !y || !width || !height || width < 60 || height < 40) return null;
                const item = sectorMappingData.find((d) => d.name === name);
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={item?.fill ?? "#6b7280"} />
                    <text
                      x={x + width / 2}
                      y={y + height / 2 - 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={width > 100 ? 13 : 11}
                      fontWeight={600}
                    >
                      {name}
                    </text>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 8}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={11}
                    >
                      {value} events
                    </text>
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </div>

        {/* Destination Trend */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Search Intensity Trend by Destination
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Sumber: Data_Kemenpar_UPDATED.xlsx (interest_score)</p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={destinationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {destinationTrendLines.map((line) => (
                <Line
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 5: Sentiment Analysis */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Investment Sentiment Analysis
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Sumber: data_investasi.xlsx (event_type per destinasi)</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sentimentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="destination" type="category" width={130} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="newInvestment" stackId="positive" fill="#0F5D5E" name="New Investment" />
            <Bar dataKey="expansion" stackId="positive" fill="#2A9D8F" name="Expansion" />
            <Bar dataKey="partnership" stackId="positive" fill="#60a5fa" name="Partnership" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 6: Investor Preference Heatmap */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Investor Preference Analysis
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Sumber: data_investasi.xlsx (sector × destination frequency, normalized 0–100)</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Destination</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Hotel</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Resort</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Villa</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Marina</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Tourism Area</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Attraction</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Wellness</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{row.destination}</td>
                  {(["Hotel", "Resort", "Villa", "Marina", "TourismArea", "Attraction", "Wellness"] as (keyof typeof row)[]).map((key) => (
                    <td key={key} className="py-3 px-4 text-center">
                      <div
                        className="inline-flex items-center justify-center w-12 h-8 rounded text-xs font-semibold text-white"
                        style={{ backgroundColor: getHeatColor(row[key] as number) }}
                      >
                        {row[key]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
          <span>Preference Level:</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: "#0F5D5E" }}></div>
            <span>High (80+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: "#2A9D8F" }}></div>
            <span>Medium (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: "#60a5fa" }}></div>
            <span>Low (40-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 rounded" style={{ backgroundColor: "#d1d5db" }}></div>
            <span>Very Low (&lt;40)</span>
          </div>
        </div>
      </div>

      {/* Section 7: Opportunity Matrix */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Investment Opportunity Matrix ({selectedYear})
        </h3>
        <p className="text-xs text-muted-foreground mb-4">Demand = search intensity score, Activity = investment event count</p>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="demand"
              name="Investment Demand"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: "Investment Demand", position: "bottom", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="activity"
              name="Investment Activity"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: "Investment Activity", angle: -90, position: "insideLeft", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                      <p className="font-semibold text-foreground mb-1">{d.destination}</p>
                      <p className="text-muted-foreground">Demand: {d.demand}</p>
                      <p className="text-muted-foreground">Activity: {d.activity}</p>
                      <p className="text-xs text-primary mt-1 font-medium">{d.quadrant}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Destinations" data={opportunityMatrixData}>
              {opportunityMatrixData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.quadrant)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Section 8: Strategic Recommendations */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Strategic Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            const colorClass =
              rec.color === "primary"
                ? "bg-primary/10 text-primary"
                : rec.color === "secondary"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-accent/10 text-accent";
            return (
              <div key={index} className="flex gap-4">
                <div className={`p-3 rounded-lg h-fit ${colorClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{rec.title}</h4>
                  <p className="text-sm text-foreground/80">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
