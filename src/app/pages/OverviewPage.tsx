import { useState } from "react";
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

const kpiData = [
  {
    title: "Total Tourist Destinations",
    value: "4,557",
    source: "BPS 2024",
    icon: MapPin,
    trend: null,
  },
  {
    title: "Tourist Visits",
    value: "148.5 Million",
    source: "Tourism Statistics",
    icon: Users,
    trend: null,
  },
  {
    title: "Tourism Investment Realization",
    value: "Rp34.02 Trillion",
    source: "Indonesia Tourism Outlook",
    icon: Wallet,
    trend: "+8.5%",
  },
  {
    title: "Domestic Investment Share (PMDN)",
    value: "73.9%",
    source: "Ministry of Investment",
    icon: TrendingUp,
    trend: "+4.3%",
  },
];

const prospectRealizationData = [
  { name: "Mandalika", prospect: 850, realization: 720 },
  { name: "Labuan Bajo", prospect: 780, realization: 650 },
  { name: "Danau Toba", prospect: 720, realization: 590 },
  { name: "Borobudur", prospect: 680, realization: 620 },
  { name: "Likupang", prospect: 620, realization: 480 },
  { name: "Morotai", prospect: 450, realization: 320 },
  { name: "Tanjung Kelayang", prospect: 520, realization: 410 },
  { name: "Wakatobi", prospect: 390, realization: 280 },
];

const investmentDistributionData = [
  { name: "Java", value: 48.8, fill: "#0F5D5E" },
  { name: "Outside Java", value: 51.2, fill: "#2A9D8F" },
];

const trendData = [
  { year: "2020", pmdn: 12.5, pma: 8.2, total: 20.7 },
  { year: "2021", pmdn: 14.8, pma: 9.1, total: 23.9 },
  { year: "2022", pmdn: 18.2, pma: 10.5, total: 28.7 },
  { year: "2023", pmdn: 22.1, pma: 11.3, total: 33.4 },
  { year: "2024", pmdn: 25.1, pma: 11.8, total: 36.9 },
  { year: "2025", pmdn: 28.3, pma: 12.4, total: 40.7 },
];

const destinationValueData = [
  { name: "Mandalika", value: 720 },
  { name: "Labuan Bajo", value: 650 },
  { name: "Borobudur", value: 620 },
  { name: "Danau Toba", value: 590 },
  { name: "Likupang", value: 480 },
  { name: "Tanjung Kelayang", value: 410 },
  { name: "Morotai", value: 320 },
  { name: "Wakatobi", value: 280 },
];

export function OverviewPage() {
  const [viewMode, setViewMode] = useState<"DPP" | "DPR">("DPP");

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
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
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="prospect" fill="#0F5D5E" name="Investment Prospect (Billion Rp)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="realization" fill="#2A9D8F" name="Investment Realization (Billion Rp)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Investment Distribution */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Investment Distribution
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
            Tourism Investment Realization Trend
          </h3>
          <p className="text-sm text-muted-foreground mb-6">Post-pandemic recovery 2020–2025</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "Trillion Rp", angle: -90, position: "insideLeft", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line type="monotone" dataKey="pmdn" stroke="#0F5D5E" strokeWidth={2} name="PMDN" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pma" stroke="#2A9D8F" strokeWidth={2} name="PMA" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="total" stroke="#D4A017" strokeWidth={2} name="Total Investment" dot={{ r: 4 }} />
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
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === "DPP"
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                DPP
              </button>
              <button
                onClick={() => setViewMode("DPR")}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  viewMode === "DPR"
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
              <Bar dataKey="value" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 4: Executive Insights */}
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
              PMDN contributes <span className="font-semibold text-primary">73.9%</span> of tourism investment.
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
