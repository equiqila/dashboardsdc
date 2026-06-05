import { Outlet } from "react-router";
import { HeroHeader } from "../components/layout/HeroHeader";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
