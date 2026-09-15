import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { SaveFlowerButton } from './SaveFlowerButton';

interface IsaiasBouquetAnimationProps {
  mode?: 'formation' | 'result';
  onProceedToReading?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
}

type AssemblyStep =
  | 'vase-rise'
  | 'foliage-stems'
  | 'bloom-flower-1'
  | 'bloom-flower-2'
  | 'bloom-flower-3'
  | 'bloom-flower-4'
  | 'bloom-flower-5'
  | 'protagonist-aura'
  | 'protagonist-outer'
  | 'protagonist-inner'
  | 'sacred-core-24'
  | 'bouquet-complete';

export const IsaiasBouquetAnimation: React.FC<IsaiasBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AssemblyStep>(mode === 'result' ? 'bouquet-complete' : 'vase-rise');
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const [interactiveRipple, setInteractiveRipple] = useState<boolean>(false);
  const [sparkleCount, setSparkleCount] = useState<number>(0);

  useEffect(() => {
    if (mode === 'result') {
      setStep('bouquet-complete');
      setIsCompleted(true);
      return;
    }

    setStep('vase-rise');
    setIsCompleted(false);

    // Sequential, rich botanical assembly choreography (~19.5 seconds)
    const t1 = setTimeout(() => setStep('foliage-stems'), 1500);
    const t2 = setTimeout(() => setStep('bloom-flower-1'), 3300);
    const t3 = setTimeout(() => setStep('bloom-flower-2'), 4900);
    const t4 = setTimeout(() => setStep('bloom-flower-3'), 6500);
    const t5 = setTimeout(() => setStep('bloom-flower-4'), 8100);
    const t6 = setTimeout(() => setStep('bloom-flower-5'), 9700);
    // Grand Protagonist Climax: Ample time for the royal sapphire bloom
    const t7 = setTimeout(() => setStep('protagonist-aura'), 11500);
    const t8 = setTimeout(() => setStep('protagonist-outer'), 13500);
    const t9 = setTimeout(() => setStep('protagonist-inner'), 15500);
    const t10 = setTimeout(() => setStep('sacred-core-24'), 17400);
    const t11 = setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 19600);

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
    };
  }, [mode]);

  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsCompleted(false);
    setStep('vase-rise');
    setTimeout(() => setStep('foliage-stems'), 1500);
    setTimeout(() => setStep('bloom-flower-1'), 3300);
    setTimeout(() => setStep('bloom-flower-2'), 4900);
    setTimeout(() => setStep('bloom-flower-3'), 6500);
    setTimeout(() => setStep('bloom-flower-4'), 8100);
    setTimeout(() => setStep('bloom-flower-5'), 9700);
    setTimeout(() => setStep('protagonist-aura'), 11500);
    setTimeout(() => setStep('protagonist-outer'), 13500);
    setTimeout(() => setStep('protagonist-inner'), 15500);
    setTimeout(() => setStep('sacred-core-24'), 17400);
    setTimeout(() => {
      setStep('bouquet-complete');
      setIsCompleted(true);
    }, 19600);
  };

  const handleTouch = () => {
    setInteractiveRipple(true);
    setSparkleCount((c) => c + 1);
    setTimeout(() => setInteractiveRipple(false), 1200);
  };

  const isStepAtLeast = (target: AssemblyStep) => {
    const order: AssemblyStep[] = [
      'vase-rise',
      'foliage-stems',
      'bloom-flower-1',
      'bloom-flower-2',
      'bloom-flower-3',
      'bloom-flower-4',
      'bloom-flower-5',
      'protagonist-aura',
      'protagonist-outer',
      'protagonist-inner',
      'sacred-core-24',
      'bouquet-complete',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="isaias-bouquet-container"
      className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-6 overflow-hidden select-none"
    >
      {/* Nocturnal Deep Ocean & Pisces Nebula Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full bg-radial from-[#0077B6]/35 via-[#071930]/80 to-transparent blur-3xl opacity-95" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-radial from-[#00E5FF]/24 via-[#FBBF24]/16 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        <motion.div
          animate={{
            opacity: [0.12, 0.28, 0.12],
            scale: [0.98, 1.04, 0.98],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-radial from-[#38BDF8]/15 via-transparent to-transparent blur-2xl pointer-events-none"
        />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Botanical Canvas SVG */}
        <div
          onClick={handleTouch}
          className="relative w-[340px] h-[480px] sm:w-[420px] sm:h-[520px] flex items-center justify-center cursor-pointer group"
        >
          <svg
            id="isaias-bouquet-svg"
            data-flower-stage="true"
            viewBox="0 0 400 500"
            className="w-full h-full overflow-visible drop-shadow-[0_0_50px_rgba(0,180,216,0.4)]"
          >
            <defs>
              {/* Sleek Minimalist Crystal Glass Body */}
              <linearGradient id="sleekGlassBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#07192F" stopOpacity="0.55" />
                <stop offset="80%" stopColor="#00E5FF" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0369A1" stopOpacity="0.45" />
              </linearGradient>

              {/* Minimalist Pure Water Volume */}
              <linearGradient id="sleekGlassWater" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
                <stop offset="40%" stopColor="#0284C7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#032042" stopOpacity="0.8" />
              </linearGradient>

              {/* Polished Gold Trim */}
              <linearGradient id="vaseGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="55%" stopColor="#EAB308" />
                <stop offset="85%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
              </linearGradient>

              {/* Obsidian Pedestal Gradient */}
              <linearGradient id="obsidianPedestal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Glossy Specular Highlight on Vase */}
              <linearGradient id="vaseHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </linearGradient>

              {/* Golden Yellow Flower Petal Gradients */}
              <linearGradient id="yellowPetalOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FEF08A" />
                <stop offset="60%" stopColor="#FACC15" />
                <stop offset="85%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              <linearGradient id="yellowPetalInner" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FEF9C3" />
                <stop offset="70%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient id="yellowCenterAmber" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="55%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>

              {/* Emerald & Deep Teal Aquatic Foliage */}
              <linearGradient id="foliageEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="35%" stopColor="#059669" />
                <stop offset="75%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              <linearGradient id="foliageAquaticTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="40%" stopColor="#0284C7" />
                <stop offset="80%" stopColor="#0F4C5C" />
                <stop offset="100%" stopColor="#06283D" />
              </linearGradient>

              {/* Stems Gradient */}
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="40%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              {/* Protagonist Royal Sapphire Oceanic Gradient */}
              <linearGradient id="protoSapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" />
                <stop offset="20%" stopColor="#38BDF8" />
                <stop offset="55%" stopColor="#0284C7" />
                <stop offset="85%" stopColor="#0369A1" />
                <stop offset="100%" stopColor="#082A4D" />
              </linearGradient>

              {/* Protagonist Electric Cyan Inner Gradient */}
              <linearGradient id="protoCyanGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#BAE6FD" />
                <stop offset="65%" stopColor="#00E5FF" />
                <stop offset="90%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#031E3D" />
              </linearGradient>

              {/* 24 Core Jewel Radial */}
              <radialGradient id="protoCoreJewel" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0F3D69" />
                <stop offset="60%" stopColor="#031E3D" />
                <stop offset="100%" stopColor="#010A14" />
              </radialGradient>

              {/* Glow Filter for 24 */}
              <filter id="glowFilter24" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Protagonist Celestial Flash */}
              <radialGradient id="protoCelestialFlash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="25%" stopColor="#BAE6FD" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#00E5FF" stopOpacity="0.5" />
                <stop offset="85%" stopColor="#0284C7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#031E3D" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* =========================================================
                PART 1: THE UNIQUE BASE (Minimalist Sleek Crystal Vase)
                Clean, contemporary, and perfectly proportioned
               ========================================================= */}

            {/* Subtle Ambient Surface Reflection Ring */}
            <g id="isaias-floor-ambient">
              <ellipse
                cx="200"
                cy="442"
                rx="30"
                ry="5"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="0.8"
                opacity="0.28"
              />
              <motion.ellipse
                cx="200"
                cy="442"
                rx="38"
                ry="6"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="0.6"
                animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '200px 442px' }}
              />
            </g>

            {/* Step 1: Sleek Minimalist Crystal Vase */}
            {isStepAtLeast('vase-rise') && (
              <motion.g
                id="isaias-vase-assembly"
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 1. Translucent Smoked Crystal Body (Slender Architectural Cylinder) */}
                <path
                  d="M 176 322 L 174 432 C 174 440, 226 440, 226 432 L 224 322 Z"
                  fill="url(#sleekGlassBody)"
                  stroke="#38BDF8"
                  strokeWidth="0.75"
                  strokeOpacity="0.4"
                />

                {/* 2. Illuminated Water Inside Cylinder */}
                <path
                  d="M 175 352 L 174 432 C 174 439, 226 439, 226 432 L 225 352 Z"
                  fill="url(#sleekGlassWater)"
                />

                {/* Water Surface Meniscus Line */}
                <ellipse
                  cx="200"
                  cy="352"
                  rx="25"
                  ry="4.2"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="0.9"
                  opacity="0.65"
                />

                {/* 3. Submerged Bouquet Stems (Naturally entering water) */}
                <g id="vase-submerged-stems" opacity="0.65">
                  <path
                    d="M 193 322 C 194 355, 195 385, 196 414"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 200 322 L 200 422"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 207 322 C 206 355, 205 385, 204 414"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </g>

                {/* 4. Sleek Minimalist Specular Glass Highlights */}
                {/* Primary Left Glint */}
                <path
                  d="M 178 328 L 176 428"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {/* Secondary Right Soft Reflection */}
                <path
                  d="M 222 332 L 224 425"
                  fill="none"
                  stroke="#7DD3FC"
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* 5. Solid Weighted Crystal Base Foot */}
                <ellipse
                  cx="200"
                  cy="433"
                  rx="26"
                  ry="5.2"
                  fill="#031E3D"
                  stroke="url(#vaseGoldTrim)"
                  strokeWidth="1.1"
                />
                <ellipse
                  cx="200"
                  cy="435"
                  rx="21"
                  ry="3.6"
                  fill="#00E5FF"
                  opacity="0.22"
                />

                {/* 6. Refined Minimalist Gold Rim Lip at Mouth */}
                <ellipse
                  cx="200"
                  cy="322"
                  rx="24"
                  ry="5.2"
                  fill="#041B33"
                  stroke="url(#vaseGoldTrim)"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="200"
                  cy="322"
                  rx="20"
                  ry="3.8"
                  fill="#020E1E"
                  stroke="#00E5FF"
                  strokeWidth="0.6"
                  opacity="0.8"
                />
              </motion.g>
            )}

            {/* =========================================================
                PART 2: DENSE LUSH FOLIAGE & STEMS (No bare poles!)
               ========================================================= */}
            {isStepAtLeast('foliage-stems') && (
              <g id="isaias-lush-foliage">
                {/* Background Wide Emerald Leaves bridging the width */}
                {/* Far Left Leaf */}
                <motion.path
                  d="M 185 320 C 120 300, 80 250, 65 195 C 105 220, 145 260, 185 320"
                  fill="url(#foliageEmerald)"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 1.4 }}
                />
                <circle cx="78" cy="210" r="2.2" fill="#E0F7FA" opacity="0.9" />

                {/* Far Right Leaf */}
                <motion.path
                  d="M 215 320 C 280 300, 320 250, 335 195 C 295 220, 255 260, 215 320"
                  fill="url(#foliageEmerald)"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 1.4, delay: 0.1 }}
                />
                <circle cx="322" cy="210" r="2.2" fill="#E0F7FA" opacity="0.9" />

                {/* Mid-level Aquatic Teal Fronds */}
                <motion.path
                  d="M 190 320 C 140 280, 120 220, 110 160 C 145 195, 170 245, 190 320"
                  fill="url(#foliageAquaticTeal)"
                  stroke="#38BDF8"
                  strokeWidth="0.7"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.3, delay: 0.2 }}
                />
                <motion.path
                  d="M 210 320 C 260 280, 280 220, 290 160 C 255 195, 230 245, 210 320"
                  fill="url(#foliageAquaticTeal)"
                  stroke="#00E5FF"
                  strokeWidth="0.7"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.3, delay: 0.25 }}
                />

                {/* Organic curved stems connecting gracefully into vase neck */}
                {/* Stem to Flower 1 (140, 205) */}
                <motion.path
                  d="M 194 322 C 178 280, 155 245, 140 205"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
                {/* Stem to Flower 2 (260, 205) */}
                <motion.path
                  d="M 206 322 C 222 280, 245 245, 260 205"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.1 }}
                />
                {/* Stem to Flower 3 (115, 275) */}
                <motion.path
                  d="M 188 322 C 160 310, 135 295, 115 275"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.15 }}
                />
                {/* Stem to Flower 4 (285, 275) */}
                <motion.path
                  d="M 212 322 C 240 310, 265 295, 285 275"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.2 }}
                />
                {/* Stem to Flower 5 (200, 260) */}
                <motion.path
                  d="M 200 322 L 200 260"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.25 }}
                />
                {/* Main Stem to Apex Protagonist (200, 130) */}
                <motion.path
                  d="M 200 322 L 200 130"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.3 }}
                />
                {/* Inner Glowing Sap Conduit for Protagonist */}
                <motion.path
                  d="M 200 322 L 200 130"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.4 }}
                />
              </g>
            )}

            {/* =========================================================
                PART 3: THE 5 RICH YELLOW FLOWERS (Lush & Radiant)
                Each flower is a full, gorgeous 360-degree rosette!
               ========================================================= */}

            {/* FLOWER 1: Upper-Left Golden Lotus/Sunflower at (140, 205) */}
            {isStepAtLeast('bloom-flower-1') && (
              <motion.g
                id="isaias-flower-1"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '140px 205px' }}
              >
                {/* Layer 1: 14 Outer Petals */}
                {[...Array(14)].map((_, i) => {
                  const deg = (i * 360) / 14;
                  return (
                    <g key={`f1-out-${i}`} transform={`rotate(${deg} 140 205)`}>
                      <path
                        d="M 140 205 C 132 182, 130 152, 140 140 C 150 152, 148 182, 140 205 Z"
                        fill="url(#yellowPetalOuter)"
                        stroke="#D97706"
                        strokeWidth="0.6"
                      />
                    </g>
                  );
                })}

                {/* Layer 2: 10 Inner Radiant Petals */}
                {[...Array(10)].map((_, i) => {
                  const deg = (i * 360) / 10 + 18;
                  return (
                    <g key={`f1-in-${i}`} transform={`rotate(${deg} 140 205)`}>
                      <path
                        d="M 140 205 C 134 188, 132 165, 140 154 C 148 165, 146 188, 140 205 Z"
                        fill="url(#yellowPetalInner)"
                        stroke="#CA8A04"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {/* Textured Amber Center Disc */}
                <circle cx="140" cy="205" r="14" fill="url(#yellowCenterAmber)" stroke="#CA8A04" strokeWidth="1" />
                <circle cx="140" cy="205" r="9" fill="#78350F" />
                <circle cx="140" cy="205" r="5" fill="#FACC15" />
                <circle cx="138" cy="203" r="1.5" fill="#FFFBEB" />
              </motion.g>
            )}

            {/* FLOWER 2: Upper-Right Golden Chrysanthemum at (260, 205) */}
            {isStepAtLeast('bloom-flower-2') && (
              <motion.g
                id="isaias-flower-2"
                initial={{ scale: 0, rotate: 45, opacity: 0 }}
                animate={{ scale: 1, rotate: 14, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '260px 205px' }}
              >
                {/* 16 Radiating Slender Petals */}
                {[...Array(16)].map((_, i) => {
                  const deg = (i * 360) / 16;
                  const len = i % 2 === 0 ? 56 : 46;
                  return (
                    <g key={`f2-out-${i}`} transform={`rotate(${deg} 260 205)`}>
                      <path
                        d={`M 260 205 C 255 190, 253 ${205 - len + 10}, 260 ${205 - len} C 267 ${205 - len + 10}, 265 190, 260 205 Z`}
                        fill="url(#yellowPetalOuter)"
                        stroke="#D97706"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {/* Inner Star Corolla */}
                {[...Array(8)].map((_, i) => {
                  const deg = (i * 360) / 8 + 22.5;
                  return (
                    <g key={`f2-in-${i}`} transform={`rotate(${deg} 260 205)`}>
                      <path
                        d="M 260 205 C 256 195, 255 178, 260 172 C 265 178, 264 195, 260 205 Z"
                        fill="url(#yellowPetalInner)"
                        stroke="#FEF08A"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {/* Golden Center */}
                <circle cx="260" cy="205" r="13" fill="url(#yellowCenterAmber)" />
                <circle cx="260" cy="205" r="8" fill="#F59E0B" />
                <circle cx="260" cy="205" r="4" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* FLOWER 3: Lower-Left Golden Ranunculus Rose at (115, 275) */}
            {isStepAtLeast('bloom-flower-3') && (
              <motion.g
                id="isaias-flower-3"
                initial={{ scale: 0, x: -25, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '115px 275px' }}
              >
                {/* 6 Large Curved Outer Cup Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f3-out-${i}`} transform={`rotate(${deg - 20} 115 275)`}>
                    <path
                      d="M 115 275 C 98 252, 102 225, 115 220 C 128 225, 132 252, 115 275 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#D97706"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* 6 Intermediate Spiraling Petals */}
                {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                  <g key={`f3-mid-${i}`} transform={`rotate(${deg - 20} 115 275)`}>
                    <path
                      d="M 115 275 C 105 258, 108 238, 115 235 C 122 238, 125 258, 115 275 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#F59E0B"
                      strokeWidth="0.6"
                    />
                  </g>
                ))}

                {/* Inner Cup & Pearl */}
                <circle cx="115" cy="275" r="11" fill="url(#yellowCenterAmber)" />
                <circle cx="115" cy="275" r="6" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="0.8" />
                <circle cx="113" cy="273" r="1.5" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* FLOWER 4: Lower-Right Golden Peony / Fleur-de-lis at (285, 275) */}
            {isStepAtLeast('bloom-flower-4') && (
              <motion.g
                id="isaias-flower-4"
                initial={{ scale: 0, x: 25, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '285px 275px' }}
              >
                {/* 8 Scalloped Arched Outer Petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <g key={`f4-out-${i}`} transform={`rotate(${deg + 22.5} 285 275)`}>
                    <path
                      d="M 285 275 C 265 248, 260 220, 285 210 C 310 220, 305 248, 285 275 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* 6 Inner Radiating Cup Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f4-in-${i}`} transform={`rotate(${deg} 285 275)`}>
                    <path
                      d="M 285 275 C 272 255, 270 236, 285 230 C 300 236, 298 255, 285 275 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#FEF08A"
                      strokeWidth="0.6"
                    />
                  </g>
                ))}

                {/* Stamen Filaments and Center */}
                {[...Array(6)].map((_, si) => {
                  const sdeg = (si * 360) / 6;
                  return (
                    <g key={`f4-stamen-${si}`} transform={`rotate(${sdeg} 285 275)`}>
                      <line x1="285" y1="275" x2="285" y2="258" stroke="#CA8A04" strokeWidth="1" />
                      <circle cx="285" cy="257" r="1.6" fill="#78350F" />
                    </g>
                  );
                })}
                <circle cx="285" cy="275" r="9" fill="url(#yellowCenterAmber)" />
                <circle cx="285" cy="275" r="5" fill="#FEF08A" />
              </motion.g>
            )}

            {/* FLOWER 5: Front-Center Grand Golden Rose at (200, 260) */}
            {isStepAtLeast('bloom-flower-5') && (
              <motion.g
                id="isaias-flower-5"
                initial={{ scale: 0, y: 25, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '200px 260px' }}
              >
                {/* Layer 1: 6 Broad Swirling Outer Rose Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f5-out-${i}`} transform={`rotate(${deg} 200 260)`}>
                    <path
                      d="M 200 260 C 172 232, 175 198, 200 192 C 225 198, 228 232, 200 260 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}

                {/* Layer 2: 6 Intermediate Interlocking Petals */}
                {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                  <g key={`f5-mid-${i}`} transform={`rotate(${deg} 200 260)`}>
                    <path
                      d="M 200 260 C 180 240, 182 215, 200 210 C 218 215, 220 240, 200 260 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* Layer 3: 5 Inner Ruffled Core Petals */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <g key={`f5-in-${i}`} transform={`rotate(${deg + 15} 200 260)`}>
                    <path
                      d="M 200 260 C 188 248, 190 230, 200 226 C 210 230, 212 248, 200 260 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#FEF08A"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}

                {/* Center Core */}
                <circle cx="200" cy="260" r="11" fill="url(#yellowCenterAmber)" />
                <circle cx="200" cy="260" r="6" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* =========================================================
                PART 4: THE APEX PROTAGONIST FLOWER (Crown of Sapphire & 24)
                Presiding majestically at (200, 130) with spectacular entrance
               ========================================================= */}

            {/* Protagonist Celestial Awakening: Genesis Aura & Starburst Rays */}
            {isStepAtLeast('protagonist-aura') && (
              <motion.g
                id="isaias-protagonist-aura"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                {/* Expanding Energy Shockwave 1 */}
                <motion.circle
                  cx="200"
                  cy="130"
                  r="28"
                  fill="url(#protoCelestialFlash)"
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [0.1, 2.6, 3.8], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 2.2, ease: 'easeOut' }}
                />

                {/* Expanding Energy Shockwave 2 */}
                <motion.circle
                  cx="200"
                  cy="130"
                  r="72"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.8"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1.35, 1.95], opacity: [0, 0.85, 0] }}
                  transition={{ duration: 2.0, delay: 0.25, ease: 'easeOut' }}
                />

                {/* 8 Celestial Radiant Energy Beams */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, ai) => {
                  const rad = (angle * Math.PI) / 180;
                  const x2 = 200 + Math.cos(rad) * 94;
                  const y2 = 130 + Math.sin(rad) * 94;
                  return (
                    <motion.line
                      key={`proto-ray-${ai}`}
                      x1="200"
                      y1="130"
                      x2={x2}
                      y2={y2}
                      stroke="#7DD3FC"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeDasharray="4 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 0.85], opacity: [0, 0.9, 0.35] }}
                      transition={{ duration: 1.6, delay: ai * 0.04, ease: 'easeOut' }}
                    />
                  );
                })}

                {/* Concentric Rotating Astrolabe Rings */}
                <motion.circle
                  cx="200"
                  cy="130"
                  r="86"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="0.9"
                  strokeDasharray="5 5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '200px 130px' }}
                />
                <motion.circle
                  cx="200"
                  cy="130"
                  r="68"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                  strokeDasharray="8 4"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '200px 130px' }}
                />

                {/* Celestial Energy Condensation Orb */}
                <motion.circle
                  cx="200"
                  cy="130"
                  r="18"
                  fill="url(#protoCelestialFlash)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.7, 0.95, 1.25],
                    opacity: [0, 1, 0.7, 0.95],
                  }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: 'drop-shadow(0 0 10px #00E5FF)' }}
                />
              </motion.g>
            )}

            {/* Protagonist Flower Group with Living Respiration */}
            {(isStepAtLeast('protagonist-outer') || isStepAtLeast('protagonist-inner') || isStepAtLeast('sacred-core-24')) && (
              <motion.g
                id="isaias-protagonist-bloom"
                animate={isCompleted ? { scale: [1, 1.025, 1] } : { scale: 1 }}
                transition={{ duration: 4.5, repeat: isCompleted ? Infinity : 0, ease: 'easeInOut' }}
                style={{ transformOrigin: '200px 130px' }}
              >
                {/* Tier 1: 12 Outer Oceanic Sapphire Wave Petals (Full 360 Rosette with Blooming Sweep) */}
                {isStepAtLeast('protagonist-outer') && (
                  <motion.g
                    id="proto-outer-petals-rosette"
                    initial={{ scale: 0.05, rotate: -70, opacity: 0 }}
                    animate={{ scale: [0.05, 1.12, 1], rotate: [-70, 8, 0], opacity: 1 }}
                    transition={{ duration: 1.8, ease: [0.34, 1.35, 0.64, 1] }}
                    style={{ transformOrigin: '200px 130px' }}
                  >
                    {/* Unfurl Flash Ripple */}
                    <motion.circle
                      cx="200"
                      cy="130"
                      r="65"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 1.75, opacity: 0 }}
                      transition={{ duration: 1.4, ease: 'easeOut' }}
                    />

                    {[...Array(12)].map((_, i) => {
                      const deg = (i * 360) / 12;
                      return (
                        <g key={`proto-out-${i}`} transform={`rotate(${deg} 200 130)`}>
                          {/* Sculpted Wave Petal */}
                          <path
                            d="M 200 130 C 180 96, 176 52, 200 34 C 224 52, 220 96, 200 130 Z"
                            fill="url(#protoSapphireGrad)"
                            stroke="#7DD3FC"
                            strokeWidth="0.85"
                          />
                          {/* Frosted Wave Tip Crest */}
                          <path
                            d="M 194 50 C 198 40, 202 40, 206 50"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            opacity="0.9"
                          />
                        </g>
                      );
                    })}
                  </motion.g>
                )}

                {/* Tier 2: 12 Interleaved Electric Cyan Corolla Petals (Bursting from within) */}
                {isStepAtLeast('protagonist-inner') && (
                  <motion.g
                    id="proto-inner-corolla-rosette"
                    initial={{ scale: 0, rotate: 55, opacity: 0 }}
                    animate={{ scale: [0, 1.18, 1], rotate: [55, -6, 0], opacity: 1 }}
                    transition={{ duration: 1.6, ease: [0.34, 1.45, 0.64, 1] }}
                    style={{ transformOrigin: '200px 130px' }}
                  >
                    {/* Cyan Expansion Pulse */}
                    <motion.circle
                      cx="200"
                      cy="130"
                      r="50"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="2.2"
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 1.6, opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />

                    {[...Array(12)].map((_, i) => {
                      const deg = (i * 360) / 12 + 15;
                      return (
                        <g key={`proto-in-${i}`} transform={`rotate(${deg} 200 130)`}>
                          <path
                            d="M 200 130 C 186 104, 184 72, 200 56 C 216 72, 214 104, 200 130 Z"
                            fill="url(#protoCyanGrad)"
                            stroke="#E0F7FA"
                            strokeWidth="0.75"
                          />
                          {/* Glowing Water Spine Vein */}
                          <motion.path
                            d="M 200 125 L 200 64"
                            stroke="#00E5FF"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.95 }}
                            transition={{ duration: 1.1, delay: 0.25 }}
                          />
                        </g>
                      );
                    })}
                  </motion.g>
                )}

                {/* Tier 3: 8 Inner Icy Crystalline Petals (Diamond Chalice) */}
                {isStepAtLeast('protagonist-inner') && (
                  <motion.g
                    id="proto-innermost-chalice"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                    transition={{ duration: 1.3, delay: 0.35, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 130px' }}
                  >
                    {[...Array(8)].map((_, i) => {
                      const deg = (i * 360) / 8 + 22.5;
                      return (
                        <g key={`proto-chalice-${i}`} transform={`rotate(${deg} 200 130)`}>
                          <path
                            d="M 200 130 C 190 114, 190 92, 200 80 C 210 92, 210 114, 200 130 Z"
                            fill="#E0F7FA"
                            stroke="#38BDF8"
                            strokeWidth="0.75"
                          />
                        </g>
                      );
                    })}
                  </motion.g>
                )}

                {/* Tier 4: The Sacred Core Medallion with Luminous "24" (The Golden & Sapphire Climax) */}
                {isStepAtLeast('sacred-core-24') && (
                  <g id="proto-sacred-core-group">
                    {/* Celestial Dual Flare Burst Shockwaves */}
                    <motion.circle
                      cx="200"
                      cy="130"
                      r="36"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      transition={{ duration: 0.85, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="200"
                      cy="130"
                      r="30"
                      fill="none"
                      stroke="#FDE047"
                      strokeWidth="2.2"
                      initial={{ scale: 0.3, opacity: 1 }}
                      animate={{ scale: 2.7, opacity: 0 }}
                      transition={{ duration: 1.15, ease: 'easeOut' }}
                    />

                    {/* 16 Radiating Golden-Cyan Stamen Filaments */}
                    <motion.g
                      id="proto-stamen-halo"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.35, 1], opacity: 1 }}
                      transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ transformOrigin: '200px 130px' }}
                    >
                      {[...Array(16)].map((_, si) => {
                        const sdeg = (si * 360) / 16;
                        return (
                          <g key={`proto-stamen-${si}`} transform={`rotate(${sdeg} 200 130)`}>
                            <line x1="200" y1="130" x2="200" y2="104" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="200" cy="103" r="2.2" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="0.6" />
                          </g>
                        );
                      })}
                    </motion.g>

                    {/* Cosmic Sapphire Jewel Medallion with Gold Trim */}
                    <motion.g
                      id="proto-jewel-disc"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: '200px 130px' }}
                    >
                      <circle
                        cx="200"
                        cy="130"
                        r="23"
                        fill="url(#protoCoreJewel)"
                        stroke="url(#vaseGoldTrim)"
                        strokeWidth="2.4"
                      />
                      {/* Inner Golden-Cyan Accent Ring */}
                      <circle
                        cx="200"
                        cy="130"
                        r="18"
                        fill="#021428"
                        stroke="#38BDF8"
                        strokeWidth="0.85"
                      />
                    </motion.g>

                    {/* Perfectly Centered Radiant "24" with Dramatic Entrance */}
                    <motion.text
                      x="200"
                      y="131"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#00E5FF"
                      fontSize="15"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                      fontWeight="800"
                      letterSpacing="0.5px"
                      filter="url(#glowFilter24)"
                      className="select-none pointer-events-none"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.25, ease: [0.34, 1.6, 0.64, 1] }}
                      style={{
                        transformOrigin: '200px 131px',
                        filter: 'drop-shadow(0 0 5px rgba(0, 229, 255, 0.95)) drop-shadow(0 0 10px rgba(56, 189, 248, 0.7))',
                      }}
                    >
                      24
                    </motion.text>

                    {/* Rotating Specular Star Glint Flare */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
                      transition={{ duration: 0.8, delay: 0.45 }}
                    >
                      <circle cx="194" cy="121" r="1.6" fill="#FFFFFF" opacity="0.95" />
                      <motion.path
                        d="M 194 117 L 194 125 M 190 121 L 198 121"
                        stroke="#FFFFFF"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '194px 121px' }}
                      />
                    </motion.g>
                  </g>
                )}
              </motion.g>
            )}

            {/* Ambient Floating Sparkles & Living Starlight */}
            {isCompleted && (
              <g id="isaias-living-sparkles">
                {[
                  { x: 135, y: 155, color: '#00E5FF', size: 2.2, delay: 0.2 },
                  { x: 265, y: 145, color: '#FEF08A', size: 2.5, delay: 0.7 },
                  { x: 200, y: 75, color: '#38BDF8', size: 2.6, delay: 1.1 },
                  { x: 95, y: 245, color: '#FDE047', size: 2.2, delay: 0.4 },
                  { x: 305, y: 235, color: '#00E5FF', size: 2.4, delay: 0.9 },
                  { x: 195, y: 220, color: '#FFFFFF', size: 2.0, delay: 1.4 },
                  { x: 155, y: 360, color: '#7DD3FC', size: 2.2, delay: 0.5 },
                  { x: 245, y: 360, color: '#FACC15', size: 2.2, delay: 1.3 },
                ].map((s, idx) => (
                  <motion.circle
                    key={`sparkle-${idx}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    animate={{
                      y: [-2, -14, -2],
                      opacity: [0.25, 0.95, 0.25],
                      scale: [0.85, 1.25, 0.85],
                    }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      delay: s.delay,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </g>
            )}

            {/* Interactive Touch Splash Wave */}
            {interactiveRipple && (
              <motion.ellipse
                key={`touch-splash-${sparkleCount}`}
                cx="200"
                cy="322"
                rx="24"
                ry="5.2"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.6"
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
              />
            )}
          </svg>
        </div>

        {/* Minimalist Action Controls: Clean & Direct */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full px-4">
          {isCompleted && (
            <>
              <motion.button
                id="btn-isaias-replay"
                type="button"
                onClick={handleReplay}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="inline-flex items-center justify-center p-3 rounded-full bg-[#18181B]/85 hover:bg-[#27272A] border border-white/20 text-[#00E5FF] shadow-lg backdrop-blur-md transition-all cursor-pointer"
                title="Volver a contemplar"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>

              {/* Guardar Flor Button */}
              <SaveFlowerButton
                userName="Isaias"
                stageContainerId="isaias-bouquet-container"
                animationDurationMs={19600}
                onReplayAnimation={handleReplay}
                ambientGlow="rgba(6, 182, 212, 0.28)"
              />

              <motion.button
                id="btn-isaias-read-text"
                type="button"
                onClick={onProceedToReading || onProceedToResponse}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0284C7] hover:from-[#00E5FF] hover:to-[#0284C7] border border-white/30 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_35px_rgba(0,229,255,0.45)] backdrop-blur-md transition-all cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-[#E0F2FE]" />
                <span>Leer</span>
                <ArrowRight className="w-4 h-4 text-white stroke-[2.2] group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
