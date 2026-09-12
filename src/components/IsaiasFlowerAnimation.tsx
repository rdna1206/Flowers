import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RotateCcw, Droplets, Waves, BookOpen, MessageSquare } from 'lucide-react';

interface IsaiasFlowerAnimationProps {
  onComplete?: () => void;
  onProceedToResponse?: () => void;
  onBackToReading?: () => void;
  onReplayFormation?: () => void;
  mode?: 'formation' | 'result';
  autoTransitionDelay?: number;
}

type BloomPhase = 'drop' | 'currents' | 'shields' | 'petals' | 'bloom';

export const IsaiasFlowerAnimation: React.FC<IsaiasFlowerAnimationProps> = ({
  onComplete,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
  mode = 'formation',
  autoTransitionDelay = 5000,
}) => {
  const [phase, setPhase] = useState<BloomPhase>(mode === 'result' ? 'bloom' : 'drop');
  const [isFullyBloomed, setIsFullyBloomed] = useState<boolean>(mode === 'result');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(mode === 'result' ? 0 : 5);
  const [gestureTick, setGestureTick] = useState<number>(0);

  // Progressive cinematic stages timing
  useEffect(() => {
    if (mode === 'result') {
      setPhase('bloom');
      setIsFullyBloomed(true);
      return;
    }

    setPhase('drop');
    setIsFullyBloomed(false);
    setSecondsRemaining(5);

    // 0 -> 2.5s: Gota inicial y ondas de agua (Piscis / Silencio exterior)
    const currentsTimer = setTimeout(() => {
      setPhase('currents');
    }, 2500);

    // 2.5s -> 5.8s: Corrientes acuáticas gemelas ascendentes
    const shieldsTimer = setTimeout(() => {
      setPhase('shields');
    }, 5800);

    // 5.8s -> 9.2s: Cáliz de reflejos ágiles y arcos de protección (Portero)
    const petalsTimer = setTimeout(() => {
      setPhase('petals');
    }, 9200);

    // 9.2s -> 13.8s: Apertura de pétalos acuáticos y centro vivo
    const bloomTimer = setTimeout(() => {
      setPhase('bloom');
      setIsFullyBloomed(true);
    }, 13800);

    return () => {
      clearTimeout(currentsTimer);
      clearTimeout(shieldsTimer);
      clearTimeout(petalsTimer);
      clearTimeout(bloomTimer);
    };
  }, [mode]);

  // Micro-movements & unexpected expressive gestures interval (simulating rapid thoughts & expressive gestures)
  useEffect(() => {
    if (phase !== 'petals' && phase !== 'bloom') return;

    const interval = setInterval(() => {
      setGestureTick((prev) => (prev + 1) % 6);
    }, 2200);

    return () => clearInterval(interval);
  }, [phase]);

  // Countdown timer once fully bloomed
  useEffect(() => {
    if (!isFullyBloomed) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFullyBloomed, onComplete]);

  const handleProceedNow = () => {
    if (onProceedToResponse) {
      onProceedToResponse();
    } else if (onComplete) {
      onComplete();
    }
  };

  // Replay sequence
  const handleReplay = () => {
    if (onReplayFormation) {
      onReplayFormation();
    }
    setIsFullyBloomed(false);
    setSecondsRemaining(5);
    setPhase('drop');
    setTimeout(() => setPhase('currents'), 2500);
    setTimeout(() => setPhase('shields'), 5800);
    setTimeout(() => setPhase('petals'), 9200);
    setTimeout(() => {
      setPhase('bloom');
      setIsFullyBloomed(true);
    }, 13800);
  };

  // Subtle phase narratives (water, contrast, expressive depth, mystery)
  const getPhaseDescription = () => {
    switch (phase) {
      case 'drop':
        return 'Una gota pura en la quietud nocturna: calma en la superficie...';
      case 'currents':
        return 'Corrientes gemelas de agua: fluidez, reflejos ágiles y dirección...';
      case 'shields':
        return 'Arcos protectores de luz: precisión, instinto y equilibrio sereno...';
      case 'petals':
        return 'Los pétalos azul zafiro y cian se abren revelando la inquietud viva...';
      case 'bloom':
        return 'Flor Acuática de Reflejos. Misterio, agua viva, contrastes y energía en movimiento.';
    }
  };

  return (
    <div
      id="isaias-flower-animation-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none"
    >
      {/* Ambient Nocturnal Aquatic Atmosphere ("ella - Intro - Domingo" / Deep Ocean Glow) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* Deep Ocean & Sapphire Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full bg-radial from-[#0077B6]/25 via-[#0A2540]/50 to-transparent blur-3xl opacity-85" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-radial from-[#00E5FF]/18 via-[#023E8A]/35 to-transparent blur-2xl" />
        
        {/* Subtle nocturnal water caustics / starry mist grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00B4D8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
      </div>

      {/* Main Botanical Canvas Area */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Top subtle indicator badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#0077B6]/40 bg-[#07172B]/80 backdrop-blur-md shadow-xs"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#90E0EF] uppercase">
            Floración Acuática Personalizada
          </span>
        </motion.div>

        {/* The Flower Stage: SVG Canvas */}
        <div className="relative w-[340px] h-[400px] sm:w-[390px] sm:h-[430px] flex items-center justify-center">
          <svg
            viewBox="0 0 400 440"
            className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(0,180,216,0.22)]"
          >
            <defs>
              {/* Deep Ocean & Cyan Gradient for Petals */}
              <linearGradient id="isaiasBlueMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E0F7FA" />
                <stop offset="30%" stopColor="#48CAE4" />
                <stop offset="70%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#023E8A" />
              </linearGradient>

              {/* Luminous Electric Cyan Accent */}
              <linearGradient id="isaiasCyanAccent" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="25%" stopColor="#90E0EF" />
                <stop offset="65%" stopColor="#00B4D8" />
                <stop offset="100%" stopColor="#03045E" />
              </linearGradient>

              {/* Obsidian Black & Sapphire Edge (Viste de negro + Elegancia) */}
              <linearGradient id="isaiasObsidianEdge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Stem Hydrodynamic Fluid Gradient */}
              <linearGradient id="isaiasStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#030B17" />
                <stop offset="35%" stopColor="#0F3854" />
                <stop offset="70%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>

              {/* Water Wave Ripple Gradient */}
              <radialGradient id="waterRippleGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#0077B6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#030914" stopOpacity="0" />
              </radialGradient>

              {/* Keeper Protective Arc Gradient (Reflejos de Portero) */}
              <linearGradient id="keeperArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
              </linearGradient>

              {/* Chocorramo / Tajadas Secret Warm Amber Glint (Easter Egg sutil) */}
              <radialGradient id="amberGlintGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0.3" />
              </radialGradient>

              {/* Warm Heart Glow ("algún día será afectuoso") */}
              <radialGradient id="tenderHeartGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#F472B6" />
                <stop offset="75%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
              </radialGradient>

              {/* Aqua Glow Filter */}
              <filter id="aquaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* =========================================================
                STAGE 1: WATER DROP & CONCENTRIC WAVES (Base en y=385)
               ========================================================= */}
            <g id="water-base-stage">
              {/* Concentric Water Waves (Ondas concéntricas de Piscis) */}
              {[42, 30, 18].map((radius, wIdx) => (
                <motion.ellipse
                  key={`wave-${wIdx}`}
                  cx="200"
                  cy="385"
                  rx={radius * 1.8}
                  ry={radius * 0.45}
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  strokeDasharray={wIdx === 1 ? '3 3' : 'none'}
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{
                    scale: [0.8, 1.35, 1.8],
                    opacity: [0.7, 0.3, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: wIdx * 1.1,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Drop descent & contact point */}
              <motion.circle
                cx="200"
                cy="385"
                r="6"
                fill="url(#isaiasCyanAccent)"
                initial={{ cy: 220, opacity: 0, scale: 0.5 }}
                animate={{
                  cy: phase === 'drop' ? [220, 385] : 385,
                  opacity: 1,
                  scale: phase === 'drop' ? [0.6, 1.2, 0.9] : 0.8,
                }}
                transition={{ duration: 1.8, ease: 'easeIn' }}
              />

              {/* Empty Coin Halo (Humor sutil: "Casi nunca tiene plata") */}
              <motion.circle
                cx="235"
                cy="390"
                r="6"
                fill="none"
                stroke="#67E8F9"
                strokeWidth="0.75"
                strokeDasharray="2 2"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'bloom' ? [0.2, 0.5, 0.2] : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>

            {/* =========================================================
                STAGE 2: TWIN HYDRODYNAMIC CURRENTS (Tallo fluido de Piscis)
                Asymmetrical rising streams from y=385 to node y=175
               ========================================================= */}
            <g id="stem-currents-stage">
              {/* Primary Fluid Stem Stream */}
              <motion.path
                d="M 200 385 C 192 320, 208 260, 198 210 C 194 190, 198 180, 200 175"
                fill="none"
                stroke="url(#isaiasStemGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: phase !== 'drop' ? 1 : 0,
                  opacity: phase !== 'drop' ? 1 : 0,
                }}
                transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Secondary Harmonizing Stream (Twin Pisces Current / Dualidad) */}
              <motion.path
                d="M 200 385 C 208 330, 190 270, 202 220 C 206 195, 202 182, 200 175"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.4"
                strokeOpacity="0.75"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: phase !== 'drop' ? 1 : 0,
                  opacity: phase !== 'drop' ? 0.85 : 0,
                }}
                transition={{ duration: 2.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Obsidian Dark Contour Line (Viste de negro) */}
              <motion.path
                d="M 198 382 C 190 320, 206 260, 196 210"
                fill="none"
                stroke="#0B1329"
                strokeWidth="1.2"
                strokeOpacity="0.9"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: phase !== 'drop' ? 1 : 0 }}
                transition={{ duration: 2.6, delay: 0.4 }}
              />

              {/* Fluid Droplets rising along the stem */}
              {phase !== 'drop' && (
                <>
                  <motion.circle
                    cx="195"
                    cy="290"
                    r="2.2"
                    fill="#38BDF8"
                    animate={{
                      y: [-8, 8, -8],
                      opacity: [0.4, 0.9, 0.4],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.circle
                    cx="205"
                    cy="245"
                    r="1.8"
                    fill="#00E5FF"
                    animate={{
                      y: [6, -6, 6],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  />
                </>
              )}
            </g>

            {/* =========================================================
                STAGE 3: PROTECTIVE ARCS & CALYX (Portero: Reflejos y Protección)
                Subtle glasses lenses (lentes de luz) at node (200, 175)
               ========================================================= */}
            <g id="shields-stage">
              {/* Left Goalkeeper Protective Arc */}
              <motion.path
                d="M 196 230 C 150 220, 130 185, 120 150 C 142 168, 175 195, 196 215"
                fill="url(#keeperArcGrad)"
                stroke="#38BDF8"
                strokeWidth="1.2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  opacity: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 0.9 : 0,
                  rotate: gestureTick % 2 === 0 ? 0 : -2,
                }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '196px 230px' }}
              />

              {/* Right Goalkeeper Protective Arc (Ágil contrapunto) */}
              <motion.path
                d="M 204 230 C 250 220, 270 185, 280 150 C 258 168, 225 195, 204 215"
                fill="url(#keeperArcGrad)"
                stroke="#00E5FF"
                strokeWidth="1.2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  opacity: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 0.9 : 0,
                  rotate: gestureTick % 2 === 1 ? 0 : 2,
                }}
                transition={{ duration: 2.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '204px 230px' }}
              />

              {/* Twin Glasses Rings of Refracted Light (Detalle sutil: "Usa gafas") */}
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  opacity: phase === 'shields' || phase === 'petals' || phase === 'bloom' ? 0.65 : 0,
                }}
                transition={{ duration: 1.8, delay: 0.6 }}
              >
                <circle cx="192" cy="180" r="7" fill="none" stroke="#67E8F9" strokeWidth="0.9" opacity="0.6" />
                <circle cx="208" cy="180" r="7" fill="none" stroke="#67E8F9" strokeWidth="0.9" opacity="0.6" />
                <line x1="199" y1="180" x2="201" y2="180" stroke="#67E8F9" strokeWidth="0.9" opacity="0.8" />
              </motion.g>

              {/* 24-25 Micro-striae of water stream on calyx (Easter egg: números 24-25) */}
              <motion.path
                d="M 194 190 Q 200 176 206 190"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity="0.75"
              />
            </g>

            {/* =========================================================
                STAGE 4 & 5: AQUATIC BLUE FLOWER BLOOM FOR ISAÍAS
                Centered at node (200, 160)
               ========================================================= */}
            <motion.g
              id="isaias-water-flower-head"
              animate={
                phase === 'bloom'
                  ? {
                      scale: [1, 1.02, 0.995, 1],
                      rotate: [0, 0.6, -0.6, 0],
                    }
                  : {}
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '200px 160px' }}
            >
              {/* Outer Ethereal Water Wave Aura */}
              <motion.circle
                cx="200"
                cy="160"
                r="76"
                fill="none"
                stroke="#00B4D8"
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray="4 6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'bloom' ? [1, 1.12, 1] : phase === 'petals' ? 0.7 : 0,
                  opacity: phase === 'bloom' ? [0.2, 0.45, 0.2] : 0,
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '200px 160px' }}
              />

              {/* 8 BESPOKE AQUATIC PETALS (Lanceolate aquatic petals with wave crest curvature) */}
              {/* Outer Layer: 4 Cardinal Oceanic Petals */}
              {[
                { angle: 0, delay: 0.1 },
                { angle: 90, delay: 0.35 },
                { angle: 180, delay: 0.6 },
                { angle: 270, delay: 0.85 },
              ].map((p, idx) => (
                <motion.g
                  key={`isaias-outer-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                    opacity: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  }}
                  transition={{
                    duration: 2.8,
                    delay: p.delay,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{
                    transformOrigin: '200px 160px',
                    transform: `rotate(${p.angle}deg)`,
                  }}
                >
                  {/* Outer Petal Silhouette (Pétalo acuático con curvatura de ola serena y punta zafiro) */}
                  <path
                    d="M 200 160 C 180 130, 174 88, 200 32 C 226 88, 220 130, 200 160 Z"
                    fill="url(#isaiasBlueMain)"
                    stroke="#023E8A"
                    strokeWidth="0.9"
                    strokeOpacity="0.85"
                  />
                  {/* Crystalline spine vein */}
                  <path
                    d="M 200 160 L 200 38"
                    stroke="#E0F7FA"
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                  {/* Obsidian Dark edge contour accent on apex (vestir de negro) */}
                  <path
                    d="M 197 50 Q 200 32 203 50"
                    stroke="#0F172A"
                    strokeWidth="1.4"
                    strokeOpacity="0.9"
                    fill="none"
                  />
                  {/* Luminous cyan water droplet on petal tip */}
                  <circle cx="200" cy="34" r="2.2" fill="#00E5FF" opacity="0.9" />
                </motion.g>
              ))}

              {/* Intermediate Layer: 4 Diagonal Petals (Intercalados a 45 grados con reflejos activos) */}
              {[
                { angle: 45, delay: 0.4 },
                { angle: 135, delay: 0.7 },
                { angle: 225, delay: 0.95 },
                { angle: 315, delay: 1.2 },
              ].map((p, idx) => (
                <motion.g
                  key={`isaias-diag-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 'petals' || phase === 'bloom' ? 0.92 : 0,
                    opacity: phase === 'petals' || phase === 'bloom' ? 0.95 : 0,
                  }}
                  transition={{
                    duration: 2.6,
                    delay: p.delay,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{
                    transformOrigin: '200px 160px',
                    transform: `rotate(${p.angle}deg)`,
                  }}
                >
                  <path
                    d="M 200 160 C 184 135, 180 98, 200 46 C 220 98, 216 135, 200 160 Z"
                    fill="url(#isaiasCyanAccent)"
                    stroke="#0077B6"
                    strokeWidth="0.8"
                    strokeOpacity="0.75"
                  />
                  <path
                    d="M 200 160 L 200 52"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                    strokeOpacity="0.8"
                  />
                </motion.g>
              ))}

              {/* Inner Corola: 6 Delicate Inner Spiral Petals */}
              {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                <motion.g
                  key={`isaias-inner-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 'petals' || phase === 'bloom' ? 0.66 : 0,
                    opacity: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  }}
                  transition={{
                    duration: 2.2,
                    delay: 1.35 + idx * 0.1,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{
                    transformOrigin: '200px 160px',
                    transform: `rotate(${angle + 15}deg)`,
                  }}
                >
                  <path
                    d="M 200 160 C 188 145, 186 120, 200 78 C 214 120, 212 145, 200 160 Z"
                    fill="#E0F7FA"
                    stroke="#48CAE4"
                    strokeWidth="0.8"
                  />
                </motion.g>
              ))}

              {/* Flower Core: 20 Micro-stamen filaments (Easter Egg: número 20) & Heart of Water */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{
                  scale: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                }}
                transition={{ duration: 1.8, delay: 2.0 }}
              >
                {/* 20 Exact Stamen Filaments radiating (Número 20 oculto) */}
                {[...Array(20)].map((_, i) => {
                  const deg = (i * 360) / 20;
                  return (
                    <g key={`isaias-stamen-${i}`} transform={`rotate(${deg} 200 160)`}>
                      <line
                        x1="200"
                        y1="160"
                        x2="200"
                        y2="142"
                        stroke="#0077B6"
                        strokeWidth="0.85"
                        opacity="0.8"
                      />
                      <circle
                        cx="200"
                        cy="141"
                        r="1.6"
                        fill={i % 2 === 0 ? '#00E5FF' : '#90E0EF'}
                      />
                    </g>
                  );
                })}

                {/* Central Sapphire & Cyan Receptacle */}
                <circle cx="200" cy="160" r="14" fill="#0077B6" />
                <circle cx="200" cy="160" r="11" fill="#023E8A" stroke="#00E5FF" strokeWidth="0.8" />

                {/* Exclusive Aquatic Botanical "25" Core for Isaías */}
                <motion.g
                  id="isaias-exclusive-25-core"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 'bloom' || isFullyBloomed ? 1 : 0,
                    opacity: phase === 'bloom' || isFullyBloomed ? 1 : 0,
                  }}
                  transition={{
                    duration: 1.6,
                    delay: mode === 'result' ? 0 : 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ transformOrigin: '200px 160px' }}
                >
                  {/* Concentric deep ocean nucleus with cyan & electric water highlights */}
                  <circle
                    cx="200"
                    cy="160"
                    r="9.5"
                    fill="#031E3D"
                    stroke="#00E5FF"
                    strokeWidth="0.9"
                  />
                  <circle
                    cx="200"
                    cy="160"
                    r="8"
                    fill="#06284F"
                  />

                  {/* Perfectly centered 25 within the aquatic flower nucleus */}
                  <text
                    x="200"
                    y="160.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#00E5FF"
                    fontSize="9"
                    fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                    fontWeight="800"
                    letterSpacing="0.5px"
                    className="select-none pointer-events-none"
                    style={{
                      filter: 'drop-shadow(0 0 2.5px rgba(0, 229, 255, 0.75))',
                    }}
                  >
                    25
                  </text>

                  {/* Micro water glint highlight */}
                  <circle cx="200" cy="153.5" r="0.8" fill="#FFFFFF" opacity="0.95" />
                </motion.g>
              </motion.g>
            </motion.g>

            {/* Rising Aquatic Sparks & Gestural Thoughts (Inquietud, mente activa & Milo J night mist) */}
            {isFullyBloomed && (
              <g id="aquatic-sparks">
                {[
                  { x: 140, y: 110, delay: 0.2, color: '#00E5FF', size: 2.5 },
                  { x: 260, y: 105, delay: 0.7, color: '#38BDF8', size: 2.2 },
                  { x: 170, y: 65, delay: 1.3, color: '#E0F7FA', size: 2.8 },
                  { x: 230, y: 60, delay: 0.5, color: '#00B4D8', size: 2.0 },
                  { x: 120, y: 185, delay: 1.0, color: '#00E5FF', size: 2.4 },
                  { x: 280, y: 170, delay: 1.6, color: '#38BDF8', size: 2.1 },
                  { x: 200, y: 40, delay: 0.9, color: '#FFFFFF', size: 3.0 },
                ].map((s, i) => (
                  <motion.circle
                    key={`aquatic-sparkle-${i}`}
                    cx={s.x}
                    cy={s.y}
                    r={s.size}
                    fill={s.color}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: [0, 0.85, 0],
                      y: [-4, -22, -40],
                      scale: [0.8, 1.3, 0.5],
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
          </svg>
        </div>

        {/* Phase Narrative & Symbolic Connection to Isaías */}
        <div className="mt-4 text-center max-w-sm px-4">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-sans tracking-wide text-[#90E0EF] font-light leading-relaxed min-h-[44px]"
          >
            {getPhaseDescription()}
          </motion.p>
        </div>

        {/* Controls & Transition once fully bloomed */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          {isFullyBloomed ? (
            <>
              {/* Primary Action to Next Step: "Mi respuesta" */}
              <motion.button
                id="btn-isaias-enter-message"
                type="button"
                onClick={handleProceedNow}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#0077B6] via-[#00B4D8] to-[#00E5FF] hover:from-[#00B4D8] hover:to-[#90E0EF] text-[#030914] text-xs font-semibold tracking-wider uppercase shadow-[0_0_22px_rgba(0,229,255,0.4)] transition-all hover:scale-102 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#030914]" />
                <span>Mi respuesta</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>

              {/* Replay Flower Animation */}
              <button
                id="btn-isaias-replay-flower"
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#0077B6]/50 hover:border-[#00E5FF] bg-[#07172B]/70 hover:bg-[#0C2442] text-[#90E0EF] hover:text-[#FFFFFF] text-xs transition-colors cursor-pointer"
                title="Volver a contemplar floración"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a contemplar</span>
              </button>

              {/* Back to reading text if applicable */}
              {onBackToReading && (
                <button
                  id="btn-isaias-back-to-text"
                  type="button"
                  onClick={onBackToReading}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#0077B6]/40 hover:border-[#00B4D8] bg-[#07172B]/50 hover:bg-[#0C2442] text-[#90E0EF] hover:text-[#FFFFFF] text-xs transition-colors cursor-pointer"
                  title="Releer el texto"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Releer</span>
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2 text-[11px] text-[#48CAE4] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
              <span>Formando flor acuática de Isaías...</span>
            </div>
          )}
        </div>

        {/* Auto transition subtle notice for formation mode */}
        {mode === 'formation' && isFullyBloomed && secondsRemaining > 0 && (
          <p className="mt-3 text-[11px] text-[#48CAE4]/80 font-mono tracking-widest">
            Transición automática en {secondsRemaining}s...
          </p>
        )}
      </div>
    </div>
  );
};
