import { useState } from "react";
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

const attractivenessData = [
  { destination: "Mandalika", newsFrequency: 145, newInvestments: 28, searchIndex: 92, propertyListings: 387, confidence: 88 },
  { destination: "Labuan Bajo", newsFrequency: 132, newInvestments: 24, searchIndex: 86, propertyListings: 342, confidence: 84 },
  { destination: "Borobudur", newsFrequency: 118, newInvestments: 22, searchIndex: 81, propertyListings: 298, confidence: 79 },
  { destination: "Danau Toba", newsFrequency: 108, newInvestments: 19, searchIndex: 75, propertyListings: 276, confidence: 75 },
  { destination: "Likupang", newsFrequency: 95, newInvestments: 17, searchIndex: 68, propertyListings: 234, confidence: 71 },
  { destination: "Tanjung Kelayang", newsFrequency: 82, newInvestments: 14, searchIndex: 62, propertyListings: 198, confidence: 66 },
  { destination: "Morotai", newsFrequency: 68, newInvestments: 11, searchIndex: 54, propertyListings: 156, confidence: 59 },
  { destination: "Wakatobi", newsFrequency: 61, newInvestments: 9, searchIndex: 49, propertyListings: 142, confidence: 55 },
];

const launchFrequencyData = [
  { month: "Jan 2023", groundbreaking: 3, newProjects: 5, newHotels: 2, resorts: 1 },
  { month: "Apr 2023", groundbreaking: 5, newProjects: 7, newHotels: 3, resorts: 2 },
  { month: "Jul 2023", groundbreaking: 4, newProjects: 6, newHotels: 4, resorts: 3 },
  { month: "Oct 2023", groundbreaking: 6, newProjects: 8, newHotels: 3, resorts: 2 },
  { month: "Jan 2024", groundbreaking: 8, newProjects: 11, newHotels: 5, resorts: 4 },
  { month: "Apr 2024", groundbreaking: 10, newProjects: 13, newHotels: 6, resorts: 5 },
  { month: "Jul 2024", groundbreaking: 12, newProjects: 15, newHotels: 7, resorts: 6 },
  { month: "Oct 2024", groundbreaking: 14, newProjects: 18, newHotels: 9, resorts: 7 },
  { month: "Jan 2025", groundbreaking: 16, newProjects: 21, newHotels: 11, resorts: 8 },
];

const sectorMappingData = [
  { name: "Hotel", value: 3200, fill: "#0F5D5E" },
  { name: "Resort", value: 2800, fill: "#2A9D8F" },
  { name: "Villa", value: 1500, fill: "#60a5fa" },
  { name: "Tourism Area Development", value: 2200, fill: "#D4A017" },
  { name: "Attraction", value: 1100, fill: "#a78bfa" },
  { name: "Marine Tourism", value: 900, fill: "#34d399" },
  { name: "Wellness & Spa", value: 750, fill: "#fbbf24" },
  { name: "Culinary", value: 620, fill: "#f87171" },
  { name: "Homestay", value: 580, fill: "#fb923c" },
  { name: "Marina", value: 420, fill: "#6366f1" },
  { name: "Diving Tourism", value: 380, fill: "#14b8a6" },
];

const destinationTrendData = [
  { year: "2019", Morotai: 45, TanjungKelayang: 52, Mandalika: 78, LabuanBajo: 72, DanauToba: 68, Borobudur: 85, Likupang: 38, Wakatobi: 32 },
  { year: "2020", Morotai: 38, TanjungKelayang: 45, Mandalika: 62, LabuanBajo: 58, DanauToba: 55, Borobudur: 68, Likupang: 32, Wakatobi: 28 },
  { year: "2021", Morotai: 48, TanjungKelayang: 58, Mandalika: 92, LabuanBajo: 78, DanauToba: 72, Borobudur: 88, Likupang: 52, Wakatobi: 38 },
  { year: "2022", Morotai: 68, TanjungKelayang: 82, Mandalika: 145, LabuanBajo: 122, DanauToba: 108, Borobudur: 132, Likupang: 85, Wakatobi: 58 },
  { year: "2023", Morotai: 98, TanjungKelayang: 118, Mandalika: 215, LabuanBajo: 178, DanauToba: 152, Borobudur: 185, Likupang: 128, Wakatobi: 82 },
  { year: "2024", Morotai: 142, TanjungKelayang: 168, Mandalika: 298, LabuanBajo: 245, DanauToba: 218, Borobudur: 255, Likupang: 185, Wakatobi: 118 },
  { year: "2025", Morotai: 198, TanjungKelayang: 232, Mandalika: 398, LabuanBajo: 328, DanauToba: 295, Borobudur: 342, Likupang: 252, Wakatobi: 165 },
];

const sentimentData = [
  { destination: "Mandalika", newInvestment: 145, expansion: 82, partnership: 56, cancelled: 12, delayed: 18, failed: 8 },
  { destination: "Labuan Bajo", newInvestment: 128, expansion: 68, partnership: 48, cancelled: 15, delayed: 22, failed: 10 },
  { destination: "Borobudur", newInvestment: 118, expansion: 62, partnership: 42, cancelled: 18, delayed: 25, failed: 12 },
  { destination: "Danau Toba", newInvestment: 98, expansion: 52, partnership: 35, cancelled: 22, delayed: 28, failed: 15 },
  { destination: "Likupang", newInvestment: 85, expansion: 45, partnership: 32, cancelled: 25, delayed: 32, failed: 18 },
  { destination: "Morotai", newInvestment: 62, expansion: 32, partnership: 22, cancelled: 32, delayed: 38, failed: 22 },
];

