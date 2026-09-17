import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface KeicyBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'prelude-spores'
  | 'origami-wrap'
  | 'yellow-cascade-wave'
  | 'botanical-canopy'
  | 'keicy-bud-emerge'
  | 'keicy-outer-unfurl'
  | 'keicy-mid-unfurl'
  | 'keicy-inner-unfurl'
  | 'keicy-heart-bloom'
  | 'bouquet-complete';

export const KeicyBouquetAnimation: React.FC<KeicyBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'prelude-spores'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  const startChoreography = () => {
    clearAllTimers();
    setStep('prelude-spores');
    setIsCompleted(false);

    // Keicy's bespoke progressive bloom choreography (~15.8s)
    const timers = [
      setTimeout(() => setStep('origami-wrap'), 1800),
      setTimeout(() => setStep('yellow-cascade-wave'), 4000),
      setTimeout(() => setStep('botanical-canopy'), 6600),
      setTimeout(() => setStep('keicy-bud-emerge'), 8400),
      setTimeout(() => setStep('keicy-outer-unfurl'), 10200),
      setTimeout(() => setStep('keicy-mid-unfurl'), 12000),
      setTimeout(() => setStep('keicy-inner-unfurl'), 13600),
      setTimeout(() => setStep('keicy-heart-bloom'), 14800),
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
      'prelude-spores',
      'origami-wrap',
      'yellow-cascade-wave',
      'botanical-canopy',
      'keicy-bud-emerge',
      'keicy-outer-unfurl',
      'keicy-mid-unfurl',
      'keicy-inner-unfurl',
      'keicy-heart-bloom',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  // 8 Outer Vinotinto Petals Angles (360° distribution)
  const outerAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  // 8 Mid Rose Petals Angles (interleaved at 22.5°)
  const midAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
  // 8 Inner Violet Petals Angles (interleaved at 11.25°)
  const innerAngles = [11.25, 56.25, 101.25, 146.25, 191.25, 236.25, 281.25, 326.25];

  return (
    <div
      id="keicy-bouquet-container"
      className="relative w-full min-h-[640px] flex flex-col items-center justify-center overflow-hidden py-4 px-2"
    >
      {/* Ambient background light field */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(245,158,11,0.16)_0%,rgba(114,9,44,0.20)_40%,rgba(139,92,246,0.14)_65%,transparent_80%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[420px] sm:w-[430px] sm:h-[500px] flex items-center justify-center">
          <svg
            id="keicy-bouquet-svg"
            data-flower-stage="true"
            viewBox="0 0 500 540"
            className="w-full h-full overflow-visible drop-shadow-[0_6px_35px_rgba(114,9,44,0.22)]"
          >
            <defs>
              {/* Yellow Flowers Gradients */}
              <linearGradient id="keicyYellowG1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="60%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              <linearGradient id="keicyYellowG2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="45%" stopColor="#FBBF24" />
                <stop offset="85%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <radialGradient id="keicyYellowCenterCore" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="70%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              {/* Keicy Signature Special Flower Gradients: Vinotinto, Rosado, Violeta */}
              <linearGradient id="keicyVinotintoOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E020E" />
                <stop offset="30%" stopColor="#4A041D" />
                <stop offset="70%" stopColor="#72092C" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>

              <linearGradient id="keicyRosadoMid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#831843" />
                <stop offset="30%" stopColor="#BE185D" />
                <stop offset="70%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FFF1F2" />
              </linearGradient>

              <linearGradient id="keicyVioletaInner" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B0764" />
                <stop offset="30%" stopColor="#6D28D9" />
                <stop offset="70%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#E9D5FF" />
              </linearGradient>

              <radialGradient id="keicyStarlightCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#F5D0FE" />
                <stop offset="60%" stopColor="#D946EF" />
                <stop offset="85%" stopColor="#7E22CE" />
                <stop offset="100%" stopColor="#4A041D" />
              </radialGradient>

              {/* Foliage, Stems & Wrapping Gradients */}
              <linearGradient id="keicyStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="60%" stopColor="#064E3B" />
                <stop offset="100%" stopColor="#022C22" />
              </linearGradient>

              <linearGradient id="keicyLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6EE7B7" />
                <stop offset="40%" stopColor="#10B981" />
                <stop offset="80%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="keicyWrapDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E1222" />
                <stop offset="50%" stopColor="#2D1A33" />
                <stop offset="100%" stopColor="#140917" />
              </linearGradient>

              <linearGradient id="keicyWrapGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="keicyRibbonMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#72092C" />
                <stop offset="50%" stopColor="#DB2777" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>

              <linearGradient id="keicyRibbonViolet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4C1D95" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="keicyStarlightGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* STAGE 1: STEMS & LUXURY WRAP */}
            <g id="keicy-stems-and-wrapping">
              {/* Natural Gathered Stems */}
              <motion.g
                initial={{ opacity: 0, scaleY: 0 }}
                animate={
                  isStepAtLeast('origami-wrap')
                    ? { opacity: 1, scaleY: 1 }
                    : { opacity: 0, scaleY: 0 }
                }
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '250px 380px' }}
              >
                <path d="M 235,330 Q 230,420 220,510" stroke="url(#keicyStemGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 245,320 Q 244,410 240,515" stroke="url(#keicyStemGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M 255,320 Q 256,410 260,515" stroke="url(#keicyStemGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
                <path d="M 265,330 Q 272,420 282,510" stroke="url(#keicyStemGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 225,340 Q 215,415 205,505" stroke="url(#keicyStemGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 275,340 Q 285,415 295,505" stroke="url(#keicyStemGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
              </motion.g>

              {/* Luxury Silk-Plum Wrap Cone with Gold Rim */}
              <motion.g
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={
                  isStepAtLeast('origami-wrap')
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.85, y: 30 }
                }
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '250px 420px' }}
              >
                {/* Back Fold */}
                <path
                  d="M 170,360 L 250,510 L 330,360 Q 250,380 170,360 Z"
                  fill="#140917"
                  stroke="#26132C"
                  strokeWidth="1.5"
                />
                {/* Left Flap */}
                <path
                  d="M 160,350 Q 210,400 240,505 L 250,505 Q 210,410 185,340 Z"
                  fill="url(#keicyWrapDark)"
                  stroke="url(#keicyWrapGoldTrim)"
                  strokeWidth="1.2"
                />
                {/* Right Flap */}
                <path
                  d="M 340,350 Q 290,400 260,505 L 250,505 Q 290,410 315,340 Z"
                  fill="url(#keicyWrapDark)"
                  stroke="url(#keicyWrapGoldTrim)"
                  strokeWidth="1.2"
                />
                {/* Gold Trim Silhouette Edge */}
                <path
                  d="M 165,345 Q 250,385 335,345"
                  stroke="url(#keicyWrapGoldTrim)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
            </g>

            {/* STAGE 2: BOTANICAL FOLIAGE (Eucalyptus & Fern fronds) */}
            <motion.g
              id="keicy-foliage-canopy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isStepAtLeast('botanical-canopy')
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '250px 280px' }}
            >
              {/* Outer Left Leaf Sprays */}
              <g transform="translate(95, 230) rotate(-45)">
                <ellipse cx="0" cy="-20" rx="12" ry="24" fill="url(#keicyLeafGrad)" opacity="0.85" />
                <path d="M 0,0 L 0,-40" stroke="#047857" strokeWidth="1.5" />
              </g>
              <g transform="translate(75, 290) rotate(-65)">
                <ellipse cx="0" cy="-22" rx="14" ry="26" fill="url(#keicyLeafGrad)" opacity="0.85" />
                <path d="M 0,0 L 0,-44" stroke="#047857" strokeWidth="1.5" />
              </g>

              {/* Outer Right Leaf Sprays */}
              <g transform="translate(405, 230) rotate(45)">
                <ellipse cx="0" cy="-20" rx="12" ry="24" fill="url(#keicyLeafGrad)" opacity="0.85" />
                <path d="M 0,0 L 0,-40" stroke="#047857" strokeWidth="1.5" />
              </g>
              <g transform="translate(425, 290) rotate(65)">
                <ellipse cx="0" cy="-22" rx="14" ry="26" fill="url(#keicyLeafGrad)" opacity="0.85" />
                <path d="M 0,0 L 0,-44" stroke="#047857" strokeWidth="1.5" />
              </g>

              {/* Top Canopy Leaves */}
              <g transform="translate(200, 80) rotate(-22)">
                <ellipse cx="0" cy="-18" rx="10" ry="22" fill="url(#keicyLeafGrad)" opacity="0.8" />
              </g>
              <g transform="translate(300, 80) rotate(22)">
                <ellipse cx="0" cy="-18" rx="10" ry="22" fill="url(#keicyLeafGrad)" opacity="0.8" />
              </g>

              {/* Golden Starlight Spores */}
              <circle cx="90" cy="195" r="3.5" fill="#FEF08A" opacity="0.9" filter="url(#keicyStarlightGlow)" />
              <circle cx="110" cy="170" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="410" cy="190" r="3.5" fill="#FEF08A" opacity="0.9" filter="url(#keicyStarlightGlow)" />
              <circle cx="390" cy="165" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="250" cy="65" r="3" fill="#FEF08A" opacity="0.9" filter="url(#keicyStarlightGlow)" />
            </motion.g>

            {/* STAGE 3: THE ABUNDANT YELLOW BLOOMS (Lush, Big, Prominent Frame around the Heart) */}
            <g id="keicy-yellow-blooms-grand-bouquet">
              {/* YELLOW FLOWER 1: Top-Center High Crown (cx: 250, cy: 120) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.3, y: 40 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.3, y: 40 }
                }
                transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '250px 120px' }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <path
                    key={`y1-outer-${i}`}
                    d="M 250,120 C 238,90 242,60 250,55 C 258,60 262,90 250,120 Z"
                    transform={`rotate(${deg} 250 120)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                ))}
                {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
                  <path
                    key={`y1-mid-${i}`}
                    d="M 250,120 C 240,100 244,77 250,73 C 256,77 260,100 250,120 Z"
                    transform={`rotate(${deg} 250 120)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.7"
                  />
                ))}
                <circle cx="250" cy="120" r="16" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.2" />
                <circle cx="250" cy="120" r="9" fill="#78350F" opacity="0.6" />
                <circle cx="250" cy="120" r="4" fill="#FEF08A" opacity="0.9" />
              </motion.g>

              {/* YELLOW FLOWER 2: Top-Left Majestic Blossom (cx: 150, cy: 170) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0.2, rotate: -30 }
                }
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '150px 170px' }}
              >
                {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
                  <path
                    key={`y2-outer-${i}`}
                    d="M 150,170 C 133,135 140,100 150,95 C 160,100 167,135 150,170 Z"
                    transform={`rotate(${deg} 150 170)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg, i) => (
                  <path
                    key={`y2-inner-${i}`}
                    d="M 150,170 C 137,145 143,120 150,115 C 157,120 163,145 150,170 Z"
                    transform={`rotate(${deg} 150 170)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="150" cy="170" r="19" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.4" />
                <circle cx="150" cy="170" r="11" fill="#78350F" opacity="0.5" />
                <circle cx="150" cy="170" r="5" fill="#FFFBEB" opacity="0.95" />
              </motion.g>

              {/* YELLOW FLOWER 3: Top-Right Grand Radiant Bloom (cx: 350, cy: 170) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.2, rotate: 30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0.2, rotate: 30 }
                }
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '350px 170px' }}
              >
                {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350].map((deg, i) => (
                  <path
                    key={`y3-outer-${i}`}
                    d="M 350,170 C 335,140 341,108 350,105 C 359,108 365,140 350,170 Z"
                    transform={`rotate(${deg} 350 170)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[12.5, 37.5, 62.5, 87.5, 112.5, 137.5, 162.5, 187.5, 212.5, 237.5, 262.5, 287.5, 312.5, 337.5].map((deg, i) => (
                  <path
                    key={`y3-inner-${i}`}
                    d="M 350,170 C 338,148 343,125 350,120 C 357,125 362,148 350,170 Z"
                    transform={`rotate(${deg} 350 170)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="350" cy="170" r="18" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.3" />
                <circle cx="350" cy="170" r="10" fill="#78350F" opacity="0.5" />
                <circle cx="350" cy="170" r="4.5" fill="#FFFBEB" opacity="0.95" />
              </motion.g>

              {/* YELLOW FLOWER 4: Left-Flank Lush Bloom (cx: 115, cy: 275) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.25, x: -30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, x: 0 }
                    : { opacity: 0, scale: 0.25, x: -30 }
                }
                transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '115px 275px' }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <path
                    key={`y4-outer-${i}`}
                    d="M 115,275 C 98,245 105,215 115,210 C 125,215 132,245 115,275 Z"
                    transform={`rotate(${deg} 115 275)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
                  <path
                    key={`y4-inner-${i}`}
                    d="M 115,275 C 102,252 108,230 115,225 C 122,230 128,252 115,275 Z"
                    transform={`rotate(${deg} 115 275)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="115" cy="275" r="17" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.3" />
                <circle cx="115" cy="275" r="9" fill="#78350F" opacity="0.5" />
                <circle cx="115" cy="275" r="4" fill="#FEF08A" opacity="0.9" />
              </motion.g>

              {/* YELLOW FLOWER 5: Right-Flank Abundant Bloom (cx: 385, cy: 275) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.25, x: 30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, x: 0 }
                    : { opacity: 0, scale: 0.25, x: 30 }
                }
                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '385px 275px' }}
              >
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <path
                    key={`y5-outer-${i}`}
                    d="M 385,275 C 368,245 375,218 385,214 C 395,218 402,245 385,275 Z"
                    transform={`rotate(${deg} 385 275)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
                  <path
                    key={`y5-inner-${i}`}
                    d="M 385,275 C 372,252 378,230 385,226 C 392,230 398,252 385,275 Z"
                    transform={`rotate(${deg} 385 275)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="385" cy="275" r="16" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.2" />
                <circle cx="385" cy="275" r="8" fill="#78350F" opacity="0.5" />
                <circle cx="385" cy="275" r="3.5" fill="#FEF08A" opacity="0.9" />
              </motion.g>

              {/* YELLOW FLOWER 6: Lower-Left Anchor Bloom (cx: 170, cy: 365) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.25, y: 30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.25, y: 30 }
                }
                transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '170px 365px' }}
              >
                {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
                  <path
                    key={`y6-outer-${i}`}
                    d="M 170,365 C 155,335 161,305 170,300 C 179,305 185,335 170,365 Z"
                    transform={`rotate(${deg} 170 365)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg, i) => (
                  <path
                    key={`y6-inner-${i}`}
                    d="M 170,365 C 158,342 163,320 170,315 C 177,320 182,342 170,365 Z"
                    transform={`rotate(${deg} 170 365)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="170" cy="365" r="17" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.3" />
                <circle cx="170" cy="365" r="9" fill="#78350F" opacity="0.5" />
                <circle cx="170" cy="365" r="4" fill="#FEF08A" opacity="0.9" />
              </motion.g>

              {/* YELLOW FLOWER 7: Lower-Right Anchor Bloom (cx: 330, cy: 365) */}
              <motion.g
                initial={{ opacity: 0, scale: 0.25, y: 30 }}
                animate={
                  isStepAtLeast('yellow-cascade-wave')
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.25, y: 30 }
                }
                transition={{ duration: 1.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '330px 365px' }}
              >
                {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
                  <path
                    key={`y7-outer-${i}`}
                    d="M 330,365 C 315,335 321,305 330,300 C 339,305 345,335 330,365 Z"
                    transform={`rotate(${deg} 330 365)`}
                    fill="url(#keicyYellowG2)"
                    stroke="#D97706"
                    strokeWidth="0.9"
                  />
                ))}
                {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg, i) => (
                  <path
                    key={`y7-inner-${i}`}
                    d="M 330,365 C 318,342 323,320 330,315 C 337,320 342,342 330,365 Z"
                    transform={`rotate(${deg} 330 365)`}
                    fill="url(#keicyYellowG1)"
                    stroke="#F59E0B"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="330" cy="365" r="17" fill="url(#keicyYellowCenterCore)" stroke="#B45309" strokeWidth="1.3" />
                <circle cx="330" cy="365" r="9" fill="#78350F" opacity="0.5" />
                <circle cx="330" cy="365" r="4" fill="#FEF08A" opacity="0.9" />
              </motion.g>
            </g>

            {/* STAGE 4, 5, 6, 7 & 8: KEICY'S EXCLUSIVE SPECIAL FLOWER (Flor Loto Astral en Vinotinto, Rosado y Violeta) */}
            {/* Focal Center Point: (250, 250). Perfectly framed, completely unobstructed and rendered ON TOP of all yellow blooms */}
            <g id="keicy-exclusive-special-flower">
              {/* Luminous aura behind Keicy's Flower */}
              <motion.circle
                cx="250"
                cy="250"
                r="70"
                fill="url(#keicyStarlightCore)"
                initial={{ opacity: 0, scale: 0.2 }}
                animate={
                  isStepAtLeast('keicy-bud-emerge')
                    ? {
                        opacity: isStepAtLeast('keicy-heart-bloom') ? 0.38 : 0.2,
                        scale: isStepAtLeast('keicy-outer-unfurl') ? 1.2 : 0.6,
                      }
                    : { opacity: 0, scale: 0.2 }
                }
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                filter="url(#keicyStarlightGlow)"
              />

              {/* BUD PHASE EMBRACE (Visible during 'keicy-bud-emerge', dissolves smoothly into the fully blooming petals) */}
              <motion.g
                id="keicy-bud-capsule"
                initial={{ opacity: 0, scale: 0.2, y: 35 }}
                animate={
                  step === 'keicy-bud-emerge'
                    ? { opacity: 1, scale: 1, y: 0 }
                    : isStepAtLeast('keicy-outer-unfurl')
                    ? { opacity: 0, scale: 1.4, y: -10 }
                    : { opacity: 0, scale: 0.2, y: 35 }
                }
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '250px 250px' }}
                pointerEvents="none"
              >
                {/* Slender Royal Chalice Bud Clasp */}
                <path
                  d="M 250,250 C 235,240 230,205 245,185 C 250,178 250,178 255,185 C 270,205 265,240 250,250 Z"
                  fill="url(#keicyVinotintoOuter)"
                  stroke="#BE185D"
                  strokeWidth="1.2"
                />
                <path
                  d="M 250,250 C 242,240 240,212 250,195 C 260,212 258,240 250,250 Z"
                  fill="url(#keicyRosadoMid)"
                  opacity="0.8"
                />
                <circle cx="250" cy="190" r="3" fill="#C084FC" filter="url(#keicyStarlightGlow)" />
              </motion.g>

              {/* TIER 1: THE 8 EXPANSIVE DEEP VINOTINTO OUTER CHALICE PETALS */}
              {/* Petal length: 95px! Width: 70px! Spreads into a magnificent ~190px wide royal rosette */}
              <g id="keicy-outer-vinotinto-wings">
                {outerAngles.map((targetDeg, i) => {
                  const isOpen = isStepAtLeast('keicy-outer-unfurl');
                  const isBud = step === 'keicy-bud-emerge';

                  // During bud: clustered tightly around top (angle near 0°, small scale)
                  // When opening: each petal progressively fans outward to its target radial angle with a wide, generous scale
                  const currentRotate = isOpen
                    ? targetDeg
                    : isBud
                    ? (i - 3.5) * 4
                    : 0;

                  const currentScale = isOpen ? 1 : isBud ? 0.35 : 0;
                  const currentScaleY = isOpen ? 1 : isBud ? 0.8 : 0;
                  const currentOpacity = isOpen ? 1 : isBud ? 0.9 : 0;

                  return (
                    <motion.g
                      key={`keicy-vinotinto-petal-${i}`}
                      initial={{ scale: 0, rotate: 0, opacity: 0 }}
                      animate={{
                        scale: currentScale,
                        scaleY: currentScaleY,
                        rotate: currentRotate,
                        opacity: currentOpacity,
                      }}
                      transition={{
                        duration: 1.6,
                        delay: isOpen ? i * 0.07 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: '250px 250px' }}
                    >
                      {/* Sculpted Winged Gothic-Lotus Petal Silhouette */}
                      <path
                        d="M 250,250 C 224,235 208,200 228,170 C 240,154 250,150 250,150 C 250,150 260,154 272,170 C 292,200 276,235 250,250 Z"
                        fill="url(#keicyVinotintoOuter)"
                        stroke="#9F1239"
                        strokeWidth="1.3"
                      />
                      {/* Rich velvet depth accent */}
                      <path
                        d="M 250,250 C 235,238 225,210 238,185 C 245,172 250,168 250,168 C 250,168 255,172 262,185 C 275,210 265,238 250,250 Z"
                        fill="none"
                        stroke="#4A041D"
                        strokeWidth="1"
                        opacity="0.6"
                      />
                      {/* Fine luminous ruby-rose spine vein */}
                      <path
                        d="M 250,250 Q 250,205 250,165"
                        stroke="#FDA4AF"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.65"
                      />
                      {/* Lateral branched micro-veins */}
                      <path
                        d="M 250,225 Q 238,212 232,192"
                        stroke="#FDA4AF"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        opacity="0.45"
                      />
                      <path
                        d="M 250,225 Q 262,212 268,192"
                        stroke="#FDA4AF"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        opacity="0.45"
                      />
                    </motion.g>
                  );
                })}
              </g>

              {/* TIER 2: THE 8 LUMINOUS SATIN ROSADO PETALS (Interleaved at 22.5°) */}
              {/* Petal length: 78px! Width: 55px! Adds high-contrast vibrant glow over the dark vinotinto base */}
              <g id="keicy-mid-rose-petals">
                {midAngles.map((targetDeg, i) => {
                  const isOpen = isStepAtLeast('keicy-mid-unfurl');
                  const isPreUnfurl = step === 'keicy-outer-unfurl';

                  const currentRotate = isOpen
                    ? targetDeg
                    : isPreUnfurl
                    ? (i - 3.5) * 3
                    : 0;

                  const currentScale = isOpen ? 1 : isPreUnfurl ? 0.35 : 0;
                  const currentOpacity = isOpen ? 1 : isPreUnfurl ? 0.6 : 0;

                  return (
                    <motion.g
                      key={`keicy-rose-petal-${i}`}
                      initial={{ scale: 0, rotate: 0, opacity: 0 }}
                      animate={{
                        scale: currentScale,
                        rotate: currentRotate,
                        opacity: currentOpacity,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: isOpen ? 0.1 + i * 0.07 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: '250px 250px' }}
                    >
                      <path
                        d="M 250,250 C 230,238 220,210 234,188 C 242,176 250,172 250,172 C 250,172 258,176 266,188 C 280,210 270,238 250,250 Z"
                        fill="url(#keicyRosadoMid)"
                        stroke="#F472B6"
                        strokeWidth="1.2"
                      />
                      {/* Radiant satin highlight on rose petal */}
                      <path
                        d="M 250,250 Q 250,210 250,180"
                        stroke="#FFF1F2"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                    </motion.g>
                  );
                })}
              </g>

              {/* TIER 3: THE 8 CELESTIAL VIOLET INNER FLAME PETALS (Interleaved at 11.25°) */}
              {/* Petal length: 58px! Width: 38px! Radiant violet framing the starlight jewel */}
              <g id="keicy-inner-violet-crown">
                {innerAngles.map((targetDeg, i) => {
                  const isOpen = isStepAtLeast('keicy-inner-unfurl');
                  const isPreUnfurl = step === 'keicy-mid-unfurl';

                  const currentRotate = isOpen
                    ? targetDeg
                    : isPreUnfurl
                    ? (i - 3.5) * 2
                    : 0;

                  const currentScale = isOpen ? 1 : isPreUnfurl ? 0.3 : 0;
                  const currentOpacity = isOpen ? 1 : isPreUnfurl ? 0.7 : 0;

                  return (
                    <motion.g
                      key={`keicy-violet-petal-${i}`}
                      initial={{ scale: 0, rotate: 0, opacity: 0 }}
                      animate={{
                        scale: currentScale,
                        rotate: currentRotate,
                        opacity: currentOpacity,
                      }}
                      transition={{
                        duration: 1.4,
                        delay: isOpen ? 0.1 + i * 0.06 : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{ transformOrigin: '250px 250px' }}
                    >
                      <path
                        d="M 250,250 C 238,242 232,222 242,204 C 246,196 250,192 250,192 C 250,192 254,196 258,204 C 268,222 262,242 250,250 Z"
                        fill="url(#keicyVioletaInner)"
                        stroke="#C084FC"
                        strokeWidth="1.1"
                      />
                      <path
                        d="M 250,250 Q 250,218 250,196"
                        stroke="#E9D5FF"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        opacity="0.85"
                      />
                    </motion.g>
                  );
                })}
              </g>

              {/* STAGE 8 & 9: THE EXCLUSIVE CENTER (Astral Starlight Crystal Heart) */}
              <motion.g
                id="keicy-starlight-crystal-heart"
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  isStepAtLeast('keicy-heart-bloom')
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0 }
                }
                transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ transformOrigin: '250px 250px' }}
              >
                {/* Velvet Receptacle Disc with Gold-Violet Border */}
                <circle cx="250" cy="250" r="22" fill="url(#keicyVinotintoOuter)" stroke="#C084FC" strokeWidth="1.6" />
                <circle cx="250" cy="250" r="17" fill="#4A041D" stroke="#FDE047" strokeWidth="1" />

                {/* 8 Micro Satin-Magenta Filigree Lobes */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <ellipse
                    key={`keicy-core-petal-${i}`}
                    cx="250"
                    cy="236"
                    rx="3.5"
                    ry="7"
                    transform={`rotate(${deg} 250 250)`}
                    fill="url(#keicyRosadoMid)"
                    stroke="#F472B6"
                    strokeWidth="0.6"
                  />
                ))}

                {/* 8-Pointed Multi-faceted Astral Starlight Crystal Jewel */}
                <path
                  d="M 250,234 L 253,246 L 265,246 L 255,252 L 259,263 L 250,257 L 241,263 L 245,252 L 235,246 L 247,246 Z"
                  fill="url(#keicyStarlightCore)"
                  stroke="#FFFFFF"
                  strokeWidth="0.9"
                  filter="url(#keicyStarlightGlow)"
                />

                {/* Ring of 12 Micro Starlight Droplet Jewels */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <circle
                    key={`keicy-gem-${i}`}
                    cx="250"
                    cy="235"
                    r="1.7"
                    transform={`rotate(${deg} 250 250)`}
                    fill="#FFFFFF"
                    opacity="0.95"
                  />
                ))}

                {/* Central Brilliant Star Sparkle */}
                <circle cx="250" cy="250" r="4" fill="#FFFFFF" filter="url(#keicyStarlightGlow)" />
                <circle cx="250" cy="250" r="2" fill="#F5D0FE" />
              </motion.g>
            </g>

            {/* FRONT SILK RIBBON & BOW (Magenta & Violet Silk Streamers) */}
            <motion.g
              id="keicy-front-silk-ribbon"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={
                isStepAtLeast('origami-wrap')
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.7 }
              }
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: '250px 380px' }}
            >
              {/* Left Magenta Ribbon Loop */}
              <path
                d="M 250,380 C 220,360 195,385 220,405 C 235,415 248,395 250,380 Z"
                fill="url(#keicyRibbonMagenta)"
                stroke="#BE185D"
                strokeWidth="1.2"
              />
              {/* Right Violet Ribbon Loop */}
              <path
                d="M 250,380 C 280,360 305,385 280,405 C 265,415 252,395 250,380 Z"
                fill="url(#keicyRibbonViolet)"
                stroke="#6D28D9"
                strokeWidth="1.2"
              />
              {/* Central Knot */}
              <circle cx="250" cy="380" r="7.5" fill="#72092C" stroke="#FDE047" strokeWidth="1.2" />
              <circle cx="250" cy="380" r="3" fill="#F472B6" />
              {/* Flowing Tails */}
              <path
                d="M 246,386 Q 235,435 220,470 Q 228,450 248,390"
                fill="url(#keicyRibbonMagenta)"
                opacity="0.9"
              />
              <path
                d="M 254,386 Q 265,435 280,470 Q 272,450 252,390"
                fill="url(#keicyRibbonViolet)"
                opacity="0.9"
              />
            </motion.g>

            {/* CELESTIAL STARDUST / SPARKLE PARTICLES UPON COMPLETION */}
            {isStepAtLeast('bouquet-complete') && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <circle cx="230" cy="210" r="2" fill="#FFFBEB" filter="url(#keicyStarlightGlow)" />
                <circle cx="270" cy="215" r="2.2" fill="#F5D0FE" filter="url(#keicyStarlightGlow)" />
                <circle cx="280" cy="285" r="1.8" fill="#FDE047" filter="url(#keicyStarlightGlow)" />
                <circle cx="220" cy="280" r="1.8" fill="#C084FC" filter="url(#keicyStarlightGlow)" />
                <circle cx="150" cy="140" r="2" fill="#FFFBEB" filter="url(#keicyStarlightGlow)" />
                <circle cx="350" cy="140" r="2" fill="#FFFBEB" filter="url(#keicyStarlightGlow)" />
              </motion.g>
            )}
          </svg>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full px-4">
          {isCompleted && (
            <>
              {/* Replay Formation Button */}
              <motion.button
                id="btn-keicy-replay-formation"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.4 }}
                title="Repetir animación"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#F472B6] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#F472B6]" />
              </motion.button>

              {/* Guardar Flor Button (Descarga directa PNG sin modal) */}
              <SaveFlowerButton
                userName="Keicy"
                stageContainerId="keicy-bouquet-container"
                animationDurationMs={15800}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(114, 9, 44, 0.28)"
              />

              {/* Leer button */}
              <motion.button
                id="btn-keicy-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
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
