import React, { useMemo } from 'react';

interface DarkPetal {
  id: number;
  left: number;
  top: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

interface GoldenSparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

// Deep vinotinto, dark purple, plum, and subtle amber palette for petals
const MAIN_HOME_PETAL_COLORS = [
  '#4C0519', // Deep Vinotinto
  '#2E1065', // Dark Violet / Purple
  '#581C87', // Deep Plum
  '#701A75', // Dark Magenta Wine
  '#380415', // Dark Maroon
  '#CA8A04', // Subtle Golden Amber accent
];

export const MainHomePageBackground: React.FC = () => {
  // Generate random dark floating petals
  const petals = useMemo<DarkPetal[]>(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: 3 + Math.random() * 94,
      top: 5 + Math.random() * 90,
      size: 16 + Math.random() * 24,
      rotation: Math.random() * 360,
      duration: 16 + Math.random() * 22,
      delay: -(Math.random() * 20),
      opacity: 0.25 + Math.random() * 0.3,
      color: MAIN_HOME_PETAL_COLORS[i % MAIN_HOME_PETAL_COLORS.length],
    }));
  }, []);

  // Generate golden micro particles to highlight yellow flowers
  const sparkles = useMemo<GoldenSparkle[]>(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 90,
      size: 2 + Math.random() * 3.5,
      duration: 8 + Math.random() * 12,
      delay: -(Math.random() * 10),
    }));
  }, []);

  return (
    <div
      id="main-home-page-background"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#030206] transition-opacity duration-1000"
    >
      {/* Base radial vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,2,6,0.85)_100%)]" />

      {/* 1. Deep Vinotinto Atmospheric Glow (Top Left) */}
      <div
        className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-45 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #4C0519 0%, #380415 60%, transparent 100%)',
          animation: 'mainHomeGlowPulse 14s infinite ease-in-out',
        }}
      />

      {/* 2. Dark Purple / Violet Atmospheric Glow (Bottom Right) */}
      <div
        className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] rounded-full blur-[140px] opacity-40 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, #2E1065 0%, #1E0536 60%, transparent 100%)',
          animation: 'mainHomeGlowPulse 18s infinite ease-in-out',
          animationDelay: '-6s',
        }}
      />

      {/* 3. Deep Plum / Burgundy Glow (Center Left) */}
      <div
        className="absolute top-1/3 -left-20 w-[26rem] h-[26rem] rounded-full blur-[100px] opacity-35"
        style={{
          background: 'radial-gradient(circle, #701A75 0%, #4A044E 70%, transparent 100%)',
          animation: 'mainHomeGlowPulse 16s infinite ease-in-out',
          animationDelay: '-3s',
        }}
      />

      {/* 4. Subtle Golden Amber Radial Highlight (Center) to make yellow flowers pop with contrast */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[150px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #EAB308 0%, #CA8A04 35%, transparent 70%)',
        }}
      />

      {/* Decorative Background Yellow/Gold Organic Flower Silhouettes */}
      <div
        className="absolute top-12 left-12 w-48 h-48 opacity-15 transition-transform duration-1000"
        style={{ animation: 'mainHomeFlowerRotate 90s linear infinite' }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#FACC15]">
          <path
            d="M50 0C55 20 70 30 90 30C70 40 60 55 60 75C50 55 35 45 15 45C35 35 45 20 50 0Z"
            fill="currentColor"
          />
          <path
            d="M50 25C52 35 60 40 70 40C60 45 55 52 55 62C50 52 42 47 32 47C42 42 47 35 50 25Z"
            fill="#EAB308"
          />
        </svg>
      </div>

      <div
        className="absolute bottom-16 right-16 w-64 h-64 opacity-15 transition-transform duration-1000"
        style={{ animation: 'mainHomeFlowerRotate 120s linear infinite reverse' }}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#FBBF24]">
          <path
            d="M50 0C55 20 70 30 90 30C70 40 60 55 60 75C50 55 35 45 15 45C35 35 45 20 50 0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Floating Dark Petals */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute transition-transform ease-out"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            transform: `rotate(${petal.rotation}deg)`,
            opacity: petal.opacity,
            animation: `floatPetalSlow ${petal.duration}s infinite ease-in-out`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.5}
            viewBox="0 0 30 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 0C6 15 0 25 0 34C0 40 6.7 45 15 45C23.3 45 30 40 30 34C30 25 24 15 15 0Z"
              fill={petal.color}
            />
            {/* Subtle center vein */}
            <path
              d="M15 12V38"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ))}

      {/* Floating Golden Yellow Particles to highlight yellow flowers */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full bg-[#FACC15] shadow-[0_0_8px_#FACC15]"
          style={{
            left: `${sp.left}%`,
            top: `${sp.top}%`,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            opacity: 0.45,
            animation: `floatPetalSlow ${sp.duration}s infinite ease-in-out`,
            animationDelay: `${sp.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
