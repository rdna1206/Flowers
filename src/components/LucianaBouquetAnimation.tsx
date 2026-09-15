import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface LucianaBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-flanks'
  | 'yellow-upper'
  | 'signature-mystic'
  | 'yellow-center-accents'
  | 'bouquet-complete';

export const LucianaBouquetAnimation: React.FC<LucianaBouquetAnimationProps> = ({
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

    // Luciana's bespoke assembly sequence: Dark stems + Yellow foundation + Mystic Imperial Flower
    const t1 = setTimeout(() => setStep('yellow-flanks'), 2700);
    const t2 = setTimeout(() => setStep('yellow-upper'), 5400);
    const t3 = setTimeout(() => setStep('signature-mystic'), 8100);
    const t4 = setTimeout(() => setStep('yellow-center-accents'), 10800);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13500);

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
    setTimeout(() => setStep('yellow-flanks'), 2700);
    setTimeout(() => setStep('yellow-upper'), 5400);
    setTimeout(() => setStep('signature-mystic'), 8100);
    setTimeout(() => setStep('yellow-center-accents'), 10800);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13500);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-flanks',
      'yellow-upper',
      'signature-mystic',
      'yellow-center-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="luciana-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Electric Violet & Warm Antique Gold over velvety obsidian */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#9333EA]/16 via-[#D97706]/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#FACC15]/16 via-[#7E22CE]/10 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#9333EA_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            id="luciana-bouquet-svg"
            data-flower-stage="true"
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(147,51,234,0.22)]"
          >
            <defs>
              {/* Obsidian & Midnight Plum Paper Wrap Gradients */}
              <linearGradient id="lucWrapBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E1065" />
                <stop offset="50%" stopColor="#17082E" />
                <stop offset="100%" stopColor="#0B0314" />
              </linearGradient>

              <linearGradient id="lucWrapFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B0764" />
                <stop offset="50%" stopColor="#1E0B36" />
                <stop offset="100%" stopColor="#0F041C" />
              </linearGradient>

              <linearGradient id="lucWrapFrontRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4C1D95" />
                <stop offset="50%" stopColor="#240E40" />
                <stop offset="100%" stopColor="#120521" />
              </linearGradient>

              {/* Silk Ribbons: Electric Violet & Pure Gold */}
              <linearGradient id="lucRibbonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="35%" stopColor="#A855F7" />
                <stop offset="75%" stopColor="#7E22CE" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>

              <linearGradient id="lucRibbonGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="80%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              <linearGradient id="lucBroochOnyx" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="30%" stopColor="#0F172A" />
                <stop offset="80%" stopColor="#000000" />
                <stop offset="100%" stopColor="#7E22CE" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS (Handcrafted botanical variations) */}
              <linearGradient id="lucGoldenRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="lucSaffronGardenRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="lucSunnyAnemone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="80%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>

              <linearGradient id="lucCanaryWildBloom" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="30%" stopColor="#FFF59D" />
                <stop offset="70%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>

              <linearGradient id="lucHeartRoseYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* LUCIANA'S SIGNATURE SPECIAL FLOWER GRADIENTS (Black, Electric Purple, Gold, White) */}
              <linearGradient id="lucMysticObsidian" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B0764" />
                <stop offset="35%" stopColor="#1E1B4B" />
                <stop offset="75%" stopColor="#0F081D" />
                <stop offset="100%" stopColor="#05020A" />
              </linearGradient>

              <linearGradient id="lucElectricPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F3E8FF" />
                <stop offset="30%" stopColor="#C084FC" />
                <stop offset="70%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>

              <linearGradient id="lucPureGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>

              <linearGradient id="lucMoonWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FAF5FF" />
                <stop offset="100%" stopColor="#E9D5FF" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="lucStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="lucDarkEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="lucDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#0F051D" floodOpacity="0.28" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, DARK FOLIAGE & MIDNIGHT WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="luc-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="luc-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 222 454" stroke="url(#lucStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 460" stroke="url(#lucStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 278 454" stroke="url(#lucStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 235 448" stroke="url(#lucStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 265 450" stroke="url(#lucStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="luc-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Special Mystic Flower (250, 145) */}
                  <path d="M 250 360 L 250 155" stroke="url(#lucStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Golden Peony (330, 180) */}
                  <path d="M 250 360 Q 300 270 330 190" stroke="url(#lucStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left Saffron Garden Rose (170, 185) */}
                  <path d="M 250 360 Q 200 270 170 195" stroke="url(#lucStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Canary Ranunculus (135, 245) */}
                  <path d="M 250 360 Q 185 305 140 250" stroke="url(#lucStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Sunny Anemone (365, 245) */}
                  <path d="M 250 360 Q 315 305 360 250" stroke="url(#lucStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Lush Heart Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#lucStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Deep Eucalyptus Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 185 230 155 105" stroke="url(#lucStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="150" cy="115" rx="10" ry="7" fill="url(#lucDarkEucalyptus)" transform="rotate(-35 150 115)" />
                  <ellipse cx="168" cy="140" rx="11" ry="8" fill="url(#lucDarkEucalyptus)" transform="rotate(25 168 140)" />
                  <ellipse cx="162" cy="175" rx="12" ry="8" fill="url(#lucDarkEucalyptus)" transform="rotate(-20 162 175)" />
                </motion.g>

                {/* Right Deep Eucalyptus Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 315 230 345 105" stroke="url(#lucStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="350" cy="115" rx="10" ry="7" fill="url(#lucDarkEucalyptus)" transform="rotate(35 350 115)" />
                  <ellipse cx="332" cy="140" rx="11" ry="8" fill="url(#lucDarkEucalyptus)" transform="rotate(-25 332 140)" />
                  <ellipse cx="338" cy="175" rx="12" ry="8" fill="url(#lucDarkEucalyptus)" transform="rotate(20 338 175)" />
                </motion.g>

                {/* Back Wrap Layer (Midnight Plum Paper with Gold Filigree Line) */}
                <motion.path
                  d="M 135 295 L 235 415 L 265 415 L 365 295 Q 250 340 135 295 Z"
                  fill="url(#lucWrapBack)"
                  stroke="#7E22CE"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: FLANK YELLOW BLOOMS (Ranunculus & Sunny Anemone)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="luc-layer-flank-yellows">
                {/* Left Flank Canary Ranunculus (x: 135, y: 245) */}
                <g id="luc-canary-ranunculus" transform="translate(135, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-24)"
                    filter="url(#lucDrop)"
                  >
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <ellipse
                        key={`ran-luc-${i}`}
                        cx="0"
                        cy="-21"
                        rx="13"
                        ry="18"
                        fill="url(#lucGoldenRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <ellipse
                        key={`ran-luc-in-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10"
                        ry="14"
                        fill="#FEF08A"
                        stroke="#92400E"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="4.5" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Right Flank Sunny Anemone (x: 365, y: 245) */}
                <g id="luc-sunny-anemone" transform="translate(365, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(22)"
                    filter="url(#lucDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <g key={`ane-luc-${i}`} transform={`rotate(${deg})`}>
                        <path
                          d="M -6 -8 Q -9 -26 0 -32 Q 9 -26 6 -8 Z"
                          fill="url(#lucSunnyAnemone)"
                          stroke="#CA8A04"
                          strokeWidth="0.6"
                        />
                        <path d="M 0 -8 L 0 -26" stroke="#FEF9C3" strokeWidth="0.8" opacity="0.8" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="9.5" fill="#B45309" />
                    <circle cx="0" cy="0" r="5" fill="#FACC15" />
                    <circle cx="0" cy="0" r="2" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Left Mini Amber Buds (x: 180, y: 285) */}
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

                {/* Right Mini Gold Buttons (x: 320, y: 285) */}
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
                TIER 3: UPPER YELLOW BLOOMS (Saffron Rose & Golden Peony)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="luc-layer-upper-yellows">
                {/* Upper-Left Saffron Garden Rose (x: 170, y: 185) */}
                <g id="luc-saffron-rose" transform="translate(170, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-14)"
                    filter="url(#lucDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#lucSaffronGardenRose)"
                      stroke="#B45309"
                      strokeWidth="0.75"
                    />
                    <path
                      d="M -24 -6 C -30 -22 -8 -28 0 -28 C 8 -28 28 -22 24 -6 C 26 14 8 20 0 20 C -8 20 -26 14 -24 -6 Z"
                      fill="#FDE047"
                      stroke="#D97706"
                      strokeWidth="0.6"
                    />
                    <path
                      d="M -14 -4 C -18 -16 -4 -18 0 -18 C 4 -18 18 -16 14 -4 C 15 8 4 12 0 12 C -4 12 -15 8 -14 -4 Z"
                      fill="#F59E0B"
                      stroke="#78350F"
                      strokeWidth="0.5"
                    />
                    <circle cx="0" cy="-2" r="5" fill="#FFFDF7" />
                  </motion.g>
                </g>

                {/* Upper-Right Golden Peony (x: 330, y: 180) */}
                <g id="luc-golden-peony" transform="translate(330, 180)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(15)"
                    filter="url(#lucDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={`peo-luc-out-${i}`}
                        cx="0"
                        cy="-22"
                        rx="14"
                        ry="20"
                        fill="url(#lucCanaryWildBloom)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                      <ellipse
                        key={`peo-luc-in-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10.5"
                        ry="15"
                        fill="#FDE047"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="5" fill="#FACC15" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 4: SIGNATURE SPECIAL FLOWER - LUCIANA'S MYSTIC IMPERIAL BLOOM
                (Negro Ónix, Morado Oscuro Eléctrico, Oro Puro y Blanco Luna)
               ========================================================= */}
            {isStepAtLeast('signature-mystic') && (
              <g id="luc-layer-signature-flower" transform="translate(250, 145)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.25, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#lucDrop)"
                >
                  {/* Subtle electric violet starlight aura */}
                  <circle cx="0" cy="0" r="48" fill="url(#lucElectricPurple)" opacity="0.22" filter="blur(8px)" />
                  <circle cx="0" cy="0" r="38" fill="url(#lucPureGold)" opacity="0.16" filter="blur(5px)" />

                  {/* LAYER 1 (Outer Imperial Guard Petals): Deep Obsidian Black with Electric Violet Edges */}
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                    <g key={`luc-obs-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -8 0 C -15 -14 -16 -28 0 -35 C 16 -28 15 -14 8 0 Z"
                        fill="url(#lucMysticObsidian)"
                        stroke="#A855F7"
                        strokeWidth="0.8"
                        opacity="0.96"
                      />
                      <path d="M 0 -8 L 0 -30" stroke="#C084FC" strokeWidth="0.75" opacity="0.7" />
                    </g>
                  ))}

                  {/* LAYER 2 (Mid Petals): Electric Violet Velvet Petals */}
                  {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                    <ellipse
                      key={`luc-elec-${i}`}
                      cx="0"
                      cy="-20"
                      rx="12"
                      ry="18"
                      fill="url(#lucElectricPurple)"
                      stroke="#FDE047"
                      strokeWidth="0.65"
                      transform={`rotate(${deg})`}
                      opacity="0.96"
                    />
                  ))}

                  {/* LAYER 3 (Inner Ring): Moon White Radiant Petals */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={`luc-wht-${i}`}
                      cx="0"
                      cy="-14"
                      rx="9.5"
                      ry="14"
                      fill="url(#lucMoonWhite)"
                      stroke="#FAF5FF"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                      opacity="0.96"
                    />
                  ))}

                  {/* LAYER 4 (Heart Crown): Pure Gold Filigree Petal Swirls */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <path
                      key={`luc-gold-swirl-${i}`}
                      d="M -6 0 C -10 -11 -2 -17 0 -17 C 2 -17 10 -11 6 0 Z"
                      fill="url(#lucPureGold)"
                      stroke="#92400E"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Crystal Core: Pure Moon Diamond in Gold Setting */}
                  <circle cx="0" cy="0" r="9" fill="#0A0314" stroke="#FDE047" strokeWidth="1.0" />
                  <circle cx="0" cy="0" r="5.5" fill="#7E22CE" />
                  <circle cx="0" cy="0" r="3.2" fill="#FAF5FF" />
                  <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: LUSH HEART YELLOW ROSE & WARM ACCENTS
               ========================================================= */}
            {isStepAtLeast('yellow-center-accents') && (
              <g id="luc-layer-heart-yellow-rose">
                {/* Yellow Accent Florets (left) */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`luc-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>

                {/* Amber Accent Florets (right) */}
                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`luc-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>

                {/* Lush Heart Yellow Garden Rose (x: 250, y: 245) - Centered and anchored */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#lucDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#lucHeartRoseYellow)"
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
                    <circle cx="0" cy="-2" r="6" fill="#FFFDF5" stroke="#D97706" strokeWidth="0.5" />
                    <circle cx="0" cy="-2" r="3" fill="#CA8A04" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: ARTISAN WRAP FRONT FOLDS & PURPLE/GOLD SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="luc-layer-front-wrap">
                {/* Left Fold Layer */}
                <motion.path
                  d="M 130 290 L 250 415 L 255 350 L 150 260 Z"
                  fill="url(#lucWrapFrontLeft)"
                  stroke="#7E22CE"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold Layer */}
                <motion.path
                  d="M 370 290 L 250 415 L 245 350 L 350 260 Z"
                  fill="url(#lucWrapFrontRight)"
                  stroke="#A855F7"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Gold Filigree Crease Lines */}
                <path d="M 150 270 L 245 400" stroke="#FACC15" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
                <path d="M 350 270 L 255 400" stroke="#FACC15" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
              </g>
            )}

            {/* Electric Purple & Gold Silk Ribbon with Obsidian Jewel */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="luc-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail (Electric Purple Silk) */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#lucRibbonPurple)"
                  />
                  {/* Right Ribbon Tail (Gold Silk) */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#lucRibbonGold)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#lucRibbonPurple)"
                    stroke="#D97706"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop (Purple) */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#lucRibbonPurple)"
                    stroke="#E9D5FF"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop (Gold) */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#lucRibbonGold)"
                    stroke="#FEF08A"
                    strokeWidth="0.6"
                  />

                  {/* Obsidian & Gold Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#lucBroochOnyx)" stroke="#FACC15" strokeWidth="0.75" />
                  <circle cx="0" cy="1" r="2.5" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING VIOLET, GOLD & AMBER SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="luc-pollen-sparks">
                {[
                  { x: 170, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 330, y: 140, color: '#FEF08A', size: 2.4, delay: 0.5 },
                  { x: 250, y: 85, color: '#C084FC', size: 2.6, delay: 0.9 },
                  { x: 235, y: 95, color: '#FDE047', size: 2.4, delay: 0.4 },
                  { x: 135, y: 210, color: '#9333EA', size: 2.2, delay: 0.3 },
                  { x: 365, y: 215, color: '#FACC15', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#FFFFFF', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#FACC15', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`luc-spark-${idx}`}
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

        {/* Acciones directas y elegantes */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full px-4">
          {isCompleted && (
            <>
              {/* Replay Formation Button */}
              <motion.button
                id="btn-luciana-replay-formation"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.4 }}
                title="Repetir animación"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#C084FC] shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#C084FC]" />
              </motion.button>

              {/* Guardar Flor Button */}
              <SaveFlowerButton
                userName="Luciana"
                stageContainerId="luciana-bouquet-container"
                animationDurationMs={13500}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(168, 85, 247, 0.28)"
              />

              <motion.button
                id="btn-luciana-read-text"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
