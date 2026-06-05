import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { MapPin, Users } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

const ROTATE_MS = 6000;

export function HeroHeader() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/60" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 pt-12 pb-0">
        <div className="pb-10">
          <p className="text-sm md:text-base font-medium text-white/80 uppercase tracking-[0.2em] mb-3">
            Kementerian Pariwisata · Republik Indonesia
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tourism Investment Demand Mapping
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mt-4 max-w-3xl leading-relaxed">
            National Overview of Tourism Investment Performance and Opportunities
            in Indonesia
          </p>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-6">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Background ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-t border-white/20 pt-0 overflow-x-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
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
            to="/investor-analytics"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
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
