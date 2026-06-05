# Tourism Investment Demand Mapping Dashboard

A comprehensive frontend dashboard for analyzing tourism investment performance and opportunities across Indonesia.

## Overview

This executive analytics platform provides strategic insights into tourism investment attractiveness, destination competitiveness, investor interest, and tourism sector growth for Indonesian government ministries, regional authorities, and investors.

## Features

### Page 1: Overview
- **4 KPI Cards**: Total destinations, tourist visits, investment realization, and domestic share
- **Prospect vs Realization Chart**: Horizontal grouped bar chart comparing investment goals and achievements across 8 priority destinations
- **Investment Distribution**: Donut chart showing Java vs Outside Java investment split
- **Investment Trend**: Multi-line chart tracking PMDN, PMA, and total investment from 2020-2025
- **Destination Value Rankings**: Toggleable bar chart with DPP/DPR views
- **Executive Insights Panel**: Key findings summary

### Page 2: Demand Analysis
- **Advanced Filters**: Year, province, destination, investment type, sector, and sentiment
- **Attractiveness Ranking Table**: Multi-metric scoring with visualization bars
- **Launch Frequency**: Area chart showing groundbreaking, new projects, hotels, and resorts over time
- **Sector Mapping**: Treemap visualization of investment distribution across 11 tourism sectors
- **Destination Trends**: Multi-line chart comparing 8 destinations from 2019-2025
- **Sentiment Analysis**: Stacked bar chart showing positive vs negative investment indicators
- **Investor Preference Heatmap**: Color-coded table analyzing investment type preferences by destination
- **Opportunity Matrix**: 2x2 scatter plot quadrant analysis
- **Strategic Recommendations**: 4 actionable insight cards

## Technology Stack

- **React 18** with TypeScript
- **React Router** for multi-page navigation
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Design System

### Colors
- Primary: Dark Teal `#0F5D5E`
- Secondary: Emerald `#2A9D8F`
- Accent: Gold `#D4A017`
- Background: White with subtle shadows

### Typography
- Display: Outfit (headings, KPI values)
- Body: Inter (interface text)
- Mono: JetBrains Mono (data tables)

### Key Design Principles
- Clean, professional government intelligence aesthetic
- Generous whitespace and clear hierarchy
- Responsive layout (desktop-optimized, mobile-friendly)
- Hover states and smooth transitions
- Real data with proper formatting (Indonesian Rupiah, percentages, dates)

## Running the Application

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main app component with router
│   ├── routes.tsx                 # Route configuration
│   ├── layouts/
│   │   └── RootLayout.tsx         # Main layout with navigation
│   └── pages/
│       ├── OverviewPage.tsx       # Page 1: National overview
│       └── DemandAnalysisPage.tsx # Page 2: Demand analysis
├── styles/
│   ├── fonts.css                  # Google Fonts imports
│   ├── theme.css                  # Design tokens and variables
│   └── index.css                  # Global styles
└── guidelines/
    └── Guidelines.md              # Design system documentation
```

## Target Users

- Ministry of Tourism
- Ministry of Investment
- Regional Governments
- Tourism Authorities
- Investors
- Policy Makers

## Data Visualization Types

- KPI Cards
- Horizontal/Vertical Bar Charts
- Line Charts
- Area Charts
- Donut/Pie Charts
- Treemap
- Scatter Plot (Quadrant Analysis)
- Heatmap (Table-based)
- Ranking Tables with Progress Bars

---

Built with Claude Code
