import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface AndreaBouquetAnimationProps {
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
  | 'signature-orchid'
  | 'yellow-heart-accents'
  | 'bouquet-complete';

export const AndreaBouquetAnimation: React.FC<AndreaBouquetAnimationProps> = ({
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

    // Andrea's bespoke assembly sequence: Sophisticated orchid bloom choreography
    const t1 = setTimeout(() => setStep('yellow-upper'), 2500);
    const t2 = setTimeout(() => setStep('yellow-flanks'), 5100);
    const t3 = setTimeout(() => setStep('signature-orchid'), 7700);
    const t4 = setTimeout(() => setStep('yellow-heart-accents'), 10200);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12900);

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
    setTimeout(() => setStep('yellow-upper'), 2500);
    setTimeout(() => setStep('yellow-flanks'), 5100);
    setTimeout(() => setStep('signature-orchid'), 7700);
    setTimeout(() => setStep('yellow-heart-accents'), 10200);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12900);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-upper',
      'yellow-flanks',
      'signature-orchid',
      'yellow-heart-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="andrea-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Soft Warm Honey Yellow with delicate Rose-Purple warmth */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#F59E0B]/14 via-[#BE123C]/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-radial from-[#FDE047]/18 via-[#7C3AED]/8 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Card / Stage - Centered vertically and horizontally */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(217,119,6,0.18)]"
          >
            <defs>
              {/* Artisan Wrap Gradients (Soft Blush Paper) */}
              <linearGradient id="andWrap1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7ED" />
                <stop offset="45%" stopColor="#FFE4E6" />
                <stop offset="100%" stopColor="#FECDD3" />
              </linearGradient>

              <linearGradient id="andWrap2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>

              {/* Velvet Amethyst & Wine Ribbon Gradient */}
              <linearGradient id="andRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333EA" />
                <stop offset="35%" stopColor="#7C3AED" />
                <stop offset="80%" stopColor="#581C87" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>

              {/* Ruby Brooch Gradient */}
              <linearGradient id="andBroochGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDA4AF" />
                <stop offset="40%" stopColor="#BE123C" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              {/* YELLOW BLOOM GRADIENTS */}
              <linearGradient id="andHoneyPeony" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="andGoldenRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="andCanaryRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="andGoldenTulip" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="30%" stopColor="#FFF59D" />
                <stop offset="70%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>

              <linearGradient id="andHeartYellowRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* SIGNATURE FLOWER ONLY: Andrea's Royal Carmine & Amethyst Orchid */}
              <linearGradient id="andSignatureOrchid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBCFE8" />
                <stop offset="30%" stopColor="#E11D48" />
                <stop offset="70%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>

              <linearGradient id="andOrchidLip" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="40%" stopColor="#F43F5E" />
                <stop offset="80%" stopColor="#9F1239" />
                <stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="andStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="andEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="andDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#1E293B" floodOpacity="0.16" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, FOLIAGE & BASE BLUSH WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="and-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="and-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 225 450" stroke="url(#andStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 455" stroke="url(#andStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 275 450" stroke="url(#andStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 238 448" stroke="url(#andStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 264 452" stroke="url(#andStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="and-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Top Orchid (250, 145) */}
                  <path d="M 250 360 L 250 155" stroke="url(#andStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left Peony (180, 185) */}
                  <path d="M 250 360 Q 205 270 180 195" stroke="url(#andStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Ranunculus (320, 185) */}
                  <path d="M 250 360 Q 295 270 320 195" stroke="url(#andStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Canary Rose (140, 245) */}
                  <path d="M 250 360 Q 190 305 145 250" stroke="url(#andStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Golden Tulip (355, 245) */}
                  <path d="M 250 360 Q 310 305 350 250" stroke="url(#andStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Yellow Heart Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#andStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Airy Eucalyptus & Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 195 230 170 105" stroke="url(#andStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="165" cy="115" rx="10" ry="7" fill="url(#andEucalyptus)" transform="rotate(-35 165 115)" />
                  <ellipse cx="180" cy="140" rx="11" ry="8" fill="url(#andEucalyptus)" transform="rotate(25 180 140)" />
                  <ellipse cx="175" cy="175" rx="12" ry="8" fill="url(#andEucalyptus)" transform="rotate(-20 175 175)" />
                </motion.g>

                {/* Right Airy Eucalyptus & Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 305 230 330 105" stroke="url(#andStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="335" cy="115" rx="10" ry="7" fill="url(#andEucalyptus)" transform="rotate(35 335 115)" />
                  <ellipse cx="320" cy="140" rx="11" ry="8" fill="url(#andEucalyptus)" transform="rotate(-25 320 140)" />
                  <ellipse cx="325" cy="175" rx="12" ry="8" fill="url(#andEucalyptus)" transform="rotate(20 325 175)" />
                </motion.g>

                {/* Back Wrap Blush Paper Layer */}
                <motion.path
                  d="M 140 295 L 235 415 L 265 415 L 360 295 Q 250 340 140 295 Z"
                  fill="url(#andWrap1)"
                  stroke="#FDBA74"
                  strokeWidth="1.0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: UPPER YELLOW BLOOMS (Honey Peony & Layered Ranunculus)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="and-layer-upper-yellows">
                {/* Upper-Left Open Honey Peony (x: 180, y: 185) */}
                <g id="and-honey-peony" transform="translate(180, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-12)"
                    filter="url(#andDrop)"
                  >
                    {/* Outer ruffled yellow petals */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={`hpeo-out-${i}`}
                        cx="0"
                        cy="-22"
                        rx="14"
                        ry="20"
                        fill="url(#andHoneyPeony)"
                        stroke="#D97706"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Mid golden petals */}
                    {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                      <ellipse
                        key={`hpeo-mid-${i}`}
                        cx="0"
                        cy="-15"
                        rx="11"
                        ry="15"
                        fill="#FDE047"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {/* Pistil core */}
                    <circle cx="0" cy="0" r="10" fill="#D97706" />
                    <circle cx="0" cy="0" r="6" fill="#FACC15" />
                    <circle cx="0" cy="0" r="3" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Upper-Right Layered Golden Ranunculus (x: 320, y: 185) */}
                <g id="and-ranunculus" transform="translate(320, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(14)"
                    filter="url(#andDrop)"
                  >
                    {/* Concentric layered golden petals */}
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <ellipse
                        key={`ran-out-${i}`}
                        cx="0"
                        cy="-20"
                        rx="13"
                        ry="18"
                        fill="url(#andGoldenRanunculus)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <ellipse
                        key={`ran-mid-${i}`}
                        cx="0"
                        cy="-14"
                        rx="10"
                        ry="14"
                        fill="#FEF08A"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="5" fill="#FFFDF0" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 3: SIDE YELLOW BLOOMS (Canary Tea Rose & Golden Tulip)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="and-layer-side-yellows">
                {/* Left Flank Canary Tea Rose (x: 140, y: 245) */}
                <g id="and-canary-rose" transform="translate(140, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-20)"
                    filter="url(#andDrop)"
                  >
                    <path
                      d="M -32 -4 C -38 -28 -12 -36 0 -36 C 12 -36 38 -28 32 -4 C 34 20 12 28 0 28 C -12 28 -34 20 -32 -4 Z"
                      fill="url(#andCanaryRose)"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M -22 -6 C -28 -22 -8 -28 0 -28 C 8 -28 28 -22 22 -6 C 24 12 8 20 0 20 C -8 20 -24 12 -22 -6 Z"
                      fill="#FDE047"
                      stroke="#D97706"
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

                {/* Right Flank Golden Tulip (x: 355, y: 245) */}
                <g id="and-golden-tulip" transform="translate(355, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(22)"
                    filter="url(#andDrop)"
                  >
                    <path
                      d="M -22 15 C -30 -10 -15 -35 0 -38 C 15 -35 30 -10 22 15 C 10 28 -10 28 -22 15 Z"
                      fill="url(#andGoldenTulip)"
                      stroke="#CA8A04"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M -12 10 C -18 -8 -8 -30 0 -34 C 8 -30 18 -8 12 10 C 6 20 -6 20 -12 10 Z"
                      fill="#FFF59D"
                      stroke="#F57F17"
                      strokeWidth="0.6"
                    />
                    <path d="M -8 -20 Q 0 -30 8 -20" stroke="#FFFDE7" strokeWidth="1.2" fill="none" />
                  </motion.g>
                </g>

                {/* Left Mini Yellow Daisy Buds (x: 180, y: 285) */}
                <g transform="translate(180, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.25 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-12)"
                  >
                    <circle cx="-10" cy="0" r="6" fill="#FACC15" stroke="#D97706" strokeWidth="0.5" />
                    <circle cx="4" cy="-4" r="7" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
                    <circle cx="16" cy="2" r="5" fill="#FEF08A" />
                  </motion.g>
                </g>

                {/* Right Mini Golden Craspedia Buttons (x: 320, y: 285) */}
                <g transform="translate(320, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(12)"
                  >
                    <circle cx="0" cy="0" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
                    <circle cx="0" cy="0" r="6" fill="#FDE047" />
                    <circle cx="12" cy="-6" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 4: SIGNATURE SPECIAL FLOWER - ANDREA'S ROYAL CARMINE & AMETHYST ORCHID
               ========================================================= */}
            {isStepAtLeast('signature-orchid') && (
              <g id="and-layer-signature-orchid" transform="translate(250, 145)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#andDrop)"
                >
                  {/* Subtle Ethereal Carmine & Amethyst Aura */}
                  <circle cx="0" cy="0" r="40" fill="url(#andSignatureOrchid)" opacity="0.18" filter="blur(6px)" />

                  {/* 3 Upper Sepals (Rich Carmine-Amethyst) */}
                  <path d="M 0 -8 Q -16 -40 0 -50 Q 16 -40 0 -8 Z" fill="url(#andSignatureOrchid)" stroke="#9F1239" strokeWidth="0.8" />
                  <path d="M -6 0 Q -38 -15 -46 5 Q -25 15 -6 0 Z" fill="url(#andSignatureOrchid)" stroke="#7C3AED" strokeWidth="0.8" />
                  <path d="M 6 0 Q 38 -15 46 5 Q 25 15 6 0 Z" fill="url(#andSignatureOrchid)" stroke="#7C3AED" strokeWidth="0.8" />

                  {/* 2 Broad Lateral Petals (Luminous Amethyst & Blush Orchid) */}
                  <path
                    d="M -5 2 C -26 -14 -42 -2 0 35 Z"
                    fill="url(#andSignatureOrchid)"
                    stroke="#C084FC"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />
                  <path
                    d="M 5 2 C 26 -14 42 -2 0 35 Z"
                    fill="url(#andSignatureOrchid)"
                    stroke="#C084FC"
                    strokeWidth="0.8"
                    opacity="0.95"
                  />

                  {/* Orchid Central Lip (Labellum) - Ruby Red with White & Gold Veining */}
                  <path
                    d="M -14 4 C -22 24 -10 42 0 46 C 10 42 22 24 14 4 Z"
                    fill="url(#andOrchidLip)"
                    stroke="#881337"
                    strokeWidth="0.9"
                  />
                  {/* Delicate Labellum Veins */}
                  <path d="M 0 6 L 0 38" stroke="#FFE4E6" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M -5 18 Q 0 25 5 18" stroke="#FDE047" strokeWidth="1.0" fill="none" />

                  {/* Orchid Golden Column Core */}
                  <ellipse cx="0" cy="8" rx="5" ry="7" fill="#FDE047" stroke="#BE123C" strokeWidth="0.8" />
                  <circle cx="0" cy="8" r="2.5" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: HEART GOLDEN ROSE & DELICATE WARM FILLERS
               ========================================================= */}
            {isStepAtLeast('yellow-heart-accents') && (
              <g id="and-layer-heart-yellow-rose">
                {/* Yellow Accent Florets (left) */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`yel-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>

                {/* Amber Accent Florets (right) */}
                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`yel-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>

                {/* Lush Heart Yellow Rose (x: 250, y: 245) - Centered and anchored */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#andDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#andHeartYellowRose)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                    />
                    <path
                      d="M -24 -8 C -30 -24 -8 -30 0 -30 C 8 -30 30 -24 24 -8 C 26 14 8 22 0 22 C -8 22 -26 14 -24 -8 Z"
                      fill="#FEF08A"
                      stroke="#D97706"
                      strokeWidth="0.7"
                    />
                    <path
                      d="M -15 -6 C -18 -16 -4 -20 0 -20 C 4 -20 18 -16 15 -6 C 16 10 4 15 0 15 C -4 15 -16 10 -15 -6 Z"
                      fill="#F59E0B"
                      stroke="#78350F"
                      strokeWidth="0.6"
                    />
                    <circle cx="0" cy="-2" r="6" fill="#FFFDF7" stroke="#D97706" strokeWidth="0.5" />
                    <circle cx="0" cy="-2" r="3" fill="#CA8A04" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: ARTISAN WRAP FRONT FOLDS & VELVET AMETHYST BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="and-layer-front-wrap">
                {/* Left Fold Layer */}
                <motion.path
                  d="M 135 290 L 250 415 L 255 350 L 155 260 Z"
                  fill="url(#andWrap2)"
                  stroke="#FDBA74"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold Layer */}
                <motion.path
                  d="M 365 290 L 250 415 L 245 350 L 345 260 Z"
                  fill="url(#andWrap1)"
                  stroke="#FDBA74"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Crease Lines */}
                <path d="M 155 270 L 245 400" stroke="#FED7AA" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.65" />
                <path d="M 345 270 L 255 400" stroke="#FED7AA" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.65" />
              </g>
            )}

            {/* Velvet Amethyst & Wine Ribbon with Ruby Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="and-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#andRibbonGrad)"
                  />
                  {/* Right Ribbon Tail */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#andRibbonGrad)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#andRibbonGrad)"
                    stroke="#581C87"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#andRibbonGrad)"
                    stroke="#C084FC"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#andRibbonGrad)"
                    stroke="#C084FC"
                    strokeWidth="0.6"
                  />

                  {/* Ruby Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#andBroochGrad)" />
                  <circle cx="0" cy="1" r="2.8" fill="#FFF1F2" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING GOLDEN & ORCHID SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="and-pollen-sparks">
                {[
                  { x: 175, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 325, y: 140, color: '#FEF08A', size: 2.4, delay: 0.5 },
                  { x: 250, y: 90, color: '#C084FC', size: 2.6, delay: 0.9 },
                  { x: 140, y: 210, color: '#FDE047', size: 2.0, delay: 0.3 },
                  { x: 360, y: 215, color: '#F59E0B', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#FDA4AF', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#FACC15', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`and-spark-${idx}`}
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
              id="btn-andrea-read-text"
              type="button"
              onClick={onProceedToReading || onProceedToResponse}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#FDA4AF]" />
              <span>Leer</span>
              <ArrowRight className="w-4 h-4 text-white/70 stroke-[2.2]" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
