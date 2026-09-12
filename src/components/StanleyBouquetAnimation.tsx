import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface StanleyBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-structure'
  | 'signature-monochrome'
  | 'yellow-crown'
  | 'center-accents'
  | 'bouquet-complete';

export const StanleyBouquetAnimation: React.FC<StanleyBouquetAnimationProps> = ({
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

    // Stanley's bespoke assembly sequence: Structured Stems + Base Yellow Blooms + Monochromatic Signature Bloom (Black & White)
    const t1 = setTimeout(() => setStep('yellow-structure'), 2100);
    const t2 = setTimeout(() => setStep('signature-monochrome'), 4500);
    const t3 = setTimeout(() => setStep('yellow-crown'), 7200);
    const t4 = setTimeout(() => setStep('center-accents'), 9700);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12200);

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
    setTimeout(() => setStep('yellow-structure'), 2100);
    setTimeout(() => setStep('signature-monochrome'), 4500);
    setTimeout(() => setStep('yellow-crown'), 7200);
    setTimeout(() => setStep('center-accents'), 9700);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12200);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-structure',
      'signature-monochrome',
      'yellow-crown',
      'center-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="stanley-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Crisp Monochrome & Clean Golden Sunlight */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-radial from-[#FACC15]/14 via-[#334155]/16 to-transparent blur-3xl opacity-75" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-radial from-[#FFFFFF]/10 via-[#0F172A]/20 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#64748B_1px,transparent_1px)] [background-size:32px_32px] opacity-6" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(250,204,21,0.18)]"
          >
            <defs>
              {/* Charcoal Kraft Paper Wrap Gradients */}
              <linearGradient id="stanWrapBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="stanWrapFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="60%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="stanWrapFrontRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="60%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0B0F19" />
              </linearGradient>

              {/* Silk Ribbons: Crisp White & Jet Black */}
              <linearGradient id="stanRibbonWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              <linearGradient id="stanRibbonBlack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS (Stanley's distinct botanical forms) */}
              <linearGradient id="stanGoldenPeony" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="stanWildCanaryRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>

              <linearGradient id="stanCupRanunculus" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="stanCenterAmberRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>

              {/* STANLEY'S SIGNATURE SPECIAL FLOWER: SCULPTED MONOCHROME ANEMONE (Black & White) */}
              <linearGradient id="stanMonoPetalWhite" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#F1F5F9" />
                <stop offset="100%" stopColor="#CBD5E1" />
              </linearGradient>

              <linearGradient id="stanMonoPetalBlack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="40%" stopColor="#1E293B" />
                <stop offset="80%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="stanStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="60%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="stanSlateLeaves" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              {/* Drop Shadow */}
              <filter id="stanDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#0F172A" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: STEMS, LEAVES & CHARCOAL KRAFT BACK WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="stan-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="stan-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 238 360 L 226 456" stroke="url(#stanStemGrad)" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 250 360 L 250 462" stroke="url(#stanStemGrad)" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 262 360 L 274 456" stroke="url(#stanStemGrad)" strokeWidth="4.2" strokeLinecap="round" />
                  <path d="M 244 360 L 238 450" stroke="url(#stanStemGrad)" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M 256 360 L 262 452" stroke="url(#stanStemGrad)" strokeWidth="3.2" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems */}
                <motion.g
                  id="stan-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Upper-Left Signature Monochrome Bloom (185, 160) */}
                  <path d="M 250 360 Q 210 260 185 170" stroke="url(#stanStemGrad)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper-Right Wild Canary Rose (325, 165) */}
                  <path d="M 250 360 Q 295 260 325 175" stroke="url(#stanStemGrad)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Cup Ranunculus (365, 245) */}
                  <path d="M 250 360 Q 320 305 365 250" stroke="url(#stanStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Structural Yellow Buds (135, 245) */}
                  <path d="M 250 360 Q 180 305 135 250" stroke="url(#stanStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Amber Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#stanStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Structural Slate Leaves */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 170 240 145 120" stroke="url(#stanStemGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <ellipse cx="140" cy="130" rx="10" ry="6" fill="url(#stanSlateLeaves)" transform="rotate(-30 140 130)" />
                  <ellipse cx="158" cy="160" rx="11" ry="7" fill="url(#stanSlateLeaves)" transform="rotate(20 158 160)" />
                </motion.g>

                {/* Right Structural Slate Leaves */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 330 240 355 120" stroke="url(#stanStemGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <ellipse cx="360" cy="130" rx="10" ry="6" fill="url(#stanSlateLeaves)" transform="rotate(30 360 130)" />
                  <ellipse cx="342" cy="160" rx="11" ry="7" fill="url(#stanSlateLeaves)" transform="rotate(-20 342 160)" />
                </motion.g>

                {/* Back Charcoal Wrap */}
                <motion.path
                  d="M 140 295 L 235 415 L 265 415 L 360 295 Q 250 340 140 295 Z"
                  fill="url(#stanWrapBack)"
                  stroke="#475569"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: FLANK YELLOW BLOOMS (Cup Ranunculus & Golden Buds)
               ========================================================= */}
            {isStepAtLeast('yellow-structure') && (
              <g id="stan-layer-flank-yellows">
                {/* Right Flank Cup Ranunculus (x: 365, y: 245) */}
                <g id="stan-cup-ranunculus" transform="translate(365, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(20)"
                    filter="url(#stanDrop)"
                  >
                    {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
                      <ellipse
                        key={`ran-stan-${i}`}
                        cx="0"
                        cy="-20"
                        rx="12.5"
                        ry="18"
                        fill="url(#stanCupRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((deg, i) => (
                      <ellipse
                        key={`ran-stan-in-${i}`}
                        cx="0"
                        cy="-14"
                        rx="9.5"
                        ry="13"
                        fill="#FEF08A"
                        stroke="#CA8A04"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="8.5" fill="#D97706" />
                    <circle cx="0" cy="0" r="4" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Left Flank Structural Yellow Wild Flower (x: 135, y: 245) */}
                <g id="stan-wild-yellow" transform="translate(135, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-20)"
                    filter="url(#stanDrop)"
                  >
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                      <path
                        key={`wild-stan-${i}`}
                        d="M -7 -8 Q -10 -28 0 -34 Q 10 -28 7 -8 Z"
                        fill="url(#stanGoldenPeony)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#B45309" />
                    <circle cx="0" cy="0" r="4.5" fill="#FACC15" />
                  </motion.g>
                </g>

                {/* Yellow Buttons (Left & Right) */}
                <g transform="translate(180, 285)">
                  <circle cx="0" cy="0" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                  <circle cx="10" cy="-4" r="6" fill="#FDE047" />
                </g>
                <g transform="translate(320, 285)">
                  <circle cx="0" cy="0" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
                  <circle cx="-8" cy="-4" r="6" fill="#FEF08A" />
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 3: SIGNATURE SPECIAL FLOWER - STANLEY'S MONOCHROMATIC SCULPTED BLOOM
                (Negro Carbón y Blanco Puro)
               ========================================================= */}
            {isStepAtLeast('signature-monochrome') && (
              <g id="stan-layer-signature-flower" transform="translate(185, 160)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.25, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  transform="rotate(-12)"
                  filter="url(#stanDrop)"
                >
                  {/* Subtle Monochrome Ambient Glow */}
                  <circle cx="0" cy="0" r="44" fill="#FFFFFF" opacity="0.14" filter="blur(6px)" />

                  {/* LAYER 1 (Outer Petals): Crisp Pure White with Slate Contours */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <g key={`stan-wht-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -9 0 C -16 -15 -14 -32 0 -38 C 14 -32 16 -15 9 0 Z"
                        fill="url(#stanMonoPetalWhite)"
                        stroke="#0F172A"
                        strokeWidth="0.8"
                      />
                      <path d="M 0 -8 L 0 -30" stroke="#CBD5E1" strokeWidth="0.75" />
                    </g>
                  ))}

                  {/* LAYER 2 (Inner Ring): Jet Black Velvet Petals */}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                    <ellipse
                      key={`stan-blk-${i}`}
                      cx="0"
                      cy="-18"
                      rx="10.5"
                      ry="16"
                      fill="url(#stanMonoPetalBlack)"
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* LAYER 3 (Center Anemone Heart): Pure White Filigree Pinwheel */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <ellipse
                      key={`stan-inner-wht-${i}`}
                      cx="0"
                      cy="-9"
                      rx="6"
                      ry="10"
                      fill="#FFFFFF"
                      stroke="#1E293B"
                      strokeWidth="0.5"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Onyx Disc with Crisp White Eye */}
                  <circle cx="0" cy="0" r="8" fill="#000000" stroke="#FFFFFF" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="4.5" fill="#1E293B" />
                  <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 4: UPPER-RIGHT YELLOW BLOOM (Wild Canary Rose)
               ========================================================= */}
            {isStepAtLeast('yellow-crown') && (
              <g id="stan-layer-upper-yellow" transform="translate(325, 165)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  transform="rotate(16)"
                  filter="url(#stanDrop)"
                >
                  <path
                    d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                    fill="url(#stanWildCanaryRose)"
                    stroke="#B45309"
                    strokeWidth="0.75"
                  />
                  <path
                    d="M -24 -6 C -30 -22 -8 -28 0 -28 C 8 -28 28 -22 24 -6 C 26 14 8 20 0 20 C -8 20 -26 14 -24 -6 Z"
                    fill="#FEF08A"
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
            )}

            {/* =========================================================
                TIER 5: LUSH CENTER AMBER ROSE & ACCENT FLORETS
               ========================================================= */}
            {isStepAtLeast('center-accents') && (
              <g id="stan-layer-center-rose">
                {/* Center Yellow Rose (x: 250, y: 245) */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#stanDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#stanCenterAmberRose)"
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

                {/* Left & Right Accent Florets */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`stan-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>
                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`stan-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: CHARCOAL KRAFT FRONT WRAP & WHITE/BLACK SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="stan-layer-front-wrap">
                {/* Left Fold */}
                <motion.path
                  d="M 135 290 L 250 415 L 255 350 L 155 260 Z"
                  fill="url(#stanWrapFrontLeft)"
                  stroke="#475569"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold */}
                <motion.path
                  d="M 365 290 L 250 415 L 245 350 L 345 260 Z"
                  fill="url(#stanWrapFrontRight)"
                  stroke="#64748B"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Clean Chalk Crease Lines */}
                <path d="M 155 270 L 245 400" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
                <path d="M 345 270 L 255 400" stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.4" />
              </g>
            )}

            {/* White & Black Silk Ribbon */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="stan-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail (Pure White Silk) */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#stanRibbonWhite)"
                  />
                  {/* Right Ribbon Tail (Jet Black Silk) */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#stanRibbonBlack)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#stanRibbonBlack)"
                    stroke="#FFFFFF"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop (White) */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#stanRibbonWhite)"
                    stroke="#CBD5E1"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop (Black) */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#stanRibbonBlack)"
                    stroke="#94A3B8"
                    strokeWidth="0.6"
                  />

                  {/* Monochromatic Center Knot */}
                  <ellipse cx="0" cy="1" rx="7" ry="5.5" fill="#000000" stroke="#FFFFFF" strokeWidth="0.8" />
                  <circle cx="0" cy="1" r="2.5" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING GOLDEN & MONOCHROME SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="stan-pollen-sparks">
                {[
                  { x: 185, y: 120, color: '#FFFFFF', size: 2.2, delay: 0.1 },
                  { x: 325, y: 130, color: '#FDE047', size: 2.4, delay: 0.5 },
                  { x: 250, y: 190, color: '#FEF08A', size: 2.4, delay: 0.8 },
                  { x: 135, y: 210, color: '#FACC15', size: 2.2, delay: 0.3 },
                  { x: 365, y: 215, color: '#F59E0B', size: 2.2, delay: 0.7 },
                  { x: 210, y: 175, color: '#FFFFFF', size: 2.0, delay: 1.2 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`stan-spark-${idx}`}
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

        {/* Tarjeta de lectura con el botón 'Leer' (Exclusivo para Stanley) */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.div
              id="tarjeta-lectura-stanley"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                borderColor: 'rgba(148, 163, 184, 0.35)',
              }}
            >
              <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[#334155]/50 border-[#64748B]/50 text-[#FACC15]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#FAF8F5]">Texto Personal</h4>
                  <p className="text-xs text-[#CBD5E1]">Palabras dedicadas por Ronald</p>
                </div>
              </div>
              <motion.button
                id="btn-stanley-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#334155] via-[#1E293B] to-[#FACC15] hover:from-[#1E293B] hover:to-[#CA8A04] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-inherit" />
                <span>Leer</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
