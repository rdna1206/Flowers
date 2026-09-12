import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, ArrowRight, RotateCcw } from 'lucide-react';

interface JhonFlowerAnimationProps {
  onComplete: () => void;
  autoTransitionDelay?: number; // ms after bloom before transitioning
}

type BloomPhase = 'seed' | 'stem' | 'leaves' | 'petals' | 'bloom';

export const JhonFlowerAnimation: React.FC<JhonFlowerAnimationProps> = ({
  onComplete,
  autoTransitionDelay = 5000,
}) => {
  const [phase, setPhase] = useState<BloomPhase>('seed');
  const [isFullyBloomed, setIsFullyBloomed] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);

  // Progressive cinematic stages timing
  useEffect(() => {
    // 0 -> 2.5s: Seed / Punto de luz en penumbra
    const stemTimer = setTimeout(() => {
      setPhase('stem');
    }, 2400);

    // 2.4s -> 5.5s: Tallo de precisión
    const leavesTimer = setTimeout(() => {
      setPhase('leaves');
    }, 5500);

    // 5.5s -> 9s: Hojas de equilibrio
    const petalsTimer = setTimeout(() => {
      setPhase('petals');
    }, 8800);

    // 9s -> 13.5s: Pétalos amarillos abriéndose completamente
    const bloomTimer = setTimeout(() => {
      setPhase('bloom');
      setIsFullyBloomed(true);
    }, 13500);

    return () => {
      clearTimeout(stemTimer);
      clearTimeout(leavesTimer);
      clearTimeout(petalsTimer);
      clearTimeout(bloomTimer);
    };
  }, []);

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

  // Restart the whole creation sequence if desired
  const handleReplay = () => {
    setIsFullyBloomed(false);
    setSecondsRemaining(5);
    setPhase('seed');
    setTimeout(() => setPhase('stem'), 2400);
    setTimeout(() => setPhase('leaves'), 5500);
    setTimeout(() => setPhase('petals'), 8800);
    setTimeout(() => {
      setPhase('bloom');
      setIsFullyBloomed(true);
    }, 13500);
  };

  // Skip or advance directly to full bloom or complete
  const handleProceedNow = () => {
    onComplete();
  };

  // Phase status texts representing Jhon's internal themes (focus, balance, mystery)
  const getPhaseDescription = () => {
    switch (phase) {
      case 'seed':
        return 'Punto de concentración y quietud en la penumbra...';
      case 'stem':
        return 'Trazando la dirección: firmeza, silencio y precisión...';
      case 'leaves':
        return 'Dualidad y equilibrio: la armonía del movimiento sutil...';
      case 'petals':
        return 'Los pétalos amarillos se abren ante la penumbra...';
      case 'bloom':
        return 'Flor de Oro y Sombra. Plenitud, templanza y energía serena.';
    }
  };

  return (
    <div
      id="jhon-flower-animation-container"
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none"
    >
      {/* Ambient Thunder-Blue & Shadow Nebula (Inspiración en cielo nocturno y destellos sutiles) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full bg-radial from-[#0047AB]/20 via-[#0A192F]/40 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-radial from-[#2B78E4]/15 via-[#F4D03F]/10 to-transparent blur-2xl" />
        
        {/* Subtle electrical sparks / starry dust particles */}
        <div className="absolute inset-0 bg-[radial-gradient(#3A86FF_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
      </div>

      {/* Main Botanical Canvas Area */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        {/* Top subtle indicator badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#1E3A6E]/60 bg-[#0A1329]/70 backdrop-blur-md shadow-xs"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#F4D03F] animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#8EAFDD] uppercase">
            Creación Floral Personalizada
          </span>
        </motion.div>

        {/* The Flower Stage: Height 420px */}
        <div className="relative w-[340px] h-[400px] sm:w-[380px] sm:h-[420px] flex items-center justify-center">
          <svg
            viewBox="0 0 380 420"
            className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(244,208,63,0.18)]"
          >
            <defs>
              {/* Golden Yellow Petal Gradients */}
              <linearGradient id="jhonGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF48F" />
                <stop offset="45%" stopColor="#F4D03F" />
                <stop offset="85%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#B38728" />
              </linearGradient>

              <linearGradient id="jhonGoldAccent" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFF9A6" />
                <stop offset="35%" stopColor="#FFDC52" />
                <stop offset="75%" stopColor="#E5B229" />
                <stop offset="100%" stopColor="#8C6314" />
              </linearGradient>

              {/* Stem Gradient: Deep Viridian & Cobalt Spine with Thunder Highlights */}
              <linearGradient id="jhonStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#0B1C38" />
                <stop offset="40%" stopColor="#1C443D" />
                <stop offset="75%" stopColor="#2E6B56" />
                <stop offset="100%" stopColor="#418764" />
              </linearGradient>

              {/* Leaf Gradient: Balance of Shadow and Night Emerald with Blue Vein */}
              <linearGradient id="jhonLeafGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A8F70" />
                <stop offset="50%" stopColor="#225341" />
                <stop offset="100%" stopColor="#0B233D" />
              </linearGradient>

              <linearGradient id="jhonLeafGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5CA684" />
                <stop offset="60%" stopColor="#1E4738" />
                <stop offset="100%" stopColor="#081A30" />
              </linearGradient>

              {/* Thunder Glow Filter */}
              <filter id="thunderGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* STAGE 1: SEED / PUNTO DE LUZ (Centro en x=190, y=210) */}
            <g id="seed-stage">
              {/* Outer electrical aura */}
              <motion.circle
                cx="190"
                cy="370"
                r="18"
                fill="none"
                stroke="#00D2FF"
                strokeWidth="1"
                strokeDasharray="2 4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: phase === 'seed' ? [0.2, 0.6, 0.2] : 0,
                  scale: phase === 'seed' ? [0.8, 1.4, 0.8] : 0,
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Seed core */}
              <motion.circle
                cx="190"
                cy="370"
                r="6"
                fill="url(#jhonGoldMain)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'seed' ? [1, 1.25, 1] : 0.8,
                  opacity: 1,
                }}
                transition={{ duration: 1.8, repeat: phase === 'seed' ? Infinity : 0 }}
              />

              {/* Gentle shadow pulse under the seed */}
              <motion.ellipse
                cx="190"
                cy="386"
                rx="24"
                ry="4"
                fill="#001838"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1.2 }}
              />
            </g>

            {/* STAGE 2: STEM (TALLO) */}
            {/* Height runs from y=370 up to the floral node at y=170 */}
            <g id="stem-stage">
              <motion.path
                d="M 190 370 Q 187 290 190 220 Q 192 195 190 170"
                fill="none"
                stroke="url(#jhonStemGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: phase !== 'seed' ? 1 : 0,
                  opacity: phase !== 'seed' ? 1 : 0,
                }}
                transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Subtle electric blue accent line down the spine of the stem */}
              <motion.path
                d="M 190 368 Q 187 290 190 220 Q 192 195 190 172"
                fill="none"
                stroke="#3A86FF"
                strokeWidth="1"
                strokeOpacity="0.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: phase !== 'seed' ? 1 : 0,
                  opacity: phase !== 'seed' ? 0.7 : 0,
                }}
                transition={{ duration: 2.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </g>

            {/* STAGE 3: LEAVES (HOJAS - DUALIDAD Y EQUILIBRIO YING-YANG) */}
            <g id="leaves-stage">
              {/* Left Leaf (Naciente a y=280) */}
              <motion.g
                initial={{ scale: 0, opacity: 0, rotate: -25 }}
                animate={{
                  scale: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  opacity: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  rotate: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 0 : -25,
                }}
                transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '188px 285px' }}
              >
                {/* Leaf blade */}
                <path
                  d="M 188 285 C 150 280 125 250 115 220 C 135 240 165 265 188 275 Z"
                  fill="url(#jhonLeafGradLeft)"
                  stroke="#2E6B56"
                  strokeWidth="1"
                />
                {/* Cobalt leaf spine */}
                <path
                  d="M 188 285 C 160 270 140 250 115 220"
                  fill="none"
                  stroke="#3A86FF"
                  strokeWidth="0.8"
                  strokeOpacity="0.7"
                />
              </motion.g>

              {/* Right Leaf (Naciente a y=245, contrapunto armónico) */}
              <motion.g
                initial={{ scale: 0, opacity: 0, rotate: 25 }}
                animate={{
                  scale: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  opacity: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  rotate: phase === 'leaves' || phase === 'petals' || phase === 'bloom' ? 0 : 25,
                }}
                transition={{ duration: 2.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: '190px 250px' }}
              >
                {/* Leaf blade */}
                <path
                  d="M 190 250 C 230 245 255 218 268 185 C 248 205 215 230 190 240 Z"
                  fill="url(#jhonLeafGradRight)"
                  stroke="#3A7B62"
                  strokeWidth="1"
                />
                {/* Golden leaf spine */}
                <path
                  d="M 190 250 C 220 232 245 210 268 185"
                  fill="none"
                  stroke="#F4D03F"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
              </motion.g>
            </g>

            {/* STAGE 4 & 5: UNIQUE YELLOW FLOWER BLOOM FOR JHON */}
            {/* Centered at node (190, 165) */}
            <motion.g
              id="jhon-yellow-flower-head"
              animate={
                phase === 'bloom'
                  ? {
                      scale: [1, 1.025, 1],
                      rotate: [0, 0.5, -0.5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '190px 165px' }}
            >
              {/* Outer Ethereal Thunder Glow Behind Blooming Petals */}
              <motion.circle
                cx="190"
                cy="165"
                r="70"
                fill="none"
                stroke="#00D2FF"
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: phase === 'bloom' ? [1, 1.15, 1] : phase === 'petals' ? 0.7 : 0,
                  opacity: phase === 'bloom' ? [0.2, 0.4, 0.2] : 0,
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* 8 BESPOKE LANCEOLATE GOLDEN PETALS (Ángulos: 0, 45, 90, 135, 180, 225, 270, 315) */}
              {/* Outer Layer: 4 Cardinal Petals */}
              {[
                { angle: 0, delay: 0.1 },
                { angle: 90, delay: 0.35 },
                { angle: 180, delay: 0.6 },
                { angle: 270, delay: 0.85 },
              ].map((p, idx) => (
                <motion.g
                  key={`outer-petal-${idx}`}
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
                    transformOrigin: '190px 165px',
                    transform: `rotate(${p.angle}deg)`,
                  }}
                >
                  {/* Outer Petal Silhouette (Pétalo lanceoloide de precisión botánica con punta elegante) */}
                  <path
                    d="M 190 165 C 172 135 168 95 190 40 C 212 95 208 135 190 165 Z"
                    fill="url(#jhonGoldMain)"
                    stroke="#B38728"
                    strokeWidth="0.8"
                    strokeOpacity="0.8"
                  />
                  {/* Subtle spine line along petal */}
                  <path
                    d="M 190 165 L 190 46"
                    stroke="#FFF9A6"
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                  {/* Cobalt tip accent reflecting Jhon's palette */}
                  <path
                    d="M 188 56 Q 190 40 192 56"
                    stroke="#3A86FF"
                    strokeWidth="1"
                    strokeOpacity="0.75"
                    fill="none"
                  />
                </motion.g>
              ))}

              {/* Intermediate Layer: 4 Diagonal Petals (Intercalados a 45 grados) */}
              {[
                { angle: 45, delay: 0.4 },
                { angle: 135, delay: 0.7 },
                { angle: 225, delay: 0.95 },
                { angle: 315, delay: 1.2 },
              ].map((p, idx) => (
                <motion.g
                  key={`diag-petal-${idx}`}
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
                    transformOrigin: '190px 165px',
                    transform: `rotate(${p.angle}deg)`,
                  }}
                >
                  <path
                    d="M 190 165 C 176 140 172 105 190 52 C 208 105 204 140 190 165 Z"
                    fill="url(#jhonGoldAccent)"
                    stroke="#9E761E"
                    strokeWidth="0.8"
                    strokeOpacity="0.7"
                  />
                  <path
                    d="M 190 165 L 190 58"
                    stroke="#FFEAA7"
                    strokeWidth="1"
                    strokeOpacity="0.7"
                  />
                </motion.g>
              ))}

              {/* Inner Corola: 6 Delicate Inner Spiral Petals */}
              {[0, 60, 120, 180, 240, 300].map((angle, idx) => (
                <motion.g
                  key={`inner-petal-${idx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: phase === 'petals' || phase === 'bloom' ? 0.65 : 0,
                    opacity: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                  }}
                  transition={{
                    duration: 2.2,
                    delay: 1.4 + idx * 0.1,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  style={{
                    transformOrigin: '190px 165px',
                    transform: `rotate(${angle + 20}deg)`,
                  }}
                >
                  <path
                    d="M 190 165 C 180 148 178 125 190 85 C 202 125 200 148 190 165 Z"
                    fill="#FFF7A1"
                    stroke="#D4AF37"
                    strokeWidth="0.8"
                  />
                </motion.g>
              ))}

              {/* Flower Center Core (Pistilo y estambres con fulgor dorado y azul cobalto) */}
              <motion.g
                initial={{ scale: 0 }}
                animate={{
                  scale: phase === 'petals' || phase === 'bloom' ? 1 : 0,
                }}
                transition={{ duration: 1.8, delay: 2.0 }}
              >
                {/* Central golden button */}
                <circle cx="190" cy="165" r="13" fill="#D4AF37" />
                <circle cx="190" cy="165" r="10" fill="#F4D03F" />
                <circle cx="190" cy="165" r="6" fill="#FFF48F" />

                {/* Stamen Radiating Filaments */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
                  <g key={`stamen-${i}`} transform={`rotate(${deg} 190 165)`}>
                    <line
                      x1="190"
                      y1="165"
                      x2="190"
                      y2="148"
                      stroke="#8C6314"
                      strokeWidth="0.9"
                    />
                    <circle
                      cx="190"
                      cy="147"
                      r="1.6"
                      fill={i % 2 === 0 ? '#FFE066' : '#00D2FF'}
                    />
                  </g>
                ))}

                {/* Center subtle light point */}
                <circle cx="190" cy="165" r="2.5" fill="#FFFFFF" />
              </motion.g>
            </motion.g>

            {/* Rising Golden & Cobalt Floating Sparkles (Inspiración en chispas de energía sutil) */}
            {isFullyBloomed && (
              <g id="sparkles">
                {[
                  { x: 130, y: 120, delay: 0.2, color: '#F4D03F' },
                  { x: 250, y: 110, delay: 0.8, color: '#3A86FF' },
                  { x: 160, y: 70, delay: 1.4, color: '#FFF48F' },
                  { x: 220, y: 65, delay: 0.5, color: '#00D2FF' },
                  { x: 110, y: 190, delay: 1.1, color: '#F4D03F' },
                  { x: 270, y: 175, delay: 1.7, color: '#3A86FF' },
                ].map((s, i) => (
                  <motion.circle
                    key={`sparkle-${i}`}
                    cx={s.x}
                    cy={s.y}
                    r="2.2"
                    fill={s.color}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: [0, 0.9, 0],
                      y: [-5, -25, -45],
                      scale: [0.8, 1.3, 0.5],
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

        {/* Phase Narrative & Philosophical Connection to Jhon */}
        <div className="mt-4 text-center max-w-sm px-4">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className="text-xs sm:text-sm font-sans tracking-wide text-[#A7C2E8] font-light leading-relaxed min-h-[44px]"
          >
            {getPhaseDescription()}
          </motion.p>
        </div>

        {/* Controls & Transition once fully bloomed */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          {isFullyBloomed ? (
            <>
              {/* Proceed to Personal Message */}
              <motion.button
                id="btn-jhon-enter-message"
                type="button"
                onClick={handleProceedNow}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#F4D03F] to-[#E5B229] hover:from-[#FFE066] hover:to-[#F4D03F] text-[#0A1224] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(244,208,63,0.35)] transition-all hover:scale-102 cursor-pointer"
              >
                <span>Acceder a tu Espacio Personal</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </motion.button>

              {/* Replay Flower Animation */}
              <button
                id="btn-jhon-replay-flower"
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-full border border-[#1E3A6E] hover:border-[#3A86FF] bg-[#0A1329]/60 hover:bg-[#0E1A38] text-[#8EAFDD] hover:text-[#E6EDF8] text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Volver a contemplar floración</span>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-[11px] text-[#6082B6] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A86FF] animate-ping" />
              <span>Formando flor amarilla exclusiva...</span>
            </div>
          )}
        </div>

        {/* Auto transition subtle notice */}
        {isFullyBloomed && secondsRemaining > 0 && (
          <p className="mt-3 text-[11px] text-[#6082B6] font-mono tracking-widest">
            Transición automática en {secondsRemaining}s...
          </p>
        )}
      </div>
    </div>
  );
};
