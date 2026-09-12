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
  | 'deep-blooms'
  | 'vinotinto-accents'
  | 'signature-leiry-flower'
  | 'velvet-finishing'
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

    // Leiry's sophisticated assembly sequence
    const t1 = setTimeout(() => setStep('deep-blooms'), 2200);
    const t2 = setTimeout(() => setStep('vinotinto-accents'), 4800);
    const t3 = setTimeout(() => setStep('signature-leiry-flower'), 7400);
    const t4 = setTimeout(() => setStep('velvet-finishing'), 10000);
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
    setTimeout(() => setStep('deep-blooms'), 2200);
    setTimeout(() => setStep('vinotinto-accents'), 4800);
    setTimeout(() => setStep('signature-leiry-flower'), 7400);
    setTimeout(() => setStep('velvet-finishing'), 10000);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 12800);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'stems-wrap',
      'deep-blooms',
      'vinotinto-accents',
      'signature-leiry-flower',
      'velvet-finishing',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="leiry-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-4 overflow-hidden select-none"
    >
      {/* Ambient Aura: Deep Intense Purple, Vinotinto and Obsidian */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#581845]/20 via-[#3B1143]/12 to-transparent blur-3xl opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#4A0E17]/22 via-[#000000]/40 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#581845_1px,transparent_1px)] [background-size:28px_28px] opacity-5" />
      </div>

      {/* Main Bouquet Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full overflow-visible drop-shadow-[0_6px_35px_rgba(88,24,69,0.3)]"
          >
            <defs>
              {/* Paper Wrap Gradients (Matte Black & Deep Vinotinto) */}
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

              {/* Velvet Ribbons (Vinotinto & Dark Purple) */}
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

              {/* Black Rose Gradient */}
              <linearGradient id="leiryBlackPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#262626" />
                <stop offset="40%" stopColor="#111111" />
                <stop offset="80%" stopColor="#080808" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              {/* Vinotinto Bloom Gradient */}
              <linearGradient id="leiryVinotintoPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7F1D2C" />
                <stop offset="45%" stopColor="#581845" />
                <stop offset="80%" stopColor="#350C16" />
                <stop offset="100%" stopColor="#1A050A" />
              </linearGradient>

              {/* Dark Intense Purple Gradient */}
              <linearGradient id="leiryPurplePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#581845" />
                <stop offset="35%" stopColor="#3B1143" />
                <stop offset="75%" stopColor="#22062E" />
                <stop offset="100%" stopColor="#110217" />
              </linearGradient>

              <linearGradient id="leiryCenterGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#713F12" />
              </linearGradient>
            </defs>

            {/* STAGE 1: Stems & Background Wrap */}
            {isStepAtLeast('stems-wrap') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                {/* Background Stems */}
                <g stroke="#1E2D22" strokeWidth="3.5" strokeLinecap="round" opacity="0.85">
                  <line x1="250" y1="230" x2="225" y2="430" />
                  <line x1="250" y1="230" x2="275" y2="430" />
                  <line x1="250" y1="230" x2="250" y2="445" />
                  <line x1="230" y1="240" x2="195" y2="420" />
                  <line x1="270" y1="240" x2="305" y2="420" />
                </g>

                {/* Back Matte Black Wrap */}
                <path
                  d="M 180 250 Q 250 230 320 250 L 350 420 Q 250 460 150 420 Z"
                  fill="url(#leiryWrapBack)"
                  stroke="#2E0E17"
                  strokeWidth="1.5"
                />
              </motion.g>
            )}

            {/* STAGE 2: Deep Blooms (Black & Dark Purple) */}
            {isStepAtLeast('deep-blooms') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Left Black Rose */}
                <g transform="translate(170, 200) scale(0.85)">
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-22"
                      rx="16"
                      ry="28"
                      fill="url(#leiryBlackPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#000000"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="10" fill="#3B1143" />
                  <circle cx="0" cy="0" r="5" fill="#110217" />
                </g>

                {/* Right Dark Purple Bloom */}
                <g transform="translate(330, 205) scale(0.85)">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-20"
                      rx="14"
                      ry="25"
                      fill="url(#leiryPurplePetal)"
                      transform={`rotate(${deg})`}
                      stroke="#1A0208"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="9" fill="#581845" />
                  <circle cx="0" cy="0" r="4" fill="url(#leiryCenterGold)" />
                </g>

                {/* Left-Lower Deep Purple Blossom */}
                <g transform="translate(205, 255) scale(0.75)">
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-18"
                      rx="13"
                      ry="22"
                      fill="url(#leiryPurplePetal)"
                      transform={`rotate(${deg})`}
                      stroke="#0D0609"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="7" fill="url(#leiryCenterGold)" />
                </g>
              </motion.g>
            )}

            {/* STAGE 3: Vinotinto Accents & Side Roses */}
            {isStepAtLeast('vinotinto-accents') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                {/* Right-Lower Vinotinto Rose */}
                <g transform="translate(295, 260) scale(0.8)">
                  {[0, 51, 102, 153, 204, 255, 306].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-19"
                      rx="15"
                      ry="24"
                      fill="url(#leiryVinotintoPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#1A0208"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="8" fill="#3B0714" />
                </g>

                {/* Upper Left Vinotinto Bud */}
                <g transform="translate(215, 160) scale(0.7)">
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-16"
                      rx="11"
                      ry="20"
                      fill="url(#leiryVinotintoPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#000"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle cx="0" cy="0" r="6" fill="#581845" />
                </g>
              </motion.g>
            )}

            {/* STAGE 4: The Majestic Signature Leiry Flower (Center Masterpiece) */}
            {isStepAtLeast('signature-leiry-flower') && (
              <motion.g
                initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: 'backOut' }}
              >
                {/* Center Majestic Masterpiece Bloom (Combining Black, Vinotinto & Intense Purple) */}
                <g transform="translate(250, 190) scale(1.35)">
                  {/* Outer Layer: Deep Black Petals */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                    <motion.ellipse
                      key={i}
                      cx="0"
                      cy="-32"
                      rx="13"
                      ry="36"
                      fill="url(#leiryBlackPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#050304"
                      strokeWidth="0.8"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.03 }}
                    />
                  ))}

                  {/* Mid Layer: Rich Vinotinto Petals */}
                  {[15, 75, 135, 195, 255, 315].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-24"
                      rx="14"
                      ry="30"
                      fill="url(#leiryVinotintoPetal)"
                      transform={`rotate(${deg})`}
                      stroke="#2B0B13"
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Inner Layer: Intense Dark Purple Petals */}
                  {[45, 105, 165, 225, 285, 345].map((deg, i) => (
                    <ellipse
                      key={i}
                      cx="0"
                      cy="-16"
                      rx="12"
                      ry="22"
                      fill="url(#leiryPurplePetal)"
                      transform={`rotate(${deg})`}
                      stroke="#3B1143"
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Heart of the flower */}
                  <circle cx="0" cy="0" r="11" fill="#1A0208" stroke="#581845" strokeWidth="2" />
                  <circle cx="0" cy="0" r="5" fill="url(#leiryCenterGold)" />
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-7"
                      stroke="#FDE047"
                      strokeWidth="1.2"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                </g>
              </motion.g>
            )}

            {/* STAGE 5: Front Wrap Layers & Velvet Ribbon Finishing */}
            {isStepAtLeast('velvet-finishing') && (
              <motion.g
                initial={{ opacity: 0, y: 20 }}
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
                  {/* Bow Loops */}
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
                  {/* Ribbon Tails */}
                  <path
                    d="M -10 15 L -35 65 L -20 70 L -5 25 Z"
                    fill="url(#leiryRibbonVinotinto)"
                  />
                  <path
                    d="M 10 15 L 35 65 L 20 70 L 5 25 Z"
                    fill="url(#leiryRibbonVinotinto)"
                  />
                  {/* Center Knot with Gold Accent */}
                  <circle cx="0" cy="18" r="8" fill="url(#leiryRibbonAccent)" stroke="#1A0208" strokeWidth="1.5" />
                  <circle cx="0" cy="18" r="3" fill="#FDE047" />
                </g>
              </motion.g>
            )}
          </svg>
        </div>

        {/* Formation Status / Completion Actions */}
        <div className="mt-6 text-center w-full">
          {!isCompleted ? (
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 text-xs tracking-wider uppercase font-medium px-4 py-1.5 rounded-full bg-[#1F0A18] text-[#D8B4FE] border border-[#581845]">
                <span className="w-2 h-2 rounded-full bg-[#9333EA] animate-pulse" />
                <span>Creando ramo exclusivo de Leiry...</span>
              </div>
              <p className="text-xs text-[#A39E98] italic font-serif">
                Negro obsidiana, vinotinto profundo y morado oscuro e intenso.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center space-x-2 text-xs tracking-wider uppercase font-semibold px-4 py-1.5 rounded-full bg-[#1F0A18] text-[#E9D5FF] border border-[#7E22CE] shadow-xs">
                <span>✦ Ramo Exclusivo Creado con Éxito ✦</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {onProceedToResponse && (
                  <button
                    type="button"
                    onClick={onProceedToResponse}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#3B1143] hover:bg-[#581845] text-[#F9FAFB] font-medium text-sm border border-[#7E22CE] shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <span>Ver Recuerdo y Dejar Mensaje</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onBackToReading && (
                  <button
                    type="button"
                    onClick={onBackToReading}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#140A10] hover:bg-[#1F0A18] text-[#D1D5DB] font-medium text-sm border border-[#3B1143] transition-all duration-300 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#C084FC]" />
                    <span>Releer Experiencia</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center justify-center p-3 rounded-xl bg-[#140A10] hover:bg-[#1F0A18] text-[#9CA3AF] hover:text-white border border-[#3B1143] transition-colors cursor-pointer"
                  title="Repetir animación del ramo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
