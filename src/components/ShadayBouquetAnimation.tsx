import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface ShadayBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-upper'
  | 'yellow-flanks'
  | 'signature-mystic'
  | 'yellow-heart-accents'
  | 'bouquet-complete';

export const ShadayBouquetAnimation: React.FC<ShadayBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(
    mode === 'result' ? 'bouquet-complete' : 'stems-wrap'
  );
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('stems-wrap');
    setIsCompleted(false);

    // Shaday's bespoke assembly sequence: lateral crescent unfurl then obsidian-crimson signature bloom
    const t1 = setTimeout(() => setStep('yellow-flanks'), 1900);
    const t2 = setTimeout(() => setStep('yellow-upper'), 4200);
    const t3 = setTimeout(() => setStep('signature-mystic'), 6900);
    const t4 = setTimeout(() => setStep('yellow-heart-accents'), 9600);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsCompleted(false);
    setStep('stems-wrap');
    setTimeout(() => setStep('yellow-flanks'), 1900);
    setTimeout(() => setStep('yellow-upper'), 4200);
    setTimeout(() => setStep('signature-mystic'), 6900);
    setTimeout(() => setStep('yellow-heart-accents'), 9600);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12100);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-upper',
      'yellow-flanks',
      'signature-mystic',
      'yellow-heart-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="shaday-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Deep Midnight Obsidian backdrop with warm Golden Yellow core & subtle Ruby/Sapphire hints */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[#1E3A8A]/16 via-[#0F172A]/40 to-transparent blur-3xl opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#FACC15]/20 via-[#DC2626]/12 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#FACC15_1px,transparent_1px)] [background-size:30px_30px] opacity-8" />
      </div>

      {/* Main Bouquet Card / Stage - Centered vertically and horizontally */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_35px_rgba(250,204,21,0.2)]"
          >
            <defs>
              {/* Obsidian & Pure White Paper Wrap Gradients */}
              <linearGradient id="shdObsidianWrap1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="50%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#09090B" />
              </linearGradient>

              <linearGradient id="shdObsidianWrap2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3F3F46" />
                <stop offset="50%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="shdWhiteLining" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              {/* Crimson Silk Ribbon Gradient */}
              <linearGradient id="shdCrimsonRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="35%" stopColor="#DC2626" />
                <stop offset="75%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#450A0A" />
              </linearGradient>

              {/* Pearl Sapphire Brooch Center */}
              <linearGradient id="shdPearlBrooch" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#1D4E89" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS */}
              <linearGradient id="shdGoldenDahlia" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="shdSunnyGardenRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="shdWildYellowCosmos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="85%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="shdGoldenNarcissus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              <linearGradient id="shdCenterHeartYellowRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* SIGNATURE FLOWER ONLY: Shaday's Mystic Rose in Azul, Negro, Blanco y Rojo */}
              <linearGradient id="shdSignatureBloom" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="20%" stopColor="#EF4444" />
                <stop offset="50%" stopColor="#991B1B" />
                <stop offset="80%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="shdSignatureCore" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>

              {/* Stems and Foliage Gradients */}
              <linearGradient id="shdStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#090D16" />
              </linearGradient>

              <linearGradient id="shdEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="shdDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, FOLIAGE & BASE OBSIDIAN WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="shd-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="shd-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 225 450" stroke="url(#shdStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 455" stroke="url(#shdStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 275 450" stroke="url(#shdStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 238 448" stroke="url(#shdStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 264 452" stroke="url(#shdStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="shd-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Top Mystic Rose (250, 145) */}
                  <path d="M 250 360 L 250 155" stroke="url(#shdStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left Golden Dahlia (175, 185) */}
                  <path d="M 250 360 Q 205 270 175 195" stroke="url(#shdStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Garden Rose (325, 185) */}
                  <path d="M 250 360 Q 295 270 325 195" stroke="url(#shdStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Wild Cosmos (140, 245) */}
                  <path d="M 250 360 Q 190 305 145 250" stroke="url(#shdStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Golden Narcissus (360, 245) */}
                  <path d="M 250 360 Q 310 305 355 250" stroke="url(#shdStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Heart Yellow Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#shdStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Frosted Silver & Slate Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 190 230 165 105" stroke="url(#shdStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="160" cy="115" rx="10" ry="7" fill="url(#shdEucalyptus)" transform="rotate(-35 160 115)" />
                  <ellipse cx="175" cy="140" rx="11" ry="8" fill="url(#shdEucalyptus)" transform="rotate(25 175 140)" />
                  <ellipse cx="170" cy="175" rx="12" ry="8" fill="url(#shdEucalyptus)" transform="rotate(-20 170 175)" />
                </motion.g>

                {/* Right Frosted Silver & Slate Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 310 230 335 105" stroke="url(#shdStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="340" cy="115" rx="10" ry="7" fill="url(#shdEucalyptus)" transform="rotate(35 340 115)" />
                  <ellipse cx="325" cy="140" rx="11" ry="8" fill="url(#shdEucalyptus)" transform="rotate(-25 325 140)" />
                  <ellipse cx="330" cy="175" rx="12" ry="8" fill="url(#shdEucalyptus)" transform="rotate(20 330 175)" />
                </motion.g>

                {/* Back Wrap Layer (Obsidian) */}
                <motion.path
                  d="M 140 295 L 235 415 L 265 415 L 360 295 Q 250 340 140 295 Z"
                  fill="url(#shdObsidianWrap1)"
                  stroke="#3F3F46"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: UPPER YELLOW BLOOMS (Golden Dahlia & Garden Rose)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="shd-layer-upper-yellows">
                {/* Upper-Left Golden Dahlia (x: 175, y: 185) */}
                <g id="shd-golden-dahlia" transform="translate(175, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-12)"
                    filter="url(#shdDrop)"
                  >
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                      <path
                        key={`dah-out-${i}`}
                        d="M -7 0 Q -10 -22 0 -30 Q 10 -22 7 0 Z"
                        fill="url(#shdGoldenDahlia)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg, i) => (
                      <path
                        key={`dah-in-${i}`}
                        d="M -5 0 Q -7 -16 0 -22 Q 7 -16 5 0 Z"
                        fill="#FEF08A"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#F59E0B" />
                    <circle cx="0" cy="0" r="5" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Upper-Right Sunny Garden Rose (x: 325, y: 185) */}
                <g id="shd-sunny-rose" transform="translate(325, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(14)"
                    filter="url(#shdDrop)"
                  >
                    <path
                      d="M -32 -4 C -38 -28 -12 -36 0 -36 C 12 -36 38 -28 32 -4 C 34 20 12 28 0 28 C -12 28 -34 20 -32 -4 Z"
                      fill="url(#shdSunnyGardenRose)"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M -22 -6 C -28 -22 -8 -28 0 -28 C 8 -28 28 -22 22 -6 C 24 12 8 20 0 20 C -8 20 -24 12 -22 -6 Z"
                      fill="#FDE047"
                      stroke="#CA8A04"
                      strokeWidth="0.6"
                    />
                    <path
                      d="M -13 -4 C -16 -14 -4 -18 0 -18 C 4 -18 16 -14 13 -4 C 14 8 4 12 0 12 C -4 12 -14 8 -13 -4 Z"
                      fill="#F59E0B"
                      stroke="#78350F"
                      strokeWidth="0.5"
                    />
                    <circle cx="0" cy="-2" r="5" fill="#FEF9C3" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 3: SIDE YELLOW BLOOMS (Wild Cosmos & Golden Narcissus)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="shd-layer-side-yellows">
                {/* Left Flank Wild Yellow Cosmos (x: 140, y: 245) */}
                <g id="shd-wild-cosmos" transform="translate(140, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-20)"
                    filter="url(#shdDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <g key={`cos-${i}`} transform={`rotate(${deg})`}>
                        <path
                          d="M -6 -8 Q -8 -26 0 -32 Q 8 -26 6 -8 Z"
                          fill="url(#shdWildYellowCosmos)"
                          stroke="#CA8A04"
                          strokeWidth="0.6"
                        />
                        <path d="M 0 -8 L 0 -27" stroke="#FEF9C3" strokeWidth="0.8" opacity="0.8" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="6" fill="#F59E0B" />
                    <circle cx="0" cy="0" r="3" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Right Flank Golden Narcissus (x: 360, y: 245) */}
                <g id="shd-golden-narcissus" transform="translate(360, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(22)"
                    filter="url(#shdDrop)"
                  >
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <path
                        key={`narc-${i}`}
                        d="M -9 0 Q -15 -22 0 -33 Q 15 -22 9 0 Z"
                        fill="url(#shdGoldenNarcissus)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="12" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="8" fill="#FACC15" />
                    <circle cx="0" cy="0" r="4" fill="#78350F" />
                    <circle cx="0" cy="0" r="2" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Left Mini Yellow Buds (x: 185, y: 285) */}
                <g transform="translate(185, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.25 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-10)"
                  >
                    <ellipse cx="-10" cy="0" rx="6" ry="9" fill="#FDE047" stroke="#D97706" strokeWidth="0.5" />
                    <ellipse cx="6" cy="-4" rx="7" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                    <circle cx="6" cy="-4" r="2.5" fill="#B45309" />
                  </motion.g>
                </g>

                {/* Right Mini Golden Craspedia Spheres (x: 315, y: 285) */}
                <g transform="translate(315, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(12)"
                  >
                    <circle cx="0" cy="0" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
                    <circle cx="-2" cy="-2" r="2" fill="#FEF08A" opacity="0.8" />
                    <circle cx="10" cy="-6" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 4: SIGNATURE SPECIAL FLOWER - SHADAY'S MYSTIC ROSE (Azul, Negro, Blanco y Rojo)
               ========================================================= */}
            {isStepAtLeast('signature-mystic') && (
              <g id="shd-layer-signature-mystic" transform="translate(250, 145)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#shdDrop)"
                >
                  {/* Subtle ethereal ruby & sapphire celestial aura */}
                  <circle cx="0" cy="0" r="42" fill="url(#shdSignatureBloom)" opacity="0.22" filter="blur(7px)" />

                  {/* Outer Petals: Crimson Velvet bordered in fine White Light */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <g key={`sig-out-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -16 0 C -26 -30 -6 -44 0 -44 C 6 -44 26 -30 16 0 Z"
                        fill="url(#shdSignatureBloom)"
                        stroke="#FFFFFF"
                        strokeWidth="0.6"
                      />
                      <path d="M 0 -8 L 0 -36" stroke="#93C5FD" strokeWidth="0.8" opacity="0.7" />
                    </g>
                  ))}

                  {/* Mid Petals: Deep Obsidian & Midnight Sapphire */}
                  {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                    <path
                      key={`sig-mid-${i}`}
                      d="M -12 0 C -18 -22 -4 -32 0 -32 C 4 -32 18 -22 12 0 Z"
                      fill="#0F172A"
                      stroke="#2563EB"
                      strokeWidth="0.7"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Inner Swirl Petals: Radiant Ruby Crimson with Pure White Core Edge */}
                  {[10, 82, 154, 226, 298].map((deg, i) => (
                    <ellipse
                      key={`sig-in-${i}`}
                      cx="0"
                      cy="-14"
                      rx="9"
                      ry="13"
                      fill="#DC2626"
                      stroke="#F8FAFC"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Sapphire & Lunar White Crystal Core */}
                  <circle cx="0" cy="0" r="11" fill="url(#shdSignatureCore)" stroke="#FFFFFF" strokeWidth="0.9" />
                  <circle cx="0" cy="0" r="6" fill="#1E3A8A" />
                  <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                  <circle cx="0" cy="0" r="1.5" fill="#EF4444" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: HEART YELLOW ROSE & WARM ACCENTS
               ========================================================= */}
            {isStepAtLeast('yellow-heart-accents') && (
              <g id="shd-layer-heart-yellow-rose">
                {/* Yellow Accent Florets */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`yel-shd-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>

                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`yel-shd-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>

                {/* Lush Heart Yellow Rose (x: 250, y: 245) - Perfectly anchored to heart stems */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#shdDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#shdCenterHeartYellowRose)"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M -24 -8 C -30 -24 -8 -30 0 -30 C 8 -30 30 -24 24 -8 C 26 14 8 22 0 22 C -8 22 -26 14 -24 -8 Z"
                      fill="#FDE047"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M -15 -6 C -18 -16 -4 -20 0 -20 C 4 -20 18 -16 15 -6 C 16 10 4 15 0 15 C -4 15 -16 10 -15 -6 Z"
                      fill="#F59E0B"
                      stroke="#78350F"
                      strokeWidth="0.6"
                    />
                    <circle cx="0" cy="-2" r="6" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
                    <circle cx="0" cy="-2" r="3" fill="#D97706" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: ARTISAN OBSIDIAN WRAP FRONT FOLDS & CRIMSON SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="shd-layer-front-wrap">
                {/* Left Fold Layer (Obsidian with Pure White Lapel) */}
                <motion.path
                  d="M 135 290 L 250 415 L 255 350 L 155 260 Z"
                  fill="url(#shdObsidianWrap2)"
                  stroke="#3F3F46"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* White Lapel Fold on Left */}
                <path d="M 140 285 L 155 260 L 195 300 Z" fill="url(#shdWhiteLining)" opacity="0.95" />

                {/* Right Fold Layer (Obsidian with Pure White Lapel) */}
                <motion.path
                  d="M 365 290 L 250 415 L 245 350 L 345 260 Z"
                  fill="url(#shdObsidianWrap1)"
                  stroke="#3F3F46"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* White Lapel Fold on Right */}
                <path d="M 360 285 L 345 260 L 305 300 Z" fill="url(#shdWhiteLining)" opacity="0.95" />

                {/* Elegant Seam Lines */}
                <path d="M 155 270 L 245 400" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.55" />
                <path d="M 345 270 L 255 400" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.55" />
              </g>
            )}

            {/* Crimson Silk Bow with Pearl Sapphire Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="shd-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#shdCrimsonRibbon)"
                  />
                  {/* Right Ribbon Tail */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#shdCrimsonRibbon)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#shdCrimsonRibbon)"
                    stroke="#7F1D1D"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#shdCrimsonRibbon)"
                    stroke="#EF4444"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#shdCrimsonRibbon)"
                    stroke="#EF4444"
                    strokeWidth="0.6"
                  />

                  {/* Pearl Sapphire Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#shdPearlBrooch)" />
                  <circle cx="0" cy="1" r="2.8" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING GOLDEN & SAPPHIRE/CRIMSON SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="shd-pollen-sparks">
                {[
                  { x: 175, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 325, y: 140, color: '#FEF08A', size: 2.4, delay: 0.5 },
                  { x: 250, y: 90, color: '#60A5FA', size: 2.6, delay: 0.9 },
                  { x: 140, y: 210, color: '#FDE047', size: 2.0, delay: 0.3 },
                  { x: 360, y: 215, color: '#EF4444', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#FFFFFF', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#FACC15', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`shd-spark-${idx}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    animate={{
                      y: [-2, -12, -2],
                      opacity: [0.25, 0.95, 0.25],
                      scale: [0.85, 1.2, 0.85],
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

        {/* Acción directa y minimalista 'Leer' */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.button
              id="btn-shaday-read-text"
              type="button"
              onClick={onProceedToReading || onProceedToResponse}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#F87171]" />
              <span>Leer</span>
              <ArrowRight className="w-4 h-4 text-white/70 stroke-[2.2]" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
