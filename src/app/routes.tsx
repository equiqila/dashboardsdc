import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { DestinationAnalyticsPage } from "./pages/DestinationAnalyticsPage";
import { InvestorAnalyticsPage } from "./pages/InvestorAnalyticsPage";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DestinationAnalyticsPage },
      { path: "investor-analytics", Component: InvestorAnalyticsPage },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
