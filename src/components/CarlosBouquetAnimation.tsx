import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface CarlosBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'origami-folio'
  | 'slender-stems'
  | 'yellow-bloom-left'
  | 'yellow-bloom-right'
  | 'yellow-bloom-center'
  | 'spatha-cradle'
  | 'royal-crest-1'
  | 'royal-crest-2'
  | 'royal-crest-3'
  | 'amber-fire-wings'
  | 'solar-stamen-core'
  | 'braided-cord'
  | 'bouquet-complete';

export const CarlosBouquetAnimation: React.FC<CarlosBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'origami-folio'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('origami-folio');
    setIsCompleted(false);

    // Architectural, sequential cinematic master choreography for Carlos (~22 seconds)
    const t1 = setTimeout(() => setStep('slender-stems'), 2200);
    const t2 = setTimeout(() => setStep('yellow-bloom-left'), 4400);
    const t3 = setTimeout(() => setStep('yellow-bloom-right'), 6600);
    const t4 = setTimeout(() => setStep('yellow-bloom-center'), 8800);
    const t5 = setTimeout(() => setStep('spatha-cradle'), 11000);
    const t6 = setTimeout(() => setStep('royal-crest-1'), 12800);
    const t7 = setTimeout(() => setStep('royal-crest-2'), 14400);
    const t8 = setTimeout(() => setStep('royal-crest-3'), 16000);
    const t9 = setTimeout(() => setStep('amber-fire-wings'), 17500);
    const t10 = setTimeout(() => setStep('solar-stamen-core'), 19000);
    const t11 = setTimeout(() => setStep('braided-cord'), 20500);
    const t12 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 22000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
      clearTimeout(t12);
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsCompleted(false);
    setStep('origami-folio');
    setTimeout(() => setStep('slender-stems'), 2200);
    setTimeout(() => setStep('yellow-bloom-left'), 4400);
    setTimeout(() => setStep('yellow-bloom-right'), 6600);
    setTimeout(() => setStep('yellow-bloom-center'), 8800);
    setTimeout(() => setStep('spatha-cradle'), 11000);
    setTimeout(() => setStep('royal-crest-1'), 12800);
    setTimeout(() => setStep('royal-crest-2'), 14400);
    setTimeout(() => setStep('royal-crest-3'), 16000);
    setTimeout(() => setStep('amber-fire-wings'), 17500);
    setTimeout(() => setStep('solar-stamen-core'), 19000);
    setTimeout(() => setStep('braided-cord'), 20500);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 22000);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'origami-folio',
      'slender-stems',
      'yellow-bloom-left',
      'yellow-bloom-right',
      'yellow-bloom-center',
      'spatha-cradle',
      'royal-crest-1',
      'royal-crest-2',
      'royal-crest-3',
      'amber-fire-wings',
      'solar-stamen-core',
      'braided-cord',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="carlos-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Deep Royal Blue, Midnight Navy and Fiery Amber warmth */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#1D4ED8]/18 via-[#0F172A]/40 to-transparent blur-3xl opacity-85" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#F59E0B]/20 via-[#EA580C]/12 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1D4ED8_1px,transparent_1px)] [background-size:32px_32px] opacity-8" />
      </div>

      {/* Main Bouquet Card / Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[420px] sm:w-[420px] sm:h-[500px] flex items-center justify-center">
          <svg
            id="carlos-bouquet-svg"
            data-flower-stage="true"
            viewBox="0 0 500 520"
            className="w-full h-full overflow-visible drop-shadow-[0_6px_35px_rgba(29,78,216,0.3)]"
          >
            <defs>
              {/* =========================================================
                  CARLOS'S BESPOKE GRADIENTS & FILTERS
                 ========================================================= */}

              {/* 1. Architectural Carbon Origami Folio Gradients */}
              <linearGradient id="carlosOrigamiBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="carlosOrigamiFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="60%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="carlosOrigamiFacetRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="40%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0B132B" />
              </linearGradient>

              <linearGradient id="carlosOrigamiCenterFold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="50%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#09090B" />
              </linearGradient>

              {/* Copper Foil Origami Crease Lines */}
              <linearGradient id="carlosCopperCrease" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* 2. Braided Cord & Amber Talisman Gradients */}
              <linearGradient id="carlosBraidedRoyal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="40%" stopColor="#1D4ED8" />
                <stop offset="80%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="carlosBraidedAmber" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="75%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#9A3412" />
              </linearGradient>

              <linearGradient id="carlosAmberTalisman" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>

              {/* 3. Stems & Base Yellow Flora Gradients */}
              <linearGradient id="carlosDarkStem" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="40%" stopColor="#0F2840" />
                <stop offset="80%" stopColor="#142B28" />
                <stop offset="100%" stopColor="#0B132B" />
              </linearGradient>

              <linearGradient id="carlosBellLilyYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="carlosSunRanunculus" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="carlosAccentYellowCenter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="30%" stopColor="#FACC15" />
                <stop offset="70%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>

              <linearGradient id="carlosHoneyCanaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="carlosWarmSaffronGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* 4. CARLOS'S UNIQUE PROTAGONIST: AVE DEL PARAÍSO ASTRAL (STRELITZIA) */}
              {/* Spatha / Boat-shaped Bract */}
              <linearGradient id="carlosSpathaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="35%" stopColor="#0F172A" />
                <stop offset="75%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <linearGradient id="carlosSpathaRim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>

              {/* Royal Blue Soaring Crest Sepals */}
              <linearGradient id="carlosRoyalCrest1Grad" x1="0%" y1="100%" x2="60%" y2="0%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="25%" stopColor="#1D4ED8" />
                <stop offset="65%" stopColor="#2563EB" />
                <stop offset="90%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>

              <linearGradient id="carlosRoyalCrest2Grad" x1="10%" y1="100%" x2="90%" y2="0%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="30%" stopColor="#1E40AF" />
                <stop offset="70%" stopColor="#3B82F6" />
                <stop offset="95%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>

              <linearGradient id="carlosRoyalCrest3Grad" x1="20%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="35%" stopColor="#1D4ED8" />
                <stop offset="75%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>

              {/* Radiant Amber & Fiery Orange Corolla Wings */}
              <linearGradient id="carlosAmberFlame1Grad" x1="0%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#7C2D12" />
                <stop offset="25%" stopColor="#EA580C" />
                <stop offset="60%" stopColor="#F97316" />
                <stop offset="85%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>

              <linearGradient id="carlosAmberFlame2Grad" x1="10%" y1="100%" x2="90%" y2="0%">
                <stop offset="0%" stopColor="#9A3412" />
                <stop offset="30%" stopColor="#C2410C" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="90%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FFFBEB" />
              </linearGradient>

              <linearGradient id="carlosAmberFlame3Grad" x1="0%" y1="100%" x2="30%" y2="0%">
                <stop offset="0%" stopColor="#431407" />
                <stop offset="35%" stopColor="#EA580C" />
                <stop offset="75%" stopColor="#FB923C" />
                <stop offset="100%" stopColor="#FED7AA" />
              </linearGradient>

              {/* Solar Stamen Core & Heart Gem */}
              <linearGradient id="carlosSolarGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="carlosSolarGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* =========================================================
                PHASE 1: ARCHITECTURAL CARBON ORIGAMI FOLIO (BACK)
               ========================================================= */}
            {isStepAtLeast('origami-folio') && (
              <g id="carlos-origami-folio-back">
                {/* Back Facet Shield */}
                <motion.polygon
                  points="160,290 250,260 340,290 300,500 200,500"
                  fill="url(#carlosOrigamiBack)"
                  initial={{ opacity: 0, scaleY: 0, transformOrigin: '250px 500px' }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Left Geometric Facet */}
                <motion.polygon
                  points="130,305 250,335 200,500 145,430"
                  fill="url(#carlosOrigamiFacetLeft)"
                  initial={{ opacity: 0, scaleX: 0, transformOrigin: '250px 420px' }}
                  animate={{ opacity: 0.95, scaleX: 1 }}
                  transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
                />

                {/* Right Geometric Facet */}
                <motion.polygon
                  points="370,305 250,335 300,500 355,430"
                  fill="url(#carlosOrigamiFacetRight)"
                  initial={{ opacity: 0, scaleX: 0, transformOrigin: '250px 420px' }}
                  animate={{ opacity: 0.95, scaleX: 1 }}
                  transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
                />

                {/* Origami Copper Inset Crease Lines */}
                <motion.line
                  x1="130"
                  y1="305"
                  x2="250"
                  y2="335"
                  stroke="url(#carlosCopperCrease)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.8 }}
                />
                <motion.line
                  x1="370"
                  y1="305"
                  x2="250"
                  y2="335"
                  stroke="url(#carlosCopperCrease)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.9 }}
                />
              </g>
            )}

            {/* =========================================================
                PHASE 2: SLENDER GRAPHITE-EMERALD STEMS & FOLIAGE
               ========================================================= */}
            {isStepAtLeast('slender-stems') && (
              <g id="carlos-stems-group">
                {/* Central Primary Strelitzia Stem */}
                <motion.path
                  d="M 250 490 C 248 420, 240 340, 215 270"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />

                {/* Stems to Elevated Background Flowers (120, 185) & (380, 185) */}
                <motion.path
                  d="M 240 480 C 195 380, 140 270, 120 185"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 1.6, delay: 0.15, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 260 480 C 305 380, 360 270, 380 185"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 1.6, delay: 0.2, ease: 'easeInOut' }}
                />

                {/* Stems to Mid-Flank Flowers (135, 250) & (365, 250) */}
                <motion.path
                  d="M 245 480 C 210 390, 160 310, 135 250"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 1.6, delay: 0.25, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 255 480 C 290 390, 340 310, 365 250"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.95 }}
                  transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }}
                />

                {/* Stems to Far-Outer Flanks (75, 275) & (425, 275) */}
                <motion.path
                  d="M 235 480 C 165 410, 105 330, 75 275"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.5, delay: 0.35, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 265 480 C 335 410, 395 330, 425 275"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: 'easeInOut' }}
                />

                {/* Stems to Foreground Front Flowers (185, 325), (315, 325) & (250, 310) */}
                <motion.path
                  d="M 245 475 C 225 420, 200 370, 185 325"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.0"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.4, delay: 0.45, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 255 475 C 275 420, 300 370, 315 325"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.0"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M 250 480 C 250 420, 250 360, 250 310"
                  fill="none"
                  stroke="url(#carlosDarkStem)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.9 }}
                  transition={{ duration: 1.4, delay: 0.52, ease: 'easeInOut' }}
                />

                {/* Botanical Foliage & Fronds in Deep Slate-Navy with Royal Blue Trim */}
                <motion.path
                  d="M 135 240 C 90 200, 60 235, 45 205 C 75 190, 120 210, 145 235 Z"
                  fill="#0B132B"
                  stroke="#1D4ED8"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ duration: 1.3, delay: 0.55 }}
                />
                <motion.path
                  d="M 365 240 C 410 200, 440 235, 455 205 C 425 190, 380 210, 355 235 Z"
                  fill="#0B132B"
                  stroke="#1D4ED8"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                  transition={{ duration: 1.3, delay: 0.6 }}
                />
                <motion.path
                  d="M 160 350 C 120 330, 80 365, 65 335 C 95 320, 140 330, 170 345 Z"
                  fill="#0B132B"
                  stroke="#1D4ED8"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ duration: 1.2, delay: 0.65 }}
                />
                <motion.path
                  d="M 340 350 C 380 330, 420 365, 435 335 C 405 320, 360 330, 330 345 Z"
                  fill="#0B132B"
                  stroke="#1D4ED8"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ duration: 1.2, delay: 0.7 }}
                />
              </g>
            )}

            {/* =========================================================
                PHASE 3: 9 GRAND VISIBLE YELLOW FLOWERS (RAMO ABUNDANTE)
               ========================================================= */}

            {/* --- LEFT WING CLUSTER (FLORES 1, 3, 5) --- */}
            {isStepAtLeast('yellow-bloom-left') && (
              <g id="carlos-yellow-bloom-left-group">
                {/* FLOR 1: Gran Dalia Solar Superior Izquierda (at x: 120, y: 185) */}
                <g id="carlos-yellow-flower-1" transform="translate(120, 185) rotate(-20)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 10 Grandes Pétalos Lanceolados Exteriores */}
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <path
                        key={`f1-outer-${i}`}
                        d="M 0 0 C -10 -15, -7 -34, 0 -38 C 7 -34, 10 -15, 0 0 Z"
                        fill="url(#carlosBellLilyYellow)"
                        stroke="#D97706"
                        strokeWidth="0.75"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 5 Pétalos Interiores */}
                    {[18, 90, 162, 234, 306].map((deg, i) => (
                      <path
                        key={`f1-inner-${i}`}
                        d="M 0 0 C -7 -10, -5 -22, 0 -25 C 5 -22, 7 -10, 0 0 Z"
                        fill="url(#carlosHoneyCanaryGrad)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Central Ámbar y Corona de Polen */}
                    <circle cx="0" cy="0" r="10" fill="url(#carlosAmberFlame1Grad)" stroke="#FEF08A" strokeWidth="1.2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <circle
                          key={`f1-pol-${i}`}
                          cx={Math.cos(rad) * 13}
                          cy={Math.sin(rad) * 13}
                          r="1.6"
                          fill="#FEF08A"
                        />
                      );
                    })}
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>

                {/* FLOR 3: Gran Ranúnculo Dorado Flanco Izquierdo (at x: 135, y: 250) */}
                <g id="carlos-yellow-flower-3" transform="translate(135, 250) rotate(-15)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 8 Pétalos Anchos de Concha Exteriores (Diámetro 84px) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <path
                        key={`f3-outer-${i}`}
                        d="M 0 0 C -18 -16, -16 -38, 0 -42 C 16 -38, 18 -16, 0 0 Z"
                        fill="url(#carlosSunRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.8"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 8 Pétalos Intermedios en Espiral */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                      <path
                        key={`f3-mid-${i}`}
                        d="M 0 0 C -13 -12, -11 -28, 0 -31 C 11 -28, 13 -12, 0 0 Z"
                        fill="url(#carlosBellLilyYellow)"
                        stroke="#D97706"
                        strokeWidth="0.7"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Central Miel-Caramelo */}
                    <circle cx="0" cy="0" r="11" fill="url(#carlosAccentYellowCenter)" stroke="#92400E" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="6" fill="#B45309" />
                    <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                  </motion.g>
                </g>

                {/* FLOR 5: Anémona Amarilla Silvestre Flanco Exterior (at x: 75, y: 275) */}
                <g id="carlos-yellow-flower-5" transform="translate(75, 275) rotate(-32)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 6 Grandes Pétalos Festoneados */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <path
                        key={`f5-outer-${i}`}
                        d="M 0 0 C -16 -12, -14 -32, 0 -36 C 14 -32, 16 -12, 0 0 Z"
                        fill="url(#carlosBellLilyYellow)"
                        stroke="#D97706"
                        strokeWidth="0.75"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 6 Pétalos de Copa Interior */}
                    {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                      <path
                        key={`f5-inner-${i}`}
                        d="M 0 0 C -11 -8, -9 -22, 0 -25 C 9 -22, 11 -8, 0 0 Z"
                        fill="url(#carlosHoneyCanaryGrad)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Estambres y Anteras */}
                    {[15, 75, 135, 195, 255, 315].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <g key={`f5-sta-${i}`}>
                          <line x1="0" y1="0" x2={Math.cos(rad) * 20} y2={Math.sin(rad) * 20} stroke="#CA8A04" strokeWidth="1" />
                          <circle cx={Math.cos(rad) * 20} cy={Math.sin(rad) * 20} r="2" fill="#78350F" />
                        </g>
                      );
                    })}
                    <circle cx="0" cy="0" r="9" fill="#D97706" stroke="#FEF08A" strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* --- RIGHT WING CLUSTER (FLORES 2, 4, 6) --- */}
            {isStepAtLeast('yellow-bloom-right') && (
              <g id="carlos-yellow-bloom-right-group">
                {/* FLOR 2: Gran Dalia Azafrán Superior Derecha (at x: 380, y: 185) */}
                <g id="carlos-yellow-flower-2" transform="translate(380, 185) rotate(22)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 10 Grandes Pétalos Lanceolados Azafrán */}
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <path
                        key={`f2-outer-${i}`}
                        d="M 0 0 C -10 -15, -7 -34, 0 -38 C 7 -34, 10 -15, 0 0 Z"
                        fill="url(#carlosWarmSaffronGrad)"
                        stroke="#D97706"
                        strokeWidth="0.75"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 5 Pétalos Interiores */}
                    {[18, 90, 162, 234, 306].map((deg, i) => (
                      <path
                        key={`f2-inner-${i}`}
                        d="M 0 0 C -7 -10, -5 -22, 0 -25 C 5 -22, 7 -10, 0 0 Z"
                        fill="url(#carlosBellLilyYellow)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Central Ámbar-Miel y Corona de Polen */}
                    <circle cx="0" cy="0" r="10" fill="url(#carlosAmberFlame2Grad)" stroke="#FEF08A" strokeWidth="1.2" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <circle
                          key={`f2-pol-${i}`}
                          cx={Math.cos(rad) * 13}
                          cy={Math.sin(rad) * 13}
                          r="1.6"
                          fill="#FDE047"
                        />
                      );
                    })}
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>

                {/* FLOR 4: Gran Rosa Solar Flanco Derecho (at x: 365, y: 250) */}
                <g id="carlos-yellow-flower-4" transform="translate(365, 250) rotate(18)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 8 Pétalos Anchos de Concha Exteriores (Diámetro 84px) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <path
                        key={`f4-outer-${i}`}
                        d="M 0 0 C -18 -16, -16 -38, 0 -42 C 16 -38, 18 -16, 0 0 Z"
                        fill="url(#carlosHoneyCanaryGrad)"
                        stroke="#B45309"
                        strokeWidth="0.8"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 8 Pétalos Intermedios en Espiral */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                      <path
                        key={`f4-mid-${i}`}
                        d="M 0 0 C -13 -12, -11 -28, 0 -31 C 11 -28, 13 -12, 0 0 Z"
                        fill="url(#carlosWarmSaffronGrad)"
                        stroke="#D97706"
                        strokeWidth="0.7"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Central Ámbar Vivo */}
                    <circle cx="0" cy="0" r="11" fill="url(#carlosAmberFlame1Grad)" stroke="#92400E" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="6" fill="#D97706" />
                    <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                  </motion.g>
                </g>

                {/* FLOR 6: Lirio Solar Silvestre Flanco Exterior (at x: 425, y: 275) */}
                <g id="carlos-yellow-flower-6" transform="translate(425, 275) rotate(32)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 6 Grandes Pétalos Arqueados */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <path
                        key={`f6-outer-${i}`}
                        d="M 0 0 C -16 -12, -14 -32, 0 -36 C 14 -32, 16 -12, 0 0 Z"
                        fill="url(#carlosWarmSaffronGrad)"
                        stroke="#D97706"
                        strokeWidth="0.75"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 6 Pétalos de Copa Interior */}
                    {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                      <path
                        key={`f6-inner-${i}`}
                        d="M 0 0 C -11 -8, -9 -22, 0 -25 C 9 -22, 11 -8, 0 0 Z"
                        fill="url(#carlosSunRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Estambres y Anteras */}
                    {[15, 75, 135, 195, 255, 315].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <g key={`f6-sta-${i}`}>
                          <line x1="0" y1="0" x2={Math.cos(rad) * 20} y2={Math.sin(rad) * 20} stroke="#CA8A04" strokeWidth="1" />
                          <circle cx={Math.cos(rad) * 20} cy={Math.sin(rad) * 20} r="2" fill="#78350F" />
                        </g>
                      );
                    })}
                    <circle cx="0" cy="0" r="9" fill="#B45309" stroke="#FEF08A" strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* --- CENTER & FOREGROUND CLUSTER (FLORES 7, 8, 9) --- */}
            {isStepAtLeast('yellow-bloom-center') && (
              <g id="carlos-yellow-bloom-center-group">
                {/* FLOR 9: Gran Cáliz de Loto Dorado Centro-Frente (at x: 250, y: 310) */}
                <g id="carlos-yellow-flower-9" transform="translate(250, 310)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.3, ease: 'easeOut' }}
                  >
                    {/* 8 Pétalos de Estrella Solar Exteriores (Diámetro 72px) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <path
                        key={`f9-outer-${i}`}
                        d="M 0 0 C -14 -14, -10 -32, 0 -36 C 10 -32, 14 -14, 0 0 Z"
                        fill="url(#carlosAccentYellowCenter)"
                        stroke="#B45309"
                        strokeWidth="0.75"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 8 Pétalos Interiores Alternos */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                      <path
                        key={`f9-inner-${i}`}
                        d="M 0 0 C -10 -10, -8 -24, 0 -27 C 8 -24, 10 -10, 0 0 Z"
                        fill="url(#carlosHoneyCanaryGrad)"
                        stroke="#D97706"
                        strokeWidth="0.65"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Núcleo de Fuego Solar */}
                    <circle
                      cx="0"
                      cy="0"
                      r="10"
                      fill="url(#carlosAmberFlame1Grad)"
                      stroke="#FEF08A"
                      strokeWidth="1.4"
                    />
                    <circle cx="0" cy="0" r="5" fill="#FEF9C3" />
                  </motion.g>
                </g>

                {/* FLOR 7: Gran Peonía Dorada Frontal Izquierda (at x: 185, y: 325) */}
                <g id="carlos-yellow-flower-7" transform="translate(185, 325) rotate(-8)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 8 Grandes Pétalos Exteriores (Diámetro 80px) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <path
                        key={`f7-outer-${i}`}
                        d="M 0 0 C -17 -15, -15 -36, 0 -40 C 15 -36, 17 -15, 0 0 Z"
                        fill="url(#carlosHoneyCanaryGrad)"
                        stroke="#B45309"
                        strokeWidth="0.8"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 8 Pétalos Intermedios */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                      <path
                        key={`f7-mid-${i}`}
                        d="M 0 0 C -12 -11, -10 -27, 0 -30 C 10 -27, 12 -11, 0 0 Z"
                        fill="url(#carlosBellLilyYellow)"
                        stroke="#D97706"
                        strokeWidth="0.7"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 4 Pétalos de Botón */}
                    {[15, 105, 195, 285].map((deg, i) => (
                      <path
                        key={`f7-core-${i}`}
                        d="M 0 0 C -8 -7, -7 -18, 0 -20 C 7 -18, 8 -7, 0 0 Z"
                        fill="#FEF08A"
                        stroke="#F59E0B"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Caramelo */}
                    <circle cx="0" cy="0" r="10" fill="url(#carlosAmberFlame1Grad)" stroke="#FEF08A" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>

                {/* FLOR 8: Gran Rosa Dorada Frontal Derecha (at x: 315, y: 325) */}
                <g id="carlos-yellow-flower-8" transform="translate(315, 325) rotate(8)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* 8 Grandes Pétalos Exteriores (Diámetro 80px) */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <path
                        key={`f8-outer-${i}`}
                        d="M 0 0 C -17 -15, -15 -36, 0 -40 C 15 -36, 17 -15, 0 0 Z"
                        fill="url(#carlosSunRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.8"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 8 Pétalos Intermedios */}
                    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                      <path
                        key={`f8-mid-${i}`}
                        d="M 0 0 C -12 -11, -10 -27, 0 -30 C 10 -27, 12 -11, 0 0 Z"
                        fill="url(#carlosWarmSaffronGrad)"
                        stroke="#D97706"
                        strokeWidth="0.7"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* 4 Pétalos de Botón */}
                    {[15, 105, 195, 285].map((deg, i) => (
                      <path
                        key={`f8-core-${i}`}
                        d="M 0 0 C -8 -7, -7 -18, 0 -20 C 7 -18, 8 -7, 0 0 Z"
                        fill="#FEF08A"
                        stroke="#F59E0B"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Botón Caramelo */}
                    <circle cx="0" cy="0" r="10" fill="url(#carlosAmberFlame2Grad)" stroke="#FEF08A" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="4" fill="#FEF9C3" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                PHASE 4: CARLOS'S SIGNATURE PROTAGONIST FLOWER
                AVE DEL PARAÍSO ASTRAL (STRELITZIA CELESTIAL)
               ========================================================= */}

            {/* 1. The Obsidian & Amber Spatha (Boat-shaped Bract Cradle) */}
            {isStepAtLeast('spatha-cradle') && (
              <g id="carlos-strelitzia-spatha">
                {/* Horizontal Sculpted Hull */}
                <motion.path
                  d="M 165 275 C 190 282, 250 275, 345 220 C 315 250, 245 298, 170 288 C 160 285, 155 278, 165 275 Z"
                  fill="url(#carlosSpathaGrad)"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0, x: -30 }}
                  animate={{ pathLength: 1, opacity: 1, x: 0 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Glowing Amber Keel Edge */}
                <motion.path
                  d="M 165 275 C 220 280, 275 255, 345 220"
                  fill="none"
                  stroke="url(#carlosSpathaRim)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#carlosSolarGlow)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.4 }}
                />

                {/* Subtle Inner Obsidian Shadow Depth */}
                <motion.path
                  d="M 180 273 C 225 275, 270 255, 330 228 C 300 245, 250 275, 185 278 Z"
                  fill="#000000"
                  opacity="0.65"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  transition={{ duration: 1.0, delay: 0.7 }}
                />
              </g>
            )}

            {/* 2. Royal Blue Lancet Crest 1 (The Tall Soaring Spine) */}
            {isStepAtLeast('royal-crest-1') && (
              <g id="carlos-royal-crest-1">
                <motion.path
                  d="M 210 265 C 185 200, 165 125, 220 35 C 235 105, 240 185, 225 260 Z"
                  fill="url(#carlosRoyalCrest1Grad)"
                  stroke="#93C5FD"
                  strokeWidth="1"
                  initial={{ scaleY: 0, opacity: 0, transformOrigin: '215px 265px' }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Luminous Azure Spine Filament */}
                <motion.path
                  d="M 215 255 C 198 190, 185 130, 220 35"
                  fill="none"
                  stroke="#93C5FD"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.5 }}
                />
              </g>
            )}

            {/* 3. Royal Blue Lancet Crest 2 (Diagonal Skyward Wing) */}
            {isStepAtLeast('royal-crest-2') && (
              <g id="carlos-royal-crest-2">
                <motion.path
                  d="M 225 258 C 245 195, 280 120, 335 55 C 305 130, 275 195, 235 262 Z"
                  fill="url(#carlosRoyalCrest2Grad)"
                  stroke="#60A5FA"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0, transformOrigin: '230px 260px' }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Electric Cyan Edge Reflection */}
                <motion.path
                  d="M 230 250 C 255 185, 290 120, 335 55"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 0.4 }}
                />
              </g>
            )}

            {/* 4. Royal Blue Lancet Crest 3 (Forward Sweeping Wing) */}
            {isStepAtLeast('royal-crest-3') && (
              <g id="carlos-royal-crest-3">
                <motion.path
                  d="M 200 270 C 160 225, 125 170, 140 85 C 170 150, 195 210, 212 265 Z"
                  fill="url(#carlosRoyalCrest3Grad)"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0, transformOrigin: '205px 268px' }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Blue Stardust Ridge */}
                <motion.path
                  d="M 205 260 C 175 210, 145 155, 140 85"
                  fill="none"
                  stroke="#BAE6FD"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              </g>
            )}

            {/* 5. Radiant Amber & Fiery Orange Corolla Wings (Erupting Through the Sepals) */}
            {isStepAtLeast('amber-fire-wings') && (
              <g id="carlos-amber-fire-wings">
                {/* Center Fiery Amber Feather */}
                <motion.path
                  d="M 218 252 C 210 185, 192 135, 205 75 C 222 130, 228 188, 224 248 Z"
                  fill="url(#carlosAmberFlame1Grad)"
                  stroke="#FEF08A"
                  strokeWidth="1"
                  filter="url(#carlosSolarGlow)"
                  initial={{ scaleY: 0, opacity: 0, transformOrigin: '220px 250px' }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Right Cadmium Orange Plume */}
                <motion.path
                  d="M 226 250 C 250 178, 288 128, 305 80 C 286 142, 258 195, 232 248 Z"
                  fill="url(#carlosAmberFlame2Grad)"
                  stroke="#FDE047"
                  strokeWidth="1"
                  filter="url(#carlosSolarGlow)"
                  initial={{ scale: 0, opacity: 0, transformOrigin: '228px 250px' }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Left Solar Amber Plume */}
                <motion.path
                  d="M 212 256 C 185 208, 172 160, 168 118 C 188 160, 205 205, 218 252 Z"
                  fill="url(#carlosAmberFlame3Grad)"
                  stroke="#FB923C"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0, transformOrigin: '215px 254px' }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Golden Spine Veins */}
                <motion.path
                  d="M 220 248 C 214 185, 202 135, 205 75"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.6 }}
                />
              </g>
            )}

            {/* 6. The Solar Astral Core & Black-Gold Stamen Crown */}
            {isStepAtLeast('solar-stamen-core') && (
              <g id="carlos-solar-stamen-core" transform="translate(222, 252)">
                {/* Black Stamen Filaments */}
                {[
                  { x2: -15, y2: -35, stroke: '#111827', tip: '#FEF08A' },
                  { x2: -5, y2: -45, stroke: '#1E293B', tip: '#F59E0B' },
                  { x2: 8, y2: -48, stroke: '#0F172A', tip: '#F97316' },
                  { x2: 20, y2: -38, stroke: '#111827', tip: '#FEF08A' },
                ].map((s, i) => (
                  <motion.g
                    key={`stamen-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2={s.x2}
                      y2={s.y2}
                      stroke={s.stroke}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={s.x2}
                      cy={s.y2}
                      r="2.8"
                      fill={s.tip}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                    />
                  </motion.g>
                ))}

                {/* Radiant Amber Solar Heart Cabochon */}
                <motion.circle
                  cx="0"
                  cy="0"
                  r="9"
                  fill="url(#carlosSolarGemGrad)"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  filter="url(#carlosSolarGlow)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                  }}
                />

                {/* Radiating Micro-Sparks */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <motion.line
                    key={`spark-${i}`}
                    x1="0"
                    y1="0"
                    x2="15"
                    y2="0"
                    stroke="#FEF08A"
                    strokeWidth="1"
                    strokeLinecap="round"
                    transform={`rotate(${deg})`}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </g>
            )}

            {/* =========================================================
                PHASE 5: FRONT ORIGAMI FOLDS & BRAIDED CORD WITH TALISMAN
               ========================================================= */}
            {isStepAtLeast('braided-cord') && (
              <g id="carlos-braided-cord-group">
                {/* Front Origami Lapel (Carbon & Royal Blue) */}
                <motion.polygon
                  points="190,360 250,420 310,360 285,495 215,495"
                  fill="url(#carlosOrigamiCenterFold)"
                  stroke="#1D4ED8"
                  strokeWidth="1"
                  initial={{ opacity: 0, scaleY: 0, transformOrigin: '250px 495px' }}
                  animate={{ opacity: 0.98, scaleY: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Copper Lapel Inset Seams */}
                <motion.line
                  x1="190"
                  y1="360"
                  x2="250"
                  y2="420"
                  stroke="url(#carlosCopperCrease)"
                  strokeWidth="1.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0 }}
                />
                <motion.line
                  x1="310"
                  y1="360"
                  x2="250"
                  y2="420"
                  stroke="url(#carlosCopperCrease)"
                  strokeWidth="1.8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.1 }}
                />

                {/* Double Braided Cord: Royal Blue Cord */}
                <motion.path
                  d="M 175 425 C 215 440, 285 440, 325 425"
                  fill="none"
                  stroke="url(#carlosBraidedRoyal)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />

                {/* Double Braided Cord: Burnt Amber Cord */}
                <motion.path
                  d="M 178 433 C 215 448, 285 448, 322 433"
                  fill="none"
                  stroke="url(#carlosBraidedAmber)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
                />

                {/* Braided Cord Knot Center */}
                <motion.circle
                  cx="250"
                  cy="442"
                  r="6"
                  fill="#0F172A"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />

                {/* Hanging Cord Tassels */}
                <motion.path
                  d="M 247 444 C 242 465, 235 480, 232 505"
                  fill="none"
                  stroke="url(#carlosBraidedRoyal)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.7 }}
                />
                <motion.path
                  d="M 253 444 C 258 465, 265 480, 268 505"
                  fill="none"
                  stroke="url(#carlosBraidedAmber)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.8 }}
                />

                {/* Tassel End Weights in Gold */}
                <motion.circle
                  cx="232"
                  cy="506"
                  r="3.5"
                  fill="#F59E0B"
                  stroke="#FEF08A"
                  strokeWidth="1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                />
                <motion.circle
                  cx="268"
                  cy="506"
                  r="3.5"
                  fill="#1D4ED8"
                  stroke="#93C5FD"
                  strokeWidth="1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                />

                {/* Hexagonal Polished Amber Talisman Brooch */}
                <motion.g
                  transform="translate(250, 442)"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Outer Gold Metal Bezel */}
                  <polygon
                    points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6"
                    fill="#B45309"
                    stroke="#FEF08A"
                    strokeWidth="1.2"
                  />
                  {/* Inner Glowing Amber Facet */}
                  <polygon
                    points="0,-9 7.8,-4.5 7.8,4.5 0,9 -7.8,4.5 -7.8,-4.5"
                    fill="url(#carlosAmberTalisman)"
                  />
                  {/* Central Specular Dot */}
                  <circle cx="-2" cy="-2" r="1.8" fill="#FFFFFF" opacity="0.9" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                AMBIENT DUSK STARDUST & SPARKS (ROYAL BLUE & AMBER)
               ========================================================= */}
            {isCompleted && (
              <g id="carlos-floating-stardust">
                {[
                  { x: 140, y: 150, color: '#F59E0B', size: 2.2, delay: 0.2 },
                  { x: 330, y: 140, color: '#38BDF8', size: 2.6, delay: 0.6 },
                  { x: 220, y: 40, color: '#FEF08A', size: 3.0, delay: 1.0 },
                  { x: 175, y: 230, color: '#F97316', size: 2.4, delay: 0.4 },
                  { x: 285, y: 225, color: '#1D4ED8', size: 2.5, delay: 0.8 },
                  { x: 110, y: 280, color: '#FBBF24', size: 2.0, delay: 1.3 },
                  { x: 370, y: 280, color: '#60A5FA', size: 2.4, delay: 1.5 },
                  { x: 250, y: 110, color: '#FFFFFF', size: 2.8, delay: 1.7 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`carlos-spark-${idx}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    animate={{
                      y: [-4, -18, -4],
                      opacity: [0.25, 0.95, 0.25],
                      scale: [0.9, 1.35, 0.9],
                    }}
                    transition={{
                      duration: 3.2,
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

        {/* Minimalist & Direct Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full px-4">
          {isCompleted && (
            <>
              {/* Replay Formation Button */}
              <motion.button
                id="btn-carlos-replay-formation"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.4 }}
                title="Repetir animación"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#0F172A]/85 hover:bg-[#1E293B] border border-white/20 text-[#93C5FD] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#F59E0B]" />
              </motion.button>

              {/* Guardar Flor Button */}
              <SaveFlowerButton
                userName="Carlos"
                stageContainerId="carlos-bouquet-container"
                animationDurationMs={22000}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(245, 158, 11, 0.28)"
              />

              {/* Direct Read Button */}
              <motion.button
                id="btn-carlos-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(29,78,216,0.35)] backdrop-blur-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#F59E0B]" />
                <span>Leer</span>
                <ArrowRight className="w-4 h-4 text-white/70 stroke-[2.2]" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
