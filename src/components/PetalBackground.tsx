import React, { useMemo } from 'react';

interface Petal {
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

interface PetalBackgroundProps {
  petalColors?: string[];
  ambientGlow?: string;
  backgroundColor?: string;
}

const DEFAULT_PETAL_COLORS = ['#E6A598', '#A594B8', '#8A9A86', '#EAD5CE', '#D4AF37'];

export const PetalBackground: React.FC<PetalBackgroundProps> = ({
  petalColors,
  ambientGlow,
  backgroundColor,
}) => {
  const activeColors = useMemo(() => {
    if (petalColors && Array.isArray(petalColors) && petalColors.length > 0) {
      return petalColors;
    }
    return DEFAULT_PETAL_COLORS;
  }, [petalColors]);

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 14 + Math.random() * 18,
      rotation: Math.random() * 360,
      duration: 18 + Math.random() * 24,
      delay: -(Math.random() * 20),
      opacity: 0.12 + Math.random() * 0.18,
      color: activeColors[i % activeColors.length],
    }));
  }, [activeColors]);

  const glowColor = ambientGlow || '#EAD5CE';

  return (
    <div
      id="petal-background"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-1000"
      style={{ backgroundColor: backgroundColor || 'transparent' }}
    >
      {/* Delicate background ambient gradients adapted to user's glow/colors */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 transition-colors duration-1000"
        style={{ backgroundColor: glowColor }}
      />
      <div
        className="absolute top-1/2 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: activeColors[1 % activeColors.length] || '#A594B8' }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-25 transition-colors duration-1000"
        style={{ backgroundColor: activeColors[2 % activeColors.length] || '#8A9A86' }}
      />

      {/* Floating Petal Silhouettes */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute transition-transform ease-out"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            transform: `rotate(${petal.rotation}deg)`,
            opacity: petal.opacity,
            animation: `floatPetal ${petal.duration}s infinite ease-in-out`,
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
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.4"
            />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes floatPetal {
          0% {
            transform: translateY(0px) rotate(0deg) scale(0.95);
          }
          50% {
            transform: translateY(-24px) translateX(12px) rotate(180deg) scale(1.05);
          }
          100% {
            transform: translateY(0px) rotate(360deg) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};
