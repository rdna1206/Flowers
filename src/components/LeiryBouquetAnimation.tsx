import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';

interface LeiryBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'stems-wrap'
  | 'yellow-flanks'
  | 'yellow-upper'
  | 'signature-leiry-flower'
  | 'yellow-center-accents'
  | 'bouquet-complete';

export const LeiryBouquetAnimation: React.FC<LeiryBouquetAnimationProps> = ({
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

    const t1 = setTimeout(() => setStep('yellow-flanks'), 2200);
    const t2 = setTimeout(() => setStep('yellow-upper'), 4800);
    const t3 = setTimeout(() => setStep('signature-leiry-flower'), 7400);
    const t4 = setTimeout(() => setStep('yellow-center-accents'), 10000);
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
    setTimeout(() => setStep('yellow-flanks'), 2200);
    setTimeout(() => setStep('yellow-upper'), 4800);
    setTimeout(() => setStep('signature-leiry-flower'), 7400);
    setTimeout(() => setStep('yellow-center-accents'), 10000);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12800);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'yellow-flanks',
      'yellow-upper',
      'signature-leiry-flower',
      'yellow-center-accents',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="leiry-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Deep Intense Purple, Vinotinto and Golden Warmth over dark obsidian */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#581845]/18 via-[#3B1143]/12 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#FACC15]/14 via-[#4A0E17]/15 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#581845_1px,transparent_1px)] [background-size:28px_28px] opacity-6" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[420px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_6px_35px_rgba(88,24,69,0.35)]"
          >
            <defs>
              {/* Wrap Gradients (Matte Black & Deep Vinotinto) */}
              <linearGradient id="leiryWrapBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1A0A12" />
                <stop offset="50%" stopColor="#0D0609" />
                <stop offset="100%" stopColor="#050304" />
              </linearGradient>

              <linearGradient id="leiryWrapLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2B0B13" />
                <stop offset="60%" stopColor="#120408" />
                <stop offset="100%" stopColor="#080204" />
              </linearGradient>

              <linearGradient id="leiryWrapRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4A0E17" />
                <stop offset="50%" stopColor="#22050B" />
                <stop offset="100%" stopColor="#0B0204" />
              </linearGradient>

              {/* Velvet Ribbon Gradients */}
              <linearGradient id="leiryRibbonVinotinto" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A1C35" />
                <stop offset="40%" stopColor="#581845" />
                <stop offset="80%" stopColor="#3B0714" />
                <stop offset="100%" stopColor="#1A0208" />
              </linearGradient>

              <linearGradient id="leiryRibbonAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#7E22CE" />
                <stop offset="100%" stopColor="#4A0E17" />
              </linearGradient>

              {/* YELLOW BLOOMS GRADIENTS (The surrounding bouquet of yellow flowers) */}
              <linearGradient id="leiryYellowGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="30%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="leirySaffronYellow" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF7" />
                <stop offset="35%" stopColor="#FDE047" />
                <stop offset="75%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="leiryCanaryYellow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDE7" />
                <stop offset="30%" stopColor="#FFF59D" />
                <stop offset="70%" stopColor="#FBC02D" />
                <stop offset="100%" stopColor="#F57F17" />
              </linearGradient>

              {/* LEIRY'S UNIQUE SIGNATURE FLOWER GRADIENTS (NEGRO, VINOTINTO Y MORADO OSCURO E INTENSO) */}
              {/* 1. Negro Obsidiana Petal Gradient */}
              <linearGradient id="leiryBlackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#262626" />
                <stop offset="35%" stopColor="#111111" />
                <stop offset="75%" stopColor="#080808" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              {/* 2. Vinotinto Profundo Petal Gradient */}
              <linearGradient id="leiryVinotintoPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7F1D2C" />
                <stop offset="40%" stopColor="#581845" />
                <stop offset="80%" stopColor="#350C16" />
                <stop offset="100%" stopColor="#1A050A" />
              </linearGradient>

              {/* 3. Morado Oscuro e Intenso Petal Gradient */}
              <linearGradient id="leiryPurplePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#581845" />
                <stop offset="35%" stopColor="#3B1143" />
                <stop offset="75%" stopColor="#2E0854" />
                <stop offset="100%" stopColor="#110217" />
              </linearGradient>

              <linearGradient id="leiryCenterGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#713F12" />
              </linearGradient>

              {/* Stem Gradient */}
              <linearGradient id="leiryStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#65A30D" />
                <stop offset="50%" stopColor="#4D7C0F" />
                <stop offset="100%" stopColor="#1E2D22" />
              </linearGradient>
            </defs>

            {/* =========================================================
                TIER 1: FOUNDATION STEMS, FOLIAGE & BACKPAPER
               ========================================================= */}
            {isStepAtLeast('stems-wrap') && (
              <g id="leiry-layer-foundation">
                {/* Lower Stems */}
                <motion.g
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 235 360 L 222 454" stroke="url(#leiryStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 250 360 L 250 460" stroke="url(#leiryStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 265 360 L 278 454" stroke="url(#leiryStemGrad)" strokeWidth="4.5" strokeLinecap="round" />
                </motion.g>

                {/* Main Internal Stems */}
                <motion.g
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  style={{ transformOrigin: '250px 360px' }}
                >
                  <path d="M 250 360 L 250 170" stroke="url(#leiryStemGrad)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
                  <path d="M 250 360 Q 300 270 330 190" stroke="url(#leiryStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  <path d="M 250 360 Q 200 270 170 195" stroke="url(#leiryStemGrad)" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                  <path d="M 250 360 Q 185 305 140 250" stroke="url(#leiryStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  <path d="M 250 360 Q 315 305 360 250" stroke="url(#leiryStemGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                </motion.g>

                {/* Back Matte Black Wrap */}
                <path
                  d="M 180 250 Q 250 230 320 250 L 350 420 Q 250 460 150 420 Z"
                  fill="url(#leiryWrapBack)"
                  stroke="#2E0E17"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* =========================================================
                TIER 2: FLANKING YELLOW BLOOMS (BOUQUET OF YELLOW FLOWERS)
               ========================================================= */}
            {isStepAtLeast('yellow-flanks') && (
              <g id="leiry-layer-flanks">
                {/* Left Yellow Daisy / Ranunculus */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '140px 250px' }}
                >
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="140"
                      cy="225"
                      rx="12"
                      ry="24"
                      fill="url(#leiryYellowGold)"
                      transform={`rotate(${deg} 140 250)`}
                      stroke="#B45309"
                      strokeWidth="0.6"
                    />
                  ))}
                  <circle cx="140" cy="250" r="12" fill="#78350F" />
                  <circle cx="140" cy="250" r="6" fill="#FDE047" />
                </motion.g>

                {/* Right Yellow Anemone */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '360px 250px' }}
                >
                  {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="360"
                      cy="226"
                      rx="13"
                      ry="25"
                      fill="url(#leirySaffronYellow)"
                      transform={`rotate(${deg} 360 250)`}
                      stroke="#CA8A04"
                      strokeWidth="0.6"
                    />
                  ))}
                  <circle cx="360" cy="250" r="11" fill="#CA8A04" />
                  <circle cx="360" cy="250" r="5" fill="#FEF08A" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 3: UPPER YELLOW BLOOMS (BOUQUET OF YELLOW FLOWERS)
               ========================================================= */}
            {isStepAtLeast('yellow-upper') && (
              <g id="leiry-layer-upper">
                {/* Upper Left Yellow Saffron Garden Rose */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  style={{ transformOrigin: '170px 195px' }}
                >
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="170"
                      cy="173"
                      rx="14"
                      ry="24"
                      fill="url(#leiryCanaryYellow)"
                      transform={`rotate(${deg} 170 195)`}
                      stroke="#EAB308"
                      strokeWidth="0.6"
                    />
                  ))}
                  <circle cx="170" cy="195" r="10" fill="#CA8A04" />
                </motion.g>

                {/* Upper Right Yellow Chrysanthemum */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                  style={{ transformOrigin: '330px 190px' }}
                >
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${(i * 360) / 12} 330 190)`}>
                      <path
                        d="M 330 190 C 324 175, 322 150, 330 142 C 338 150, 336 175, 330 190 Z"
                        fill="url(#leiryYellowGold)"
                        stroke="#B45309"
                        strokeWidth="0.6"
                      />
                    </g>
                  ))}
                  <circle cx="330" cy="190" r="11" fill="#78350F" />
                  <circle cx="330" cy="190" r="5" fill="#FDE047" />
                </motion.g>
              </g>
            )}

            {/* =========================================================
                TIER 4: THE MAJESTIC UNIQUE SIGNATURE LEIRY FLOWER
                (THE ONLY DISTINCT FLOWER IN THE CENTER: NEGRO, VINOTINTO Y MORADO OSCURO E INTENSO)
               ========================================================= */}
            {isStepAtLeast('signature-leiry-flower') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.65, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.0, ease: 'backOut' }}
                style={{ transformOrigin: '250px 220px' }}
              >
                {/* Center Masterpiece Bloom (Unique Flower in Negro, Vinotinto & Morado Oscuro e Intenso) */}
                <g transform="translate(250, 220) scale(1.35)">
                  {/* Outer Layer: Negro Obsidiana Petals */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <motion.ellipse
                      key={`black-petal-${i}`}
                      cx="0"
                      cy="-34"
                      rx="14"
                      ry="38"
                      fill="url(#leiryBlackPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#050304"
                      strokeWidth="0.8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.03 }}
                    />
                  ))}

                  {/* Mid Layer: Vinotinto Profundo Petals */}
                  {[15, 75, 135, 195, 255, 315].map((deg, i) => (
                    <ellipse
                      key={`vinotinto-petal-${i}`}
                      cx="0"
                      cy="-25"
                      rx="15"
                      ry="31"
                      fill="url(#leiryVinotintoPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#2B0B13"
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Inner Layer: Morado Oscuro e Intenso Petals */}
                  {[45, 105, 165, 225, 285, 345].map((deg, i) => (
                    <ellipse
                      key={`purple-petal-${i}`}
                      cx="0"
                      cy="-17"
                      rx="13"
                      ry="23"
                      fill="url(#leiryPurplePetal)"
                      transform={`rotate(${deg})`}
                      stroke="#3B1143"
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Center Pistil / Core with Gold & Deep Burgundy Accent */}
                  <circle cx="0" cy="0" r="12" fill="#1A0208" stroke="#581845" strokeWidth="2" />
                  <circle cx="0" cy="0" r="6" fill="url(#leiryCenterGold)" />
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <line
                      key={`stamen-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-8"
                      stroke="#FDE047"
                      strokeWidth="1.2"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                </g>
              </motion.g>
            )}

            {/* =========================================================
                TIER 5: FRONT WRAP & VELVET RIBBON FINISHING
               ========================================================= */}
            {isStepAtLeast('yellow-center-accents') && (
              <motion.g
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Front Left Wrap */}
                <path
                  d="M 180 250 Q 210 360 250 440 Q 200 370 150 420 Z"
                  fill="url(#leiryWrapLeft)"
                  stroke="#581845"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Front Right Wrap */}
                <path
                  d="M 320 250 Q 290 360 250 440 Q 300 370 350 420 Z"
                  fill="url(#leiryWrapRight)"
                  stroke="#4A0E17"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Velvet Vinotinto Ribbon & Bow */}
                <g transform="translate(250, 390)">
                  <path
                    d="M 0 0 C -35 -25 -50 15 0 25 C 50 15 35 -25 0 0 Z"
                    fill="url(#leiryRibbonVinotinto)"
                    stroke="#2B0B13"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0 0 C -35 25 -50 -15 0 25 C 50 -15 35 25 0 0 Z"
                    fill="url(#leiryRibbonVinotinto)"
                    stroke="#2B0B13"
                    strokeWidth="1"
                  />
                  <path
                    d="M -10 15 L -35 65 L -20 70 L -5 25 Z"
                    fill="url(#leiryRibbonVinotinto)"
                  />
                  <path
                    d="M 10 15 L 35 65 L 20 70 L 5 25 Z"
                    fill="url(#leiryRibbonVinotinto)"
                  />
                  <circle cx="0" cy="18" r="8" fill="url(#leiryRibbonAccent)" stroke="#1A0208" strokeWidth="1.5" />
                  <circle cx="0" cy="18" r="3" fill="#FDE047" />
                </g>
              </motion.g>
            )}
          </svg>
        </div>

        {/* Action Controls (Clean, Zero Words / Descriptions, Matching all system profiles) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          {isCompleted && (
            <>
              {/* Enter User Response */}
              <motion.button
                id="btn-leiry-enter-response"
                type="button"
                onClick={onProceedToResponse}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#581845] via-[#3B1143] to-[#4A0E17] hover:from-[#4A0E17] hover:to-[#2B0B13] text-white text-xs font-semibold tracking-wider uppercase shadow-[0_0_24px_rgba(88,24,69,0.35)] transition-all hover:scale-102 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Mi respuesta</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>

              {/* View Personal Message from Admin */}
              {onBackToReading && (
                <button
                  id="btn-leiry-view-message"
                  type="button"
                  onClick={onBackToReading}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#581845]/40 hover:border-[#9333EA] bg-[#140A10]/70 hover:bg-[#1F0A18]/80 text-[#E9D5FF] text-xs transition-colors cursor-pointer"
                  title="Mensaje"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#E9D5FF]" />
                  <span>Mensaje</span>
                </button>
              )}

              {/* Replay Bouquet Assembly */}
              <button
                id="btn-leiry-replay-bouquet"
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#3B1143]/50 hover:border-[#581845] bg-[#140A10]/70 hover:bg-[#1F0A18]/80 text-[#E9D5FF] text-xs transition-colors cursor-pointer"
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
