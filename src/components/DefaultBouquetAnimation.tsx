import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare } from 'lucide-react';
import type { UserExperienceData } from '../types';

interface DefaultBouquetAnimationProps {
  experience: UserExperienceData;
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'wrap'
  | 'background-stems'
  | 'side-blooms'
  | 'center-warmth'
  | 'signature-sun'
  | 'bouquet-complete';

export const DefaultBouquetAnimation: React.FC<DefaultBouquetAnimationProps> = ({
  experience,
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(mode === 'result' ? 'bouquet-complete' : 'wrap');
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('wrap');
    setIsCompleted(false);

    const t1 = setTimeout(() => setStep('background-stems'), 2200);
    const t2 = setTimeout(() => setStep('side-blooms'), 5000);
    const t3 = setTimeout(() => setStep('center-warmth'), 8000);
    const t4 = setTimeout(() => setStep('signature-sun'), 11000);
    const t5 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 14500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) onReplayFormation();
    setIsCompleted(false);
    setStep('wrap');
    setTimeout(() => setStep('background-stems'), 2200);
    setTimeout(() => setStep('side-blooms'), 5000);
    setTimeout(() => setStep('center-warmth'), 8000);
    setTimeout(() => setStep('signature-sun'), 11000);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 14500);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'wrap',
      'background-stems',
      'side-blooms',
      'center-warmth',
      'signature-sun',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="default-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 overflow-hidden select-none"
    >
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#F59E0B]/15 via-[#FDE047]/8 to-transparent blur-3xl opacity-80" />
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Bouquet Stage SVG */}
        <div className="relative w-[340px] h-[430px] sm:w-[390px] sm:h-[460px] flex items-center justify-center">
          <svg
            viewBox="0 0 400 480"
            className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(217,119,6,0.18)]"
          >
            <defs>
              <linearGradient id="defGoldPetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF9C3" />
                <stop offset="40%" stopColor="#FACC15" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>

              <linearGradient id="defSunPetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              <linearGradient id="defStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#65A30D" />
                <stop offset="50%" stopColor="#4D7C0F" />
                <stop offset="100%" stopColor="#365314" />
              </linearGradient>

              <linearGradient id="defKraftWrap" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6D5C3" />
                <stop offset="50%" stopColor="#D4BEA7" />
                <stop offset="100%" stopColor="#B89F86" />
              </linearGradient>
            </defs>

            {/* Background Stems */}
            {isStepAtLeast('background-stems') && (
              <g id="def-bg-stems">
                <motion.path
                  d="M 195 410 Q 170 320 135 220"
                  fill="none"
                  stroke="url(#defStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4 }}
                />
                <motion.path
                  d="M 205 410 Q 230 310 265 210"
                  fill="none"
                  stroke="url(#defStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.2 }}
                />
              </g>
            )}

            {/* Back Left Sunflower */}
            {isStepAtLeast('background-stems') && (
              <motion.g
                initial={{ scale: 0, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: -15, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.4 }}
                style={{ transformOrigin: '135px 220px' }}
              >
                {[...Array(12)].map((_, i) => (
                  <g key={`def-sun-${i}`} transform={`rotate(${(i * 360) / 12} 135 220)`}>
                    <path
                      d="M 135 220 C 128 200, 126 175, 135 165 C 144 175, 142 200, 135 220 Z"
                      fill="url(#defSunPetal)"
                      stroke="#B45309"
                      strokeWidth="0.6"
                    />
                  </g>
                ))}
                <circle cx="135" cy="220" r="16" fill="#78350F" />
                <circle cx="135" cy="220" r="10" fill="#B45309" />
                <circle cx="135" cy="220" r="4" fill="#FDE047" />
              </motion.g>
            )}

            {/* Back Right Chrysanthemum */}
            {isStepAtLeast('background-stems') && (
              <motion.g
                initial={{ scale: 0, rotate: 30, opacity: 0 }}
                animate={{ scale: 1, rotate: 18, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.6 }}
                style={{ transformOrigin: '265px 210px' }}
              >
                {[...Array(18)].map((_, i) => (
                  <g key={`def-chrys-${i}`} transform={`rotate(${(i * 360) / 18} 265 210)`}>
                    <path
                      d="M 265 210 C 262 195, 260 170, 265 162 C 270 170, 268 195, 265 210 Z"
                      fill="url(#defGoldPetal)"
                      stroke="#D97706"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}
                <circle cx="265" cy="210" r="12" fill="#D97706" />
                <circle cx="265" cy="210" r="6" fill="#FEF08A" />
              </motion.g>
            )}

            {/* Side Blooms */}
            {isStepAtLeast('side-blooms') && (
              <g id="def-side-blooms">
                {/* Left Daisy */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.3, delay: 0.3 }}
                  style={{ transformOrigin: '110px 280px' }}
                >
                  <path d="M 197 410 Q 155 330 110 280" fill="none" stroke="url(#defStemGrad)" strokeWidth="3.5" />
                  {[...Array(8)].map((_, i) => (
                    <g key={`def-daisy-${i}`} transform={`rotate(${(i * 360) / 8 - 25} 110 280)`}>
                      <path
                        d="M 110 280 C 102 265, 104 245, 110 240 C 116 245, 118 265, 110 280 Z"
                        fill="url(#defGoldPetal)"
                        stroke="#CA8A04"
                        strokeWidth="0.6"
                      />
                    </g>
                  ))}
                  <circle cx="110" cy="280" r="8" fill="#EAB308" />
                </motion.g>

                {/* Right Tulip */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.3, delay: 0.5 }}
                  style={{ transformOrigin: '290px 275px' }}
                >
                  <path d="M 203 410 Q 245 330 290 275" fill="none" stroke="url(#defStemGrad)" strokeWidth="3.5" />
                  <g transform="rotate(28 290 275)">
                    <path d="M 290 275 C 275 255, 275 225, 290 215 C 305 225, 305 255, 290 275 Z" fill="url(#defSunPetal)" stroke="#D97706" strokeWidth="0.6" />
                  </g>
                </motion.g>
              </g>
            )}

            {/* Center Front Rose */}
            {isStepAtLeast('center-warmth') && (
              <motion.g
                initial={{ scale: 0, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.4 }}
                style={{ transformOrigin: '200px 290px' }}
              >
                <path d="M 200 410 L 200 290" fill="none" stroke="url(#defStemGrad)" strokeWidth="4" />
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <g key={`def-rose-${i}`} transform={`rotate(${deg} 200 290)`}>
                    <path
                      d="M 200 290 C 180 270, 182 248, 200 242 C 218 248, 220 270, 200 290 Z"
                      fill="url(#defGoldPetal)"
                      stroke="#D97706"
                      strokeWidth="0.6"
                    />
                  </g>
                ))}
                <circle cx="200" cy="290" r="9" fill="#F59E0B" />
                <circle cx="200" cy="290" r="4" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* Signature Top Solar Bloom */}
            {isStepAtLeast('signature-sun') && (
              <motion.g
                initial={{ scale: 0, y: -40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.6 }}
                style={{ transformOrigin: '200px 145px' }}
              >
                <path d="M 200 410 L 200 145" fill="none" stroke="url(#defStemGrad)" strokeWidth="4.5" />
                {[...Array(16)].map((_, i) => (
                  <g key={`def-sig-${i}`} transform={`rotate(${(i * 360) / 16} 200 145)`}>
                    <path
                      d="M 200 145 C 188 122, 186 85, 200 42 C 214 85, 212 122, 200 145 Z"
                      fill="url(#defSunPetal)"
                      stroke="#B45309"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
                <circle cx="200" cy="145" r="16" fill="#F59E0B" />
                <circle cx="200" cy="145" r="10" fill="#FDE047" />
                <circle cx="200" cy="145" r="4" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* Kraft Wrap and Jute Ribbon */}
            {isStepAtLeast('wrap') && (
              <g id="def-kraft-wrap">
                <motion.path
                  d="M 125 350 L 195 450 L 200 375 L 145 330 Z"
                  fill="url(#defKraftWrap)"
                  stroke="#8C7A5B"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                />
                <motion.path
                  d="M 275 350 L 205 450 L 200 375 L 255 330 Z"
                  fill="url(#defKraftWrap)"
                  stroke="#8C7A5B"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.95 }}
                />
                <ellipse cx="200" cy="395" rx="14" ry="7" fill="#C29B38" stroke="#8C7A5B" strokeWidth="0.8" />
              </g>
            )}
          </svg>
        </div>

        {/* Tarjeta de lectura con el botón 'Leer' (Default) */}
        <div className="mt-8 flex items-center justify-center w-full px-4">
          {isCompleted && (
            <motion.div
              id="tarjeta-lectura-default"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md p-4 sm:p-5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'rgba(28, 25, 23, 0.92)',
                borderColor: 'rgba(245, 158, 11, 0.35)',
              }}
            >
              <div className="flex items-center space-x-3.5 text-left w-full sm:w-auto">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[#F59E0B]/30 border-[#F59E0B]/50 text-[#FBBF24]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-medium text-[#FAF8F5]">Texto Personal</h4>
                  <p className="text-xs text-[#FEF3C7]">Palabras dedicadas por Ronald</p>
                </div>
              </div>
              <motion.button
                id="btn-default-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#FBBF24] hover:to-[#FDE047] text-[#1C1917] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer"
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
