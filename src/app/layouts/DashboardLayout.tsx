import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import { MapPin, Users } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

const ROTATE_MS = 6000;

export function DashboardHeader() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative overflow-hidden border-b border-border shadow-sm">
      {/* Rotating backgrounds */}
      <div className="absolute inset-0">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === activeIndex ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/92 via-primary/80 to-primary/70" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 pt-8 pb-0">
        <div className="pb-6">
          <p className="text-xs md:text-sm font-medium text-white/75 uppercase tracking-[0.2em] mb-2">
            Kementerian Pariwisata · Republik Indonesia
          </p>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tourism Investment Demand Mapping
          </h1>
          <p className="text-sm md:text-base text-white/85 mt-2 max-w-2xl">
            National Overview of Tourism Investment Performance and Opportunities in Indonesia
          </p>

          <div className="flex gap-2 mt-4">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-7 bg-white" : "w-3.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-t border-white/20 overflow-x-auto">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-white/70 hover:text-white hover:border-white/40"
              }`
            }
          >
            <MapPin className="h-4 w-4" />
            Destination Analytics
          </NavLink>
          <NavLink
            to="/dashboard/investor-analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-white text-white"
                  : "border-transparent text-white/70 hover:text-white hover:border-white/40"
              }`
            }
          >
            <Users className="h-4 w-4" />
            Investor Analytics
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-[1600px] px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
