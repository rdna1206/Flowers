import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, MessageSquare, Sparkles, Flower2 } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface YefersonBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onProceedToChat?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type YefersonStep =
  | 'wrap'
  | 'stems'
  | 'leaves'
  | 'base-bloom-1'
  | 'base-bloom-2'
  | 'base-bloom-3'
  | 'base-bloom-4'
  | 'base-bloom-5'
  | 'coffee-aura'
  | 'coffee-petals'
  | 'coffee-center'
  | 'black-ribbon'
  | 'bouquet-complete';

export const YefersonBouquetAnimation: React.FC<YefersonBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onProceedToChat,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<YefersonStep>(mode === 'result' ? 'bouquet-complete' : 'wrap');
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('wrap');
    setIsCompleted(false);

    // Cinematic choreography for Yeferson (~18 seconds)
    const t1 = setTimeout(() => setStep('stems'), 2000);
    const t2 = setTimeout(() => setStep('leaves'), 4000);
    const t3 = setTimeout(() => setStep('base-bloom-1'), 6000);
    const t4 = setTimeout(() => setStep('base-bloom-2'), 7500);
    const t5 = setTimeout(() => setStep('base-bloom-3'), 9000);
    const t6 = setTimeout(() => setStep('base-bloom-4'), 10500);
    const t7 = setTimeout(() => setStep('base-bloom-5'), 12000);
    const t8 = setTimeout(() => setStep('coffee-aura'), 13500);
    const t9 = setTimeout(() => setStep('coffee-petals'), 15000);
    const t10 = setTimeout(() => setStep('coffee-center'), 16500);
    const t11 = setTimeout(() => setStep('black-ribbon'), 17500);
    const t12 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 19000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
      clearTimeout(t9);
      clearTimeout(t10);
      clearTimeout(t11);
      clearTimeout(t12);
    };
  }, [mode]);

  const isStepAtLeast = (target: YefersonStep) => {
    const order: YefersonStep[] = [
      'wrap',
      'stems',
      'leaves',
      'base-bloom-1',
      'base-bloom-2',
      'base-bloom-3',
      'base-bloom-4',
      'base-bloom-5',
      'coffee-aura',
      'coffee-petals',
      'coffee-center',
      'black-ribbon',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setStep('wrap');
    setIsCompleted(false);
  };

  return (
    <div
      id="yeferson-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none bg-[#020205]"
    >
      {/* BACKGROUND EFFECTS */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Gray/Slate Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(55,65,81,0.25)_0%,rgba(15,23,42,0.6)_60%,transparent_90%)] blur-3xl pointer-events-none" />
        
        {/* Subtle Starlight Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#9CA3AF_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />

        {/* Floating Gray Petals */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`float-petal-${i}`}
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 1.5
            }}
            className="absolute w-8 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-[60%_40%_50%_50%/50%_50%_40%_60%] blur-[1px]"
            style={{
              top: `${20 + i * 12}%`,
              left: `${15 + (i * 15) % 70}%`,
              scale: 0.5 + Math.random() * 0.5
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Bouquet Stage SVG */}
        <div className="relative w-[350px] h-[450px] sm:w-[410px] sm:h-[490px] flex items-center justify-center">
          <svg
            viewBox="0 0 420 500"
            className="w-full h-full overflow-visible drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
          >
            <defs>
              {/* GRADIENTS */}
              <linearGradient id="yefWrapMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="50%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>

              <linearGradient id="yefRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="50%" stopColor="#374151" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <linearGradient id="yefCoffeePetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="70%" stopColor="#F9FAFB" />
                <stop offset="100%" stopColor="#E5E7EB" />
              </linearGradient>

              <linearGradient id="yefYellowCoffeePetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>

              <radialGradient id="yefCoffeeCenter" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FACC15" />
                <stop offset="40%" stopColor="#84CC16" />
                <stop offset="80%" stopColor="#166534" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              <linearGradient id="yefStem" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4B5563" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>

              <filter id="yefSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* WRAP BACK */}
            {isStepAtLeast('wrap') && (
              <motion.path
                d="M 110 320 L 210 480 L 310 320 Q 210 350 110 320 Z"
                fill="url(#yefWrapMain)"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
              />
            )}

            {/* STEMS */}
            {isStepAtLeast('stems') && (
              <g>
                {[120, 150, 210, 270, 300].map((x, i) => (
                  <motion.path
                    key={`stem-${i}`}
                    d={`M 210 435 Q ${210 + (x - 210) / 2} 370 ${x} 250`}
                    fill="none"
                    stroke="url(#yefStem)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                  />
                ))}
                {/* Main center stem for special flower */}
                <motion.path
                  d="M 210 435 L 210 160"
                  fill="none"
                  stroke="url(#yefStem)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </g>
            )}

            {/* LEAVES */}
            {isStepAtLeast('leaves') && (
              <g>
                <motion.path
                  d="M 180 340 Q 120 330 100 280 Q 150 300 180 340 Z"
                  fill="#1F2937"
                  stroke="#4B5563"
                  strokeWidth="1"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1.5 }}
                  style={{ transformOrigin: '180px 340px' }}
                />
                <motion.path
                  d="M 240 335 Q 300 325 320 275 Q 270 295 240 335 Z"
                  fill="#1F2937"
                  stroke="#4B5563"
                  strokeWidth="1"
                  initial={{ scale: 0, rotate: 20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                  style={{ transformOrigin: '240px 335px' }}
                />
              </g>
            )}

            {/* BASE FLOWERS (Yellow Coffee Flowers) */}
            <g>
              {[
                { id: 'base-bloom-1', cx: 150, cy: 220, rot: -15, scale: 0.65 },
                { id: 'base-bloom-2', cx: 270, cy: 220, rot: 15, scale: 0.65 },
                { id: 'base-bloom-3', cx: 120, cy: 280, rot: -30, scale: 0.6 },
                { id: 'base-bloom-4', cx: 300, cy: 280, rot: 30, scale: 0.6 },
                { id: 'base-bloom-5', cx: 210, cy: 300, rot: 0, scale: 0.55 },
              ].map((b, i) => (
                isStepAtLeast(b.id as YefersonStep) && (
                  <motion.g
                    key={b.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: b.scale, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{ transformOrigin: `${b.cx}px ${b.cy}px` }}
                  >
                    <g transform={`translate(${b.cx - 210}, ${b.cy - 160})`}>
                      <g transform="translate(210, 160)">
                        {/* 5 Coffee Flower Petals (Star shaped) - Yellow Version */}
                        {[0, 72, 144, 216, 288].map((deg, j) => (
                          <g key={`yellow-petal-${j}`} transform={`rotate(${deg} 0 0)`}>
                            <path
                              d="M 0 0 C -15 -20, -20 -60, 0 -75 C 20 -60, 15 -20, 0 0 Z"
                              fill="url(#yefYellowCoffeePetal)"
                              stroke="#CA8A04"
                              strokeWidth="0.8"
                            />
                          </g>
                        ))}
                        {/* Center for yellow flower */}
                        <circle cx="0" cy="0" r="8" fill="url(#yefCoffeeCenter)" opacity="0.8" />
                        <circle cx="0" cy="0" r="5" fill="#84CC16" />
                      </g>
                    </g>
                  </motion.g>
                )
              ))}
            </g>

            {/* SPECIAL COFFEE FLOWER (The Protagonist) */}
            {isStepAtLeast('coffee-aura') && (
              <motion.circle
                cx="210"
                cy="160"
                r="70"
                fill="radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2 }}
              />
            )}

            {isStepAtLeast('coffee-petals') && (
              <motion.g
                id="coffee-flower"
                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '210px 160px' }}
                filter="url(#yefSoftGlow)"
              >
                {/* 5 Coffee Flower Petals (Star shaped) */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <motion.g key={`coffee-petal-${i}`} transform={`rotate(${deg} 210 160)`}>
                    <path
                      d="M 210 160 C 195 140, 190 100, 210 85 C 230 100, 225 140, 210 160 Z"
                      fill="url(#yefCoffeePetal)"
                      stroke="#D1D5DB"
                      strokeWidth="0.8"
                    />
                    {/* Subtle central vein */}
                    <path
                      d="M 210 160 L 210 95"
                      stroke="#E5E7EB"
                      strokeWidth="0.5"
                      strokeOpacity="0.5"
                    />
                  </motion.g>
                ))}
                
                {/* Second layer of slightly smaller petals */}
                {[36, 108, 180, 252, 324].map((deg, i) => (
                  <motion.g key={`coffee-petal-inner-${i}`} transform={`rotate(${deg} 210 160)`}>
                    <path
                      d="M 210 160 C 198 145, 195 115, 210 105 C 225 115, 222 145, 210 160 Z"
                      fill="#FFFFFF"
                      stroke="#F3F4F6"
                      strokeWidth="0.6"
                      opacity="0.9"
                    />
                  </motion.g>
                ))}
              </motion.g>
            )}

            {isStepAtLeast('coffee-center') && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ transformOrigin: '210px 160px' }}
              >
                {/* Coffee Flower Botanical Center */}
                <circle cx="210" cy="160" r="10" fill="url(#yefCoffeeCenter)" opacity="0.8" />
                <circle cx="210" cy="160" r="6" fill="#84CC16" />
                
                {/* Delicate Stamens */}
                {[...Array(12)].map((_, i) => (
                  <motion.line
                    key={`stamen-${i}`}
                    x1="210" y1="160"
                    x2={210 + Math.cos((i * 30 * Math.PI) / 180) * 15}
                    y2={160 + Math.sin((i * 30 * Math.PI) / 180) * 15}
                    stroke="#FACC15"
                    strokeWidth="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                ))}
                <circle cx="210" cy="160" r="2.5" fill="#166534" />
                <circle cx="210" cy="160" r="1" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* WRAP FRONT & RIBBON */}
            {isStepAtLeast('wrap') && (
              <g>
                <motion.path
                  d="M 115 330 L 205 470 L 210 380 L 140 320 Z"
                  fill="#1F2937"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                />
                <motion.path
                  d="M 305 330 L 215 470 L 210 380 L 280 320 Z"
                  fill="#1F2937"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                />
              </g>
            )}

            {isStepAtLeast('black-ribbon') && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                style={{ transformOrigin: '210px 410px' }}
              >
                {/* Black Silk Ribbon */}
                <path
                  d="M 200 410 C 170 395, 160 430, 200 420 Z"
                  fill="url(#yefRibbon)"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <path
                  d="M 220 410 C 250 395, 260 430, 220 420 Z"
                  fill="url(#yefRibbon)"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <circle cx="210" cy="410" r="6" fill="#111827" stroke="#374151" />
                
                {/* Ribbon Tails */}
                <path
                  d="M 205 415 L 185 450 L 195 455 L 208 420 Z"
                  fill="#111827"
                  opacity="0.9"
                />
                <path
                  d="M 215 415 L 235 450 L 225 455 L 212 420 Z"
                  fill="#111827"
                  opacity="0.9"
                />
              </motion.g>
            )}
          </svg>
        </div>

        {/* INTERACTION UI */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-12 space-y-6 w-full max-w-sm px-6"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onProceedToReading}
                className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 bg-gray-800/80 hover:bg-gray-700 text-white px-6 py-3.5 rounded-full backdrop-blur-md border border-gray-600 transition-all active:scale-95 shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-gray-300" />
                <span className="text-sm font-medium">Mi Mensaje</span>
              </button>
              
              <button
                onClick={onProceedToResponse}
                className="flex-1 min-w-[140px] flex items-center justify-center space-x-2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-xl font-bold text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Responder</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <SaveFlowerButton 
                userId="yeferson" 
                userName="Yeferson"
                isDarkTheme={true}
              />
              
              <button
                onClick={handleReplay}
                className="p-3.5 rounded-full bg-gray-900/50 hover:bg-gray-800 text-gray-400 border border-gray-800 transition-colors"
                title="Repetir formación"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
