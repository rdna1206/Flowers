import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen, MessageSquare, Sparkles } from 'lucide-react';

interface JhonBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'wrap'
  | 'stems'
  | 'leaves'
  | 'base-bloom-1'
  | 'base-bloom-2'
  | 'base-bloom-3'
  | 'base-bloom-4'
  | 'base-bloom-5'
  | 'proto-aura'
  | 'proto-outer'
  | 'proto-mid'
  | 'proto-inner'
  | 'proto-core'
  | 'golden-ribbon'
  | 'bouquet-complete';

export const JhonBouquetAnimation: React.FC<JhonBouquetAnimationProps> = ({
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

    // Ultra-detailed, sequential, cinematic master choreography for Jhon (~21 seconds)
    const t1 = setTimeout(() => setStep('stems'), 2200);           // 1. Origami wrap folds -> Emerald stems emerge
    const t2 = setTimeout(() => setStep('leaves'), 4400);          // 2. Protective forest leaves roll open
    const t3 = setTimeout(() => setStep('base-bloom-1'), 6400);    // 3. Flower 1 (Back-Left) opens
    const t4 = setTimeout(() => setStep('base-bloom-2'), 8200);    // 4. Flower 2 (Back-Right) unfolds needle petals
    const t5 = setTimeout(() => setStep('base-bloom-3'), 9900);    // 5. Flower 3 (Far-Left) blooms
    const t6 = setTimeout(() => setStep('base-bloom-4'), 11500);   // 6. Flower 4 (Far-Right) layers settle
    const t7 = setTimeout(() => setStep('base-bloom-5'), 13000);   // 7. Flower 5 (Front-Center) unfolds grand rose
    const t8 = setTimeout(() => setStep('proto-aura'), 14500);     // 8. Protagonist radial aura awakens
    const t9 = setTimeout(() => setStep('proto-outer'), 16000);    // 9. Tier 1 outer cobalt-gold petals unfold
    const t10 = setTimeout(() => setStep('proto-mid'), 17500);     // 10. Tier 2 intermediate petals rotate open
    const t11 = setTimeout(() => setStep('proto-inner'), 18800);   // 11. Tier 3 inner corolla blossoms
    const t12 = setTimeout(() => setStep('proto-core'), 19900);    // 12. Sapphire starlight jewel core ignites
    const t13 = setTimeout(() => setStep('golden-ribbon'), 21000); // 13. Gold silk ribbon ties & cascades
    const t14 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 22500);                                                     // 14. Full living atmospheric harmony

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
      clearTimeout(t13);
      clearTimeout(t14);
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsCompleted(false);
    setStep('wrap');
    setTimeout(() => setStep('stems'), 2200);
    setTimeout(() => setStep('leaves'), 4400);
    setTimeout(() => setStep('base-bloom-1'), 6400);
    setTimeout(() => setStep('base-bloom-2'), 8200);
    setTimeout(() => setStep('base-bloom-3'), 9900);
    setTimeout(() => setStep('base-bloom-4'), 11500);
    setTimeout(() => setStep('base-bloom-5'), 13000);
    setTimeout(() => setStep('proto-aura'), 14500);
    setTimeout(() => setStep('proto-outer'), 16000);
    setTimeout(() => setStep('proto-mid'), 17500);
    setTimeout(() => setStep('proto-inner'), 18800);
    setTimeout(() => setStep('proto-core'), 19900);
    setTimeout(() => setStep('golden-ribbon'), 21000);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 22500);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'wrap',
      'stems',
      'leaves',
      'base-bloom-1',
      'base-bloom-2',
      'base-bloom-3',
      'base-bloom-4',
      'base-bloom-5',
      'proto-aura',
      'proto-outer',
      'proto-mid',
      'proto-inner',
      'proto-core',
      'golden-ribbon',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="jhon-bouquet-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none bg-[#0A192F]"
    >
      {/* =========================================================
          CINEMATIC NIGHT BACKGROUND (#0A192F) & VOLUMETRIC AURA
         ========================================================= */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Night Atmosphere Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.38)_0%,rgba(10,25,47,0.7)_55%,transparent_80%)] blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.14)_0%,rgba(30,58,138,0.22)_50%,transparent_75%)] blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.9)_0%,transparent_70%)] blur-xl" />

        {/* Soft Background Grid / Star Precision Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:36px_36px] opacity-12" />

        {/* =========================================================
            DEFOCUSED FLOATING PETALS (AZULES Y DORADOS DESENFOCADOS)
           ========================================================= */}
        {/* Large Foreground Blurred Floating Petals (Bokeh) */}
        <motion.div
          animate={{
            y: [-20, 25, -20],
            x: [-15, 15, -15],
            rotate: [15, 35, 15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-[10%] w-16 h-24 rounded-[50%_50%_60%_40%/60%_40%_60%_40%] bg-gradient-to-tr from-[#1E3A8A] via-[#2563EB] to-[#FBBF24] opacity-40 blur-[6px]"
        />
        <motion.div
          animate={{
            y: [30, -25, 30],
            x: [20, -15, 20],
            rotate: [-20, -45, -20],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-28 right-[12%] w-14 h-20 rounded-[50%_50%_40%_60%/40%_60%_40%_60%] bg-gradient-to-br from-[#FBBF24] via-[#F59E0B] to-[#1E3A8A] opacity-45 blur-[5px]"
        />
        <motion.div
          animate={{
            y: [10, -35, 10],
            x: [-20, 20, -20],
            rotate: [45, 15, 45],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute bottom-24 left-[14%] w-12 h-18 rounded-[60%_40%_50%_50%/50%_50%_40%_60%] bg-gradient-to-tl from-[#1E3A8A] via-[#38BDF8] to-[#FBBF24] opacity-35 blur-[7px]"
        />
        <motion.div
          animate={{
            y: [-15, 30, -15],
            x: [15, -25, 15],
            rotate: [-30, 0, -30],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-32 right-[15%] w-14 h-22 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-gradient-to-tr from-[#FBBF24] to-[#1E3A8A] opacity-40 blur-[6px]"
        />

        {/* Medium Floating Petals */}
        <motion.div
          animate={{
            y: [-10, 20, -10],
            rotate: [0, 40, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-[6%] w-7 h-11 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#FBBF24] opacity-50 blur-[2px]"
        />
        <motion.div
          animate={{
            y: [15, -15, 15],
            rotate: [-15, 25, -15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-[8%] w-8 h-12 rounded-full bg-gradient-to-b from-[#FBBF24] to-[#1E3A8A] opacity-55 blur-[2.5px]"
        />
      </div>

      {/* Main Showcase Stage */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Bouquet Stage SVG */}
        <div className="relative w-[350px] h-[450px] sm:w-[410px] sm:h-[490px] flex items-center justify-center">
          <svg
            viewBox="0 0 420 500"
            className="w-full h-full overflow-visible drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* =========================================================
                  LIGHTING & SHADING GRADIENTS
                 ========================================================= */}
              {/* 3D Radial Glow for Central Protagonist Flower */}
              <radialGradient id="jhonCenterAura" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#FBBF24" stopOpacity="0.45" />
                <stop offset="85%" stopColor="#F59E0B" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0A192F" stopOpacity="0" />
              </radialGradient>

              {/* Warm Halo for the Blue Core */}
              <radialGradient id="jhonWarmHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="20%" stopColor="#93C5FD" />
                <stop offset="45%" stopColor="#38BDF8" />
                <stop offset="70%" stopColor="#FBBF24" />
                <stop offset="90%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* Protagonist Petals: Golden Yellow #FBBF24 transitioning to Deep Blue #1E3A8A at the tips */}
              <linearGradient id="jhonProtagonistPetalVertical" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="25%" stopColor="#FBBF24" />
                <stop offset="55%" stopColor="#FDE68A" />
                <stop offset="70%" stopColor="#3B82F6" />
                <stop offset="88%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              <linearGradient id="jhonProtagonistPetalAngled" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="30%" stopColor="#FBBF24" />
                <stop offset="60%" stopColor="#60A5FA" />
                <stop offset="85%" stopColor="#1E3A8A" />
                <stop offset="100%" stopColor="#0A192F" />
              </linearGradient>

              {/* 5 Base Flowers: Golden Yellow #FBBF24 with 3D Depth */}
              <linearGradient id="jhonBaseYellowPetal1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="35%" stopColor="#FBBF24" />
                <stop offset="75%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="jhonBaseYellowPetal2" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="80%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              {/* Matte Black Origami Wrap Gradient */}
              <linearGradient id="jhonMatteWrapMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#27272A" />
                <stop offset="30%" stopColor="#18181B" />
                <stop offset="70%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#090A0F" />
              </linearGradient>

              <linearGradient id="jhonMatteWrapFlap" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3F3F46" />
                <stop offset="40%" stopColor="#18181B" />
                <stop offset="100%" stopColor="#050811" />
              </linearGradient>

              {/* Gold Ribbon Silk Gradient */}
              <linearGradient id="jhonGoldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              {/* Emerald & Midnight Stems */}
              <linearGradient id="jhonStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="40%" stopColor="#059669" />
                <stop offset="80%" stopColor="#065F46" />
                <stop offset="100%" stopColor="#022C22" />
              </linearGradient>

              {/* Filter for Soft 3D Specular Shadow */}
              <filter id="jhonDropShadow3D" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
              </filter>

              <filter id="jhonCenterGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* =========================================================
                STEP 1: MATTE BLACK WRAP BACK LAYER & STEMS
               ========================================================= */}
            {isStepAtLeast('wrap') && (
              <g id="jhon-wrap-back" filter="url(#jhonDropShadow3D)">
                {/* Back Cone of Matte Black Paper */}
                <motion.path
                  d="M 110 320 L 210 480 L 310 320 Q 210 350 110 320 Z"
                  fill="url(#jhonMatteWrapMain)"
                  stroke="#27272A"
                  strokeWidth="1.2"
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </g>
            )}

            {/* =========================================================
                STEP 2: NATURAL STEMS STRUCTURE
               ========================================================= */}
            {isStepAtLeast('stems') && (
              <g id="jhon-stems-structure">
                {/* Stem 1 - Far Left Base Flower */}
                <motion.path
                  d="M 210 435 Q 165 370 120 280"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Stem 2 - Back Left Base Flower */}
                <motion.path
                  d="M 210 435 Q 185 340 150 215"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Stem 3 - Back Right Base Flower */}
                <motion.path
                  d="M 210 435 Q 235 340 270 215"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Stem 4 - Far Right Base Flower */}
                <motion.path
                  d="M 210 435 Q 255 370 300 280"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Stem 5 - Front Center Base Flower */}
                <motion.path
                  d="M 210 435 Q 210 365 210 295"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Central Main Stem for Protagonist Bloom */}
                <motion.path
                  d="M 210 435 L 210 145"
                  fill="none"
                  stroke="url(#jhonStemGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Deep Forest Protective Leaves */}
                {isStepAtLeast('leaves') && (
                  <g id="jhon-leaves-layer">
                    <motion.path
                      d="M 180 340 Q 125 330 105 290 Q 155 310 180 340 Z"
                      fill="#064E3B"
                      stroke="#10B981"
                      strokeWidth="0.8"
                      initial={{ scale: 0, opacity: 0, rotate: -20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '180px 340px' }}
                    />
                    <motion.path
                      d="M 240 335 Q 295 325 315 285 Q 265 305 240 335 Z"
                      fill="#064E3B"
                      stroke="#10B981"
                      strokeWidth="0.8"
                      initial={{ scale: 0, opacity: 0, rotate: 20 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ duration: 1.4, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '240px 335px' }}
                    />
                  </g>
                )}
              </g>
            )}

            {/* =========================================================
                STEP 3: THE 5 GOLDEN YELLOW BASE FLOWERS (#FBBF24) - SEQUENTIAL
               ========================================================= */}
            <g id="jhon-5-yellow-base-flowers" filter="url(#jhonDropShadow3D)">
              {/* -------------------------------------------------------
                  BASE FLOWER 1 (Back-Left: Golden Sunflower/Rose #FBBF24)
                  Center at (150, 215), tilted -18 deg
                 ------------------------------------------------------- */}
              {isStepAtLeast('base-bloom-1') && (
                <motion.g
                  id="jhon-base-flower-1"
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ scale: 1, rotate: -18, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '150px 215px' }}
                >
                  {/* Outer Layer: 12 Petals */}
                  {[...Array(12)].map((_, i) => {
                    const deg = (i * 360) / 12;
                    return (
                      <g key={`b1-p-${i}`} transform={`rotate(${deg} 150 215)`}>
                        <path
                          d="M 150 215 C 142 195, 138 168, 150 156 C 162 168, 158 195, 150 215 Z"
                          fill="url(#jhonBaseYellowPetal1)"
                          stroke="#D97706"
                          strokeWidth="0.6"
                        />
                      </g>
                    );
                  })}
                  {/* Inner Layer: 8 Petals */}
                  {[...Array(8)].map((_, i) => {
                    const deg = (i * 360) / 8 + 22.5;
                    return (
                      <g key={`b1-in-${i}`} transform={`rotate(${deg} 150 215)`}>
                        <path
                          d="M 150 215 C 144 200, 142 178, 150 172 C 158 178, 156 200, 150 215 Z"
                          fill="url(#jhonBaseYellowPetal2)"
                          stroke="#B45309"
                          strokeWidth="0.5"
                        />
                      </g>
                    );
                  })}
                  {/* Textured Amber & Gold Center */}
                  <circle cx="150" cy="215" r="14" fill="#78350F" />
                  <circle cx="150" cy="215" r="10" fill="#B45309" />
                  <circle cx="150" cy="215" r="6" fill="#FBBF24" />
                  <circle cx="148" cy="213" r="1.5" fill="#FEF08A" />
                  <circle cx="152" cy="217" r="1.3" fill="#FEF08A" />
                </motion.g>
              )}

              {/* -------------------------------------------------------
                  BASE FLOWER 2 (Back-Right: Golden Chrysanthemum #FBBF24)
                  Center at (270, 215), tilted +18 deg
                 ------------------------------------------------------- */}
              {isStepAtLeast('base-bloom-2') && (
                <motion.g
                  id="jhon-base-flower-2"
                  initial={{ scale: 0, rotate: 45, opacity: 0 }}
                  animate={{ scale: 1, rotate: 18, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '270px 215px' }}
                >
                  {/* 16 Radiating Needle Petals */}
                  {[...Array(16)].map((_, i) => {
                    const deg = (i * 360) / 16;
                    const length = i % 2 === 0 ? 54 : 44;
                    return (
                      <g key={`b2-p-${i}`} transform={`rotate(${deg} 270 215)`}>
                        <path
                          d={`M 270 215 C 266 200, 264 ${215 - length + 10}, 270 ${215 - length} C 276 ${215 - length + 10}, 274 200, 270 215 Z`}
                          fill="url(#jhonBaseYellowPetal1)"
                          stroke="#D97706"
                          strokeWidth="0.5"
                        />
                      </g>
                    );
                  })}
                  <circle cx="270" cy="215" r="13" fill="#92400E" />
                  <circle cx="270" cy="215" r="8" fill="#F59E0B" />
                  <circle cx="270" cy="215" r="4" fill="#FEF08A" />
                </motion.g>
              )}

              {/* -------------------------------------------------------
                  BASE FLOWER 3 (Flank Left: Golden Ranunculus Cup #FBBF24)
                  Center at (120, 280), tilted -30 deg
                 ------------------------------------------------------- */}
              {isStepAtLeast('base-bloom-3') && (
                <motion.g
                  id="jhon-base-flower-3"
                  initial={{ scale: 0, x: -30, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '120px 280px' }}
                >
                  {/* 6 Curved Shell Petals */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <g key={`b3-p-${i}`} transform={`rotate(${deg - 30} 120 280)`}>
                      <path
                        d="M 120 280 C 105 258, 110 234, 120 230 C 130 234, 135 258, 120 280 Z"
                        fill="url(#jhonBaseYellowPetal2)"
                        stroke="#D97706"
                        strokeWidth="0.6"
                      />
                    </g>
                  ))}
                  {/* Inner Tight Spiral */}
                  {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                    <g key={`b3-in-${i}`} transform={`rotate(${deg - 30} 120 280)`}>
                      <path
                        d="M 120 280 C 112 265, 114 248, 120 245 C 126 248, 128 265, 120 280 Z"
                        fill="#FEF08A"
                        stroke="#F59E0B"
                        strokeWidth="0.5"
                      />
                    </g>
                  ))}
                  <circle cx="120" cy="280" r="10" fill="#F59E0B" />
                  <circle cx="120" cy="280" r="5" fill="#FEF9C3" />
                </motion.g>
              )}

              {/* -------------------------------------------------------
                  BASE FLOWER 4 (Flank Right: Golden Anemone / Lily #FBBF24)
                  Center at (300, 280), tilted +30 deg
                 ------------------------------------------------------- */}
              {isStepAtLeast('base-bloom-4') && (
                <motion.g
                  id="jhon-base-flower-4"
                  initial={{ scale: 0, x: 30, opacity: 0 }}
                  animate={{ scale: 1, x: 0, opacity: 1 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '300px 280px' }}
                >
                  {/* 6 Arched Petals */}
                  {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <g key={`b4-p-${i}`} transform={`rotate(${deg + 30} 300 280)`}>
                      <path
                        d="M 300 280 C 282 254, 278 226, 300 216 C 322 226, 318 254, 300 280 Z"
                        fill="url(#jhonBaseYellowPetal1)"
                        stroke="#B45309"
                        strokeWidth="0.7"
                      />
                    </g>
                  ))}
                  {/* Stamen Anthers with Golden Stamens */}
                  <line x1="300" y1="280" x2="294" y2="252" stroke="#CA8A04" strokeWidth="1" />
                  <circle cx="294" cy="252" r="2" fill="#78350F" />
                  <line x1="300" y1="280" x2="306" y2="252" stroke="#CA8A04" strokeWidth="1" />
                  <circle cx="306" cy="252" r="2" fill="#78350F" />
                  <circle cx="300" cy="280" r="9" fill="#F59E0B" />
                  <circle cx="300" cy="280" r="5" fill="#FEF08A" />
                </motion.g>
              )}

              {/* -------------------------------------------------------
                  BASE FLOWER 5 (Front Center: Grand Golden Rose #FBBF24)
                  Center at (210, 295), straight anchor
                 ------------------------------------------------------- */}
              {isStepAtLeast('base-bloom-5') && (
                <motion.g
                  id="jhon-base-flower-5"
                  initial={{ scale: 0, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '210px 295px' }}
                >
                  {/* Outer Layer: 5 Large Swirling Rose Petals */}
                  {[0, 72, 144, 216, 288].map((deg, i) => (
                    <g key={`b5-out-${i}`} transform={`rotate(${deg} 210 295)`}>
                      <path
                        d="M 210 295 C 185 270, 188 240, 210 235 C 232 240, 235 270, 210 295 Z"
                        fill="url(#jhonBaseYellowPetal1)"
                        stroke="#D97706"
                        strokeWidth="0.8"
                      />
                    </g>
                  ))}
                  {/* Mid Layer: 5 Interlocking Petals */}
                  {[36, 108, 180, 252, 324].map((deg, i) => (
                    <g key={`b5-mid-${i}`} transform={`rotate(${deg} 210 295)`}>
                      <path
                        d="M 210 295 C 192 278, 194 255, 210 250 C 226 255, 228 278, 210 295 Z"
                        fill="url(#jhonBaseYellowPetal2)"
                        stroke="#B45309"
                        strokeWidth="0.7"
                      />
                    </g>
                  ))}
                  {/* Inner Rose Heart */}
                  <circle cx="210" cy="295" r="10" fill="#F59E0B" />
                  <circle cx="210" cy="295" r="5" fill="#FEF9C3" />
                </motion.g>
              )}
            </g>

            {/* =========================================================
                STEP 4: LA FLOR CENTRAL PROTAGONISTA (GRANDE Y DIFERENTE)
                - Pétalos amarillos dorados con puntas degradadas a azul profundo #1E3A8A
                - Centro luminoso azul brillante con halo cálido
                - Posicionada con majestuosidad en el eje focal superior (210, 145)
               ========================================================= */}
            {isStepAtLeast('proto-aura') && (
              <motion.g
                id="jhon-protagonist-bloom"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
                style={{ transformOrigin: '210px 145px' }}
                filter="url(#jhonDropShadow3D)"
              >
                {/* Volumetric Radial Ambient Aura for the Protagonist Bloom */}
                <motion.circle
                  cx="210"
                  cy="145"
                  r="90"
                  fill="url(#jhonCenterAura)"
                  className="pointer-events-none"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  style={{ transformOrigin: '210px 145px' }}
                />

                {/* Rotating Geometric Energy Halo (Precision & Concentration) */}
                <motion.circle
                  cx="210"
                  cy="145"
                  r="72"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                  strokeOpacity="0.45"
                  strokeDasharray="4 6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '210px 145px' }}
                />

                <motion.circle
                  cx="210"
                  cy="145"
                  r="62"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="0.9"
                  strokeOpacity="0.35"
                  strokeDasharray="2 4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '210px 145px' }}
                />

                {/* TIER 1: OUTER LAYER OF GRAND PETALS (10 Petals)
                    Base: Yellow Gold #FBBF24 -> Tip: Deep Blue #1E3A8A */}
                {isStepAtLeast('proto-outer') && (
                  <motion.g
                    id="jhon-proto-outer-tier"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '210px 145px' }}
                  >
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg, i) => (
                      <g key={`proto-outer-${i}`} transform={`rotate(${deg} 210 145)`}>
                        {/* Lanceolate Petal with 3D Sculpted Curvature */}
                        <path
                          d="M 210 145 C 188 112, 182 64, 210 18 C 238 64, 232 112, 210 145 Z"
                          fill="url(#jhonProtagonistPetalVertical)"
                          stroke="#0F172A"
                          strokeWidth="1.2"
                        />
                        {/* Central Lightning Crystalline Vein */}
                        <path
                          d="M 210 145 L 210 26"
                          stroke="#93C5FD"
                          strokeWidth="1.2"
                          strokeOpacity="0.75"
                        />
                        {/* Glowing Deep Blue Edge Accent */}
                        <circle cx="210" cy="22" r="2.2" fill="#60A5FA" />
                      </g>
                    ))}
                  </motion.g>
                )}

                {/* TIER 2: INTERMEDIATE LAYER (10 Petals offset by 18 deg)
                    Base: Yellow Gold #FBBF24 -> Mid: Radiant Gold -> Tip: Rich Deep Blue #1E3A8A */}
                {isStepAtLeast('proto-mid') && (
                  <motion.g
                    id="jhon-proto-mid-tier"
                    initial={{ scale: 0, rotate: -25, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '210px 145px' }}
                  >
                    {[18, 54, 90, 126, 162, 198, 234, 270, 306, 342].map((deg, i) => (
                      <g key={`proto-mid-${i}`} transform={`rotate(${deg} 210 145)`}>
                        <path
                          d="M 210 145 C 194 122, 192 84, 210 42 C 228 84, 226 122, 210 145 Z"
                          fill="url(#jhonProtagonistPetalAngled)"
                          stroke="#1E3A8A"
                          strokeWidth="0.9"
                          opacity="0.95"
                        />
                        {/* Subtle Golden-Yellow Inner Rib */}
                        <path
                          d="M 210 145 L 210 52"
                          stroke="#FDE047"
                          strokeWidth="0.9"
                          strokeOpacity="0.6"
                        />
                      </g>
                    ))}
                  </motion.g>
                )}

                {/* TIER 3: INNER COROLLA (8 Petals embracing the luminous center) */}
                {isStepAtLeast('proto-inner') && (
                  <motion.g
                    id="jhon-proto-inner-tier"
                    initial={{ scale: 0, rotate: 20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '210px 145px' }}
                  >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                      <g key={`proto-inner-${i}`} transform={`rotate(${deg + 10} 210 145)`}>
                        <path
                          d="M 210 145 C 198 130, 198 106, 210 70 C 222 106, 222 130, 210 145 Z"
                          fill="url(#jhonProtagonistPetalVertical)"
                          stroke="#3B82F6"
                          strokeWidth="0.8"
                        />
                      </g>
                    ))}
                  </motion.g>
                )}

                {/* =========================================================
                    CENTRO LUMINOSO AZUL BRILLANTE CON HALO CÁLIDO Y ESTAMBRES
                   ========================================================= */}
                {isStepAtLeast('proto-core') && (
                  <motion.g
                    id="jhon-proto-core-elements"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: '210px 145px' }}
                  >
                    {/* 1. Warm Golden Halo (Surrounding the luminous blue core) */}
                    <circle
                      cx="210"
                      cy="145"
                      r="26"
                      fill="url(#jhonWarmHalo)"
                      opacity="0.85"
                    />

                    {/* 2. Deep Blue Receptacle Ring */}
                    <circle cx="210" cy="145" r="18" fill="#0A192F" stroke="#1E3A8A" strokeWidth="1.5" />

                    {/* 3. Luminous Brilliant Blue Core with Specular Glow */}
                    <circle
                      cx="210"
                      cy="145"
                      r="13"
                      fill="#1E40AF"
                      filter="url(#jhonCenterGlowFilter)"
                    />
                    <circle
                      cx="210"
                      cy="145"
                      r="9"
                      fill="#38BDF8"
                    />
                    <circle
                      cx="210"
                      cy="145"
                      r="5"
                      fill="#93C5FD"
                    />

                    {/* 4. Pulsing Pure White Starlight Core (Precision & Focus) */}
                    <motion.circle
                      cx="210"
                      cy="145"
                      r="3.2"
                      fill="#FFFFFF"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.85, 1, 0.85],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />

                    {/* Radiant Sparkles Orbiting the Center */}
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: '210px 145px' }}
                    >
                      <circle cx="210" cy="123" r="1.5" fill="#FDE047" />
                      <circle cx="232" cy="145" r="1.6" fill="#67E8F9" />
                      <circle cx="210" cy="167" r="1.5" fill="#FDE047" />
                      <circle cx="188" cy="145" r="1.6" fill="#67E8F9" />
                    </motion.g>
                  </motion.g>
                )}
              </motion.g>
            )}

            {/* =========================================================
                STEP 5: MATTE BLACK WRAP FRONT FLAPS & GOLDEN RIBBON
               ========================================================= */}
            {isStepAtLeast('wrap') && (
              <g id="jhon-wrap-front" filter="url(#jhonDropShadow3D)">
                {/* Left Fold: Matte Black Paper with Clean Geometry */}
                <motion.path
                  d="M 115 330 L 205 470 L 210 380 L 140 320 Z"
                  fill="url(#jhonMatteWrapFlap)"
                  stroke="#27272A"
                  strokeWidth="1.2"
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Right Fold: Matte Black Paper Overlap */}
                <motion.path
                  d="M 305 330 L 215 470 L 210 380 L 280 320 Z"
                  fill="url(#jhonMatteWrapFlap)"
                  stroke="#27272A"
                  strokeWidth="1.2"
                  initial={{ x: 25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Center Collar Band */}
                <motion.path
                  d="M 160 375 L 210 475 L 260 375 Q 210 395 160 375 Z"
                  fill="#0F172A"
                  stroke="#1E293B"
                  strokeWidth="1.4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              </g>
            )}

            {/* =========================================================
                STEP 6: LAZO DORADO RADIANTE (GOLD SILK RIBBON)
               ========================================================= */}
            {isStepAtLeast('golden-ribbon') && (
              <motion.g
                id="jhon-golden-ribbon"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '210px 405px' }}
                filter="url(#jhonDropShadow3D)"
              >
                {/* Left Bow Loop */}
                <path
                  d="M 200 405 C 160 390, 150 425, 198 412 Z"
                  fill="url(#jhonGoldRibbon)"
                  stroke="#B45309"
                  strokeWidth="0.9"
                />
                {/* Right Bow Loop */}
                <path
                  d="M 220 405 C 260 390, 270 425, 222 412 Z"
                  fill="url(#jhonGoldRibbon)"
                  stroke="#B45309"
                  strokeWidth="0.9"
                />
                {/* Ribbon Knot */}
                <ellipse
                  cx="210"
                  cy="406"
                  rx="15"
                  ry="8"
                  fill="url(#jhonGoldRibbon)"
                  stroke="#78350F"
                  strokeWidth="1"
                />
                {/* Center Ribbon Diamond Gem */}
                <polygon
                  points="210,401 215,406 210,411 205,406"
                  fill="#FFFBEB"
                />
                {/* Cascading Golden Ribbon Tails */}
                <path
                  d="M 204 412 Q 190 445 178 480 L 186 480 Q 198 448 208 414 Z"
                  fill="url(#jhonGoldRibbon)"
                  stroke="#92400E"
                  strokeWidth="0.5"
                />
                <path
                  d="M 216 412 Q 230 445 242 480 L 234 480 Q 222 448 212 414 Z"
                  fill="url(#jhonGoldRibbon)"
                  stroke="#92400E"
                  strokeWidth="0.5"
                />
              </motion.g>
            )}

            {/* =========================================================
                AMBIENT DUSK SPARKS & GOLD/BLUE STARDUST
               ========================================================= */}
            {isCompleted && (
              <g id="jhon-floating-stardust">
                {[
                  { x: 130, y: 160, color: '#FBBF24', size: 2.2, delay: 0.2 },
                  { x: 290, y: 155, color: '#38BDF8', size: 2.6, delay: 0.7 },
                  { x: 210, y: 70, color: '#FFFFFF', size: 3.2, delay: 1.1 },
                  { x: 165, y: 250, color: '#FDE047', size: 2.0, delay: 0.4 },
                  { x: 255, y: 245, color: '#60A5FA', size: 2.4, delay: 0.9 },
                  { x: 95, y: 300, color: '#FBBF24', size: 2.2, delay: 1.4 },
                  { x: 325, y: 300, color: '#1E3A8A', size: 2.5, delay: 1.6 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`jhon-spark-${idx}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    animate={{
                      y: [-4, -18, -4],
                      opacity: [0.25, 0.95, 0.25],
                      scale: [0.9, 1.35, 0.9],
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
              id="btn-jhon-read-text"
              type="button"
              onClick={onProceedToReading || onProceedToResponse}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#FBBF24]" />
              <span>Leer</span>
              <ArrowRight className="w-4 h-4 text-white/70 stroke-[2.2]" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
