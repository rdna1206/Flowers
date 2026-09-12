import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface GenesisBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'background-yellows'
  | 'side-blooms'
  | 'signature-iris'
  | 'heart-rose-accents'
  | 'bouquet-complete';

export const GenesisBouquetAnimation: React.FC<GenesisBouquetAnimationProps> = ({
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

    // Genesis bespoke assembly sequence: Warm earth, deep navy and golden honey iris
    const t1 = setTimeout(() => setStep('background-yellows'), 2600);
    const t2 = setTimeout(() => setStep('side-blooms'), 5200);
    const t3 = setTimeout(() => setStep('signature-iris'), 7900);
    const t4 = setTimeout(() => setStep('heart-rose-accents'), 10600);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13400);

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
    setTimeout(() => setStep('background-yellows'), 2600);
    setTimeout(() => setStep('side-blooms'), 5200);
    setTimeout(() => setStep('signature-iris'), 7900);
    setTimeout(() => setStep('heart-rose-accents'), 10600);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13400);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'background-yellows',
      'side-blooms',
      'signature-iris',
      'heart-rose-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="genesis-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Refined Beige, Royal Sapphire Blue & Golden Yellow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#1D4E89]/12 via-[#D4A373]/14 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-radial from-[#FBBF24]/18 via-[#60A5FA]/10 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1D4E89_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Card / Stage - Centered vertically and horizontally */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(29,78,137,0.16)]"
          >
            <defs>
              {/* Linen / Beige Paper Wrap Gradients */}
              <linearGradient id="genLinen1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF7F2" />
                <stop offset="40%" stopColor="#EFE5D5" />
                <stop offset="100%" stopColor="#D4C3A6" />
              </linearGradient>

              <linearGradient id="genLinen2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E6D9C5" />
                <stop offset="100%" stopColor="#C4B08F" />
              </linearGradient>

              {/* Silk Navy Ribbon Gradient */}
              <linearGradient id="genNavySilk" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="35%" stopColor="#1D4E89" />
                <stop offset="85%" stopColor="#0F2B52" />
                <stop offset="100%" stopColor="#0A1C36" />
              </linearGradient>

              {/* Gold Brooch Gradient */}
              <linearGradient id="genGoldBrooch" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="45%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Yellow Floral Gradients */}
              <linearGradient id="genGoldenRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="genSunnyPeony" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="genWildCosmos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="85%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="genCenterRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="genDaffodilPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="50%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              {/* SIGNATURE FLOWER: Sapphire & Porcelain Star-Iris */}
              <linearGradient id="genSapphireIris" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="30%" stopColor="#3B82F6" />
                <stop offset="75%" stopColor="#1D4E89" />
                <stop offset="100%" stopColor="#0E2749" />
              </linearGradient>

              <linearGradient id="genPorcelainVein" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#F5EFEB" />
                <stop offset="100%" stopColor="#D4A373" />
              </linearGradient>

              {/* Pampas & Leaves Gradients */}
              <linearGradient id="genPampasPlume" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FAF6F0" />
                <stop offset="45%" stopColor="#E5D9C4" />
                <stop offset="100%" stopColor="#B8A383" />
              </linearGradient>

              <linearGradient id="genEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="genStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="genDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F2B52" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, BACK FOLIAGE & BASE WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="gen-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="gen-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 225 450" stroke="url(#genStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 455" stroke="url(#genStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 275 450" stroke="url(#genStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 238 448" stroke="url(#genStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 264 452" stroke="url(#genStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="gen-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Top Signature Iris (250, 150) */}
                  <path d="M 250 360 L 250 160" stroke="url(#genStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left Ranunculus (185, 185) */}
                  <path d="M 250 360 Q 210 270 185 195" stroke="url(#genStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Peony (315, 185) */}
                  <path d="M 250 360 Q 290 270 315 195" stroke="url(#genStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Cosmos (150, 245) */}
                  <path d="M 250 360 Q 195 305 155 250" stroke="url(#genStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Narcissus (350, 245) */}
                  <path d="M 250 360 Q 305 305 345 250" stroke="url(#genStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#genStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Pampas Plume (Soft Beige) */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '230px 350px' }}
                >
                  <path
                    d="M 230 350 Q 170 240 135 125 Q 130 105 145 120 Q 160 155 185 235 Q 210 310 230 350 Z"
                    fill="url(#genPampasPlume)"
                    opacity="0.9"
                  />
                  <path
                    d="M 135 125 Q 115 110 125 123 M 140 143 Q 118 133 132 145 M 150 163 Q 128 155 142 167"
                    stroke="#D4C3A6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.g>

                {/* Right Pampas Plume (Soft Beige) */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '270px 350px' }}
                >
                  <path
                    d="M 270 350 Q 330 240 365 125 Q 370 105 355 120 Q 340 155 315 235 Q 290 310 270 350 Z"
                    fill="url(#genPampasPlume)"
                    opacity="0.9"
                  />
                  <path
                    d="M 365 125 Q 385 110 375 123 M 360 143 Q 382 133 368 145 M 350 163 Q 372 155 358 167"
                    stroke="#D4C3A6"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.g>

                {/* Eucalyptus and Sage Sprigs (Deep Slate-Blue Leaves) */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.0, delay: 0.2 }}
                  style={{ transformOrigin: '250px 340px' }}
                >
                  {/* Top-Left Eucalyptus branch */}
                  <path d="M 240 340 Q 200 230 185 105" stroke="url(#genStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="180" cy="115" rx="10" ry="7" fill="url(#genEucalyptus)" transform="rotate(-35 180 115)" />
                  <ellipse cx="195" cy="140" rx="11" ry="8" fill="url(#genEucalyptus)" transform="rotate(25 195 140)" />
                  <ellipse cx="190" cy="175" rx="12" ry="8" fill="url(#genEucalyptus)" transform="rotate(-20 190 175)" />

                  {/* Top-Right Eucalyptus branch */}
                  <path d="M 260 340 Q 300 230 315 105" stroke="url(#genStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="320" cy="115" rx="10" ry="7" fill="url(#genEucalyptus)" transform="rotate(35 320 115)" />
                  <ellipse cx="305" cy="140" rx="11" ry="8" fill="url(#genEucalyptus)" transform="rotate(-25 305 140)" />
                  <ellipse cx="310" cy="175" rx="12" ry="8" fill="url(#genEucalyptus)" transform="rotate(20 310 175)" />
                </motion.g>

                {/* Back Wrap Linen Layer */}
                <motion.path
                  d="M 140 295 L 235 415 L 265 415 L 360 295 Q 250 340 140 295 Z"
                  fill="url(#genLinen1)"
                  stroke="#C4B08F"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: BACKGROUND YELLOW BLOOMS (Ranunculus & Golden Peony)
               ========================================================= */}
            {isStepAtLeast('background-yellows') && (
              <g id="gen-layer-bg-yellows">
                {/* Left Upper Golden Ranunculus (x: 185, y: 185) */}
                <g id="gen-flower-ranunculus" transform="translate(185, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-14)"
                    filter="url(#genDrop)"
                  >
                    {/* Outer concentric petals */}
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
                      <ellipse
                        key={`ran-out-${i}`}
                        cx="0"
                        cy="-22"
                        rx="13"
                        ry="18"
                        fill="url(#genGoldenRanunculus)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Mid petals */}
                    {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((deg, i) => (
                      <ellipse
                        key={`ran-mid-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10"
                        ry="14"
                        fill="#FACC15"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Inner core swirl */}
                    <circle cx="0" cy="0" r="10" fill="#F59E0B" />
                    <circle cx="0" cy="0" r="6" fill="#B45309" />
                    <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                  </motion.g>
                </g>

                {/* Right Upper Golden Peony (x: 315, y: 185) */}
                <g id="gen-flower-peony" transform="translate(315, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(16)"
                    filter="url(#genDrop)"
                  >
                    {/* Scalloped ruffled outer petals */}
                    {[0, 51, 102, 153, 204, 255, 306].map((deg, i) => (
                      <path
                        key={`peony-pet-${i}`}
                        d="M -15 0 C -22 -26 -5 -34 0 -34 C 5 -34 22 -26 15 0 Z"
                        fill="url(#genSunnyPeony)"
                        stroke="#D97706"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Inner ruffled layer */}
                    {[25, 76, 127, 178, 229, 280, 331].map((deg, i) => (
                      <path
                        key={`peony-in-${i}`}
                        d="M -11 0 C -16 -18 -4 -24 0 -24 C 4 -24 16 -18 11 0 Z"
                        fill="#FEF08A"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="5" fill="#FFFBEB" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 3: SIDE BLOOMS (Star-Cosmos, Narcissus & Buds)
               ========================================================= */}
            {isStepAtLeast('side-blooms') && (
              <g id="gen-layer-side-blooms">
                {/* Left Flank Wild Sunny Cosmos (x: 150, y: 245) */}
                <g id="gen-flower-cosmos" transform="translate(150, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-22)"
                    filter="url(#genDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <g key={`cos-${i}`} transform={`rotate(${deg})`}>
                        <path
                          d="M -6 -8 Q -8 -26 0 -32 Q 8 -26 6 -8 Z"
                          fill="url(#genWildCosmos)"
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

                {/* Right Flank Golden Narcissus / Daffodil (x: 350, y: 245) */}
                <g id="gen-flower-narcissus" transform="translate(350, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(24)"
                    filter="url(#genDrop)"
                  >
                    {/* 6 Pointed Star Petals */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <path
                        key={`narc-${i}`}
                        d="M -9 0 Q -15 -22 0 -33 Q 15 -22 9 0 Z"
                        fill="url(#genDaffodilPetal)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Ruffled Golden Trumpet Crown */}
                    <circle cx="0" cy="0" r="12" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="8" fill="#FACC15" />
                    <circle cx="0" cy="0" r="4" fill="#78350F" />
                    <circle cx="0" cy="0" r="2" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Left Mini Buttercup Buds & Foliage (x: 185, y: 285) */}
                <g transform="translate(185, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.25 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-10)"
                  >
                    <ellipse cx="-12" cy="0" rx="7" ry="10" fill="#FDE047" stroke="#D97706" strokeWidth="0.5" />
                    <ellipse cx="6" cy="-4" rx="8" ry="11" fill="#FACC15" stroke="#D97706" strokeWidth="0.5" />
                    <circle cx="6" cy="-4" r="3" fill="#B45309" />
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
                    <circle cx="0" cy="0" r="10" fill="#F59E0B" stroke="#CA8A04" strokeWidth="0.6" />
                    <circle cx="0" cy="0" r="7" fill="#FDE047" />
                    <circle cx="12" cy="-8" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 4: SIGNATURE SPECIAL FLOWER - SAPPHIRE & PORCELAIN STAR-IRIS
               ========================================================= */}
            {isStepAtLeast('signature-iris') && (
              <g id="gen-layer-signature-iris" transform="translate(250, 150)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#genDrop)"
                >
                  {/* Subtle sapphire ethereal glow aura */}
                  <circle cx="0" cy="0" r="38" fill="url(#genSapphireIris)" opacity="0.16" filter="blur(6px)" />

                  {/* 3 Drooping Lower Falls (Sapphire Cobalt Blue with Porcelain Veins) */}
                  {[-45, 45, 180].map((deg, i) => (
                    <g key={`iris-fall-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -13 0 Q -24 30 0 46 Q 24 30 13 0 Z"
                        fill="url(#genSapphireIris)"
                        stroke="#1D4E89"
                        strokeWidth="0.8"
                      />
                      {/* Porcelain Beige & Gold Vein */}
                      <path
                        d="M 0 4 Q 0 28 0 40"
                        stroke="url(#genPorcelainVein)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Golden Yellow Stamen Beard */}
                      <ellipse cx="0" cy="16" rx="3" ry="6" fill="#FACC15" />
                      <circle cx="0" cy="18" r="1.2" fill="#FFFBEB" />
                    </g>
                  ))}

                  {/* 3 Upright Standards (Luminous Azure with Porcelain Rim) */}
                  {[0, 120, 240].map((deg, i) => (
                    <g key={`iris-std-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -10 0 Q -15 -35 0 -44 Q 15 -35 10 0 Z"
                        fill="url(#genSapphireIris)"
                        stroke="#60A5FA"
                        strokeWidth="0.8"
                        opacity="0.95"
                      />
                      <path
                        d="M -9 -4 Q -13 -30 0 -38 Q 13 -30 9 -4"
                        stroke="#FAF7F2"
                        strokeWidth="0.8"
                        fill="none"
                        opacity="0.85"
                      />
                    </g>
                  ))}

                  {/* Center Crown & Gold Seed Core */}
                  <circle cx="0" cy="0" r="10" fill="#1D4E89" stroke="#93C5FD" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="6.5" fill="#D4A373" />
                  <circle cx="0" cy="0" r="4" fill="#FACC15" />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: HEART GOLDEN ROSE & DELICATE SAPPHIRE/BEIGE FILLERS
               ========================================================= */}
            {isStepAtLeast('heart-rose-accents') && (
              <g id="gen-layer-heart-rose">
                {/* Complementary Sapphire Mini-Florets */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.1 }}
                  style={{ transformOrigin: '250px 245px' }}
                >
                  {/* Left Sapphire accent cluster (x: 205, y: 235) */}
                  <g transform="translate(205, 235)">
                    {[0, 72, 144, 216, 288].map((deg, i) => (
                      <circle key={`bl-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#3B82F6" transform={`rotate(${deg})`} />
                    ))}
                    <circle cx="0" cy="0" r="3" fill="#FDE047" />
                  </g>

                  {/* Right Sapphire accent cluster (x: 295, y: 235) */}
                  <g transform="translate(295, 235)">
                    {[0, 72, 144, 216, 288].map((deg, i) => (
                      <circle key={`bl-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#2563EB" transform={`rotate(${deg})`} />
                    ))}
                    <circle cx="0" cy="0" r="3" fill="#FFFBEB" />
                  </g>
                </motion.g>

                {/* Lush Full Center Golden Rose (x: 250, y: 245) - Perfectly anchored to heart stems */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#genDrop)"
                  >
                    {/* Outer Rose Calyx and Petals */}
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#genCenterRose)"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                    {/* Middle Petal Ring */}
                    <path
                      d="M -24 -8 C -30 -24 -8 -30 0 -30 C 8 -30 30 -24 24 -8 C 26 14 8 22 0 22 C -8 22 -26 14 -24 -8 Z"
                      fill="#FDE047"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                    {/* Inner Petal Ring */}
                    <path
                      d="M -15 -6 C -18 -16 -4 -20 0 -20 C 4 -20 18 -16 15 -6 C 16 10 4 15 0 15 C -4 15 -16 10 -15 -6 Z"
                      fill="#F59E0B"
                      stroke="#78350F"
                      strokeWidth="0.6"
                    />
                    {/* Heart Core */}
                    <circle cx="0" cy="-2" r="6" fill="#FEF08A" stroke="#B45309" strokeWidth="0.5" />
                    <circle cx="0" cy="-2" r="3" fill="#D97706" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: ARTISAN LINEN WRAP FRONT FOLDS & NAVY SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="gen-layer-front-wrap">
                {/* Left Fold Layer */}
                <motion.path
                  d="M 135 290 L 250 415 L 255 350 L 155 260 Z"
                  fill="url(#genLinen2)"
                  stroke="#C4B08F"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold Layer */}
                <motion.path
                  d="M 365 290 L 250 415 L 245 350 L 345 260 Z"
                  fill="url(#genLinen1)"
                  stroke="#C4B08F"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Diagonal Soft Fold Seams */}
                <path d="M 155 270 L 245 400" stroke="#D4C3A6" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.65" />
                <path d="M 345 270 L 255 400" stroke="#D4C3A6" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.65" />
              </g>
            )}

            {/* Silk Navy Bow & Golden Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="gen-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Flowing Navy Ribbon Tail */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#genNavySilk)"
                  />
                  {/* Right Flowing Navy Ribbon Tail */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#genNavySilk)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#genNavySilk)"
                    stroke="#1D4E89"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#genNavySilk)"
                    stroke="#3B82F6"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#genNavySilk)"
                    stroke="#3B82F6"
                    strokeWidth="0.6"
                  />

                  {/* Golden Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#genGoldBrooch)" />
                  <circle cx="0" cy="1" r="2.8" fill="#FFFBEB" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING GOLD & SAPPHIRE POLLEN PARTICLES
               ========================================================= */}
            {isCompleted && (
              <g id="gen-pollen-sparks">
                {[
                  { x: 175, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 325, y: 140, color: '#FDE047', size: 2.4, delay: 0.5 },
                  { x: 250, y: 95, color: '#60A5FA', size: 2.6, delay: 0.9 },
                  { x: 140, y: 210, color: '#FEF08A', size: 2.0, delay: 0.3 },
                  { x: 360, y: 215, color: '#FBBF24', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#93C5FD', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#D4A373', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`gen-spark-${idx}`}
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
              id="btn-genesis-read-text"
              type="button"
              onClick={onProceedToReading || onProceedToResponse}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#F59E0B]" />
              <span>Leer</span>
              <ArrowRight className="w-4 h-4 text-white/70 stroke-[2.2]" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
