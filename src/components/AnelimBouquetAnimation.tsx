import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface AnelimBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'crimson-aurora-glow'
  | 'golden-sun-canopy'
  | 'emerald-laurel-framing'
  | 'origami-velvet-cinch'
  | 'anelim-pedicel-ascent'
  | 'anelim-outer-carmine-unfold'
  | 'anelim-mid-coral-crest'
  | 'anelim-inner-rose-filaments'
  | 'anelim-stamen-starburst-reveal'
  | 'bouquet-complete';

export const AnelimBouquetAnimation: React.FC<AnelimBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'crimson-aurora-glow'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach((t) => clearTimeout(t));
    timerRefs.current = [];
  };

  const startChoreography = () => {
    clearAllTimers();
    setStep('crimson-aurora-glow');
    setIsCompleted(false);

    const timers = [
      setTimeout(() => setStep('golden-sun-canopy'), 1900),
      setTimeout(() => setStep('emerald-laurel-framing'), 4400),
      setTimeout(() => setStep('origami-velvet-cinch'), 6600),
      setTimeout(() => setStep('anelim-pedicel-ascent'), 8600),
      setTimeout(() => setStep('anelim-outer-carmine-unfold'), 10400),
      setTimeout(() => setStep('anelim-mid-coral-crest'), 12200),
      setTimeout(() => setStep('anelim-inner-rose-filaments'), 14000),
      setTimeout(() => setStep('anelim-stamen-starburst-reveal'), 15600),
      setTimeout(() => {
        setStep('bouquet-complete');
        setIsCompleted(true);
      }, 17000),
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
      'crimson-aurora-glow',
      'golden-sun-canopy',
      'emerald-laurel-framing',
      'origami-velvet-cinch',
      'anelim-pedicel-ascent',
      'anelim-outer-carmine-unfold',
      'anelim-mid-coral-crest',
      'anelim-inner-rose-filaments',
      'anelim-stamen-starburst-reveal',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="anelim-bouquet-container"
      className="relative w-full min-h-[640px] flex flex-col items-center justify-center overflow-hidden py-4 px-2"
    >
      {/* Ambient Red & Pink Atmosphere Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{
            scale: isCompleted ? [1, 1.05, 1] : 1,
            opacity: isCompleted ? [0.35, 0.45, 0.35] : 0.3,
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[500px] h-[500px] rounded-full bg-radial from-[#E11D48]/35 via-[#FB7185]/18 to-transparent blur-3xl pointer-events-none"
        />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* SVG Bouquet Canvas */}
        <div className="relative w-full max-w-[420px] aspect-[400/520] flex items-center justify-center">
          <svg
            id="anelim-flower-svg"
            viewBox="0 0 400 520"
            className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)] select-none"
          >
            <defs>
              {/* Gradients for Luxury Wrap */}
              <linearGradient id="anelimWrapCone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#251F23" />
                <stop offset="50%" stopColor="#171215" />
                <stop offset="100%" stopColor="#0B080A" />
              </linearGradient>

              <linearGradient id="anelimWrapStripe" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FB7185" />
                <stop offset="50%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>

              <linearGradient id="anelimRibbonCarmine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="50%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              <linearGradient id="anelimRibbonRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="50%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="anelimLeafDeep" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="50%" stopColor="#15803D" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="anelimLeafEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="60%" stopColor="#16A34A" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>

              {/* Yellow Flowers Gradients (Abundant, Multi-layered, Radiant) */}
              <radialGradient id="anelimYellowSunburst" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="55%" stopColor="#FACC15" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>

              <radialGradient id="anelimYellowAmber" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </radialGradient>

              <radialGradient id="anelimYellowCenterPistil" cx="45%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#CA8A04" />
                <stop offset="60%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>

              {/* =======================================================
                  ANELIM SPECIAL FLOWER GRADIENTS (PURE RED & PINK PALETTE)
                  - NO other colors, no violet, no blue, no black petals!
                 ======================================================= */}
              {/* Outer Layer: Lanceolate Flame Sepals in Deep Carmine Ruby */}
              <linearGradient id="anelimOuterCarmine" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="30%" stopColor="#9F1239" />
                <stop offset="70%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#FB7185" />
              </linearGradient>

              {/* Mid Layer: Wavy Arching Flame Petals in Vivid Coral Pink & Crimson */}
              <linearGradient id="anelimMidFlame" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#9F1239" />
                <stop offset="35%" stopColor="#E11D48" />
                <stop offset="75%" stopColor="#FF2A6D" />
                <stop offset="100%" stopColor="#FDA4AF" />
              </linearGradient>

              {/* Inner Layer: Slender Silk Crest in Soft Blossom Rose & Pearl */}
              <linearGradient id="anelimInnerSilk" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#BE123C" />
                <stop offset="40%" stopColor="#FB7185" />
                <stop offset="80%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FFF1F2" />
              </linearGradient>

              {/* Central Ruby-Nectar Jewel & Architectural Stamen Anthers */}
              <radialGradient id="anelimRubyNectar" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="25%" stopColor="#FF2A6D" />
                <stop offset="65%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#881337" />
              </radialGradient>

              <radialGradient id="anelimAntherPearl" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FFE4E6" />
                <stop offset="100%" stopColor="#FB7185" />
              </radialGradient>

              {/* Filter for Ambient Starlight Glow */}
              <filter id="anelimStarlightGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* =========================================================
                PHASE 1: CRIMSON & ROSE AURORA EMBER SPIRALS
               ========================================================= */}
            {isStepAtLeast('crimson-aurora-glow') && (
              <motion.g
                id="anelim-aurora-embers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.8 }}
              >
                <circle cx="200" cy="200" r="160" fill="url(#anelimRubyNectar)" opacity="0.07" filter="url(#anelimStarlightGlow)" />
                <circle cx="160" cy="180" r="2.5" fill="#FB7185" opacity="0.6" filter="url(#anelimStarlightGlow)" />
                <circle cx="240" cy="170" r="3" fill="#FDA4AF" opacity="0.7" filter="url(#anelimStarlightGlow)" />
                <circle cx="130" cy="230" r="2" fill="#E11D48" opacity="0.5" filter="url(#anelimStarlightGlow)" />
                <circle cx="270" cy="220" r="2.5" fill="#FF2A6D" opacity="0.6" filter="url(#anelimStarlightGlow)" />
              </motion.g>
            )}

            {/* =========================================================
                PHASE 2: EMERALD & EUCALYPTUS BOTANICAL FOLIAGE
               ========================================================= */}
            {isStepAtLeast('emerald-laurel-framing') && (
              <motion.g
                id="anelim-foliage-layer"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 320px' }}
              >
                {/* Back Stems */}
                <path d="M 200,440 Q 185,340 130,220" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 200,440 Q 215,340 270,220" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M 200,450 Q 200,320 200,210" stroke="#065F46" strokeWidth="5.5" strokeLinecap="round" fill="none" />

                {/* Left Fan Leaves */}
                <path d="M 155,270 C 110,250 80,210 95,170 C 120,185 145,230 155,270 Z" fill="url(#anelimLeafDeep)" opacity="0.9" />
                <path d="M 140,230 C 95,200 70,160 85,120 C 110,135 130,190 140,230 Z" fill="url(#anelimLeafEmerald)" opacity="0.95" />

                {/* Right Fan Leaves */}
                <path d="M 245,270 C 290,250 320,210 305,170 C 280,185 255,230 245,270 Z" fill="url(#anelimLeafDeep)" opacity="0.9" />
                <path d="M 260,230 C 305,200 330,160 315,120 C 290,135 270,190 260,230 Z" fill="url(#anelimLeafEmerald)" opacity="0.95" />

                {/* Upper Arching Laurel Shoots */}
                <path d="M 180,200 C 160,150 150,110 170,80 C 185,110 185,160 180,200 Z" fill="url(#anelimLeafEmerald)" opacity="0.85" />
                <path d="M 220,200 C 240,150 250,110 230,80 C 215,110 215,160 220,200 Z" fill="url(#anelimLeafEmerald)" opacity="0.85" />
              </motion.g>
            )}

            {/* =========================================================
                PHASE 3: LUXURY ORIGAMI WRAPPING (OBSIDIAN & CARMINE LINES)
               ========================================================= */}
            {isStepAtLeast('origami-velvet-cinch') && (
              <motion.g
                id="anelim-origami-wrap"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                style={{ transformOrigin: '200px 400px' }}
              >
                {/* Back Fold Paper Wings */}
                <polygon points="120,310 200,480 80,330" fill="#171215" stroke="#E11D48" strokeWidth="0.8" opacity="0.85" />
                <polygon points="280,310 200,480 320,330" fill="#171215" stroke="#E11D48" strokeWidth="0.8" opacity="0.85" />

                {/* Main Front Luxury Geometric Origami Cone */}
                <polygon points="110,320 200,490 290,320" fill="url(#anelimWrapCone)" stroke="#382C34" strokeWidth="1.4" />

                {/* Carmine and Ruby Pinstripes along facets */}
                <line x1="110" y1="320" x2="200" y2="490" stroke="url(#anelimWrapStripe)" strokeWidth="1.8" />
                <line x1="290" y1="320" x2="200" y2="490" stroke="url(#anelimWrapStripe)" strokeWidth="1.8" />
                <line x1="155" y1="320" x2="200" y2="490" stroke="#FB7185" strokeWidth="1.1" strokeDasharray="3,3" opacity="0.65" />
                <line x1="245" y1="320" x2="200" y2="490" stroke="#FB7185" strokeWidth="1.1" strokeDasharray="3,3" opacity="0.65" />
              </motion.g>
            )}

            {/* =========================================================
                PHASE 4: ABUNDANT, LARGE, RADIANT YELLOW GARDEN BLOOMS
                (MANDATORY CORE REQUIREMENT: ABUNDANT YELLOW FLOWERS)
               ========================================================= */}
            {isStepAtLeast('golden-sun-canopy') && (
              <g id="anelim-abundant-yellow-blooms">
                {/* 1. Upper-Left Golden Garden Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: 'backOut' }}
                  style={{ transformOrigin: '140px 175px' }}
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <ellipse
                      key={`ylw-ul-outer-${i}`}
                      cx="140"
                      cy="153"
                      rx="11"
                      ry="24"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 140 175)`}
                    />
                  ))}
                  {[15, 75, 135, 195, 255, 315].map((deg, i) => (
                    <ellipse
                      key={`ylw-ul-mid-${i}`}
                      cx="140"
                      cy="158"
                      rx="9.5"
                      ry="18"
                      fill="url(#anelimYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 140 175)`}
                    />
                  ))}
                  <circle cx="140" cy="175" r="12" fill="url(#anelimYellowCenterPistil)" stroke="#B45309" strokeWidth="1" />
                  <circle cx="140" cy="175" r="5" fill="#FEF08A" />
                </motion.g>

                {/* 2. Upper-Right Golden Garden Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: 'backOut' }}
                  style={{ transformOrigin: '260px 175px' }}
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <ellipse
                      key={`ylw-ur-outer-${i}`}
                      cx="260"
                      cy="153"
                      rx="11"
                      ry="24"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 260 175)`}
                    />
                  ))}
                  {[15, 75, 135, 195, 255, 315].map((deg, i) => (
                    <ellipse
                      key={`ylw-ur-mid-${i}`}
                      cx="260"
                      cy="158"
                      rx="9.5"
                      ry="18"
                      fill="url(#anelimYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 260 175)`}
                    />
                  ))}
                  <circle cx="260" cy="175" r="12" fill="url(#anelimYellowCenterPistil)" stroke="#B45309" strokeWidth="1" />
                  <circle cx="260" cy="175" r="5" fill="#FEF08A" />
                </motion.g>

                {/* 3. Flank-Left Sunburst Ranunculus Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.4, ease: 'backOut' }}
                  style={{ transformOrigin: '105px 245px' }}
                >
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                    <path
                      key={`ylw-fl-outer-${i}`}
                      d="M 105,245 C 95,225 93,205 105,190 C 117,205 115,225 105,245 Z"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.6"
                      transform={`rotate(${deg} 105 245)`}
                    />
                  ))}
                  {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                    <ellipse
                      key={`ylw-fl-mid-${i}`}
                      cx="105"
                      cy="228"
                      rx="7.5"
                      ry="17"
                      fill="url(#anelimYellowAmber)"
                      transform={`rotate(${deg} 105 245)`}
                    />
                  ))}
                  <circle cx="105" cy="245" r="11" fill="url(#anelimYellowCenterPistil)" stroke="#D97706" strokeWidth="1" />
                  <circle cx="105" cy="245" r="4.5" fill="#FEF9C3" />
                </motion.g>

                {/* 4. Flank-Right Sunburst Ranunculus Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.55, ease: 'backOut' }}
                  style={{ transformOrigin: '295px 245px' }}
                >
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                    <path
                      key={`ylw-fr-outer-${i}`}
                      d="M 295,245 C 285,225 283,205 295,190 C 307,205 305,225 295,245 Z"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.6"
                      transform={`rotate(${deg} 295 245)`}
                    />
                  ))}
                  {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                    <ellipse
                      key={`ylw-fr-mid-${i}`}
                      cx="295"
                      cy="228"
                      rx="7.5"
                      ry="17"
                      fill="url(#anelimYellowAmber)"
                      transform={`rotate(${deg} 295 245)`}
                    />
                  ))}
                  <circle cx="295" cy="245" r="11" fill="url(#anelimYellowCenterPistil)" stroke="#D97706" strokeWidth="1" />
                  <circle cx="295" cy="245" r="4.5" fill="#FEF9C3" />
                </motion.g>

                {/* 5. Front-Left Lush Golden Garden Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: 'backOut' }}
                  style={{ transformOrigin: '145px 305px' }}
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <ellipse
                      key={`ylw-bll-${i}`}
                      cx="145"
                      cy="282"
                      rx="11"
                      ry="25"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 145 305)`}
                    />
                  ))}
                  <circle cx="145" cy="305" r="13" fill="url(#anelimYellowCenterPistil)" stroke="#78350F" strokeWidth="1.2" />
                  <circle cx="145" cy="305" r="5.5" fill="#FEF08A" />
                </motion.g>

                {/* 6. Front-Right Lush Golden Garden Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.85, ease: 'backOut' }}
                  style={{ transformOrigin: '255px 305px' }}
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <ellipse
                      key={`ylw-blr-${i}`}
                      cx="255"
                      cy="282"
                      rx="11"
                      ry="25"
                      fill="url(#anelimYellowSunburst)"
                      stroke="#CA8A04"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 255 305)`}
                    />
                  ))}
                  <circle cx="255" cy="305" r="13" fill="url(#anelimYellowCenterPistil)" stroke="#78350F" strokeWidth="1.2" />
                  <circle cx="255" cy="305" r="5.5" fill="#FEF08A" />
                </motion.g>

                {/* 7. Lower Central Golden Guard Bloom */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 1.0, ease: 'backOut' }}
                  style={{ transformOrigin: '200px 325px' }}
                >
                  {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg, i) => (
                    <ellipse
                      key={`ylw-cntr-${i}`}
                      cx="200"
                      cy="305"
                      rx="9"
                      ry="21"
                      fill="url(#anelimYellowAmber)"
                      stroke="#B45309"
                      strokeWidth="0.5"
                      transform={`rotate(${deg} 200 325)`}
                    />
                  ))}
                  <circle cx="200" cy="325" r="12" fill="url(#anelimYellowCenterPistil)" stroke="#CA8A04" strokeWidth="1" />
                  <circle cx="200" cy="325" r="5" fill="#FEF9C3" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                PHASE 5: ANELIM'S UNIQUE SIGNATURE FLOWER
                "COROLA FLAMÍGERA ASTRAL EN ROJO Y ROSA"
                - Sits in majestic prominence atop the center of the bouquet (cx=200, cy=205)
                - Wide, fully open radial petals unfolding outward layer by layer
                - Palette: Pure red & pink, no other floral copies
               ========================================================= */}
            {isStepAtLeast('anelim-pedicel-ascent') && (
              <motion.g
                id="anelim-signature-flower-group"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '200px 205px' }}
              >
                {/* Luminous Red & Pink Radiance Halo */}
                <motion.circle
                  cx="200"
                  cy="205"
                  r="78"
                  fill="url(#anelimRubyNectar)"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 0.18, scale: 1 }}
                  transition={{ duration: 1.5 }}
                  filter="url(#anelimStarlightGlow)"
                />

                {/* -----------------------------------------------------
                    TIER 1: 8 OUTER REFLEXED LANCEOLATE FLAME SEPALS
                    (Deep Carmine Ruby with Crimson Ridges - Opens Outward)
                   ----------------------------------------------------- */}
                {isStepAtLeast('anelim-outer-carmine-unfold') && (
                  <g id="anelim-tier1-outer-carmine">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <motion.g
                        key={`anelim-outer-petal-${i}`}
                        initial={{ scale: 0.1, rotate: deg - 25, opacity: 0 }}
                        animate={{ scale: 1, rotate: deg, opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          delay: i * 0.05,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        style={{ transformOrigin: '200px 205px' }}
                      >
                        {/* Sculpted Lanceolate Curved Sepal Body */}
                        <path
                          d="M 200,205 C 182,175 174,135 200,118 C 226,135 218,175 200,205 Z"
                          fill="url(#anelimOuterCarmine)"
                          stroke="#881337"
                          strokeWidth="1.1"
                        />
                        {/* Longitudinal Velvet Ridge */}
                        <path
                          d="M 200,205 Q 200,150 200,120"
                          stroke="#FB7185"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          opacity="0.85"
                        />
                      </motion.g>
                    ))}
                  </g>
                )}

                {/* -----------------------------------------------------
                    TIER 2: 10 INTERMEDIATE ARCHING WAVY PETALS
                    (Vivid Coral Pink & Flame Carmine - Sinuously Opened)
                   ----------------------------------------------------- */}
                {isStepAtLeast('anelim-mid-coral-crest') && (
                  <g id="anelim-tier2-mid-coral">
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <motion.g
                        key={`anelim-mid-petal-${i}`}
                        initial={{ scale: 0.1, rotate: deg + 30, opacity: 0 }}
                        animate={{ scale: 1, rotate: deg, opacity: 1 }}
                        transition={{
                          duration: 1.1,
                          delay: i * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{ transformOrigin: '200px 205px' }}
                      >
                        {/* Sinuous Wavy Crest Petal */}
                        <path
                          d="M 200,205 C 187,185 180,155 194,138 C 203,133 211,142 215,152 C 220,166 213,186 200,205 Z"
                          fill="url(#anelimMidFlame)"
                          stroke="#BE123C"
                          strokeWidth="1.0"
                        />
                        {/* Radiant Rose Highlights */}
                        <path
                          d="M 200,205 C 195,188 190,165 200,143"
                          stroke="#FDA4AF"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                      </motion.g>
                    ))}
                  </g>
                )}

                {/* -----------------------------------------------------
                    TIER 3: 12 INNER SILK CREST PETALS
                    (Soft Silky Blossom Pink & Pearl - Radial Cup Spread)
                   ----------------------------------------------------- */}
                {isStepAtLeast('anelim-inner-rose-filaments') && (
                  <g id="anelim-tier3-inner-rose">
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                      <motion.g
                        key={`anelim-inner-petal-${i}`}
                        initial={{ scale: 0.1, rotate: deg - 20, opacity: 0 }}
                        animate={{ scale: 1, rotate: deg, opacity: 1 }}
                        transition={{
                          duration: 0.9,
                          delay: i * 0.03,
                          ease: 'easeOut',
                        }}
                        style={{ transformOrigin: '200px 205px' }}
                      >
                        <path
                          d="M 200,205 C 191,192 188,172 200,160 C 212,172 209,192 200,205 Z"
                          fill="url(#anelimInnerSilk)"
                          stroke="#E11D48"
                          strokeWidth="0.8"
                        />
                        <path
                          d="M 200,205 L 200,163"
                          stroke="#FFF1F2"
                          strokeWidth="1.0"
                          strokeLinecap="round"
                          opacity="0.95"
                        />
                      </motion.g>
                    ))}
                  </g>
                )}

                {/* -----------------------------------------------------
                    TIER 4: BOTANICAL HEART & RADIATING STAMEN CROWN
                    (16 Filament Stamens + Ruby Drupelet Nectar Core Dome)
                   ----------------------------------------------------- */}
                {isStepAtLeast('anelim-stamen-starburst-reveal') && (
                  <motion.g
                    id="anelim-stamen-core"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'backOut' }}
                    style={{ transformOrigin: '200px 205px' }}
                  >
                    {/* 16 Radial Stamens with Pearl Pink Anthers */}
                    {[
                      0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5,
                      180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5,
                    ].map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      const x2 = 200 + Math.cos(rad) * 22;
                      const y2 = 205 + Math.sin(rad) * 22;
                      return (
                        <g key={`anelim-stamen-${i}`}>
                          <line
                            x1="200"
                            y1="205"
                            x2={x2}
                            y2={y2}
                            stroke="#E11D48"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                          <circle
                            cx={x2}
                            cy={y2}
                            r="2.2"
                            fill="url(#anelimAntherPearl)"
                            stroke="#BE123C"
                            strokeWidth="0.6"
                          />
                        </g>
                      );
                    })}

                    {/* Central Faceted Ruby Nectar Dome */}
                    <circle
                      cx="200"
                      cy="205"
                      r="12.5"
                      fill="url(#anelimRubyNectar)"
                      stroke="#FF2A6D"
                      strokeWidth="1.2"
                    />

                    {/* Concentric Inner Nectar Ring */}
                    <circle
                      cx="200"
                      cy="205"
                      r="7.5"
                      fill="#FF2A6D"
                      opacity="0.8"
                    />

                    {/* Luminous Morning Dew Crystal Highlight */}
                    <ellipse
                      cx="197.5"
                      cy="202.5"
                      rx="3.5"
                      ry="2.2"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                  </motion.g>
                )}
              </motion.g>
            )}

            {/* =========================================================
                PHASE 6: SILK DUAL-RIBBON & LUXURY KNOT (CRIMSON & ROSE)
               ========================================================= */}
            {isStepAtLeast('origami-velvet-cinch') && (
              <motion.g
                id="anelim-silk-ribbon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.0, delay: 0.3 }}
                style={{ transformOrigin: '200px 395px' }}
              >
                {/* Left Crimson Ribbon Loop */}
                <path
                  d="M 200,395 C 168,375 142,398 166,420 C 182,430 196,410 200,395 Z"
                  fill="url(#anelimRibbonCarmine)"
                  stroke="#9F1239"
                  strokeWidth="1.1"
                />
                {/* Right Rose Ribbon Loop */}
                <path
                  d="M 200,395 C 232,375 258,398 234,420 C 218,430 204,410 200,395 Z"
                  fill="url(#anelimRibbonRose)"
                  stroke="#E11D48"
                  strokeWidth="1.1"
                />
                {/* Central Jewel Knot */}
                <circle cx="200" cy="395" r="8" fill="#9F1239" stroke="#FDA4AF" strokeWidth="1.4" />
                <circle cx="200" cy="395" r="4" fill="#FF2A6D" />

                {/* Cascading Ribbon Tails */}
                <path
                  d="M 195,402 Q 180,448 165,482 Q 175,460 198,406"
                  fill="url(#anelimRibbonCarmine)"
                  opacity="0.95"
                />
                <path
                  d="M 205,402 Q 220,448 235,482 Q 225,460 202,406"
                  fill="url(#anelimRibbonRose)"
                  opacity="0.95"
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
                <circle cx="175" cy="195" r="2.2" fill="#FFE4E6" filter="url(#anelimStarlightGlow)" />
                <circle cx="228" cy="200" r="2.4" fill="#FDA4AF" filter="url(#anelimStarlightGlow)" />
                <circle cx="265" cy="275" r="2.0" fill="#FEF08A" filter="url(#anelimStarlightGlow)" />
                <circle cx="135" cy="270" r="2.0" fill="#FB7185" filter="url(#anelimStarlightGlow)" />
                <circle cx="110" cy="140" r="2.2" fill="#FFE4E6" filter="url(#anelimStarlightGlow)" />
                <circle cx="290" cy="140" r="2.2" fill="#FEF08A" filter="url(#anelimStarlightGlow)" />
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
                id="btn-anelim-replay-formation"
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
                userName="Anelim"
                stageContainerId="anelim-bouquet-container"
                animationDurationMs={17000}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(225, 29, 72, 0.28)"
              />

              {/* Leer button */}
              <motion.button
                id="btn-anelim-read-text"
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
