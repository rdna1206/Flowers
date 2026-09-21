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
  | 'blue-black-pedicel-ascent'
  | 'blue-black-outer-unfold'
  | 'blue-black-mid-unfold'
  | 'blue-black-inner-unfold'
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
      setTimeout(() => setStep('yellow-stems-and-leaves'), 1600),
      setTimeout(() => setStep('yellow-blooms-opening'), 3600),
      setTimeout(() => setStep('blue-black-pedicel-ascent'), 6000),
      setTimeout(() => setStep('blue-black-outer-unfold'), 8000),
      setTimeout(() => setStep('blue-black-mid-unfold'), 9800),
      setTimeout(() => setStep('blue-black-inner-unfold'), 11400),
      setTimeout(() => setStep('number-13-reveal'), 13000),
      setTimeout(() => {
        setStep('bouquet-complete');
        setIsCompleted(true);
      }, 14500),
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
      'blue-black-pedicel-ascent',
      'blue-black-outer-unfold',
      'blue-black-mid-unfold',
      'blue-black-inner-unfold',
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
          'radial-gradient(circle at 50% 38%, rgba(37, 99, 235, 0.25) 0%, rgba(250, 204, 21, 0.14) 40%, rgba(8, 12, 20, 0.98) 85%)',
      }}
    >
      {/* Background Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full blur-[90px] bg-blue-600/20 pointer-events-none"
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
            className="w-full h-auto max-w-[360px] sm:max-w-[420px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Filters */}
              <filter id="gabrielGlow13" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="gabrielPetalShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
              </filter>

              {/* Gradients for Yellow Blooms */}
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

              {/* Gradients for Blue & Black Special Flower */}
              <linearGradient id="gabrielBlackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="40%" stopColor="#0F172A" />
                <stop offset="85%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <linearGradient id="gabrielMidnightBluePetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#1E3A8A" />
                <stop offset="90%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="gabrielCobaltSapphire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#3B82F6" />
                <stop offset="80%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <radialGradient id="gabrielAzureSilkInner" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="90%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>

              <radialGradient id="gabrielCoreReceptacle" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1E3A8A" />
                <stop offset="45%" stopColor="#0F172A" />
                <stop offset="85%" stopColor="#020617" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>

              {/* Foliage & Wrap Gradients */}
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
                {/* Bouquet stems */}
                <path d="M 200,480 Q 190,360 140,230" stroke="#047857" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 200,480 Q 210,360 260,230" stroke="#047857" strokeWidth="5" strokeLinecap="round" fill="none" />
                <path d="M 200,480 Q 180,380 100,280" stroke="#065F46" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 200,480 Q 220,380 300,280" stroke="#065F46" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 200,480 Q 170,390 145,340" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M 200,480 Q 230,390 255,340" stroke="#064E3B" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* Leaves */}
                <path d="M 160,340 C 110,310 80,260 95,210 C 125,230 150,290 160,340 Z" fill="url(#gabrielLeafEmerald)" opacity="0.9" />
                <path d="M 240,340 C 290,310 320,260 305,210 C 275,230 250,290 240,340 Z" fill="url(#gabrielLeafEmerald)" opacity="0.9" />
                <path d="M 180,260 C 140,210 130,160 160,120 C 175,150 180,210 180,260 Z" fill="url(#gabrielLeafEmerald)" opacity="0.85" />
                <path d="M 220,260 C 260,210 270,160 240,120 C 225,150 220,210 220,260 Z" fill="url(#gabrielLeafEmerald)" opacity="0.85" />
              </g>
            )}

            {/* Layer 2: Origami Wrap & Golden Ribbon */}
            {isStepAtLeast('yellow-stems-and-leaves') && (
              <g id="gabriel-wrap-layer">
                <polygon points="120,340 200,500 280,340" fill="url(#gabrielWrapCone)" stroke="#334155" strokeWidth="1.5" />
                <line x1="120" y1="340" x2="200" y2="500" stroke="url(#gabrielWrapGoldTrim)" strokeWidth="2" />
                <line x1="280" y1="340" x2="200" y2="500" stroke="url(#gabrielWrapGoldTrim)" strokeWidth="2" />

                {/* Ribbon Knot */}
                <path d="M 175,370 C 185,380 215,380 225,370 C 230,390 170,390 175,370 Z" fill="url(#gabrielWrapGoldTrim)" />
                <path d="M 180,375 C 160,420 150,450 155,470" stroke="url(#gabrielWrapGoldTrim)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 220,375 C 240,420 250,450 245,470" stroke="url(#gabrielWrapGoldTrim)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
            )}

            {/* Layer 3: Abundant Prominent Yellow Flowers */}
            {isStepAtLeast('yellow-blooms-opening') && (
              <g id="gabriel-yellow-blooms">
                {/* Yellow Bloom #1 - Top Left (cx: 135, cy: 160) */}
                <g transform="translate(135, 160)">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <motion.path
                      key={`y1-${i}`}
                      d="M 0,0 C -12,-35 0,-52 0,-52 C 0,-52 12,-35 0,0 Z"
                      fill="url(#gabrielYellowPetalSoft)"
                      stroke="#EAB308"
                      strokeWidth="0.8"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.1 + i * 0.04 }}
                    />
                  ))}
                  {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
                    <motion.path
                      key={`y1-inner-${i}`}
                      d="M 0,0 C -9,-26 0,-38 0,-38 C 0,-38 9,-26 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.04 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="14" fill="url(#gabrielYellowCenter)" stroke="#78350F" strokeWidth="1.2" />
                </g>

                {/* Yellow Bloom #2 - Top Right (cx: 265, cy: 160) */}
                <g transform="translate(265, 160)">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                    <motion.path
                      key={`y2-${i}`}
                      d="M 0,0 C -12,-35 0,-52 0,-52 C 0,-52 12,-35 0,0 Z"
                      fill="url(#gabrielYellowPetalSoft)"
                      stroke="#EAB308"
                      strokeWidth="0.8"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.04 }}
                    />
                  ))}
                  {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
                    <motion.path
                      key={`y2-inner-${i}`}
                      d="M 0,0 C -9,-26 0,-38 0,-38 C 0,-38 9,-26 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.4 + i * 0.04 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="14" fill="url(#gabrielYellowCenter)" stroke="#78350F" strokeWidth="1.2" />
                </g>

                {/* Yellow Bloom #3 - Mid Left (cx: 95, cy: 245) */}
                <g transform="translate(95, 245)">
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
                    <motion.path
                      key={`y3-${i}`}
                      d="M 0,0 C -11,-32 0,-46 0,-46 C 0,-46 11,-32 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.1, delay: 0.3 + i * 0.05 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="12" fill="url(#gabrielYellowCenter)" stroke="#92400E" strokeWidth="1" />
                </g>

                {/* Yellow Bloom #4 - Mid Right (cx: 305, cy: 245) */}
                <g transform="translate(305, 245)">
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
                    <motion.path
                      key={`y4-${i}`}
                      d="M 0,0 C -11,-32 0,-46 0,-46 C 0,-46 11,-32 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.1, delay: 0.35 + i * 0.05 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="12" fill="url(#gabrielYellowCenter)" stroke="#92400E" strokeWidth="1" />
                </g>

                {/* Yellow Bloom #5 - Lower Left Base (cx: 145, cy: 310) */}
                <g transform="translate(145, 310)">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
                    <motion.path
                      key={`y5-${i}`}
                      d="M 0,0 C -10,-28 0,-40 0,-40 C 0,-40 10,-28 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1, delay: 0.4 + i * 0.05 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="11" fill="url(#gabrielYellowCenter)" />
                </g>

                {/* Yellow Bloom #6 - Lower Right Base (cx: 255, cy: 310) */}
                <g transform="translate(255, 310)">
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
                    <motion.path
                      key={`y6-${i}`}
                      d="M 0,0 C -10,-28 0,-40 0,-40 C 0,-40 10,-28 0,0 Z"
                      fill="url(#gabrielYellowSunburst)"
                      transform={`rotate(${angle})`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1, delay: 0.45 + i * 0.05 }}
                    />
                  ))}
                  <circle cx="0" cy="0" r="11" fill="url(#gabrielYellowCenter)" />
                </g>
              </g>
            )}

            {/* Layer 4: CENTRAL SPECIAL FLOWER (AZUL Y NEGRO CON EL NÚMERO 13) */}
            {isStepAtLeast('blue-black-pedicel-ascent') && (
              <g id="gabriel-special-blue-black-flower">
                {/* Special Stem */}
                <path
                  d="M 200,480 Q 200,340 200,220"
                  stroke="#1D4ED8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Central Flower Group centered at (200, 220) */}
                <g transform="translate(200, 220)">
                  {/* Layer 1: Outer Obsidian Black & Midnight Blue Petals (8 Petals) */}
                  {isStepAtLeast('blue-black-outer-unfold') && (
                    <g id="special-outer-black-layer">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <motion.g
                          key={`blk-petal-${i}`}
                          transform={`rotate(${angle})`}
                          initial={{ scale: 0, rotate: -20, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ duration: 1.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <path
                            d="M 0,0 C -22,-45 -28,-75 0,-92 C 28,-75 22,-45 0,0 Z"
                            fill="url(#gabrielBlackPetal)"
                            stroke="#1E3A8A"
                            strokeWidth="1.2"
                            filter="url(#gabrielPetalShadow)"
                          />
                          <path
                            d="M 0,0 C -12,-40 -15,-65 0,-82 C 15,-65 12,-40 0,0 Z"
                            fill="url(#gabrielMidnightBluePetal)"
                            opacity="0.65"
                          />
                        </motion.g>
                      ))}
                    </g>
                  )}

                  {/* Layer 2: Mid Cobalt & Sapphire Blue Petals (8 Petals Offset) */}
                  {isStepAtLeast('blue-black-mid-unfold') && (
                    <g id="special-mid-cobalt-layer">
                      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                        <motion.g
                          key={`mid-cobalt-${i}`}
                          transform={`rotate(${angle})`}
                          initial={{ scale: 0, rotate: 25, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          transition={{ duration: 1.3, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <path
                            d="M 0,0 C -18,-35 -22,-60 0,-74 C 22,-60 18,-35 0,0 Z"
                            fill="url(#gabrielCobaltSapphire)"
                            stroke="#60A5FA"
                            strokeWidth="1"
                            filter="url(#gabrielPetalShadow)"
                          />
                          <path
                            d="M 0,-10 C -8,-32 -10,-48 0,-60 C 10,-48 8,-32 0,-10 Z"
                            fill="#0F172A"
                            opacity="0.5"
                          />
                        </motion.g>
                      ))}
                    </g>
                  )}

                  {/* Layer 3: Inner Azure & Silk Blue Petals (8 Petals) */}
                  {isStepAtLeast('blue-black-inner-unfold') && (
                    <g id="special-inner-azure-layer">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <motion.g
                          key={`inner-azure-${i}`}
                          transform={`rotate(${angle})`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1.2, delay: i * 0.06 }}
                        >
                          <path
                            d="M 0,0 C -14,-25 -16,-45 0,-54 C 16,-45 14,-25 0,0 Z"
                            fill="url(#gabrielAzureSilkInner)"
                            stroke="#93C5FD"
                            strokeWidth="0.8"
                          />
                        </motion.g>
                      ))}
                    </g>
                  )}

                  {/* Layer 4: Receptacle Core & Integrated Number 13 */}
                  {isStepAtLeast('number-13-reveal') && (
                    <g id="special-flower-core-13">
                      {/* Outer Ring */}
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="26"
                        fill="url(#gabrielCoreReceptacle)"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />

                      {/* Inner Golden-Blue Ring */}
                      <motion.circle
                        cx="0"
                        cy="0"
                        r="19"
                        fill="#020617"
                        stroke="#FDE047"
                        strokeWidth="1.2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />

                      {/* Glowing Pistil Dots */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, k) => (
                        <circle
                          key={`dot-${k}`}
                          cx={15 * Math.cos((ang * Math.PI) / 180)}
                          cy={15 * Math.sin((ang * Math.PI) / 180)}
                          r="1.5"
                          fill="#60A5FA"
                        />
                      ))}

                      {/* Integrated Number 13 strictly in the exact center */}
                      <motion.text
                        x="0"
                        y="1"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#FEF08A"
                        fontSize="15"
                        fontWeight="bold"
                        fontFamily="Playfair Display, Georgia, serif"
                        letterSpacing="1px"
                        filter="url(#gabrielGlow13)"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.4 }}
                      >
                        13
                      </motion.text>
                    </g>
                  )}
                </g>
              </g>
            )}

            {/* Subtle Magic Sparkles */}
            {isCompleted && (
              <g id="gabriel-sparkles">
                <circle cx="160" cy="140" r="2" fill="#FEF08A" filter="url(#gabrielGlow13)" />
                <circle cx="240" cy="140" r="2.2" fill="#93C5FD" filter="url(#gabrielGlow13)" />
                <circle cx="110" cy="220" r="1.8" fill="#FDE047" filter="url(#gabrielGlow13)" />
                <circle cx="290" cy="220" r="2" fill="#60A5FA" filter="url(#gabrielGlow13)" />
                <circle cx="200" cy="120" r="2.5" fill="#FEF08A" filter="url(#gabrielGlow13)" />
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

              {/* Save Flower Button (Descargar PNG directamente sin modal) */}
              <SaveFlowerButton
                userName="Gabriel"
                stageContainerId="gabriel-bouquet-container"
                animationDurationMs={14500}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(37, 99, 235, 0.25)"
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
