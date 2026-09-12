import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface DileidysBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-foundation'
  | 'signature-rose-peony'
  | 'yellow-canary-dahlia'
  | 'center-accents'
  | 'bouquet-complete';

export const DileidysBouquetAnimation: React.FC<DileidysBouquetAnimationProps> = ({
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

    // Dileidys' bespoke assembly sequence: Organic Curved Stems + Foundation Yellows + Romantic Velvet Pink Peony + Yellow Dahlia & Centers
    const t1 = setTimeout(() => setStep('yellow-foundation'), 2400);
    const t2 = setTimeout(() => setStep('signature-rose-peony'), 5000);
    const t3 = setTimeout(() => setStep('yellow-canary-dahlia'), 7600);
    const t4 = setTimeout(() => setStep('center-accents'), 10300);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13000);

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
    setTimeout(() => setStep('yellow-foundation'), 2400);
    setTimeout(() => setStep('signature-rose-peony'), 5000);
    setTimeout(() => setStep('yellow-canary-dahlia'), 7600);
    setTimeout(() => setStep('center-accents'), 10300);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 13000);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-foundation',
      'signature-rose-peony',
      'yellow-canary-dahlia',
      'center-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="dileidys-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Soft Romantic Blush Pink & Warm Golden Radiance */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-radial from-[#F43F5E]/16 via-[#FACC15]/12 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[370px] h-[370px] rounded-full bg-radial from-[#FB7185]/16 via-[#FEF08A]/10 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#FB7185_1px,transparent_1px)] [background-size:30px_30px] opacity-6" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_4px_30px_rgba(244,63,94,0.22)]"
          >
            <defs>
              {/* Blush & Deep Berry Wrap Gradients */}
              <linearGradient id="dilWrapBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4C0519" />
                <stop offset="50%" stopColor="#2A040E" />
                <stop offset="100%" stopColor="#140106" />
              </linearGradient>

              <linearGradient id="dilWrapFrontLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#881337" />
                <stop offset="50%" stopColor="#4C0519" />
                <stop offset="100%" stopColor="#1F020A" />
              </linearGradient>

              <linearGradient id="dilWrapFrontRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9F1239" />
                <stop offset="50%" stopColor="#4C0519" />
                <stop offset="100%" stopColor="#1A0208" />
              </linearGradient>

              {/* Silk Ribbons: Soft Rose Silk & Blush Carmín */}
              <linearGradient id="dilRibbonRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE4E6" />
                <stop offset="35%" stopColor="#FB7185" />
                <stop offset="75%" stopColor="#F43F5E" />
                <stop offset="100%" stopColor="#9F1239" />
              </linearGradient>

              <linearGradient id="dilBroochPearl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="50%" stopColor="#FDA4AF" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS (Dileidys' distinct botanical forms) */}
              <linearGradient id="dilGoldenRanunculus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FACC15" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="dilCanaryDahlia" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#A16207" />
              </linearGradient>

              <linearGradient id="dilOpenEnglishRose" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="dilCenterSaffronRose" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF5" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="65%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>

              {/* DILEIDYS' SIGNATURE SPECIAL FLOWER: VELVET ROMANTIC PEONY (Pure Rose Tones) */}
              <linearGradient id="dilVelvetPinkPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF1F2" />
                <stop offset="25%" stopColor="#FECDD3" />
                <stop offset="60%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#BE123C" />
              </linearGradient>

              <linearGradient id="dilDeepRosePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE4E6" />
                <stop offset="30%" stopColor="#F43F5E" />
                <stop offset="70%" stopColor="#E11D48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>

              {/* Foliage Gradients */}
              <linearGradient id="dilStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4D7C0F" />
                <stop offset="60%" stopColor="#365314" />
                <stop offset="100%" stopColor="#1A2E05" />
              </linearGradient>

              <linearGradient id="dilOliveLeaves" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" />
                <stop offset="50%" stopColor="#4D7C0F" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>

              {/* Drop Shadow */}
              <filter id="dilDrop" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#4C0519" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* =========================================================
                TIER 1: ORGANIC CURVED STEMS, FOLIAGE & BERRY BACK WRAP
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="dil-layer-foundation">
                {/* Lower Stems below the tie point (250, 360) */}
                <motion.g
                  id="dil-bottom-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 236 360 L 224 456" stroke="url(#dilStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 462" stroke="url(#dilStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 264 360 L 276 456" stroke="url(#dilStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 243 360 L 236 450" stroke="url(#dilStemGrad)" strokeWidth="3.4" strokeLinecap="round" />
                  <path d="M 257 360 L 264 452" stroke="url(#dilStemGrad)" strokeWidth="3.4" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Curved Stems */}
                <motion.g
                  id="dil-internal-stems"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  {/* Stem to Upper-Right Signature Romantic Pink Peony (315, 155) */}
                  <path d="M 250 360 Q 290 260 315 165" stroke="url(#dilStemGrad)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  {/* Stem to Upper-Left Canary Dahlia (180, 165) */}
                  <path d="M 250 360 Q 205 260 180 175" stroke="url(#dilStemGrad)" strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  {/* Stem to Left Golden Ranunculus (130, 245) */}
                  <path d="M 250 360 Q 180 305 130 250" stroke="url(#dilStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Right Open English Rose (370, 245) */}
                  <path d="M 250 360 Q 320 305 370 250" stroke="url(#dilStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  {/* Stem to Center Saffron Rose (250, 245) */}
                  <path d="M 250 360 Q 250 300 250 250" stroke="url(#dilStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Soft Foliage Sprigs */}
                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '240px 340px' }}
                >
                  <path d="M 240 340 Q 175 230 145 110" stroke="url(#dilStemGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <ellipse cx="140" cy="120" rx="10" ry="6.5" fill="url(#dilOliveLeaves)" transform="rotate(-30 140 120)" />
                  <ellipse cx="160" cy="150" rx="11" ry="7.5" fill="url(#dilOliveLeaves)" transform="rotate(20 160 150)" />
                </motion.g>

                <motion.g
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.95, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                  style={{ transformOrigin: '260px 340px' }}
                >
                  <path d="M 260 340 Q 325 230 355 110" stroke="url(#dilStemGrad)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  <ellipse cx="360" cy="120" rx="10" ry="6.5" fill="url(#dilOliveLeaves)" transform="rotate(30 360 120)" />
                  <ellipse cx="340" cy="150" rx="11" ry="7.5" fill="url(#dilOliveLeaves)" transform="rotate(-20 340 150)" />
                </motion.g>

                {/* Back Berry Wrap */}
                <motion.path
                  d="M 135 295 L 235 415 L 265 415 L 365 295 Q 250 340 135 295 Z"
                  fill="url(#dilWrapBack)"
                  stroke="#BE123C"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.98, scale: 1 }}
                  transition={{ duration: 0.9 }}
                  style={{ transformOrigin: '250px 360px' }}
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: FLANK YELLOW BLOOMS (Ranunculus & Open English Rose)
               ========================================================= */}
            {isStepAtLeast('yellow-foundation') && (
              <g id="dil-layer-flank-yellows">
                {/* Left Flank Golden Ranunculus (x: 130, y: 245) */}
                <g id="dil-golden-ranunculus" transform="translate(130, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: 10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(-22)"
                    filter="url(#dilDrop)"
                  >
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <ellipse
                        key={`ran-dil-${i}`}
                        cx="0"
                        cy="-21"
                        rx="13"
                        ry="18"
                        fill="url(#dilGoldenRanunculus)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <ellipse
                        key={`ran-dil-in-${i}`}
                        cx="0"
                        cy="-15"
                        rx="10"
                        ry="14"
                        fill="#FEF08A"
                        stroke="#CA8A04"
                        strokeWidth="0.5"
                        transform={`rotate(${deg})`}
                      />
                    ))}
                    <circle cx="0" cy="0" r="9" fill="#D97706" />
                    <circle cx="0" cy="0" r="4.5" fill="#FFFBEB" />
                  </motion.g>
                </g>

                {/* Right Flank Open English Rose (x: 370, y: 245) */}
                <g id="dil-open-rose" transform="translate(370, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, x: -10, y: 10 }}
                    animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    transform="rotate(22)"
                    filter="url(#dilDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#dilOpenEnglishRose)"
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

                {/* Yellow Buttercup Buds */}
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
                TIER 3: SIGNATURE SPECIAL FLOWER - DILEIDYS' VELVET ROMANTIC PINK PEONY
                (Rosa Aterciopelado & Carmín Suave)
               ========================================================= */}
            {isStepAtLeast('signature-rose-peony') && (
              <g id="dil-layer-signature-flower" transform="translate(315, 155)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.25, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  transform="rotate(14)"
                  filter="url(#dilDrop)"
                >
                  {/* Delicate Pink Petal Bloom Halo */}
                  <circle cx="0" cy="0" r="46" fill="#FB7185" opacity="0.18" filter="blur(7px)" />

                  {/* LAYER 1 (Outer Lush Petals): Delicate Blush Pink */}
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                    <g key={`dil-out-p-${i}`} transform={`rotate(${deg})`}>
                      <path
                        d="M -9 0 C -17 -16 -15 -32 0 -38 C 15 -32 17 -16 9 0 Z"
                        fill="url(#dilVelvetPinkPetal)"
                        stroke="#BE123C"
                        strokeWidth="0.75"
                      />
                      <path d="M 0 -8 L 0 -30" stroke="#FFF1F2" strokeWidth="0.7" opacity="0.8" />
                    </g>
                  ))}

                  {/* LAYER 2 (Mid Petals): Deep Rose Carmín Wave */}
                  {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                    <ellipse
                      key={`dil-mid-p-${i}`}
                      cx="0"
                      cy="-20"
                      rx="12.5"
                      ry="18"
                      fill="url(#dilDeepRosePetal)"
                      stroke="#FFE4E6"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* LAYER 3 (Inner Rosette): Petal Swirls */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={`dil-in-p-${i}`}
                      cx="0"
                      cy="-14"
                      rx="9.5"
                      ry="14"
                      fill="#FB7185"
                      stroke="#9F1239"
                      strokeWidth="0.55"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* LAYER 4 (Heart Core): Delicate Powder Pink Fold */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <path
                      key={`dil-heart-p-${i}`}
                      d="M -6 0 C -10 -11 -2 -17 0 -17 C 2 -17 10 -11 6 0 Z"
                      fill="#FFF1F2"
                      stroke="#E11D48"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}

                  {/* Central Dew Drop Core */}
                  <circle cx="0" cy="0" r="7.5" fill="#BE123C" stroke="#FFF1F2" strokeWidth="0.75" />
                  <circle cx="0" cy="0" r="4" fill="#F43F5E" />
                  <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 4: UPPER-LEFT YELLOW BLOOM (Canary Dahlia)
               ========================================================= */}
            {isStepAtLeast('yellow-canary-dahlia') && (
              <g id="dil-layer-upper-yellow" transform="translate(180, 165)">
                <motion.g
                  initial={{ scale: 0, opacity: 0, y: 15 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                  transform="rotate(-15)"
                  filter="url(#dilDrop)"
                >
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={`dah-dil-out-${i}`}
                      cx="0"
                      cy="-22"
                      rx="14"
                      ry="20"
                      fill="url(#dilCanaryDahlia)"
                      stroke="#CA8A04"
                      strokeWidth="0.6"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  {[22, 67, 112, 157, 202, 247, 292, 337].map((deg, i) => (
                    <ellipse
                      key={`dah-dil-in-${i}`}
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
            )}

            {/* =========================================================
                TIER 5: LUSH HEART YELLOW SAFFRON ROSE & ACCENTS
               ========================================================= */}
            {isStepAtLeast('center-accents') && (
              <g id="dil-layer-center-rose">
                {/* Center Yellow Rose (x: 250, y: 245) */}
                <g transform="translate(250, 245)">
                  <motion.g
                    initial={{ scale: 0, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    style={{ transformOrigin: '0px 0px' }}
                    filter="url(#dilDrop)"
                  >
                    <path
                      d="M -34 -4 C -40 -30 -12 -38 0 -38 C 12 -38 40 -30 34 -4 C 36 22 12 30 0 30 C -12 30 -36 22 -34 -4 Z"
                      fill="url(#dilCenterSaffronRose)"
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

                {/* Left & Right Accent Florets */}
                <g transform="translate(205, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`dil-fl-1-${i}`} cx="0" cy="-6" r="3.5" fill="#FACC15" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#D97706" />
                </g>
                <g transform="translate(295, 235)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <circle key={`dil-fl-2-${i}`} cx="0" cy="-6" r="3.5" fill="#F59E0B" transform={`rotate(${deg})`} />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FEF08A" />
                </g>
              </g>
            )}

            {/* =========================================================
                TIER 6: BERRY CRAFT FRONT WRAP & ROSE SILK BOW
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="dil-layer-front-wrap">
                {/* Left Fold */}
                <motion.path
                  d="M 130 290 L 250 415 L 255 350 L 150 260 Z"
                  fill="url(#dilWrapFrontLeft)"
                  stroke="#9F1239"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Right Fold */}
                <motion.path
                  d="M 370 290 L 250 415 L 245 350 L 350 260 Z"
                  fill="url(#dilWrapFrontRight)"
                  stroke="#BE123C"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 0.98, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  style={{ transformOrigin: '250px 360px' }}
                />

                {/* Crease Lines */}
                <path d="M 150 270 L 245 400" stroke="#FDA4AF" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
                <path d="M 350 270 L 255 400" stroke="#FDA4AF" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.45" />
              </g>
            )}

            {/* Rose Silk Ribbon & Pearl Brooch */}
            {isStepAtLeast('bouquet-complete') && (
              <g id="dil-layer-ribbon" transform="translate(250, 360)">
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '0px 0px' }}
                >
                  {/* Left Ribbon Tail (Rose Silk) */}
                  <path
                    d="M -5 15 Q -35 55 -55 95 L -42 95 Q -22 60 0 18 Z"
                    fill="url(#dilRibbonRose)"
                  />
                  {/* Right Ribbon Tail (Rose Silk) */}
                  <path
                    d="M 5 15 Q 35 55 55 95 L 42 95 Q 22 60 0 18 Z"
                    fill="url(#dilRibbonRose)"
                  />

                  {/* Horizontal Silk Wrap Band */}
                  <path
                    d="M -30 -6 Q 0 1 30 -6 L 28 8 Q 0 15 -28 8 Z"
                    fill="url(#dilRibbonRose)"
                    stroke="#FDA4AF"
                    strokeWidth="0.8"
                  />

                  {/* Left Bow Loop (Rose) */}
                  <path
                    d="M -2 0 Q -35 -14 -25 8 Q -12 12 0 2 Z"
                    fill="url(#dilRibbonRose)"
                    stroke="#FFE4E6"
                    strokeWidth="0.6"
                  />
                  {/* Right Bow Loop (Rose) */}
                  <path
                    d="M 2 0 Q 35 -14 25 8 Q 12 12 0 2 Z"
                    fill="url(#dilRibbonRose)"
                    stroke="#FFE4E6"
                    strokeWidth="0.6"
                  />

                  {/* Rose Pearl Brooch */}
                  <ellipse cx="0" cy="1" rx="7" ry="5.5" fill="url(#dilBroochPearl)" stroke="#FFF1F2" strokeWidth="0.8" />
                  <circle cx="0" cy="1" r="2.5" fill="#FFFFFF" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                FLOATING ROSE & GOLDEN SPARKS
               ========================================================= */}
            {isCompleted && (
              <g id="dil-pollen-sparks">
                {[
                  { x: 315, y: 110, color: '#FB7185', size: 2.4, delay: 0.1 },
                  { x: 180, y: 125, color: '#FDE047', size: 2.4, delay: 0.5 },
                  { x: 250, y: 190, color: '#FEF08A', size: 2.4, delay: 0.8 },
                  { x: 130, y: 210, color: '#FACC15', size: 2.2, delay: 0.3 },
                  { x: 370, y: 215, color: '#FDA4AF', size: 2.2, delay: 0.7 },
                  { x: 210, y: 175, color: '#FFF1F2', size: 2.0, delay: 1.2 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`dil-spark-${idx}`}
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

        {/* Tarjeta de lectura con el botón 'Leer' (Exclusivo para Dileidys) */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.div
              id="tarjeta-lectura-dileidys"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(24, 10, 20, 0.92)',
                borderColor: 'rgba(244, 63, 94, 0.35)',
              }}
            >
              <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[#F43F5E]/40 border-[#FB7185]/40 text-[#FACC15]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#FAF8F5]">Texto Personal</h4>
                  <p className="text-xs text-[#FECDD3]">Palabras dedicadas por Ronald</p>
                </div>
              </div>
              <motion.button
                id="btn-dileidys-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#F43F5E] via-[#FB7185] to-[#FACC15] hover:from-[#E11D48] hover:to-[#CA8A04] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.45)] transition-all cursor-pointer"
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