const heatmapData = [
  { destination: "Mandalika", Hotel: 95, Resort: 88, Villa: 72, Marina: 45, TourismArea: 82, Attraction: 68, Wellness: 58 },
  { destination: "Labuan Bajo", Hotel: 85, Resort: 92, Villa: 65, Marina: 78, TourismArea: 75, Attraction: 82, Wellness: 52 },
  { destination: "Borobudur", Hotel: 92, Resort: 68, Villa: 58, Marina: 25, TourismArea: 85, Attraction: 95, Wellness: 62 },
  { destination: "Danau Toba", Hotel: 78, Resort: 75, Villa: 68, Marina: 35, TourismArea: 72, Attraction: 65, Wellness: 78 },
  { destination: "Likupang", Hotel: 72, Resort: 85, Villa: 62, Marina: 68, TourismArea: 65, Attraction: 58, Wellness: 72 },
  { destination: "Wakatobi", Hotel: 58, Resort: 72, Villa: 48, Marina: 88, TourismArea: 52, Attraction: 75, Wellness: 45 },
];

const opportunityMatrixData = [
  { destination: "Mandalika", demand: 92, activity: 88, quadrant: "High Demand + High Investment" },
  { destination: "Labuan Bajo", demand: 86, activity: 84, quadrant: "High Demand + High Investment" },
  { destination: "Borobudur", demand: 81, activity: 79, quadrant: "High Demand + High Investment" },
  { destination: "Danau Toba", demand: 85, activity: 65, quadrant: "High Demand + Low Investment" },
  { destination: "Likupang", demand: 78, activity: 58, quadrant: "High Demand + Low Investment" },
  { destination: "Tanjung Kelayang", demand: 62, activity: 72, quadrant: "Low Demand + High Investment" },
  { destination: "Morotai", demand: 54, activity: 42, quadrant: "Low Demand + Low Investment" },
  { destination: "Wakatobi", demand: 49, activity: 38, quadrant: "Low Demand + Low Investment" },
];

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

export function DemandAnalysisPage() {
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
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
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
              <option>Mandalika</option>
              <option>Labuan Bajo</option>
              <option>Borobudur</option>
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
              <option>Hotel</option>
              <option>Resort</option>
              <option>Attraction</option>
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
          Destination Investment Attractiveness Ranking
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
              {attractivenessData.map((item, index) => (
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
        <p className="text-sm text-muted-foreground mb-6">Monthly timeline 2023–2025</p>
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
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
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
          <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Tourism Investment Sector Mapping
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <Treemap
              data={sectorMappingData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={({ x, y, width, height, name, value }) => {
                if (width < 60 || height < 40) return null;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={sectorMappingData.find((d) => d.name === name)?.fill} />
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
                      {value}B Rp
                    </text>
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </div>

        {/* Destination Trend */}
        <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Investment Trend by Destination
          </h3>
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
              <Line type="monotone" dataKey="Mandalika" stroke="#0F5D5E" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="LabuanBajo" stroke="#2A9D8F" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Borobudur" stroke="#D4A017" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="DanauToba" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Likupang" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 5: Sentiment Analysis */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Investment Sentiment Analysis
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={sentimentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="destination" type="category" width={120} tick={{ fontSize: 12 }} />
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
            <Bar dataKey="cancelled" stackId="negative" fill="#f87171" name="Cancelled" />
            <Bar dataKey="delayed" stackId="negative" fill="#fb923c" name="Delayed" />
            <Bar dataKey="failed" stackId="negative" fill="#dc2626" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Section 6: Investor Preference Heatmap */}
      <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Investor Preference Analysis
        </h3>
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
                  {Object.entries(row)
                    .filter(([key]) => key !== "destination")
                    .map(([key, value]) => (
                      <td key={key} className="py-3 px-4 text-center">
                        <div
                          className="inline-flex items-center justify-center w-12 h-8 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: getHeatColor(value as number) }}
                        >
                          {value}
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
        <h3 className="text-lg font-semibold text-foreground mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Investment Opportunity Matrix
        </h3>
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
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white border border-border rounded-lg p-3 shadow-lg text-sm">
                      <p className="font-semibold text-foreground mb-1">{data.destination}</p>
                      <p className="text-muted-foreground">Demand: {data.demand}</p>
                      <p className="text-muted-foreground">Activity: {data.activity}</p>
                      <p className="text-xs text-primary mt-1 font-medium">{data.quadrant}</p>
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
            {/* Quadrant labels */}
            <text x="75%" y="25%" textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight={600}>
              Established Investment Hubs
            </text>
            <text x="75%" y="75%" textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight={600}>
              Saturated Markets
            </text>
            <text x="25%" y="25%" textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight={600}>
              Emerging Opportunities
            </text>
            <text x="25%" y="75%" textAnchor="middle" fontSize={11} fill="#6b7280" fontWeight={600}>
              Development Priorities
            </text>
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
