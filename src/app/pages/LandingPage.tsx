import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

const HERO_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
];

const ROTATE_MS = 6000;

export function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="text-sm md:text-base font-medium text-white/80 uppercase tracking-[0.25em] mb-4">
          Kementerian Pariwisata · Republik Indonesia
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tourism Investment Demand Mapping
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 mt-6 max-w-3xl leading-relaxed">
          National Overview of Tourism Investment Performance and Opportunities
          in Indonesia
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mt-10 inline-flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-xl font-semibold text-lg shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-300"
        >
          Masuk Dashboard
          <ArrowRight className="h-5 w-5" />
        </button>

        <div className="flex gap-2 mt-12">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
