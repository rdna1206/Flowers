import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface GabrielBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'aurora-glow'
  | 'yellow-stems-and-leaves'
  | 'yellow-blooms-opening'
  | 'blue-black-aura-awakens'
  | 'blue-black-outer-unfold'
  | 'blue-black-mid-unfold'
  | 'blue-black-inner-unfold'
  | 'blue-black-corona-unfold'
  | 'number-13-reveal'
  | 'bouquet-complete';

export const GabrielBouquetAnimation: React.FC<GabrielBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'aurora-glow'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  const startChoreography = () => {
    clearAllTimers();
    setStep('aurora-glow');
    setIsCompleted(false);

    const timers = [
      setTimeout(() => setStep('yellow-stems-and-leaves'), 1200),
      setTimeout(() => setStep('yellow-blooms-opening'), 2800),
      setTimeout(() => setStep('blue-black-aura-awakens'), 5000),
      setTimeout(() => setStep('blue-black-outer-unfold'), 6600),
      setTimeout(() => setStep('blue-black-mid-unfold'), 8800),
      setTimeout(() => setStep('blue-black-inner-unfold'), 10800),
      setTimeout(() => setStep('blue-black-corona-unfold'), 12600),
      setTimeout(() => setStep('number-13-reveal'), 14200),
      setTimeout(() => {
        setStep('bouquet-complete');
        setIsCompleted(true);
      }, 15800),
    ];

    timerRefs.current = timers;
  };

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    startChoreography();

    return () => {
      clearAllTimers();
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    startChoreography();
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'aurora-glow',
      'yellow-stems-and-leaves',
      'yellow-blooms-opening',
      'blue-black-aura-awakens',
      'blue-black-outer-unfold',
      'blue-black-mid-unfold',
      'blue-black-inner-unfold',
      'blue-black-corona-unfold',
      'number-13-reveal',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="gabriel-bouquet-container"
      className="relative z-10 w-full min-h-[85vh] flex flex-col items-center justify-center py-6 sm:py-10 px-3 sm:px-6 overflow-hidden transition-all duration-1000 select-none"
      style={{
        background:
          'radial-gradient(circle at 50% 38%, rgba(37, 99, 235, 0.28) 0%, rgba(250, 204, 21, 0.14) 42%, rgba(8, 12, 20, 0.98) 85%)',
      }}
    >
      {/* Background Ambient Particles & Atmospheric Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-[95px] bg-blue-600/25 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full blur-[80px] bg-yellow-500/15 pointer-events-none"
        />
      </div>

      {/* Main Vector Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <div className="relative w-full flex items-center justify-center">
          <svg
            viewBox="0 0 400 520"
            className="w-full h-auto max-w-[360px] sm:max-w-[420px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* =========================================================
                  LIGHTING, SHADOW & GLOW FILTERS
                 ========================================================= */}
              <filter id="gabrielGlow13" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="gabrielDropShadow3D" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.9" />
              </filter>
              <filter id="gabrielPetalShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#020617" floodOpacity="0.85" />
              </filter>

              {/* =========================================================
                  YELLOW BLOOMS GRADIENTS
                 ========================================================= */}
              <radialGradient id="gabrielYellowSunburst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#FACC15" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>

              <radialGradient id="gabrielYellowPetalSoft" cx="50%" cy="20%" r="80%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="60%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </radialGradient>

              <radialGradient id="gabrielYellowCenter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              {/* =========================================================
                  GABRIEL'S SIGNATURE BLUE & BLACK SPECIAL FLOWER GRADIENTS
                 ========================================================= */}
              <radialGradient id="gabrielBlueBlackAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#1E40AF" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#0F172A" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="gabrielOuterPetalGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="25%" stopColor="#0F172A" />
                <stop offset="55%" stopColor="#1D4ED8" />
                <stop offset="82%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="gabrielMidPetalGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="30%" stopColor="#1E40AF" />
                <stop offset="65%" stopColor="#2563EB" />
                <stop offset="90%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <radialGradient id="gabrielInnerPetalGrad" cx="50%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="45%" stopColor="#3B82F6" />
                <stop offset="80%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <linearGradient id="gabrielCoronaPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <radialGradient id="gabrielCoreDisc" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="60%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              {/* =========================================================
                  FOLIAGE & WRAP GRADIENTS
                 ========================================================= */}
              <linearGradient id="gabrielLeafEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="60%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="gabrielWrapCone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="gabrielWrapGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>

            {/* Layer 1: Stems & Foliage */}
            {isStepAtLeast('yellow-stems-and-leaves') && (
              <g id="gabriel-foliage-layer">
                {/* Bouquet stems growing */}
                <motion.path
                  d="M 200,480 Q 190,360 140,230"
                  stroke="#047857"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200,480 Q 210,360 260,230"
                  stroke="#047857"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200,480 Q 180,380 100,280"
                  stroke="#065F46"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200,480 Q 220,380 300,280"
                  stroke="#065F46"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200,480 Q 170,390 145,340"
                  stroke="#064E3B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.25, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200,480 Q 230,390 255,340"
                  stroke="#064E3B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                />

                {/* Leaves Unfolding */}
                <motion.path
                  d="M 160,340 C 110,310 80,260 95,210 C 125,230 150,290 160,340 Z"
                  fill="url(#gabrielLeafEmerald)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  style={{ transformOrigin: '160px 340px' }}
                />
                <motion.path
                  d="M 240,340 C 290,310 320,260 305,210 C 275,230 250,290 240,340 Z"
                  fill="url(#gabrielLeafEmerald)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                />
                <motion.path
                  d="M 180,260 C 140,210 130,160 160,120 C 175,150 180,210 180,260 Z"
                  fill="url(#gabrielLeafEmerald)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                  style={{ transformOrigin: '180px 260px' }}
                />
                <motion.path
                  d="M 220,260 C 260,210 270,160 240,120 C 225,150 220,210 220,260 Z"
                  fill="url(#gabrielLeafEmerald)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.85 }}
                  transition={{ duration: 1, delay: 0.45, ease: 'easeOut' }}
                  style={{ transformOrigin: '220px 260px' }}
                />
              </g>
            )}

            {/* Layer 2: Origami Wrap & Golden Ribbon */}
            {isStepAtLeast('yellow-stems-and-leaves') && (
              <g id="gabriel-wrap-layer">
                <motion.polygon
                  points="120,340 200,500 280,340"
                  fill="url(#gabrielWrapCone)"
                  stroke="#334155"
                  strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
                  style={{ transformOrigin: '200px 500px' }}
                />
                <motion.line
                  x1="120"
                  y1="340"
                  x2="200"
                  y2="500"
                  stroke="url(#gabrielWrapGoldTrim)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                <motion.line
                  x1="280"
                  y1="340"
                  x2="200"
                  y2="500"
                  stroke="url(#gabrielWrapGoldTrim)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />

                {/* Ribbon Knot */}
                <motion.path
                  d="M 175,370 C 185,380 215,380 225,370 C 230,390 170,390 175,370 Z"
                  fill="url(#gabrielWrapGoldTrim)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  style={{ transformOrigin: '200px 375px' }}
                />
                <motion.path
                  d="M 180,375 C 160,420 150,450 155,470"
                  stroke="url(#gabrielWrapGoldTrim)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.75 }}
                />
                <motion.path
                  d="M 220,375 C 240,420 250,450 245,470"
                  stroke="url(#gabrielWrapGoldTrim)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.75 }}
                />
              </g>
            )}

            {/* Layer 3: Abundant Prominent Yellow Flowers (Apertura Radial de Pétalos desde Cerrados a Abiertos) */}
            {isStepAtLeast('yellow-blooms-opening') && (
              <g id="gabriel-yellow-blooms">
                {/* Yellow Bloom #1 - Top Left (cx: 135, cy: 160) */}
                <g transform="translate(135, 160)">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <g key={`y1-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -12,-35 0,-52 0,-52 C 0,-52 12,-35 0,0 Z"
                        fill="url(#gabrielYellowPetalSoft)"
                        stroke="#EAB308"
                        strokeWidth="0.8"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -30, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.3,
                          delay: (i % 3) * 0.12 + Math.floor(i / 3) * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
                    <g key={`y1-in-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -9,-26 0,-38 0,-38 C 0,-38 9,-26 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.3 + (i % 3) * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill="url(#gabrielYellowCenter)"
                    stroke="#78350F"
                    strokeWidth="1.2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.55 }}
                  />
                </g>

                {/* Yellow Bloom #2 - Top Right (cx: 265, cy: 160) */}
                <g transform="translate(265, 160)">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <g key={`y2-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -12,-35 0,-52 0,-52 C 0,-52 12,-35 0,0 Z"
                        fill="url(#gabrielYellowPetalSoft)"
                        stroke="#EAB308"
                        strokeWidth="0.8"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -30, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.3,
                          delay: 0.1 + (i % 3) * 0.12 + Math.floor(i / 3) * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
                    <g key={`y2-in-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -9,-26 0,-38 0,-38 C 0,-38 9,-26 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.4 + (i % 3) * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill="url(#gabrielYellowCenter)"
                    stroke="#78350F"
                    strokeWidth="1.2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                </g>

                {/* Yellow Bloom #3 - Mid Left (cx: 95, cy: 245) */}
                <g transform="translate(95, 245)">
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
                    <g key={`y3-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -11,-32 0,-46 0,-46 C 0,-46 11,-32 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        stroke="#CA8A04"
                        strokeWidth="0.8"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -25, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.2 + (i % 3) * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="url(#gabrielYellowCenter)"
                    stroke="#92400E"
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.65 }}
                  />
                </g>

                {/* Yellow Bloom #4 - Mid Right (cx: 305, cy: 245) */}
                <g transform="translate(305, 245)">
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
                    <g key={`y4-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -11,-32 0,-46 0,-46 C 0,-46 11,-32 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        stroke="#CA8A04"
                        strokeWidth="0.8"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -25, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          delay: 0.25 + (i % 3) * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="url(#gabrielYellowCenter)"
                    stroke="#92400E"
                    strokeWidth="1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                  />
                </g>

                {/* Yellow Bloom #5 - Lower Left Base (cx: 145, cy: 310) */}
                <g transform="translate(145, 310)">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
                    <g key={`y5-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -10,-28 0,-40 0,-40 C 0,-40 10,-28 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.1,
                          delay: 0.3 + (i % 3) * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="11"
                    fill="url(#gabrielYellowCenter)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.75 }}
                  />
                </g>

                {/* Yellow Bloom #6 - Lower Right Base (cx: 255, cy: 310) */}
                <g transform="translate(255, 310)">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
                    <g key={`y6-g-${i}`} transform={`rotate(${angle})`}>
                      <motion.path
                        d="M 0,0 C -10,-28 0,-40 0,-40 C 0,-40 10,-28 0,0 Z"
                        fill="url(#gabrielYellowSunburst)"
                        initial={{ scale: 0, scaleX: 0.1, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                        transition={{
                          duration: 1.1,
                          delay: 0.35 + (i % 3) * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '0px 0px' }}
                      />
                    </g>
                  ))}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="11"
                    fill="url(#gabrielYellowCenter)"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                  />
                </g>
              </g>
            )}

            {/* =========================================================
                GABRIEL'S HIGHLY DETAILED & IMPOSING SPECIAL BLUE-BLACK FLOWER
                - Opening sequence:
                  1. Stem & Aura awaken
                  2. Tier 1 (Capas traseras): 12 Lanceolate Petals unfold outwards
                  3. Tier 2 (Capas intermedias): 12 Curved Petals open in counter-rotation
                  4. Tier 3 (Capas frontales / Corola): 10 Silk Inner Petals blossom
                  5. Tier 4: Corona of Mini Petals & Filaments expands
                  6. Receptacle Core & Integrated Number 13 reveals at exact center
               ========================================================= */}
            <g id="gabriel-special-blue-black-flower">
              {/* Special Stem growing from base up to center (200, 205) */}
              {isStepAtLeast('blue-black-aura-awakens') && (
                <motion.path
                  d="M 200,480 Q 200,340 200,205"
                  stroke="#1E3A8A"
                  strokeWidth="6.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                />
              )}

              {/* Central Flower Group centered at (200, 205) */}
              <g transform="translate(200, 205)" filter="url(#gabrielDropShadow3D)">
                {/* 1. Volumetric Ambient Aura & Rotating Energy Rings */}
                {isStepAtLeast('blue-black-aura-awakens') && (
                  <g id="special-aura-layer">
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="105"
                      fill="url(#gabrielBlueBlackAura)"
                      className="pointer-events-none"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.95 }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                    />
                    {/* Outer Rotating Dashed Ring */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="82"
                      fill="none"
                      stroke="#60A5FA"
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                      strokeDasharray="4 8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{
                        scale: { duration: 1.4 },
                        rotate: { duration: 22, repeat: Infinity, ease: 'linear' },
                      }}
                    />
                    {/* Inner Counter-Rotating Dashed Ring */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="68"
                      fill="none"
                      stroke="#1E40AF"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      strokeDasharray="2 6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: -360 }}
                      transition={{
                        scale: { duration: 1.4 },
                        rotate: { duration: 17, repeat: Infinity, ease: 'linear' },
                      }}
                    />
                  </g>
                )}

                {/* TIER 1: OUTER LAYER - CAPAS TRASERAS - 12 GRAND LANCEOLATE PETALS (Apertura progresiva por grupos) */}
                {isStepAtLeast('blue-black-outer-unfold') && (
                  <g id="special-tier1-outer">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                      <g key={`t1-p-g-${i}`} transform={`rotate(${deg})`}>
                        <motion.g
                          initial={{ scale: 0, scaleX: 0.08, rotate: -40, opacity: 0 }}
                          animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                          transition={{
                            duration: 1.6,
                            delay: (i % 4) * 0.16 + Math.floor(i / 4) * 0.1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ transformOrigin: '0px 0px' }}
                        >
                          {/* Main Sculpted Outer Petal */}
                          <path
                            d="M 0,0 C -26,-35 -30,-80 0,-98 C 30,-80 26,-35 0,0 Z"
                            fill="url(#gabrielOuterPetalGrad)"
                            stroke="#020617"
                            strokeWidth="1.2"
                            filter="url(#gabrielPetalShadow)"
                          />
                          {/* Shadow Accent for 3D Overlap Depth */}
                          <path
                            d="M 0,0 C -26,-35 -30,-80 0,-98 C -10,-60 -5,-30 0,0 Z"
                            fill="#000000"
                            opacity="0.38"
                          />
                          {/* Lightning Crystalline Central Vein */}
                          <path
                            d="M 0,0 L 0,-88"
                            stroke="#60A5FA"
                            strokeWidth="1.2"
                            strokeOpacity="0.85"
                          />
                          {/* Sapphire Highlight Tip Bead */}
                          <circle cx="0" cy="-94" r="2.2" fill="#93C5FD" />
                        </motion.g>
                      </g>
                    ))}
                  </g>
                )}

                {/* TIER 2: MID LAYER - CAPAS INTERMEDIAS - 12 CURVED PETALS (Offset 15 deg) */}
                {isStepAtLeast('blue-black-mid-unfold') && (
                  <g id="special-tier2-mid">
                    {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
                      <g key={`t2-p-g-${i}`} transform={`rotate(${deg})`}>
                        <motion.g
                          initial={{ scale: 0, scaleX: 0.1, rotate: 35, opacity: 0 }}
                          animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                          transition={{
                            duration: 1.5,
                            delay: (i % 4) * 0.15 + Math.floor(i / 4) * 0.09,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ transformOrigin: '0px 0px' }}
                        >
                          <path
                            d="M 0,0 C -22,-28 -25,-64 0,-78 C 25,-64 22,-28 0,0 Z"
                            fill="url(#gabrielMidPetalGrad)"
                            stroke="#1E3A8A"
                            strokeWidth="1"
                            filter="url(#gabrielPetalShadow)"
                          />
                          {/* Inner Shadow Core */}
                          <path
                            d="M 0,0 C -12,-20 -15,-50 0,-62 C 15,-50 12,-20 0,0 Z"
                            fill="#020617"
                            opacity="0.4"
                          />
                          {/* Central Blue Rib */}
                          <path
                            d="M 0,0 L 0,-68"
                            stroke="#93C5FD"
                            strokeWidth="1"
                            strokeOpacity="0.75"
                          />
                        </motion.g>
                      </g>
                    ))}
                  </g>
                )}

                {/* TIER 3: INNER COROLLA - CAPAS FRONTALES - 10 SILK AZURE PETALS (Offset 18 deg) */}
                {isStepAtLeast('blue-black-inner-unfold') && (
                  <g id="special-tier3-inner">
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <g key={`t3-p-g-${i}`} transform={`rotate(${deg + 18})`}>
                        <motion.g
                          initial={{ scale: 0, scaleX: 0.12, rotate: -25, opacity: 0 }}
                          animate={{ scale: 1, scaleX: 1, rotate: 0, opacity: 1 }}
                          transition={{
                            duration: 1.4,
                            delay: i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ transformOrigin: '0px 0px' }}
                        >
                          <path
                            d="M 0,0 C -18,-20 -20,-48 0,-58 C 20,-48 18,-20 0,0 Z"
                            fill="url(#gabrielInnerPetalGrad)"
                            stroke="#3B82F6"
                            strokeWidth="0.9"
                          />
                        </motion.g>
                      </g>
                    ))}
                  </g>
                )}

                {/* TIER 4: CORONA OF FILAMENTS & MINI CALYX PETALS */}
                {isStepAtLeast('blue-black-corona-unfold') && (
                  <g id="special-tier4-corona">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                      <g key={`t4-c-g-${i}`} transform={`rotate(${deg + 7.5})`}>
                        <motion.g
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1.2, delay: i * 0.05, ease: 'easeOut' }}
                          style={{ transformOrigin: '0px 0px' }}
                        >
                          {/* Mini Crown Petal */}
                          <path
                            d="M 0,0 C -10,-12 -10,-32 0,-38 C 10,-32 10,-12 0,0 Z"
                            fill="url(#gabrielCoronaPetalGrad)"
                            stroke="#60A5FA"
                            strokeWidth="0.8"
                          />
                          {/* Stamen Filament Line */}
                          <line x1="0" y1="0" x2="0" y2="-32" stroke="#38BDF8" strokeWidth="1" opacity="0.85" />
                          {/* Filament Anther Pearl */}
                          <circle cx="0" cy="-32" r="2" fill="#60A5FA" stroke="#020617" strokeWidth="0.5" />
                        </motion.g>
                      </g>
                    ))}
                  </g>
                )}

                {/* RECEPTACLE CORE WITH THE INTEGRATED NUMBER 13 STRICTLY IN THE EXACT CENTER */}
                {isStepAtLeast('number-13-reveal') && (
                  <g id="special-flower-core-13">
                    {/* Outer Obsidian Receptacle Ring */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="26"
                      fill="#020617"
                      stroke="#1D4ED8"
                      strokeWidth="2.2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />

                    {/* Concentric Sapphire & Jet Black Disc */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill="url(#gabrielCoreDisc)"
                      stroke="#3B82F6"
                      strokeWidth="1.2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    />

                    {/* Inner Fine Accent Ring */}
                    <motion.circle
                      cx="0"
                      cy="0"
                      r="15"
                      fill="#000000"
                      stroke="#60A5FA"
                      strokeWidth="0.8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    />

                    {/* Glowing Pistil Dots framing the exact center */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((ang, k) => (
                      <motion.circle
                        key={`pistil-dot-${k}`}
                        cx={13.5 * Math.cos((ang * Math.PI) / 180)}
                        cy={13.5 * Math.sin((ang * Math.PI) / 180)}
                        r="1.4"
                        fill="#38BDF8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.35 + k * 0.03 }}
                      />
                    ))}

                    {/* Integrated Number 13 strictly in the exact center */}
                    <motion.text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#93C5FD"
                      fontSize="16"
                      fontWeight="bold"
                      fontFamily="Playfair Display, Georgia, serif"
                      letterSpacing="1px"
                      filter="url(#gabrielGlow13)"
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
                    >
                      13
                    </motion.text>
                  </g>
                )}
              </g>
            </g>

            {/* Subtle Magic Sparkles around completed bouquet */}
            {isCompleted && (
              <g id="gabriel-sparkles">
                <circle cx="160" cy="140" r="2" fill="#FEF08A" filter="url(#gabrielGlow13)" />
                <circle cx="240" cy="140" r="2.2" fill="#93C5FD" filter="url(#gabrielGlow13)" />
                <circle cx="110" cy="220" r="1.8" fill="#FDE047" filter="url(#gabrielGlow13)" />
                <circle cx="290" cy="220" r="2" fill="#60A5FA" filter="url(#gabrielGlow13)" />
                <circle cx="200" cy="100" r="2.5" fill="#93C5FD" filter="url(#gabrielGlow13)" />
              </g>
            )}
          </svg>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full px-4">
          {isCompleted && (
            <>
              {/* Replay Formation Button */}
              <motion.button
                id="btn-gabriel-replay-formation"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.4 }}
                title="Repetir animación"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] border border-white/20 text-[#60A5FA] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#60A5FA]" />
              </motion.button>

              {/* Save Flower Button */}
              <SaveFlowerButton
                userName="Gabriel"
                stageContainerId="gabriel-bouquet-container"
                animationDurationMs={15800}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(37, 99, 235, 0.28)"
              />

              {/* Leer Button */}
              <motion.button
                id="btn-gabriel-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#FACC15]" />
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
