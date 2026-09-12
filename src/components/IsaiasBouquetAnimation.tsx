import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface IsaiasBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'water-wrap'
  | 'current-stems'
  | 'waving-flanks'
  | 'center-blooms'
  | 'sapphire-crown'
  | 'bouquet-complete';

export const IsaiasBouquetAnimation: React.FC<IsaiasBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(mode === 'result' ? 'bouquet-complete' : 'water-wrap');
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const [gestureTick, setGestureTick] = useState<number>(0);

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('water-wrap');
    setIsCompleted(false);

    // Fluid, expressive, undulating assembly timing for Isaías
    const t1 = setTimeout(() => setStep('current-stems'), 2500); // Water ripples & aquatic wrap
    const t2 = setTimeout(() => setStep('waving-flanks'), 5500); // Wavy background yellow stems placed
    const t3 = setTimeout(() => setStep('center-blooms'), 8500); // Expressive nodding side blooms arranged
    const t4 = setTimeout(() => setStep('sapphire-crown'), 11500); // Sapphire & Keeper water signature flower placed
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 15000); // Translucent ribbon tied, water reflections harmonized

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [mode]);

  // Expressive micro-gestures & restless thoughts tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGestureTick((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsCompleted(false);
    setStep('water-wrap');
    setTimeout(() => setStep('current-stems'), 2500);
    setTimeout(() => setStep('waving-flanks'), 5500);
    setTimeout(() => setStep('center-blooms'), 8500);
    setTimeout(() => setStep('sapphire-crown'), 11500);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 15000);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'water-wrap',
      'current-stems',
      'waving-flanks',
      'center-blooms',
      'sapphire-crown',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="isaias-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 overflow-hidden select-none"
    >
      {/* Nocturnal Aquatic Atmosphere ("ella - Intro - Domingo" & Pisces Water Aura) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-radial from-[#0077B6]/25 via-[#071930]/55 to-transparent blur-3xl opacity-85" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#00E5FF]/18 via-[#FBBF24]/12 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#00B4D8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Bouquet Stage SVG */}
        <div className="relative w-[340px] h-[430px] sm:w-[390px] sm:h-[460px] flex items-center justify-center">
          <svg
            viewBox="0 0 400 480"
            className="w-full h-full overflow-visible drop-shadow-[0_0_35px_rgba(0,180,216,0.25)]"
          >
            <defs>
              {/* Soft Golden Water Petal Gradient */}
              <linearGradient id="isaiasGoldPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="80%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              {/* Luminous Warm Buttercup Yellow */}
              <linearGradient id="isaiasButtercupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              {/* Signature Flower: Sapphire & Ocean Wave Gradient */}
              <linearGradient id="isaiasSapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="30%" stopColor="#48CAE4" />
                <stop offset="70%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#023E8A" />
              </linearGradient>

              {/* Electric Cyan Water Accent */}
              <linearGradient id="isaiasCyanAccent" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#90E0EF" />
                <stop offset="70%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#03045E" />
              </linearGradient>

              {/* Fluid Hydrodynamic Stem Gradient */}
              <linearGradient id="isaiasStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#67E8F9" />
                <stop offset="40%" stopColor="#0284C7" />
                <stop offset="85%" stopColor="#0F3854" />
                <stop offset="100%" stopColor="#030B17" />
              </linearGradient>

              {/* Translucent Oceanic Vellum Wrap Gradient */}
              <linearGradient id="isaiasWrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0369A1" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#071E3D" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020817" stopOpacity="0.95" />
              </linearGradient>

              {/* Aquatic Sapphire Ribbon Gradient */}
              <linearGradient id="isaiasRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#67E8F9" />
                <stop offset="50%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#0077B6" />
              </linearGradient>

              {/* Keeper Protective Shield Arc Gradient */}
              <linearGradient id="isaiasKeeperShield" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* =========================================================
                WATER BASE RIPPLES & CONCENTRIC WAVES (Piscis & Calma)
               ========================================================= */}
            <g id="isaias-water-base">
              {[46, 32, 20].map((radius, wIdx) => (
                <motion.ellipse
                  key={`isaias-wave-${wIdx}`}
                  cx="200"
                  cy="435"
                  rx={radius * 1.8}
                  ry={radius * 0.45}
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  strokeDasharray={wIdx === 1 ? '3 3' : 'none'}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    scale: [0.8, 1.35, 1.8],
                    opacity: [0.7, 0.3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: wIdx * 1.1,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </g>

            {/* =========================================================
                BACKGROUND FLUID STEMS & WATER FOLIAGE
               ========================================================= */}
            {isStepAtLeast('current-stems') && (
              <g id="isaias-bg-stems">
                {/* Wavy Stem 1 (Left Back Water Daisy) */}
                <motion.path
                  d="M 196 420 C 175 350, 150 300, 135 215"
                  fill="none"
                  stroke="url(#isaiasStemGrad)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Wavy Stem 2 (Right Back Narcissus) */}
                <motion.path
                  d="M 204 420 C 225 350, 250 300, 265 205"
                  fill="none"
                  stroke="url(#isaiasStemGrad)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Aquatic ribbon-grass fronds with dew pearls */}
                <motion.path
                  d="M 180 340 C 130 320, 115 280, 105 240 C 135 270, 160 300, 180 340"
                  fill="#0369A1"
                  stroke="#38BDF8"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.75 }}
                  transition={{ duration: 1.2, delay: 0.4 }}
                />
                <motion.path
                  d="M 220 340 C 270 320, 285 280, 295 240 C 265 270, 240 300, 220 340"
                  fill="#0369A1"
                  stroke="#00E5FF"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.75 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </g>
            )}

            {/* =========================================================
                YELLOW FLOWER 1 (Back Left: Margarita de Agua Amarilla)
                Center around (135, 215), undulating tilt -24 deg
               ========================================================= */}
            {isStepAtLeast('current-stems') && (
              <motion.g
                id="isaias-flower-water-daisy"
                initial={{ scale: 0, y: -25, rotate: -40, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  rotate: gestureTick % 2 === 0 ? -24 : -21,
                  opacity: 1,
                }}
                transition={{ duration: 1.6, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
                style={{ transformOrigin: '135px 215px' }}
              >
                {/* 11 Wavy fluid petals */}
                {[...Array(11)].map((_, i) => {
                  const deg = (i * 360) / 11;
                  return (
                    <g key={`daisy-p-${i}`} transform={`rotate(${deg} 135 215)`}>
                      <path
                        d="M 135 215 C 127 195, 126 170, 135 158 C 144 170, 143 195, 135 215 Z"
                        fill="url(#isaiasGoldPetal)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                      />
                    </g>
                  );
                })}
                {/* Center Receptacle with water droplet glint */}
                <circle cx="135" cy="215" r="14" fill="#EAB308" />
                <circle cx="135" cy="215" r="10" fill="#FACC15" />
                <circle cx="135" cy="215" r="5" fill="#FEF08A" />
                <circle cx="138" cy="212" r="1.8" fill="#00E5FF" opacity="0.8" />
              </motion.g>
            )}

            {/* =========================================================
                YELLOW FLOWER 2 (Back Right: Narciso Dorado Ondulante)
                Center around (265, 205), dynamic trumpet tilt +26 deg
               ========================================================= */}
            {isStepAtLeast('current-stems') && (
              <motion.g
                id="isaias-flower-narcissus"
                initial={{ scale: 0, y: -25, rotate: 45, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  rotate: gestureTick % 2 === 1 ? 26 : 29,
                  opacity: 1,
                }}
                transition={{ duration: 1.6, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
                style={{ transformOrigin: '265px 205px' }}
              >
                {/* 6 Star-flared outer golden petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`narc-p-${i}`} transform={`rotate(${deg + 26} 265 205)`}>
                    <path
                      d="M 265 205 C 248 185, 248 160, 265 150 C 282 160, 282 185, 265 205 Z"
                      fill="url(#isaiasButtercupGrad)"
                      stroke="#D97706"
                      strokeWidth="0.65"
                    />
                  </g>
                ))}
                {/* Ruffled Deep Trumpet Cup Center */}
                <ellipse cx="265" cy="205" rx="13" ry="11" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                <ellipse cx="265" cy="205" rx="9" ry="7" fill="#FDE047" />
                <circle cx="265" cy="205" r="4" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* =========================================================
                MIDDLE LAYER STEMS (Flanks: Drooping Bell & Sea Tulip)
               ========================================================= */}
            {isStepAtLeast('waving-flanks') && (
              <g id="isaias-mid-stems">
                {/* Stem 3 (Far Left: Campanilla Amarilla) */}
                <motion.path
                  d="M 197 420 C 160 350, 130 310, 105 275"
                  fill="none"
                  stroke="url(#isaiasStemGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3 }}
                />
                {/* Stem 4 (Far Right: Tulipán Marino) */}
                <motion.path
                  d="M 203 420 C 240 350, 270 310, 295 270"
                  fill="none"
                  stroke="url(#isaiasStemGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 0.2 }}
                />
              </g>
            )}

            {/* =========================================================
                YELLOW FLOWER 3 (Left Flank: Campanilla Amarilla de Arroyo)
                Center around (105, 275), drooping tilt -36 deg
               ========================================================= */}
            {isStepAtLeast('waving-flanks') && (
              <motion.g
                id="isaias-flower-bell"
                initial={{ scale: 0, x: -30, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '105px 275px' }}
              >
                {/* 5 Drooping bell petals nodding gently */}
                <g transform="rotate(-36 105 275)">
                  <path
                    d="M 105 275 C 90 250, 85 225, 95 215 C 105 220, 110 240, 105 275 Z"
                    fill="url(#isaiasGoldPetal)"
                    stroke="#CA8A04"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 105 275 C 110 245, 115 225, 125 218 C 120 235, 115 255, 105 275 Z"
                    fill="url(#isaiasButtercupGrad)"
                    stroke="#CA8A04"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M 105 275 C 98 250, 100 230, 110 220 C 112 235, 110 255, 105 275 Z"
                    fill="#FEF08A"
                    stroke="#EAB308"
                    strokeWidth="0.6"
                  />
                  {/* Suspended water droplet */}
                  <circle cx="110" cy="217" r="2" fill="#00E5FF" opacity="0.9" />
                </g>
              </motion.g>
            )}

            {/* =========================================================
                YELLOW FLOWER 4 (Right Flank: Tulipán Amarillo Marino)
                Center around (295, 270), cup tilt +32 deg
               ========================================================= */}
            {isStepAtLeast('waving-flanks') && (
              <motion.g
                id="isaias-flower-tulip"
                initial={{ scale: 0, x: 30, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '295px 270px' }}
              >
                <g transform="rotate(32 295 270)">
                  {/* Outer Left Chalice Petal */}
                  <path
                    d="M 295 270 C 275 250, 272 220, 285 210 C 292 230, 295 250, 295 270 Z"
                    fill="url(#isaiasGoldPetal)"
                    stroke="#CA8A04"
                    strokeWidth="0.7"
                  />
                  {/* Outer Right Chalice Petal */}
                  <path
                    d="M 295 270 C 315 250, 318 220, 305 210 C 298 230, 295 250, 295 270 Z"
                    fill="url(#isaiasGoldPetal)"
                    stroke="#CA8A04"
                    strokeWidth="0.7"
                  />
                  {/* Center Chalice Petal */}
                  <path
                    d="M 295 270 C 285 250, 288 215, 295 208 C 302 215, 305 250, 295 270 Z"
                    fill="#FEF08A"
                    stroke="#EAB308"
                    strokeWidth="0.6"
                  />
                  {/* Luminous water glint on petal rim */}
                  <circle cx="295" cy="209" r="1.8" fill="#00E5FF" opacity="0.85" />
                </g>
              </motion.g>
            )}

            {/* =========================================================
                FOREGROUND YELLOW FLOWER 5 (Center-Front: Botón de Miel Ondulante)
                Center around (200, 290), organic cluster
               ========================================================= */}
            {isStepAtLeast('center-blooms') && (
              <motion.g
                id="isaias-flower-buttercups"
                initial={{ scale: 0, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                style={{ transformOrigin: '200px 290px' }}
              >
                {/* Stem */}
                <path
                  d="M 200 420 C 196 360, 204 320, 200 290"
                  fill="none"
                  stroke="url(#isaiasStemGrad)"
                  strokeWidth="4.2"
                />
                {/* 5 Buttercup Petals radiating */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <g key={`buttercup-${i}`} transform={`rotate(${deg} 200 290)`}>
                    <path
                      d="M 200 290 C 180 272, 182 248, 200 242 C 218 248, 220 272, 200 290 Z"
                      fill="url(#isaiasGoldPetal)"
                      stroke="#CA8A04"
                      strokeWidth="0.75"
                    />
                  </g>
                ))}
                {/* Glowing buttercup center */}
                <circle cx="200" cy="290" r="9" fill="#EAB308" />
                <circle cx="200" cy="290" r="5" fill="#FEF9C3" />
                {/* Water droplet on leaf node */}
                <circle cx="200" cy="289" r="1.5" fill="#00E5FF" />
              </motion.g>
            )}

            {/* =========================================================
                THE SIGNATURE FLOWER: NENÚFAR DE ZAFIRO & REFLEJOS DE PORTERO
                Positioned at the elevated focal crown (200, 140)
               ========================================================= */}
            {isStepAtLeast('sapphire-crown') && (
              <motion.g
                id="isaias-signature-sapphire-crown"
                initial={{ scale: 0, y: -50, opacity: 0 }}
                animate={{
                  scale: [0, 1.08, 1],
                  y: 0,
                  opacity: 1,
                  rotate: gestureTick % 2 === 0 ? 0.8 : -0.8,
                }}
                transition={{
                  scale: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
                  rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                }}
                style={{ transformOrigin: '200px 140px' }}
              >
                {/* Signature Dual Water Stream Stem */}
                <path
                  d="M 200 420 C 192 340, 208 260, 198 190 C 196 165, 200 150, 200 140"
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="4.8"
                  strokeLinecap="round"
                />
                <path
                  d="M 200 420 C 208 340, 192 260, 202 190 C 204 165, 200 150, 200 140"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.4"
                  strokeOpacity="0.8"
                />

                {/* Goalkeeper Protective Light Arcs at Base (Reflejos y Protección) */}
                <g id="isaias-keeper-arcs">
                  <motion.path
                    d="M 196 195 C 155 185, 135 155, 125 125 C 145 140, 175 165, 196 180"
                    fill="url(#isaiasKeeperShield)"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    animate={{ rotate: gestureTick % 2 === 0 ? 0 : -2 }}
                    style={{ transformOrigin: '196px 195px' }}
                  />
                  <motion.path
                    d="M 204 195 C 245 185, 265 155, 275 125 C 255 140, 225 165, 204 180"
                    fill="url(#isaiasKeeperShield)"
                    stroke="#00E5FF"
                    strokeWidth="1.2"
                    animate={{ rotate: gestureTick % 2 === 1 ? 0 : 2 }}
                    style={{ transformOrigin: '204px 195px' }}
                  />
                </g>

                {/* Outer Oceanic Water Aura Wave */}
                <motion.circle
                  cx="200"
                  cy="140"
                  r="58"
                  fill="none"
                  stroke="#00B4D8"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                  strokeDasharray="4 5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '200px 140px' }}
                />

                {/* Tier 1: 4 Cardinal Oceanic Sapphire Petals */}
                {[0, 90, 180, 270].map((deg, i) => (
                  <g key={`sapphire-outer-${i}`} transform={`rotate(${deg} 200 140)`}>
                    <path
                      d="M 200 140 C 180 112, 175 72, 200 28 C 225 72, 220 112, 200 140 Z"
                      fill="url(#isaiasSapphireGrad)"
                      stroke="#023E8A"
                      strokeWidth="1"
                    />
                    <path
                      d="M 200 140 L 200 34"
                      stroke="#E0F7FA"
                      strokeWidth="1.2"
                      strokeOpacity="0.85"
                    />
                    <circle cx="200" cy="30" r="2" fill="#00E5FF" />
                  </g>
                ))}

                {/* Tier 2: 4 Diagonal Cyan Petals */}
                {[45, 135, 225, 315].map((deg, i) => (
                  <g key={`sapphire-mid-${i}`} transform={`rotate(${deg} 200 140)`}>
                    <path
                      d="M 200 140 C 185 118, 182 85, 200 42 C 218 85, 215 118, 200 140 Z"
                      fill="url(#isaiasCyanAccent)"
                      stroke="#0077B6"
                      strokeWidth="0.8"
                      opacity="0.95"
                    />
                  </g>
                ))}

                {/* Tier 3: Inner Spiral Lanceolate Corola */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`sapphire-inner-${i}`} transform={`rotate(${deg + 15} 200 140)`}>
                    <path
                      d="M 200 140 C 189 126, 188 105, 200 68 C 211 105, 210 126, 200 140 Z"
                      fill="#E0F7FA"
                      stroke="#48CAE4"
                      strokeWidth="0.75"
                    />
                  </g>
                ))}

                {/* Center: 20 Radiating Micro-stamen filaments (Easter Egg: número 20) */}
                {[...Array(20)].map((_, idx) => {
                  const d = (idx * 360) / 20;
                  return (
                    <g key={`isaias-stamen-${idx}`} transform={`rotate(${d} 200 140)`}>
                      <line x1="200" y1="140" x2="200" y2="124" stroke="#0077B6" strokeWidth="0.85" opacity="0.8" />
                      <circle cx="200" cy="123" r="1.4" fill={idx % 2 === 0 ? '#00E5FF' : '#90E0EF'} />
                    </g>
                  );
                })}

                {/* Sapphire Core Receptacle */}
                <circle cx="200" cy="140" r="13" fill="#0077B6" />
                <circle cx="200" cy="140" r="9.5" fill="#00B4D8" />

                {/* Warm Amber Honey Pearl in Center (Chocorramo / Tajadas secret glint) */}
                <circle cx="200" cy="140" r="6" fill="#F59E0B" />

                {/* Tender Heart Glint (Sutil afecto interior) */}
                <motion.circle
                  cx="200"
                  cy="140"
                  r="3.5"
                  fill="#FFFFFF"
                  animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.g>
            )}

            {/* =========================================================
                ARTISAN TRANSLUCENT WATER VELLUM WRAP & SAPPHIRE RIBBON
               ========================================================= */}
            {isStepAtLeast('water-wrap') && (
              <g id="isaias-bouquet-wrapping">
                {/* Left Translucent Aquatic Fold */}
                <motion.path
                  d="M 115 360 L 195 460 L 200 380 L 135 340 Z"
                  fill="url(#isaiasWrapGrad)"
                  stroke="#0284C7"
                  strokeWidth="1.2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.95 }}
                  transition={{ duration: 1.2 }}
                />
                {/* Right Translucent Aquatic Fold */}
                <motion.path
                  d="M 285 360 L 205 460 L 200 380 L 265 340 Z"
                  fill="url(#isaiasWrapGrad)"
                  stroke="#0284C7"
                  strokeWidth="1.2"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 0.95 }}
                  transition={{ duration: 1.2, delay: 0.15 }}
                />
                {/* Center Aquatic Collar */}
                <motion.path
                  d="M 155 375 L 200 465 L 245 375 Q 200 390 155 375"
                  fill="#031E3D"
                  stroke="#00E5FF"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />

                {/* Tied Aquatic Sapphire Ribbon */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isStepAtLeast('bouquet-complete') ? 1 : isStepAtLeast('center-blooms') ? 0.8 : 0,
                    opacity: isStepAtLeast('center-blooms') ? 1 : 0,
                  }}
                  transition={{ duration: 1.2 }}
                >
                  {/* Ribbon Knot at (200, 405) */}
                  <ellipse cx="200" cy="405" rx="14" ry="7" fill="url(#isaiasRibbonGrad)" stroke="#0077B6" strokeWidth="0.8" />
                  {/* Left Wavy Bow Loop */}
                  <path
                    d="M 190 405 C 160 395, 150 420, 190 410 Z"
                    fill="url(#isaiasRibbonGrad)"
                    stroke="#0077B6"
                    strokeWidth="0.8"
                  />
                  {/* Right Wavy Bow Loop */}
                  <path
                    d="M 210 405 C 240 395, 250 420, 210 410 Z"
                    fill="url(#isaiasRibbonGrad)"
                    stroke="#0077B6"
                    strokeWidth="0.8"
                  />
                  {/* Flowing Water Ribbon Ends */}
                  <path
                    d="M 195 410 Q 180 445 170 472 L 178 472 Q 188 445 198 412 Z"
                    fill="url(#isaiasRibbonGrad)"
                  />
                  <path
                    d="M 205 410 Q 220 445 230 472 L 222 472 Q 212 445 202 412 Z"
                    fill="url(#isaiasRibbonGrad)"
                  />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                AMBIENT WATER DROPS & NOCTURNAL SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="isaias-bouquet-sparks">
                {[
                  { x: 120, y: 170, color: '#00E5FF', size: 2.5, delay: 0.2 },
                  { x: 280, y: 165, color: '#38BDF8', size: 2.2, delay: 0.7 },
                  { x: 200, y: 75, color: '#E0F7FA', size: 2.8, delay: 1.1 },
                  { x: 160, y: 250, color: '#FDE047', size: 2.0, delay: 0.4 },
                  { x: 245, y: 245, color: '#67E8F9', size: 2.4, delay: 0.9 },
                  { x: 90, y: 290, color: '#FCD34D', size: 2.2, delay: 1.3 },
                  { x: 310, y: 290, color: '#90E0EF', size: 2.2, delay: 1.5 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`isaias-spark-${idx}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    animate={{
                      y: [-4, -20, -4],
                      opacity: [0.2, 0.9, 0.2],
                      scale: [0.9, 1.3, 0.9],
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      delay: s.delay,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </g>
            )}
          </svg>
        </div>

        {/* Tarjeta de lectura con el botón 'Leer' (Exclusivo para Isaías) */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.div
              id="tarjeta-lectura-isaias"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(3, 14, 33, 0.92)',
                borderColor: 'rgba(0, 229, 255, 0.35)',
              }}
            >
              <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[#0077B6]/50 border-[#00B4D8]/50 text-[#00E5FF]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#FAF8F5]">Texto Personal</h4>
                  <p className="text-xs text-[#90E0EF]">Palabras dedicadas por Ronald</p>
                </div>
              </div>
              <motion.button
                id="btn-isaias-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#00E5FF] hover:from-[#00B4D8] hover:to-[#90E0EF] text-[#030914] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(0,229,255,0.45)] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-inherit" />
                <span>Leer</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
