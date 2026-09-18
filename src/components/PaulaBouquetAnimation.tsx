import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface PaulaBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'prelude-mist'
  | 'origami-wrap'
  | 'emerald-foliage'
  | 'yellow-canopy-wave'
  | 'paula-bud-emergence'
  | 'paula-outer-scarlet-open'
  | 'paula-mid-lilac-unfurl'
  | 'paula-inner-pink-bloom'
  | 'paula-chalice-core-reveal'
  | 'bouquet-complete';

export const PaulaBouquetAnimation: React.FC<PaulaBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'prelude-mist'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  const startChoreography = () => {
    clearAllTimers();
    setStep('prelude-mist');
    setIsCompleted(false);

    // Paula's bespoke botanical bloom choreography (~16.2s)
    const timers = [
      setTimeout(() => setStep('origami-wrap'), 1800),
      setTimeout(() => setStep('emerald-foliage'), 3800),
      setTimeout(() => setStep('yellow-canopy-wave'), 5800),
      setTimeout(() => setStep('paula-bud-emergence'), 8400),
      setTimeout(() => setStep('paula-outer-scarlet-open'), 10400),
      setTimeout(() => setStep('paula-mid-lilac-unfurl'), 12200),
      setTimeout(() => setStep('paula-inner-pink-bloom'), 13800),
      setTimeout(() => setStep('paula-chalice-core-reveal'), 15000),
      setTimeout(() => {
        setStep('bouquet-complete');
        setIsCompleted(true);
      }, 16200),
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
      'prelude-mist',
      'origami-wrap',
      'emerald-foliage',
      'yellow-canopy-wave',
      'paula-bud-emergence',
      'paula-outer-scarlet-open',
      'paula-mid-lilac-unfurl',
      'paula-inner-pink-bloom',
      'paula-chalice-core-reveal',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="paula-bouquet-container"
      className="relative w-full min-h-[640px] flex flex-col items-center justify-center overflow-hidden py-4 px-2"
    >
      {/* Ambient background light field */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle_at_50%_40%,rgba(225,29,72,0.22)_0%,rgba(192,132,252,0.18)_40%,rgba(245,158,11,0.12)_65%,transparent_85%)] blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[460px] mx-auto flex flex-col items-center">
        {/* SVG Bouquet Viewport */}
        <div className="relative w-full aspect-[4/5] flex items-center justify-center">
          <svg
            id="paula-svg-stage"
            viewBox="0 0 400 500"
            className="w-full h-full max-h-[560px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.7)] select-none"
          >
            <defs>
              {/* Radial glow filter */}
              <filter id="paulaStarlightGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="paulaSoftBloom" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Wrapping Gradients */}
              <linearGradient id="paulaWrapCharcoal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="50%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#09090B" />
              </linearGradient>

              <linearGradient id="paulaWrapFold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3F3F46" />
                <stop offset="60%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#09090B" />
              </linearGradient>

              <linearGradient id="paulaRoseGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="50%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>

              {/* Silk Ribbons */}
              <linearGradient id="paulaRibbonScarlet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="35%" stopColor="#F43F5E" />
                <stop offset="70%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>

              <linearGradient id="paulaRibbonLilac" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="40%" stopColor="#C084FC" />
                <stop offset="80%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#6B21A8" />
              </linearGradient>

              {/* Yellow Bouquet Gradients */}
              <radialGradient id="paulaYellowGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>

              <radialGradient id="paulaYellowAmber" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>

              <radialGradient id="paulaYellowCanary" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#EAB308" />
              </radialGradient>

              <radialGradient id="paulaYellowCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              {/* Foliage Gradients */}
              <linearGradient id="paulaLeafEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="paulaLeafSage" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="55%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#14532D" />
              </linearGradient>

              {/* =========================================================
                  PAULA'S BESPOKE SPECIAL FLOWER GRADIENTS (ROSA, LILA Y ROJO)
                 ========================================================= */}
              {/* Tier 1: Outer Scarlet / Ruby Chalice Petals */}
              <linearGradient id="paulaRubyChalice" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#4C0519" />
                <stop offset="30%" stopColor="#881337" />
                <stop offset="70%" stopColor="#BE123C" />
                <stop offset="95%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#FDA4AF" />
              </linearGradient>

              {/* Tier 1 Side Wings */}
              <linearGradient id="paulaRubyChaliceWing" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B0716" />
                <stop offset="35%" stopColor="#9F1239" />
                <stop offset="75%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#FECDD3" />
              </linearGradient>

              {/* Tier 2: Mid Silken Lilac / Lavender Petals */}
              <linearGradient id="paulaLilacSatin" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#3B0764" />
                <stop offset="30%" stopColor="#6B21A8" />
                <stop offset="65%" stopColor="#9333EA" />
                <stop offset="88%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#F3E8FF" />
              </linearGradient>

              {/* Tier 2 Lateral Lilac Petals */}
              <linearGradient id="paulaLilacSatinSide" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#581C87" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#E9D5FF" />
              </linearGradient>

              {/* Tier 3: Inner Satin Pink / Rose Petals */}
              <linearGradient id="paulaPinkLustre" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#701A75" />
                <stop offset="25%" stopColor="#9D174D" />
                <stop offset="60%" stopColor="#DB2777" />
                <stop offset="88%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#FFE4E6" />
              </linearGradient>

              {/* Tier 4: Chalice Receptacle Core & Nectar Cup */}
              <radialGradient id="paulaHeartRubyAmethyst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#F472B6" />
                <stop offset="55%" stopColor="#E11D48" />
                <stop offset="85%" stopColor="#701A75" />
                <stop offset="100%" stopColor="#3B0764" />
              </radialGradient>

              {/* Radiant Stamen & Pistils */}
              <linearGradient id="paulaStamenGold" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#CA8A04" />
                <stop offset="60%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#FEF08A" />
              </linearGradient>

              {/* Dew Crystal Highlight */}
              <radialGradient id="paulaDewCrystal" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#F5D0FE" />
                <stop offset="75%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#BE185D" />
              </radialGradient>
            </defs>

            {/* =========================================================
                STAGE 1: PRELUDE ROSE-QUARTZ & LILAC MIST
               ========================================================= */}
            <motion.g
              id="paula-prelude-mist"
              initial={{ opacity: 0 }}
              animate={{ opacity: isStepAtLeast('prelude-mist') ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            >
              <circle cx="200" cy="200" r="160" fill="url(#paulaHeartRubyAmethyst)" opacity="0.08" filter="url(#paulaSoftBloom)" />
              <circle cx="160" cy="180" r="90" fill="url(#paulaLilacSatin)" opacity="0.10" filter="url(#paulaSoftBloom)" />
              <circle cx="240" cy="190" r="90" fill="url(#paulaPinkLustre)" opacity="0.10" filter="url(#paulaSoftBloom)" />
            </motion.g>

            {/* =========================================================
                STAGE 2: LUXURY ORIGAMI WRAPPING & ROSE-GOLD ACCENTS
               ========================================================= */}
            {isStepAtLeast('origami-wrap') && (
              <motion.g
                id="paula-origami-wrap"
                initial={{ opacity: 0, y: 35, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '200px 420px' }}
              >
                {/* Back Collar Layer */}
                <polygon
                  points="200,190 70,250 110,430 200,470 290,430 330,250"
                  fill="url(#paulaWrapCharcoal)"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1.2"
                />

                {/* Left Outer Fold */}
                <polygon
                  points="60,265 175,445 105,435 50,300"
                  fill="url(#paulaWrapFold)"
                  stroke="url(#paulaRoseGoldTrim)"
                  strokeWidth="0.9"
                  opacity="0.9"
                />

                {/* Right Outer Fold */}
                <polygon
                  points="340,265 225,445 295,435 350,300"
                  fill="url(#paulaWrapFold)"
                  stroke="url(#paulaRoseGoldTrim)"
                  strokeWidth="0.9"
                  opacity="0.9"
                />

                {/* Left Origami Wing */}
                <path
                  d="M 65,260 L 195,450 L 130,455 L 75,340 Z"
                  fill="#18181B"
                  stroke="url(#paulaRoseGoldTrim)"
                  strokeWidth="1.1"
                />

                {/* Right Origami Wing */}
                <path
                  d="M 335,260 L 205,450 L 270,455 L 325,340 Z"
                  fill="#18181B"
                  stroke="url(#paulaRoseGoldTrim)"
                  strokeWidth="1.1"
                />

                {/* Central Body Cone Wrap */}
                <path
                  d="M 120,320 L 200,465 L 280,320 Q 200,345 120,320 Z"
                  fill="url(#paulaWrapCharcoal)"
                  stroke="url(#paulaRoseGoldTrim)"
                  strokeWidth="1.2"
                />
              </motion.g>
            )}

            {/* =========================================================
                STAGE 3: EMERALD & SAGE BOTANICAL CANOPY & LEAVES
               ========================================================= */}
            {isStepAtLeast('emerald-foliage') && (
              <motion.g
                id="paula-botanical-foliage"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 300px' }}
              >
                {/* Upper Left Eucalyptus Sprig */}
                <g transform="translate(95, 130) rotate(-35)">
                  <ellipse cx="0" cy="0" rx="14" ry="24" fill="url(#paulaLeafSage)" stroke="#047857" strokeWidth="0.8" />
                  <ellipse cx="12" cy="-18" rx="11" ry="19" fill="url(#paulaLeafEmerald)" stroke="#064E3B" strokeWidth="0.8" />
                  <path d="M 0,24 Q 5,-5 12,-18" stroke="#A7F3D0" strokeWidth="0.9" fill="none" />
                </g>

                {/* Upper Right Eucalyptus Sprig */}
                <g transform="translate(305, 130) rotate(35)">
                  <ellipse cx="0" cy="0" rx="14" ry="24" fill="url(#paulaLeafSage)" stroke="#047857" strokeWidth="0.8" />
                  <ellipse cx="-12" cy="-18" rx="11" ry="19" fill="url(#paulaLeafEmerald)" stroke="#064E3B" strokeWidth="0.8" />
                  <path d="M 0,24 Q -5,-5 -12,-18" stroke="#A7F3D0" strokeWidth="0.9" fill="none" />
                </g>

                {/* Left Flank Fan Leaf */}
                <path
                  d="M 80,240 C 35,220 30,170 70,165 C 80,195 90,225 80,240 Z"
                  fill="url(#paulaLeafEmerald)"
                  stroke="#047857"
                  strokeWidth="0.9"
                />
                <path d="M 80,240 Q 60,195 70,165" stroke="#6EE7B7" strokeWidth="0.8" fill="none" />

                {/* Right Flank Fan Leaf */}
                <path
                  d="M 320,240 C 365,220 370,170 330,165 C 320,195 310,225 320,240 Z"
                  fill="url(#paulaLeafEmerald)"
                  stroke="#047857"
                  strokeWidth="0.9"
                />
                <path d="M 320,240 Q 340,195 330,165" stroke="#6EE7B7" strokeWidth="0.8" fill="none" />

                {/* Lower Left Framing Leaf */}
                <path
                  d="M 120,310 C 65,315 60,265 105,260 C 115,280 120,295 120,310 Z"
                  fill="url(#paulaLeafSage)"
                  stroke="#064E3B"
                  strokeWidth="0.8"
                />

                {/* Lower Right Framing Leaf */}
                <path
                  d="M 280,310 C 335,315 340,265 295,260 C 285,280 280,295 280,310 Z"
                  fill="url(#paulaLeafSage)"
                  stroke="#064E3B"
                  strokeWidth="0.8"
                />
              </motion.g>
            )}

            {/* =========================================================
                STAGE 4: ABUNDANT GRAND YELLOW FLOWERS CASCADE
                (Large, prominent, visible, rich golden garden blooms)
               ========================================================= */}
            {isStepAtLeast('yellow-canopy-wave') && (
              <motion.g id="paula-yellow-bouquet-cascade">
                {/* ---------------------------------------------------
                    YELLOW FLOWER 1: Upper-Left Golden Ranunculus (125, 170)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-1"
                  initial={{ scale: 0, opacity: 0, rotate: -30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.3, ease: [0.34, 1.3, 0.64, 1], delay: 0.1 }}
                  style={{ transformOrigin: '125px 170px' }}
                >
                  {/* Outer Tier Petals */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse
                      key={`yf1-out-${i}`}
                      cx="125"
                      cy="170"
                      rx="16"
                      ry="32"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 125 170)`}
                      opacity="0.95"
                    />
                  ))}
                  {/* Mid Tier Petals */}
                  {[30, 90, 150, 210, 270, 330].map((angle, i) => (
                    <ellipse
                      key={`yf1-mid-${i}`}
                      cx="125"
                      cy="170"
                      rx="13"
                      ry="24"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 125 170)`}
                    />
                  ))}
                  {/* Inner Rosette Petals */}
                  {[15, 75, 135, 195, 255, 315].map((angle, i) => (
                    <circle
                      key={`yf1-inn-${i}`}
                      cx={125 + Math.cos((angle * Math.PI) / 180) * 10}
                      cy={170 + Math.sin((angle * Math.PI) / 180) * 10}
                      r="9"
                      fill="url(#paulaYellowCanary)"
                      stroke="#EAB308"
                      strokeWidth="0.6"
                    />
                  ))}
                  {/* Core Stamen Ring */}
                  <circle cx="125" cy="170" r="10" fill="url(#paulaYellowCore)" />
                  <circle cx="125" cy="170" r="5" fill="#FEF08A" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 2: Upper-Right Golden Ranunculus (275, 170)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-2"
                  initial={{ scale: 0, opacity: 0, rotate: 30 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.3, ease: [0.34, 1.3, 0.64, 1], delay: 0.2 }}
                  style={{ transformOrigin: '275px 170px' }}
                >
                  {/* Outer Tier */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <ellipse
                      key={`yf2-out-${i}`}
                      cx="275"
                      cy="170"
                      rx="16"
                      ry="32"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 275 170)`}
                      opacity="0.95"
                    />
                  ))}
                  {/* Mid Tier */}
                  {[30, 90, 150, 210, 270, 330].map((angle, i) => (
                    <ellipse
                      key={`yf2-mid-${i}`}
                      cx="275"
                      cy="170"
                      rx="13"
                      ry="24"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 275 170)`}
                    />
                  ))}
                  {/* Inner Rosette */}
                  {[15, 75, 135, 195, 255, 315].map((angle, i) => (
                    <circle
                      key={`yf2-inn-${i}`}
                      cx={275 + Math.cos((angle * Math.PI) / 180) * 10}
                      cy={170 + Math.sin((angle * Math.PI) / 180) * 10}
                      r="9"
                      fill="url(#paulaYellowCanary)"
                      stroke="#EAB308"
                      strokeWidth="0.6"
                    />
                  ))}
                  <circle cx="275" cy="170" r="10" fill="url(#paulaYellowCore)" />
                  <circle cx="275" cy="170" r="5" fill="#FEF08A" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 3: Mid-Left Radiant Sun Peony (90, 240)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-3"
                  initial={{ scale: 0, opacity: 0, rotate: -40 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.4, ease: [0.34, 1.3, 0.64, 1], delay: 0.3 }}
                  style={{ transformOrigin: '90px 240px' }}
                >
                  {/* Outer Broad Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <path
                      key={`yf3-out-${i}`}
                      d="M 90,240 C 72,210 108,210 90,240 Z"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 90 240) scale(1.6)`}
                      style={{ transformOrigin: '90px 240px' }}
                    />
                  ))}
                  {/* Mid Cup Petals */}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                    <ellipse
                      key={`yf3-mid-${i}`}
                      cx="90"
                      cy="240"
                      rx="14"
                      ry="26"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                      transform={`rotate(${angle} 90 240)`}
                    />
                  ))}
                  {/* Inner Swirl */}
                  <circle cx="90" cy="240" r="14" fill="url(#paulaYellowCanary)" stroke="#EAB308" strokeWidth="0.8" />
                  <circle cx="90" cy="240" r="7" fill="url(#paulaYellowCore)" />
                  <circle cx="90" cy="240" r="3" fill="#FFFFFF" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 4: Mid-Right Radiant Sun Peony (310, 240)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-4"
                  initial={{ scale: 0, opacity: 0, rotate: 40 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ duration: 1.4, ease: [0.34, 1.3, 0.64, 1], delay: 0.35 }}
                  style={{ transformOrigin: '310px 240px' }}
                >
                  {/* Outer Broad Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <path
                      key={`yf4-out-${i}`}
                      d="M 310,240 C 292,210 328,210 310,240 Z"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 310 240) scale(1.6)`}
                      style={{ transformOrigin: '310px 240px' }}
                    />
                  ))}
                  {/* Mid Cup Petals */}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                    <ellipse
                      key={`yf4-mid-${i}`}
                      cx="310"
                      cy="240"
                      rx="14"
                      ry="26"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                      transform={`rotate(${angle} 310 240)`}
                    />
                  ))}
                  {/* Inner Swirl */}
                  <circle cx="310" cy="240" r="14" fill="url(#paulaYellowCanary)" stroke="#EAB308" strokeWidth="0.8" />
                  <circle cx="310" cy="240" r="7" fill="url(#paulaYellowCore)" />
                  <circle cx="310" cy="240" r="3" fill="#FFFFFF" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 5: Lower-Left Golden Rose (145, 295)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.3, ease: [0.34, 1.3, 0.64, 1], delay: 0.45 }}
                  style={{ transformOrigin: '145px 295px' }}
                >
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <ellipse
                      key={`yf5-out-${i}`}
                      cx="145"
                      cy="295"
                      rx="16"
                      ry="30"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 145 295)`}
                    />
                  ))}
                  {[36, 108, 180, 252, 324].map((angle, i) => (
                    <ellipse
                      key={`yf5-mid-${i}`}
                      cx="145"
                      cy="295"
                      rx="12"
                      ry="22"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                      transform={`rotate(${angle} 145 295)`}
                    />
                  ))}
                  <circle cx="145" cy="295" r="11" fill="url(#paulaYellowCanary)" stroke="#F59E0B" strokeWidth="0.8" />
                  <circle cx="145" cy="295" r="6" fill="url(#paulaYellowCore)" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 6: Lower-Right Golden Rose (255, 295)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.3, ease: [0.34, 1.3, 0.64, 1], delay: 0.5 }}
                  style={{ transformOrigin: '255px 295px' }}
                >
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <ellipse
                      key={`yf6-out-${i}`}
                      cx="255"
                      cy="295"
                      rx="16"
                      ry="30"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 255 295)`}
                    />
                  ))}
                  {[36, 108, 180, 252, 324].map((angle, i) => (
                    <ellipse
                      key={`yf6-mid-${i}`}
                      cx="255"
                      cy="295"
                      rx="12"
                      ry="22"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                      transform={`rotate(${angle} 255 295)`}
                    />
                  ))}
                  <circle cx="255" cy="295" r="11" fill="url(#paulaYellowCanary)" stroke="#F59E0B" strokeWidth="0.8" />
                  <circle cx="255" cy="295" r="6" fill="url(#paulaYellowCore)" />
                </motion.g>

                {/* ---------------------------------------------------
                    YELLOW FLOWER 7: Grand Front Center Rose (200, 335)
                    (Large, majestic anchor of the bouquet wrap)
                   --------------------------------------------------- */}
                <motion.g
                  id="yellow-flower-7"
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: [0.34, 1.4, 0.64, 1], delay: 0.6 }}
                  style={{ transformOrigin: '200px 335px' }}
                >
                  {/* Outer Grand Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <ellipse
                      key={`yf7-out-${i}`}
                      cx="200"
                      cy="335"
                      rx="18"
                      ry="36"
                      fill="url(#paulaYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.9"
                      transform={`rotate(${angle} 200 335)`}
                    />
                  ))}
                  {/* Mid Rose Layers */}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
                    <ellipse
                      key={`yf7-mid-${i}`}
                      cx="200"
                      cy="335"
                      rx="14"
                      ry="28"
                      fill="url(#paulaYellowGold)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                      transform={`rotate(${angle} 200 335)`}
                    />
                  ))}
                  {/* Inner Rose Cups */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <circle
                      key={`yf7-inn-${i}`}
                      cx={200 + Math.cos((angle * Math.PI) / 180) * 12}
                      cy={335 + Math.sin((angle * Math.PI) / 180) * 12}
                      r="12"
                      fill="url(#paulaYellowCanary)"
                      stroke="#EAB308"
                      strokeWidth="0.7"
                    />
                  ))}
                  {/* Glowing Core */}
                  <circle cx="200" cy="335" r="14" fill="url(#paulaYellowCore)" stroke="#CA8A04" strokeWidth="1" />
                  <circle cx="200" cy="335" r="7" fill="#FEF08A" />
                  <circle cx="200" cy="335" r="3" fill="#FFFFFF" />
                </motion.g>
              </motion.g>
            )}

            {/* =========================================================
                PAULA'S EXCLUSIVE SPECIAL PROTAGONIST FLOWER:
                "COROLA ESCARLATA Y CÁLIZ IMPERIAL" (ROSA, LILA Y ROJO)
                Located at center (200, 160). Multi-tiered depth with
                real petal unfolding kinematics:
                Bud -> Outer Scarlet Wings -> Mid Lilac Satin -> Inner Pink Cups -> Chalice Core
               ========================================================= */}

            {/* STAGE 5: CLOSED CHRYSALIS BUD EMERGENCE */}
            {step === 'paula-bud-emergence' && (
              <motion.g
                id="paula-bud-genesis"
                initial={{ scale: 0.1, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.34, 1.4, 0.64, 1] }}
                style={{ transformOrigin: '200px 185px' }}
              >
                {/* Concentrated Aura Glow */}
                <circle cx="200" cy="160" r="38" fill="url(#paulaHeartRubyAmethyst)" opacity="0.4" filter="url(#paulaSoftBloom)" />

                {/* Central Closed Ruby Chalice Bud */}
                <path
                  d="M 200,185 C 180,165 175,120 200,90 C 225,120 220,165 200,185 Z"
                  fill="url(#paulaRubyChalice)"
                  stroke="#FDA4AF"
                  strokeWidth="1.2"
                />
                {/* Flanking Closed Lilac Sheaths */}
                <path
                  d="M 200,185 C 170,160 165,130 185,105 C 195,125 198,160 200,185 Z"
                  fill="url(#paulaLilacSatinSide)"
                  stroke="#E9D5FF"
                  strokeWidth="1.0"
                  opacity="0.9"
                />
                <path
                  d="M 200,185 C 230,160 235,130 215,105 C 205,125 202,160 200,185 Z"
                  fill="url(#paulaLilacSatinSide)"
                  stroke="#E9D5FF"
                  strokeWidth="1.0"
                  opacity="0.9"
                />
                {/* Inner Bud Glow Spark */}
                <circle cx="200" cy="140" r="7" fill="#FDA4AF" opacity="0.85" filter="url(#paulaStarlightGlow)" />
                <circle cx="200" cy="140" r="3" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* STAGES 6+: FULL MULTI-TIERED FLOWER BLOOM */}
            {(isStepAtLeast('paula-outer-scarlet-open') ||
              isStepAtLeast('paula-mid-lilac-unfurl') ||
              isStepAtLeast('paula-inner-pink-bloom') ||
              isStepAtLeast('paula-chalice-core-reveal')) && (
              <motion.g
                id="paula-protagonist-bloom"
                animate={isCompleted ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 4.8, repeat: isCompleted ? Infinity : 0, ease: 'easeInOut' }}
                style={{ transformOrigin: '200px 165px' }}
              >
                {/* Ethereal Petal Halo Glow */}
                <circle cx="200" cy="155" r="72" fill="url(#paulaHeartRubyAmethyst)" opacity="0.22" filter="url(#paulaSoftBloom)" />

                {/* -----------------------------------------------------
                    TIER 1: OUTER SCARLET / RUBY CHALICE PETALS (5 Grand Wings)
                    Unfolding outwards and laterally from the base (200, 185)
                   ----------------------------------------------------- */}
                <g id="paula-tier-1-scarlet-wings">
                  {/* Outer Far-Left Scarlet Wing (Pivots outward to x=110, y=130) */}
                  <motion.path
                    d="M 200,185 C 160,180 115,150 115,120 C 115,95 155,115 200,185 Z"
                    fill="url(#paulaRubyChaliceWing)"
                    stroke="#FDA4AF"
                    strokeWidth="1.1"
                    initial={{ scaleY: 0.3, scaleX: 0.2, opacity: 0, rotate: 15 }}
                    animate={{ scaleY: 1, scaleX: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '200px 185px' }}
                  />

                  {/* Outer Upper-Left Scarlet Petal */}
                  <motion.path
                    d="M 200,185 C 170,165 130,120 145,80 C 170,75 190,125 200,185 Z"
                    fill="url(#paulaRubyChalice)"
                    stroke="#FDA4AF"
                    strokeWidth="1.1"
                    initial={{ scaleY: 0.3, scaleX: 0.2, opacity: 0, rotate: 10 }}
                    animate={{ scaleY: 1, scaleX: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                    style={{ transformOrigin: '200px 185px' }}
                  />

                  {/* Outer Central Apex Scarlet Crown Petal */}
                  <motion.path
                    d="M 200,185 C 180,150 170,95 200,55 C 230,95 220,150 200,185 Z"
                    fill="url(#paulaRubyChalice)"
                    stroke="#FECDD3"
                    strokeWidth="1.2"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                    style={{ transformOrigin: '200px 185px' }}
                  />

                  {/* Outer Upper-Right Scarlet Petal */}
                  <motion.path
                    d="M 200,185 C 230,165 270,120 255,80 C 230,75 210,125 200,185 Z"
                    fill="url(#paulaRubyChalice)"
                    stroke="#FDA4AF"
                    strokeWidth="1.1"
                    initial={{ scaleY: 0.3, scaleX: 0.2, opacity: 0, rotate: -10 }}
                    animate={{ scaleY: 1, scaleX: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                    style={{ transformOrigin: '200px 185px' }}
                  />

                  {/* Outer Far-Right Scarlet Wing (Pivots outward to x=290, y=130) */}
                  <motion.path
                    d="M 200,185 C 240,180 285,150 285,120 C 285,95 245,115 200,185 Z"
                    fill="url(#paulaRubyChaliceWing)"
                    stroke="#FDA4AF"
                    strokeWidth="1.1"
                    initial={{ scaleY: 0.3, scaleX: 0.2, opacity: 0, rotate: -15 }}
                    animate={{ scaleY: 1, scaleX: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '200px 185px' }}
                  />
                </g>

                {/* -----------------------------------------------------
                    TIER 2: MID SILKEN LILAC / LAVENDER PETALS (5 Petals)
                    Interleaved with the outer scarlet layer for real depth
                   ----------------------------------------------------- */}
                {isStepAtLeast('paula-mid-lilac-unfurl') && (
                  <g id="paula-tier-2-lilac-satin">
                    {/* Mid Left Lilac Petal */}
                    <motion.path
                      d="M 200,180 C 165,170 135,135 140,105 C 165,100 185,135 200,180 Z"
                      fill="url(#paulaLilacSatinSide)"
                      stroke="#E9D5FF"
                      strokeWidth="1.0"
                      initial={{ scale: 0.2, opacity: 0, rotate: 20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '200px 180px' }}
                    />

                    {/* Mid Upper-Left Lilac Petal */}
                    <motion.path
                      d="M 200,180 C 180,150 160,110 180,75 C 195,85 198,135 200,180 Z"
                      fill="url(#paulaLilacSatin)"
                      stroke="#F3E8FF"
                      strokeWidth="1.0"
                      initial={{ scale: 0.2, opacity: 0, rotate: 12 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                      style={{ transformOrigin: '200px 180px' }}
                    />

                    {/* Mid Upper-Right Lilac Petal */}
                    <motion.path
                      d="M 200,180 C 220,150 240,110 220,75 C 205,85 202,135 200,180 Z"
                      fill="url(#paulaLilacSatin)"
                      stroke="#F3E8FF"
                      strokeWidth="1.0"
                      initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                      style={{ transformOrigin: '200px 180px' }}
                    />

                    {/* Mid Right Lilac Petal */}
                    <motion.path
                      d="M 200,180 C 235,170 265,135 260,105 C 235,100 215,135 200,180 Z"
                      fill="url(#paulaLilacSatinSide)"
                      stroke="#E9D5FF"
                      strokeWidth="1.0"
                      initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '200px 180px' }}
                    />

                    {/* Mid Bottom Cradle Lilac Petal */}
                    <motion.path
                      d="M 200,180 C 170,175 160,195 200,205 C 240,195 230,175 200,180 Z"
                      fill="url(#paulaLilacSatin)"
                      stroke="#C084FC"
                      strokeWidth="0.9"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.9 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      style={{ transformOrigin: '200px 180px' }}
                    />
                  </g>
                )}

                {/* -----------------------------------------------------
                    TIER 3: INNER SATIN PINK / ROSE CHALICE PETALS (5 Petals)
                    Forming the vibrant, luminous inner cup
                   ----------------------------------------------------- */}
                {isStepAtLeast('paula-inner-pink-bloom') && (
                  <g id="paula-tier-3-pink-lustre">
                    {/* Inner Left Pink Petal */}
                    <motion.path
                      d="M 200,175 C 175,160 155,135 165,110 C 185,115 195,145 200,175 Z"
                      fill="url(#paulaPinkLustre)"
                      stroke="#FFE4E6"
                      strokeWidth="0.9"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '200px 175px' }}
                    />

                    {/* Inner Center-Left Pink Petal */}
                    <motion.path
                      d="M 200,175 C 185,145 175,115 190,95 C 200,110 200,145 200,175 Z"
                      fill="url(#paulaPinkLustre)"
                      stroke="#FFE4E6"
                      strokeWidth="0.9"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
                      style={{ transformOrigin: '200px 175px' }}
                    />

                    {/* Inner Center-Right Pink Petal */}
                    <motion.path
                      d="M 200,175 C 215,145 225,115 210,95 C 200,110 200,145 200,175 Z"
                      fill="url(#paulaPinkLustre)"
                      stroke="#FFE4E6"
                      strokeWidth="0.9"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
                      style={{ transformOrigin: '200px 175px' }}
                    />

                    {/* Inner Right Pink Petal */}
                    <motion.path
                      d="M 200,175 C 225,160 245,135 235,110 C 215,115 205,145 200,175 Z"
                      fill="url(#paulaPinkLustre)"
                      stroke="#FFE4E6"
                      strokeWidth="0.9"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '200px 175px' }}
                    />

                    {/* Front Flared Pink Lip Petal */}
                    <motion.path
                      d="M 180,165 C 185,185 215,185 220,165 C 215,150 185,150 180,165 Z"
                      fill="url(#paulaPinkLustre)"
                      stroke="#FDA4AF"
                      strokeWidth="0.8"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                      style={{ transformOrigin: '200px 165px' }}
                    />
                  </g>
                )}

                {/* -----------------------------------------------------
                    TIER 4: BOTANICAL CHALICE HEART & CRYSTAL STAMEN CORE
                    (Pure floral organic center with golden pistils & dew jewel, NO floating text/numbers)
                   ----------------------------------------------------- */}
                {isStepAtLeast('paula-chalice-core-reveal') && (
                  <motion.g
                    id="paula-tier-4-chalice-core"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 150px' }}
                  >
                    {/* Glowing Nectar Receptacle */}
                    <circle cx="200" cy="150" r="16" fill="url(#paulaHeartRubyAmethyst)" stroke="#FDA4AF" strokeWidth="1.2" />
                    <circle cx="200" cy="150" r="10" fill="#9D174D" />

                    {/* 10 Radiating Golden Stamens with Pearl Tips */}
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
                      const rad = (angle * Math.PI) / 180;
                      const x2 = 200 + Math.cos(rad) * 12;
                      const y2 = 150 + Math.sin(rad) * 12;
                      return (
                        <g key={`stamen-${i}`}>
                          <line x1="200" y1="150" x2={x2} y2={y2} stroke="url(#paulaStamenGold)" strokeWidth="1.1" strokeLinecap="round" />
                          <circle cx={x2} cy={y2} r="1.8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.5" />
                        </g>
                      );
                    })}

                    {/* Central Glistening Dewdrop Jewel */}
                    <circle
                      cx="200"
                      cy="150"
                      r="4.5"
                      fill="url(#paulaDewCrystal)"
                      filter="url(#paulaStarlightGlow)"
                    />
                    <circle cx="199" cy="148.5" r="1.5" fill="#FFFFFF" />
                  </motion.g>
                )}
              </motion.g>
            )}

            {/* =========================================================
                SILK DUAL-RIBBON BOW & SCATTERED STARLIGHT
               ========================================================= */}
            {isStepAtLeast('origami-wrap') && (
              <motion.g
                id="paula-silk-ribbon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                style={{ transformOrigin: '200px 380px' }}
              >
                {/* Left Scarlet Ribbon Loop */}
                <path
                  d="M 200,380 C 170,360 145,385 170,405 C 185,415 198,395 200,380 Z"
                  fill="url(#paulaRibbonScarlet)"
                  stroke="#BE123C"
                  strokeWidth="1.1"
                />
                {/* Right Lilac Ribbon Loop */}
                <path
                  d="M 200,380 C 230,360 255,385 230,405 C 215,415 202,395 200,380 Z"
                  fill="url(#paulaRibbonLilac)"
                  stroke="#7E22CE"
                  strokeWidth="1.1"
                />
                {/* Central Jewel Knot */}
                <circle cx="200" cy="380" r="7.5" fill="#9F1239" stroke="#FDA4AF" strokeWidth="1.2" />
                <circle cx="200" cy="380" r="3.5" fill="#C084FC" />
                {/* Flowing Tails */}
                <path
                  d="M 196,386 Q 185,435 170,470 Q 178,450 198,390"
                  fill="url(#paulaRibbonScarlet)"
                  opacity="0.9"
                />
                <path
                  d="M 204,386 Q 215,435 230,470 Q 222,450 202,390"
                  fill="url(#paulaRibbonLilac)"
                  opacity="0.9"
                />
              </motion.g>
            )}

            {/* CELESTIAL STARDUST / SPARKLE PARTICLES UPON COMPLETION */}
            {isStepAtLeast('bouquet-complete') && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                <circle cx="180" cy="210" r="2.0" fill="#FFE4E6" filter="url(#paulaStarlightGlow)" />
                <circle cx="225" cy="215" r="2.2" fill="#F3E8FF" filter="url(#paulaStarlightGlow)" />
                <circle cx="260" cy="285" r="1.8" fill="#FEF08A" filter="url(#paulaStarlightGlow)" />
                <circle cx="140" cy="280" r="1.8" fill="#FDA4AF" filter="url(#paulaStarlightGlow)" />
                <circle cx="110" cy="130" r="2.0" fill="#FFE4E6" filter="url(#paulaStarlightGlow)" />
                <circle cx="290" cy="130" r="2.0" fill="#F3E8FF" filter="url(#paulaStarlightGlow)" />
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
                id="btn-paula-replay-formation"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.4 }}
                title="Repetir animación"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FDA4AF] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#FDA4AF]" />
              </motion.button>

              {/* Guardar Flor Button (Descarga directa PNG sin modal) */}
              <SaveFlowerButton
                userName="Paula"
                stageContainerId="paula-bouquet-container"
                animationDurationMs={16200}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(225, 29, 72, 0.25)"
              />

              {/* Leer button */}
              <motion.button
                id="btn-paula-read-text"
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
