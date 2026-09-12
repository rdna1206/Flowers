import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface HanniaBouquetAnimationProps {
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
  | 'signature-rose-blue'
  | 'yellow-heart-accents'
  | 'bouquet-complete';

export const HanniaBouquetAnimation: React.FC<HanniaBouquetAnimationProps> = ({
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

    // Hannia's bespoke assembly sequence: Rose & blue bloom choreography
    const t1 = setTimeout(() => setStep('yellow-upper'), 2300);
    const t2 = setTimeout(() => setStep('yellow-flanks'), 4900);
    const t3 = setTimeout(() => setStep('signature-rose-blue'), 7500);
    const t4 = setTimeout(() => setStep('yellow-heart-accents'), 10100);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12700);

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
    setTimeout(() => setStep('yellow-upper'), 2300);
    setTimeout(() => setStep('yellow-flanks'), 4900);
    setTimeout(() => setStep('signature-rose-blue'), 7500);
    setTimeout(() => setStep('yellow-heart-accents'), 10100);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12700);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-upper',
      'yellow-flanks',
      'signature-rose-blue',
      'yellow-heart-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="hannia-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Soft dual-glow (Rose & Azure) with warm yellow core */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-radial from-[#EC4899]/14 via-[#3B82F6]/10 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#FDE047]/16 via-[#F472B6]/8 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#EC4899_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(236,72,153,0.18)]"
          >
            <defs>
              {/* Wrapping Gradients */}
              <linearGradient id="hanWrapBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FFFDF7" />
                <stop offset="100%" stopColor="#FCE7F3" />
              </linearGradient>

              <linearGradient id="hanWrapFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="55%" stopColor="#FDF2F8" />
                <stop offset="100%" stopColor="#FBCFE8" />
              </linearGradient>

              <linearGradient id="hanWrapFrontRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#EFF6FF" />
                <stop offset="100%" stopColor="#DBEAFE" />
              </linearGradient>

              {/* Duality Silk Ribbon (Rose & Azure) */}
              <linearGradient id="hanRibbonRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDF2F8" />
                <stop offset="35%" stopColor="#F472B6" />
                <stop offset="75%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>

              <linearGradient id="hanRibbonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="35%" stopColor="#60A5FA" />
                <stop offset="75%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              <linearGradient id="hanBroochSapphire" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#93C5FD" />
                <stop offset="80%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS */}
              <linearGradient id="hanEnglishYellowRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="hanCanaryRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="hanOpenYellowPeony" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="35%" stopColor="#FACC15" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="hanWildCanaryDahlia" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="30%" stopColor="#FFF59D" />
                <stop offset="70%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>

              <linearGradient id="hanHeartYellowGardenRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* SIGNATURE FLOWER ONLY: Hannia's Bicolor Camelia in ROSA and AZUL */}
              <linearGradient id="hanSignaturePink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="35%" stopColor="#FBCFE8" />
                <stop offset="75%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>

              <linearGradient id="hanSignatureBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0F9FF" />
                <stop offset="35%" stopColor="#BAE6FD" />
                <stop offset="75%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>

              <linearGradient id="hanSignatureDeepBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="40%" stopColor="#60A5FA" />
                <stop offset="85%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="hanStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="60%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <linearGradient id="hanEucalyptus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CBD5E1" />
                <stop offset="50%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Drop Shadow Filter */}
              <filter id="hanDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#334155" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, FOLIAGE & BASE WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="han-layer-foundation">
                {/* Lower Stems below the tie gathering point (250, 360) */}
                <motion.g
                  id="han-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 224 452" stroke="url(#hanStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 458" stroke="url(#hanStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 276 452" stroke="url(#hanStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 242 360 L 236 448" stroke="url(#hanStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 258 360 L 266 450" stroke="url(#hanStemGrad)" strokeWidth="3.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Structural Stems rising up into the bouquet */}
                <motion.g
                  id="han-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Center Top Special Rose & Blue Flower (250, 140) */}
                  <path d="M 250 360 L 250 150" stroke="url(#hanStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Left English Yellow Rose (165, 180) */}
                  <path d="M 250 360 Q 200 270 165 190" stroke="url(#hanStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper Right Canary Ranunculus (335, 175) */}
                  <path d="M 250 360 Q 300 270 335 185" stroke="url(#hanStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Open Yellow Peony (135, 245) */}
                  <path d="M 250 360 Q 185 305 140 250" stroke="url(#hanStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Wild Canary Dahlia (365, 240) */}
                  <path d="M 250 360 Q 315 305 360 245" stroke="url(#hanStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Lush Heart Yellow Garden Rose (250, 250) */}
                  <path d="M 250 360 Q 250 300 250 255" stroke="url(#hanStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Left Airy Eucalyptus Sprays */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 185 230 155 100" stroke="url(#hanStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="150" cy="110" rx="10" ry="7" fill="url(#hanEucalyptus)" transform="rotate(-35 150 110)" />
                  <ellipse cx="168" cy="135" rx="11" ry="8" fill="url(#hanEucalyptus)" transform="rotate(25 168 135)" />
                  <ellipse cx="162" cy="170" rx="12" ry="8" fill="url(#hanEucalyptus)" transform="rotate(-20 162 170)" />
                </motion.g>

                {/* Right Airy Eucalyptus Sprays */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 315 230 345 100" stroke="url(#hanStemGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <ellipse cx="350" cy="110" rx="10" ry="7" fill="url(#hanEucalyptus)" transform="rotate(35 350 110)" />
                  <ellipse cx="332" cy="135" rx="11" ry="8" fill="url(#hanEucalyptus)" transform="rotate(-25 332 135)" />
                  <ellipse cx="338" cy="170" rx="12" ry="8" fill="url(#hanEucalyptus)" transform="rotate(20 338 170)" />
                </motion.g>

                {/* Back Wrap Layer (Creamy Pearl with blush gradient) */}
                <motion.path
                  d="M 135 295 L 235 415 L 265 415 L 365 295 Q 250 340 135 295 Z"
                  fill="url(#hanWrapBack)"
                  stroke="#FBCFE8"
                  strokeWidth="1.0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: UPPER YELLOW BLOOMS (English Rose & Canary Ranunculus)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="han-layer-upper-yellows">
                {/* Upper-Left English Yellow Rose (x: 165, y: 180) */}
                <g id="han-english-rose" transform="translate(165, 180)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-15)"
                    filter="url(#hanDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#hanEnglishYellowRose)"
                      stroke="#B45309"
                      strokeWidth="0.7"
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
                    <circle cx="0" cy="-2" r="5" fill="#FFFDF5" />
                  </motion.g>
                </g>

                {/* Upper-Right Canary Ranunculus (x: 335, y: 175) */}
                <g id="han-canary-ranunculus" transform="translate(335, 175)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(16)"
                    filter="url(#hanDrop)"
                  >
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <ellipse
                        key={`ran-han-${i}`}
                        cx="0"
                        cy="-21"
                        rx="13"
                        ry="18"
                        fill="url(#hanCanaryRanunculus)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <ellipse
                        key={`ran-han-mid-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10"
                        ry="14"
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
                TIER 3: SIDE YELLOW BLOOMS (Open Peony & Wild Canary Dahlia)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="han-layer-side-yellows">
                {/* Left Open Yellow Peony (x: 135, y: 245) */}
                <g id="han-open-peony" transform="translate(135, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-22)"
                    filter="url(#hanDrop)"
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <ellipse
                        key={`hpeo-${i}`}
                        cx="0"
                        cy="-22"
                        rx="14"
                        ry="20"
                        fill="url(#hanOpenYellowPeony)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                      <ellipse
                        key={`hpeo-in-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10"
                        ry="15"
                        fill="#FEF9C3"
                        stroke="#B45309"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="4.5" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Right Wild Canary Dahlia (x: 365, y: 240) */}
                <g id="han-canary-dahlia" transform="translate(365, 240)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(24)"
                    filter="url(#hanDrop)"
                  >
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                      <g key={`hdah-${i}`} transform={`rotate(${deg})`}>
                        <path
                          d="M -5 -8 Q -7 -27 0 -33 Q 7 -27 5 -8 Z"
                          fill="url(#hanWildCanaryDahlia)"
                          stroke="#CA8A04"
                          strokeWidth="0.6"
                        />
                        <path d="M 0 -8 L 0 -28" stroke="#FFFDE7" strokeWidth="0.8" opacity="0.8" />
                      </g>
                    ))}
                    <circle cx="0" cy="0" r="9.5" fill="#F59E0B" />
                    <circle cx="0" cy="0" r="5" fill="#FDE047" />
                    <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
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
                    <circle cx="-10" cy="0" r="6.5" fill="#FACC15" stroke="#D97706" strokeWidth="0.5" />
                    <circle cx="4" cy="-4" r="7.5" fill="#FDE047" stroke="#B45309" strokeWidth="0.5" />
                    <circle cx="16" cy="2" r="5" fill="#FEF08A" />
                  </motion.g>
                </g>

                {/* Right Mini Golden Craspedia Buttons (x: 315, y: 285) */}
                <g transform="translate(315, 285)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.3 }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(10)"
                  >
                    <circle cx="0" cy="0" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
                    <circle cx="0" cy="0" r="6" fill="#FDE047" />
                    <circle cx="12" cy="-6" r="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.5" />
                  </motion.g>
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 4: SIGNATURE SPECIAL FLOWER - HANNIA'S BICOLOR "ROSA & AZUL" BLOOM
                (Harmoniously combining Pink and Blue in layered elegance)
               ========================================================= */}
            {isStepAtLeast('signature-rose-blue') && (
              <g id="han-layer-signature-flower" transform="translate(250, 140)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  filter="url(#hanDrop)"
                >
                  {/* Subtle ethereal aura blending soft pink and azure */}
                  <circle cx="0" cy="0" r="46" fill="url(#hanSignatureDeepBlue)" opacity="0.16" filter="blur(7px)" />
                  <circle cx="0" cy="0" r="38" fill="url(#hanSignaturePink)" opacity="0.16" filter="blur(5px)" />

                  {/* LAYER 1 (Outer Petals): Luminous Azure & Cerulean Blue */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={`han-az-out-${i}`}
                      cx="0"
                      cy="-25"
                      rx="14.5"
                      ry="21"
                      fill="url(#hanSignatureDeepBlue)"
                      stroke="#93C5FD"
                      strokeWidth="0.75"
                      transform={`rotate(${deg})`}
                      opacity="0.95"
                    />
                  ))}

                  {/* LAYER 2 (Mid-Outer Petals): Sweet Velvet Rose Pink (Intertwined between blue angles) */}
                  {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
                    <ellipse
                      key={`han-pk-mid-${i}`}
                      cx="0"
                      cy="-19"
                      rx="12.5"
                      ry="18"
                      fill="url(#hanSignaturePink)"
                      stroke="#F472B6"
                      strokeWidth="0.75"
                      transform={`rotate(${deg})`}
                      opacity="0.95"
                    />
                  ))}

                  {/* LAYER 3 (Inner Heart Dual-Tone Ring): Alternating Sky Blue & Petal Pink Petals */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                    const isPink = i % 2 === 0;
                    return (
                      <ellipse
                        key={`han-dual-ring-${i}`}
                        cx="0"
                        cy="-13"
                        rx="10"
                        ry="14"
                        fill={isPink ? 'url(#hanSignaturePink)' : 'url(#hanSignatureBlue)'}
                        stroke={isPink ? '#FBCFE8' : '#BAE6FD'}
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                        opacity="0.95"
                      />
                    );
                  })}

                  {/* LAYER 4 (Heart Petal Swirl): Interlaced Rose & Blue Rosette Center */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <path
                      key={`han-heart-swirl-${i}`}
                      d="M -7 0 C -12 -13 -2 -19 0 -19 C 2 -19 12 -13 7 0 Z"
                      fill={i % 2 === 0 ? '#EC4899' : '#3B82F6'}
                      stroke="#FFFFFF"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Crystal Dew Core with Shimmering Starlight */}
                  <circle cx="0" cy="0" r="9" fill="#FFFDF7" stroke="#EC4899" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="5.5" fill="#3B82F6" />
                  <circle cx="0" cy="0" r="2.8" fill="#FDE047" />
                  <circle cx="0" cy="0" r="1.2" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 5: HEART YELLOW GARDEN ROSE & WARM ACCENTS
               ========================================================= */}
            {isStepAtLeast('yellow-heart-accents') && (
              <g id="han-layer-heart-yellow-rose">
                {/* Yellow Accent Florets (left) */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`han-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>

                {/* Amber Accent Florets (right) */}
                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`han-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>

                {/* Lush Heart Yellow Garden Rose (x: 250, y: 250) - Centered and anchored */}
                <g transform="translate(250, 250)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#hanDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#hanHeartYellowGardenRose)"
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
                TIER 6: ARTISAN WRAP FRONT FOLDS & DUAL-TONE SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="han-layer-front-wrap">
                {/* Left Fold Layer (Soft Pink Cream) */}
                <motion.path
                  d="M 130 290 L 250 415 L 255 350 L 150 260 Z"
                  fill="url(#hanWrapFrontLeft)"
                  stroke="#FBCFE8"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold Layer (Soft Sky Pearl) */}
                <motion.path
                  d="M 370 290 L 250 415 L 245 350 L 350 260 Z"
                  fill="url(#hanWrapFrontRight)"
                  stroke="#BAE6FD"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Delicate Crease Lines */}
                <path d="M 150 270 L 245 400" stroke="#EC4899" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
                <path d="M 350 270 L 255 400" stroke="#3B82F6" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
              </g>
            )}

            {/* Dual-Tone Silk Ribbon (Left Rose, Right Azure) with Sapphire Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="han-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail (Rose Silk) */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#hanRibbonRose)"
                  />
                  {/* Right Ribbon Tail (Azure Silk) */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#hanRibbonBlue)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#hanRibbonRose)"
                    stroke="#BE185D"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop (Rose) */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#hanRibbonRose)"
                    stroke="#FBCFE8"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop (Azure) */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#hanRibbonBlue)"
                    stroke="#BAE6FD"
                    strokeWidth="0.6"
                  />

                  {/* Sapphire Crystal Brooch Center */}
                  <ellipse cx="0" cy="1" rx="7.5" ry="6" fill="url(#hanBroochSapphire)" />
                  <circle cx="0" cy="1" r="2.8" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING ROSE & AZURE & GOLDEN SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="han-pollen-sparks">
                {[
                  { x: 165, y: 150, color: '#FACC15', size: 2.2, delay: 0.1 },
                  { x: 335, y: 140, color: '#FEF08A', size: 2.4, delay: 0.5 },
                  { x: 250, y: 85, color: '#EC4899', size: 2.6, delay: 0.9 },
                  { x: 235, y: 95, color: '#3B82F6', size: 2.4, delay: 0.4 },
                  { x: 135, y: 210, color: '#F472B6', size: 2.2, delay: 0.3 },
                  { x: 365, y: 215, color: '#60A5FA', size: 2.2, delay: 0.7 },
                  { x: 210, y: 195, color: '#FDE047', size: 2.0, delay: 1.2 },
                  { x: 290, y: 200, color: '#FACC15', size: 2.2, delay: 1.4 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`han-spark-${idx}`}
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

        {/* Tarjeta de lectura con el botón 'Leer' (Exclusivo para Hannia) */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.div
              id="tarjeta-lectura-hannia"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(18, 12, 28, 0.92)',
                borderColor: 'rgba(236, 72, 153, 0.35)',
              }}
            >
              <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[#EC4899]/40 border-[#F472B6]/40 text-[#F472B6]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#FAF8F5]">Texto Personal</h4>
                  <p className="text-xs text-[#FBCFE8]">Palabras dedicadas por Ronald</p>
                </div>
              </div>
              <motion.button
                id="btn-hannia-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#EC4899] via-[#F472B6] to-[#3B82F6] hover:from-[#DB2777] hover:to-[#2563EB] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.45)] transition-all cursor-pointer"
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
