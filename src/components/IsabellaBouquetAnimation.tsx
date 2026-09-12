import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface IsabellaBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-upper'
  | 'yellow-flanks'
  | 'signature-prism'
  | 'yellow-heart-accents'
  | 'bouquet-complete';

export const IsabellaBouquetAnimation: React.FC<IsabellaBouquetAnimationProps> = ({
  mode = 'formation',
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

    // Isabella's bespoke assembly sequence: Yellow blooms base + Single Signature Pastel Prism Peony
    const t1 = setTimeout(() => setStep('yellow-upper'), 2200);
    const t2 = setTimeout(() => setStep('yellow-flanks'), 4800);
    const t3 = setTimeout(() => setStep('signature-prism'), 7400);
    const t4 = setTimeout(() => setStep('yellow-heart-accents'), 10000);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12800);

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
    setTimeout(() => setStep('yellow-upper'), 2200);
    setTimeout(() => setStep('yellow-flanks'), 4800);
    setTimeout(() => setStep('signature-prism'), 7400);
    setTimeout(() => setStep('yellow-heart-accents'), 10000);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12800);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-upper',
      'yellow-flanks',
      'signature-prism',
      'yellow-heart-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="isabella-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Soft Pastel Dream with warm golden yellow core & delicate lilac-blush reflections */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#C084FC]/14 via-[#F472B6]/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#FDE047]/18 via-[#86EFAC]/10 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#C084FC_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Card / Stage - Centered vertically and horizontally */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(192,132,252,0.18)]"
          >
            <defs>
              {/* Pearl & Soft Lilac Wrapping Gradients */}
              <linearGradient id="isaPearlWrap1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FAF5FF" />
                <stop offset="100%" stopColor="#EDE9FE" />
              </linearGradient>

              <linearGradient id="isaPearlWrap2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="50%" stopColor="#F5F3FF" />
                <stop offset="100%" stopColor="#DDD6FE" />
              </linearGradient>

              {/* Pastel Lavender Silk Ribbon Gradient */}
              <linearGradient id="isaLavenderRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="35%" stopColor="#C084FC" />
                <stop offset="75%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#6B21A8" />
              </linearGradient>

              {/* Rose Quartz Brooch Center */}
              <linearGradient id="isaBroochGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FBCFE8" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>

              {/* YELLOW BLOOM GRADIENTS */}
              <linearGradient id="isaSunnyPeony" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="isaGoldenRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF0" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="isaCanaryRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="isaGoldenCosmos" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="35%" stopColor="#FFF59D" />
                <stop offset="75%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>

              <linearGradient id="isaHeartYellowRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* SIGNATURE FLOWER ONLY: Isabella's Pastel Prism Peony (Azul, Rosadito Pastel, Verdecito Pastel y Lila) */}
              <linearGradient id="isaPastelBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="40%" stopColor="#BFDBFE" />
                <stop offset="80%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>

              <linearGradient id="isaPastelPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="40%" stopColor="#FBCFE8" />
                <stop offset="80%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>

              <linearGradient id="isaPastelGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0FDF4" />
                <stop offset="40%" stopColor="#BBF7D0" />
                <stop offset="80%" stopColor="#86EFAC" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>

              <linearGradient id="isaPastelLilac" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF5FF" />
                <stop offset="40%" stopColor="#E9D5FF" />
                <stop offset="80%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="isaStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="60%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="isaEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="isaDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#334155" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, FOLIAGE & BASE PEARL WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="isa-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="isa-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 225 450" stroke="url(#isaStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 455" stroke="url(#isaStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 275 450" stroke="url(#isaStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 238 448" stroke="url(#isaStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 264 452" stroke="url(#isaStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="isa-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Top Pastel Prism Peony (250, 145) */}
                  <path d="M 250 360 L 250 155" stroke="url(#isaStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left Peony (175, 185) */}
                  <path d="M 250 360 Q 205 270 175 195" stroke="url(#isaStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Ranunculus (325, 185) */}
                  <path d="M 250 360 Q 295 270 325 195" stroke="url(#isaStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Canary Rose (140, 245) */}
                  <path d="M 250 360 Q 190 305 145 250" stroke="url(#isaStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Golden Cosmos (360, 245) */}
                  <path d="M 250 360 Q 310 305 355 250" stroke="url(#isaStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Heart Yellow Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#isaStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Airy Eucalyptus & Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 190 230 165 105" stroke="url(#isaStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="160" cy="115" rx="10" ry="7" fill="url(#isaEucalyptus)" transform="rotate(-35 160 115)" />
                  <ellipse cx="175" cy="140" rx="11" ry="8" fill="url(#isaEucalyptus)" transform="rotate(25 175 140)" />
                  <ellipse cx="170" cy="175" rx="12" ry="8" fill="url(#isaEucalyptus)" transform="rotate(-20 170 175)" />
                </motion.g>

                {/* Right Airy Eucalyptus & Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 310 230 335 105" stroke="url(#isaStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="340" cy="115" rx="10" ry="7" fill="url(#isaEucalyptus)" transform="rotate(35 340 115)" />
                  <ellipse cx="325" cy="140" rx="11" ry="8" fill="url(#isaEucalyptus)" transform="rotate(-25 325 140)" />
                  <ellipse cx="330" cy="175" rx="12" ry="8" fill="url(#isaEucalyptus)" transform="rotate(20 330 175)" />
                </motion.g>

                {/* Back Wrap Layer (Pearl Lilac Paper) */}
                <motion.path
                  d="M 140 295 L 235 415 L 265 415 L 360 295 Q 250 340 140 295 Z"
                  fill="url(#isaPearlWrap1)"
                  stroke="#DDD6FE"
                  strokeWidth="1.0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: UPPER YELLOW BLOOMS (Sunny Peony & Golden Ranunculus)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="isa-layer-upper-yellows">
                {/* Upper-Left Open Sunny Peony (x: 175, y: 185) */}
                <g id="isa-sunny-peony" transform="translate(175, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-12)"
                    filter="url(#isaDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={`speo-out-${i}`}
                        cx="0"
                        cy="-22"
                        rx="14"
                        ry="20"
                        fill="url(#isaSunnyPeony)"
                        stroke="#D97706"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                      <ellipse
                        key={`speo-mid-${i}`}
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
                    <circle cx="0" cy="0" r="10" fill="#D97706" />
                    <circle cx="0" cy="0" r="6" fill="#FACC15" />
                    <circle cx="0" cy="0" r="3" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Upper-Right Layered Golden Ranunculus (x: 325, y: 185) */}
                <g id="isa-ranunculus" transform="translate(325, 185)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(14)"
                    filter="url(#isaDrop)"
                  >
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <ellipse
                        key={`ran-out-${i}`}
                        cx="0"
                        cy="-20"
                        rx="13"
                        ry="18"
                        fill="url(#isaGoldenRanunculus)"
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
                TIER 3: SIDE YELLOW BLOOMS (Canary Tea Rose & Golden Cosmos)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="isa-layer-side-yellows">
                {/* Left Flank Canary Tea Rose (x: 140, y: 245) */}
                <g id="isa-canary-rose" transform="translate(140, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-20)"
                    filter="url(#isaDrop)"
                  >
                    <path
                      d="M -32 -4 C -38 -28 -12 -36 0 -36 C 12 -36 38 -28 32 -4 C 34 20 12 28 0 28 C -12 28 -34 20 -32 -4 Z"
                      fill="url(#isaCanaryRose)"
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

                {/* Right Flank Golden Cosmos (x: 360, y: 245) */}
                <g id="isa-golden-cosmos" transform="translate(360, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(22)"
                    filter="url(#isaDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <g key={`cos-isa-${i}`} transform={`rotate(${deg})`}>
                        <path
                          d="M -6 -8 Q -8 -26 0 -32 Q 8 -26 6 -8 Z"
                          fill="url(#isaGoldenCosmos)"
                          stroke="#CA8A04"
                          strokeWidth="0.6"
                        />
                        <path d="M 0 -8 L 0 -27" stroke="#FFFDE7" strokeWidth="0.8" opacity="0.8" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#F59E0B" />
                    <circle cx="0" cy="0" r="5" fill="#FDE047" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Left Mini Yellow Buds (x: 180, y: 285) */}
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
                TIER 4: SIGNATURE SPECIAL FLOWER - ISABELLA'S PASTEL PRISM PEONY
                (Harmoniously combining: Azul, Rosadito Pastel, Verdecito Pastel y Lila)
               ========================================================= */}
            {isStepAtLeast('signature-prism') && (
              <g id="isa-layer-signature-prism" transform="translate(250, 145)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#isaDrop)"
                >
                  {/* Subtle ethereal rainbow-pastel celestial halo */}
                  <circle cx="0" cy="0" r="44" fill="url(#isaPastelLilac)" opacity="0.18" filter="blur(7px)" />

                  {/* LAYER 1 (Outer Petals): Azul Celeste Pastel */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={`isa-az-${i}`}
                      cx="0"
                      cy="-24"
                      rx="14"
                      ry="20"
                      fill="url(#isaPastelBlue)"
                      stroke="#93C5FD"
                      strokeWidth="0.7"
                      transform={`rotate(${deg})`}
                      opacity="0.95"
                    />
                  ))}

                  {/* LAYER 2 (Mid-Outer Petals): Rosadito Pastel */}
                  {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                    <ellipse
                      key={`isa-pk-${i}`}
                      cx="0"
                      cy="-18"
                      rx="12"
                      ry="17"
                      fill="url(#isaPastelPink)"
                      stroke="#F472B6"
                      strokeWidth="0.7"
                      transform={`rotate(${deg})`}
                      opacity="0.95"
                    />
                  ))}

                  {/* LAYER 3 (Inner Ring Petals): Verdecito Menta Pastel */}
                  {[10, 55, 100, 145, 190, 235, 280, 325].map((deg, i) => (
                    <ellipse
                      key={`isa-gr-${i}`}
                      cx="0"
                      cy="-13"
                      rx="10"
                      ry="14"
                      fill="url(#isaPastelGreen)"
                      stroke="#4ADE80"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                      opacity="0.95"
                    />
                  ))}

                  {/* LAYER 4 (Heart Petal Swirl): Lila Lavanda Pastel */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <path
                      key={`isa-lil-${i}`}
                      d="M -7 0 C -12 -12 -2 -18 0 -18 C 2 -18 12 -12 7 0 Z"
                      fill="url(#isaPastelLilac)"
                      stroke="#C084FC"
                      strokeWidth="0.7"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Crystal Dew Core with Gold Whispers */}
                  <circle cx="0" cy="0" r="9" fill="#FFFDF7" stroke="#C084FC" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="5" fill="#FDE047" />
                  <circle cx="0" cy="0" r="2.2" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: HEART YELLOW ROSE & WARM ACCENTS
               ========================================================= */}
            {isStepAtLeast('yellow-heart-accents') && (
              <g id="isa-layer-heart-yellow-rose">
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
                    filter="url(#isaDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#isaHeartYellowRose)"
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
                TIER 6: ARTISAN WRAP FRONT FOLDS & LAVENDER SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="isa-layer-front-wrap">
                {/* Left Fold Layer */}
                <motion.path
                  d="M 135 290 L 250 415 L 255 350 L 155 260 Z"
                  fill="url(#isaPearlWrap2)"
                  stroke="#DDD6FE"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold Layer */}
                <motion.path
                  d="M 365 290 L 250 415 L 245 350 L 345 260 Z"
                  fill="url(#isaPearlWrap1)"
                  stroke="#DDD6FE"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Crease Lines */}
                <path d="M 155 270 L 245 400" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
                <path d="M 345 270 L 255 400" stroke="#C084FC" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
              </g>
            )}

            {/* Lavender Silk Ribbon with Rose Quartz Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="isa-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#isaLavenderRibbon)"
                  />
                  {/* Right Ribbon Tail */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#isaLavenderRibbon)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#isaLavenderRibbon)"
                    stroke="#9333EA"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#isaLavenderRibbon)"
                    stroke="#E9D5FF"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#isaLavenderRibbon)"
                    stroke="#E9D5FF"
                    strokeWidth="0.6"
                  />

                  {/* Rose Quartz Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#isaBroochGrad)" />
                  <circle cx="0" cy="1" r="2.8" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING GOLDEN & PASTEL SPARKS (Azul, Rosa, Verde, Lila)
               ========================================================= */}
            {isCompleted && (
              <g id="isa-pollen-sparks">
                {[
                  { x: 175, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 325, y: 140, color: '#FEF08A', size: 2.4, delay: 0.5 },
                  { x: 250, y: 90, color: '#C084FC', size: 2.6, delay: 0.9 },
                  { x: 140, y: 210, color: '#60A5FA', size: 2.2, delay: 0.3 },
                  { x: 360, y: 215, color: '#F472B6', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#86EFAC', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#FACC15', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`isa-spark-${idx}`}
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

        {/* Action Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          {isCompleted && (
            <>
              {/* Enter User Response */}
              <motion.button
                id="btn-isabella-enter-response"
                type="button"
                onClick={onProceedToResponse}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#C084FC] via-[#F472B6] to-[#60A5FA] hover:from-[#A855F7] hover:to-[#3B82F6] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_0_24px_rgba(192,132,252,0.35)] transition-all hover:scale-102 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Mi respuesta</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>

              {/* View Personal Message from Admin */}
              {onBackToReading && (
                <button
                  id="btn-isabella-view-message"
                  type="button"
                  onClick={onBackToReading}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#C084FC]/30 hover:border-[#C084FC] bg-[#FAF5FF]/80 hover:bg-[#FAF5FF] text-[#9333EA] text-xs transition-colors cursor-pointer"
                  title="Mensaje"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#9333EA]" />
                  <span>Mensaje</span>
                </button>
              )}

              {/* Replay Bouquet Assembly */}
              <button
                id="btn-isabella-replay-bouquet"
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#E9D5FF] hover:border-[#C084FC] bg-[#FAF5FF]/70 hover:bg-[#EDE9FE] text-[#64748B] hover:text-[#9333EA] text-xs transition-colors cursor-pointer"
                title="Volver a armar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a armar</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
