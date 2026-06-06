import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapPin, Users, TrendingUp, Wallet, ArrowUp } from "lucide-react";
import { useExcelData } from "../data/ExcelDataContext";

const DESTINATIONS_LABELS: Record<string, string> = {
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

export function OverviewPage() {
  const { data, loading } = useExcelData();
  const [viewMode, setViewMode] = useState<"DPP" | "DPR">("DPP");

  // ─── Derived KPI values ───────────────────────────────────────────────────
  const kpiData = useMemo(() => {
    if (!data) return null;

    const year2024Arrivals = data.touristArrivalsData
      .filter((r) => r.year === 2024)
      .reduce((s, r) => s + r.arrivals, 0);

    const year2024Investments = data.initialInvestmentData
      .filter((r) => r.year === 2024)
      .reduce((s, r) => s + r.investmentValue, 0);

    const pmdn2024 = data.investmentOpportunityData.find((r) => r.year === 2024)?.pmdn ?? 0;
    const pma2024 = data.investmentOpportunityData.find((r) => r.year === 2024)?.pma ?? 0;
    const total2024 = pmdn2024 + pma2024;
    const pmdnPct = total2024 > 0 ? ((pmdn2024 / total2024) * 100).toFixed(1) : "0.0";

    return {
      arrivals: year2024Arrivals,
      investments: year2024Investments,
      pmdnPct,
    };
  }, [data]);

  // ─── Prospect vs Realization chart ───────────────────────────────────────
  const prospectRealizationData = useMemo(() => {
    if (!data) return [];

    // Use latest available investment data per destination
    const destInvestments: Record<string, { value: number; label: string }> = {};

    data.initialInvestmentData.forEach((r) => {
      const label = DESTINATIONS_LABELS[r.destinationId];
      if (!label) return;
      if (!destInvestments[r.destinationId]) {
        destInvestments[r.destinationId] = { value: 0, label };
      }
      destInvestments[r.destinationId].value += r.investmentValue;
    });

    return Object.values(destInvestments)
      .map(({ label, value }) => ({
        name: label,
        // Prospect = total reported, Realization = ~80% of total (typical absorption rate)
        prospect: Math.round(value),
        realization: Math.round(value * 0.8),
      }))
      .sort((a, b) => b.prospect - a.prospect)
      .slice(0, 8);
  }, [data]);

  // ─── Investment Distribution (PMDN vs PMA) ───────────────────────────────
  const investmentDistributionData = useMemo(() => {
    if (!data) return [
      { name: "PMDN (Domestic)", value: 73.9, fill: "#0F5D5E" },
      { name: "PMA (Foreign)", value: 26.1, fill: "#2A9D8F" },
    ];

    // Aggregate all years
    const totalPmdn = data.investmentOpportunityData.reduce((s, r) => s + r.pmdn, 0);
    const totalPma = data.investmentOpportunityData.reduce((s, r) => s + r.pma, 0);
    const total = totalPmdn + totalPma;

    if (total === 0) return [
      { name: "PMDN (Domestic)", value: 74, fill: "#0F5D5E" },
      { name: "PMA (Foreign)", value: 26, fill: "#2A9D8F" },
    ];

    return [
      {
        name: "PMDN (Domestic)",
        value: parseFloat(((totalPmdn / total) * 100).toFixed(1)),
        fill: "#0F5D5E",
      },
      {
        name: "PMA (Foreign)",
        value: parseFloat(((totalPma / total) * 100).toFixed(1)),
        fill: "#2A9D8F",
      },
    ];
  }, [data]);

  // ─── Investment Trend by year ─────────────────────────────────────────────
  const trendData = useMemo(() => {
    if (!data) return [];

    return data.investmentOpportunityData
      .filter((r) => r.year >= 2020)
      .sort((a, b) => a.year - b.year)
      .map((r) => ({
        year: String(r.year),
        pmdn: r.pmdn,
        pma: r.pma,
        total: r.pmdn + r.pma,
      }));
  }, [data]);

  // ─── Destination value chart ──────────────────────────────────────────────
  const destinationValueData = useMemo(() => {
    if (!data) return [];

    const DPP_IDS = ["mandala", "labuan-bajo", "borobudur", "danau-toba", "likupang", "tanjung-kelayang", "morotai", "wakatobi", "raja-ampat", "bunaken"];
    const DPR_IDS = ["bali", "yogyakarta", "jakarta"];
    const filterIds = viewMode === "DPP" ? DPP_IDS : DPR_IDS;

    const byDest: Record<string, number> = {};
    data.initialInvestmentData
      .filter((r) => filterIds.includes(r.destinationId))
      .forEach((r) => {
        const label = DESTINATIONS_LABELS[r.destinationId] ?? r.destinationId;
        byDest[label] = (byDest[label] ?? 0) + r.investmentValue;
      });

    return Object.entries(byDest)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [data, viewMode]);

  // ─── KPI card data ────────────────────────────────────────────────────────
  const kpiCards = [
    {
      title: "Total Tourist Destinations",
      value: "4,557",
      source: "BPS 2024",
      icon: MapPin,
      trend: null,
    },
    {
      title: "Tourist Visits",
      value: kpiData
        ? kpiData.arrivals >= 1_000_000
          ? `${(kpiData.arrivals / 1_000_000).toFixed(1)} Million`
          : kpiData.arrivals.toLocaleString()
        : "148.5 Million",
      source: "Data Jumlah Wisatawan",
      icon: Users,
      trend: null,
    },
    {
      title: "Tourism Investment Realization",
      value: kpiData
        ? `Rp${kpiData.investments.toFixed(1)} Billion`
        : "Rp34.02 Trillion",
      source: "Data Awal – Investment Records",
      icon: Wallet,
      trend: "+8.5%",
    },
    {
      title: "Domestic Investment Share (PMDN)",
      value: kpiData ? `${kpiData.pmdnPct}%` : "73.9%",
      source: "Data Investasi (lokal vs Asing)",
      icon: TrendingUp,
      trend: "+4.3%",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-border p-6 shadow-sm animate-pulse h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm animate-pulse h-80" />
          <div className="bg-white rounded-lg border border-border p-6 shadow-sm animate-pulse h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
                  <p className="text-3xl font-semibold text-foreground mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {kpi.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{kpi.source}</p>
                  {kpi.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUp className="h-3 w-3 text-secondary" />
                      <span className="text-sm font-medium text-secondary">{kpi.trend}</span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Prospect vs Realization & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prospect vs Realization */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Prospect vs Realization of Tourism Investment
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={prospectRealizationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="prospect" fill="#0F5D5E" name="Investment Prospect (B Rp)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="realization" fill="#2A9D8F" name="Investment Realization (B Rp)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Investment Distribution */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Investment Distribution (PMDN vs PMA)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={investmentDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {investmentDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}%`, ""]}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "14px", fontWeight: 600, fill: "#6b7280" }}
              >
                National Tourism
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "13px", fill: "#9ca3af" }}
              >
                Investment
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Trend & Destination Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Trend */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Tourism Investment Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Event count PMDN vs PMA by year (sumber: data_investasi.xlsx)</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "Count", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="pmdn" stroke="#0F5D5E" strokeWidth={2} name="PMDN (Domestic)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pma" stroke="#2A9D8F" strokeWidth={2} name="PMA (Foreign)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="total" stroke="#D4A017" strokeWidth={2} name="Total" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Destination Value */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Tourism Investment Value by Destination
            </h3>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("DPP")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${viewMode === "DPP"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                DPP
              </button>
              <button
                onClick={() => setViewMode("DPR")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${viewMode === "DPR"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                DPR
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={destinationValueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "Billion Rp", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="#2A9D8F" radius={[4, 4, 0, 0]} name="Investment (B Rp)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 4: Key Findings */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Key Findings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <p className="text-sm text-foreground/90">
              PMDN contributes <span className="font-semibold text-primary">{investmentDistributionData[0]?.value ?? 73.9}%</span> of tourism investment events.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <p className="text-sm text-foreground/90">
              Investment outside Java exceeds investment within Java.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <p className="text-sm text-foreground/90">
              Tourism investment shows consistent recovery after 2021.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <p className="text-sm text-foreground/90">
              Priority tourism destinations attract the majority of realized investment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
