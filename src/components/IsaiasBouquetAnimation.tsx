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

/*
  ISAIAS UNIQUE AQUATIC CHOREOGRAPHY (CONCENTRIC 5-TIER DEPTH):
  1. empty-vase              (0.0s)  - Recipiente de cristal espacioso, completamente vacío y translúcido
  2. water-filling           (1.5s)  - El agua brota desde el fondo y sube de forma visible con corrientes, burbujas y superficie fluida
  3. stems-in-water          (4.2s)  - Ondas concéntricas en la superficie; aparecen los primeros tallos vivos sumergidos dentro del agua
  4. stems-growing           (6.0s)  - Los tallos crecen hacia arriba, atraviesan la superficie del agua y salen del recipiente con follaje
  5. yellow-cascade-1        (7.8s)  - Flor amarilla 1 (Superior izquierda) brota con energía
  6. yellow-cascade-2        (9.4s)  - Flor amarilla 2 (Superior derecha) se expande
  7. yellow-cascade-3        (11.0s) - Flores amarillas 3 y 4 (Laterales) emergen con vitalidad
  8. yellow-cascade-4        (12.6s) - Gran rosa dorada frontal (200, 265) se abre en la boca del jarrón, completando el ramo base
  9. vortex-genesis          (14.2s) - Corriente acuática luminosa sube desde el agua hasta el ápice y forma un vórtice
  10. proto-bud-emerge       (15.8s) - Capullo cerrado inicial formado por la corriente
  11. proto-layer1-deep-open (17.2s) - CAPA 1: Se despliega la capa posterior profunda de 10 grandes pétalos azul abisal en 360°
  12. proto-layer2-rear-open (18.6s) - CAPA 2: Se despliegan 12 pétalos azul zafiro real elevados en los intersticios
  13. proto-layer3-mid-open  (20.0s) - CAPA 3: Se abren 12 pétalos intermedios con siluetas de olas oceánicas
  14. proto-layer4-inner-open(21.4s) - CAPA 4: Se despliega la corola interior de 10 pétalos cian eléctrico
  15. proto-layer5-front-open(22.8s) - CAPA 5: Se abre el cáliz frontal de 8 pétalos cristalinos rodeando la corona
  16. sacred-core-24         (24.2s) - Halo de estambres dorados, doble onda celestial y revelación del sagrado '24' en el núcleo
  17. aquatic-calm           (26.0s) - El agua queda serena y viva debajo con el gran ramo completo y la flor azul de múltiples capas
*/

type AquaticStep =
  | 'empty-vase'
  | 'water-filling'
  | 'stems-in-water'
  | 'stems-growing'
  | 'yellow-cascade-1'
  | 'yellow-cascade-2'
  | 'yellow-cascade-3'
  | 'yellow-cascade-4'
  | 'vortex-genesis'
  | 'proto-bud-emerge'
  | 'proto-spire-unfold'
  | 'proto-lateral-open'
  | 'proto-corolla-bloom'
  | 'sacred-core-24'
  | 'aquatic-calm';

export const IsaiasBouquetAnimation: React.FC<IsaiasBouquetAnimationProps> = ({
  mode = 'formation',
  onProceedToReading,
  onProceedToResponse,
  onBackToReading,
  onReplayFormation,
}) => {
  const [step, setStep] = useState<AquaticStep>(mode === 'result' ? 'aquatic-calm' : 'empty-vase');
  const [isCompleted, setIsCompleted] = useState<boolean>(mode === 'result');
  const [interactiveRipple, setInteractiveRipple] = useState<boolean>(false);
  const [sparkleCount, setSparkleCount] = useState<number>(0);

  useEffect(() => {
    if (mode === 'result') {
      setStep('aquatic-calm');
      setIsCompleted(true);
      return;
    }

    setStep('empty-vase');
    setIsCompleted(false);

    const t1 = setTimeout(() => setStep('water-filling'), 1500);
    const t2 = setTimeout(() => setStep('stems-in-water'), 4200);
    const t3 = setTimeout(() => setStep('stems-growing'), 6000);
    const t4 = setTimeout(() => setStep('yellow-cascade-1'), 7800);
    const t5 = setTimeout(() => setStep('yellow-cascade-2'), 9400);
    const t6 = setTimeout(() => setStep('yellow-cascade-3'), 11000);
    const t7 = setTimeout(() => setStep('yellow-cascade-4'), 12600);
    const t8 = setTimeout(() => setStep('vortex-genesis'), 14200);
    const t9 = setTimeout(() => setStep('proto-bud-emerge'), 15800);
    const t10 = setTimeout(() => setStep('proto-spire-unfold'), 17200);
    const t11 = setTimeout(() => setStep('proto-lateral-open'), 18800);
    const t12 = setTimeout(() => setStep('proto-corolla-bloom'), 20400);
    const t13 = setTimeout(() => setStep('sacred-core-24'), 22000);
    const t14 = setTimeout(() => {
      setStep('aquatic-calm');
      setIsCompleted(true);
    }, 24200);

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
    setStep('empty-vase');
    setTimeout(() => setStep('water-filling'), 1500);
    setTimeout(() => setStep('stems-in-water'), 4200);
    setTimeout(() => setStep('stems-growing'), 6000);
    setTimeout(() => setStep('yellow-cascade-1'), 7800);
    setTimeout(() => setStep('yellow-cascade-2'), 9400);
    setTimeout(() => setStep('yellow-cascade-3'), 11000);
    setTimeout(() => setStep('yellow-cascade-4'), 12600);
    setTimeout(() => setStep('vortex-genesis'), 14200);
    setTimeout(() => setStep('proto-bud-emerge'), 15800);
    setTimeout(() => setStep('proto-spire-unfold'), 17200);
    setTimeout(() => setStep('proto-lateral-open'), 18800);
    setTimeout(() => setStep('proto-corolla-bloom'), 20400);
    setTimeout(() => setStep('sacred-core-24'), 22000);
    setTimeout(() => {
      setStep('aquatic-calm');
      setIsCompleted(true);
    }, 24200);
  };

  const handleTouch = () => {
    setInteractiveRipple(true);
    setSparkleCount((c) => c + 1);
    setTimeout(() => setInteractiveRipple(false), 1400);
  };

  const isStepAtLeast = (target: AquaticStep) => {
    const order: AquaticStep[] = [
      'empty-vase',
      'water-filling',
      'stems-in-water',
      'stems-growing',
      'yellow-cascade-1',
      'yellow-cascade-2',
      'yellow-cascade-3',
      'yellow-cascade-4',
      'vortex-genesis',
      'proto-bud-emerge',
      'proto-spire-unfold',
      'proto-lateral-open',
      'proto-corolla-bloom',
      'sacred-core-24',
      'aquatic-calm',
    ];
    return order.indexOf(step) >= order.indexOf(target);
  };

  return (
    <div
      id="isaias-bouquet-container"
      className="relative min-h-[86vh] flex flex-col items-center justify-center px-3 py-4 overflow-hidden select-none"
    >
      {/* Nocturnal Deep Ocean & Pisces Nebula Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full bg-radial from-[#0077B6]/35 via-[#071930]/80 to-transparent blur-3xl opacity-95" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-radial from-[#00E5FF]/24 via-[#FBBF24]/16 to-transparent blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        <motion.div
          animate={{
            opacity: [0.12, 0.32, 0.12],
            scale: [0.98, 1.05, 0.98],
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
          className="relative w-[340px] h-[500px] sm:w-[420px] sm:h-[580px] flex items-center justify-center cursor-pointer group"
        >
          <svg
            id="isaias-bouquet-svg"
            data-flower-stage="true"
            viewBox="0 0 400 550"
            className="w-full h-full overflow-visible drop-shadow-[0_0_50px_rgba(0,180,216,0.4)]"
          >
            <defs>
              {/* Grand Crystal Glass Body Gradient */}
              <linearGradient id="sleekGlassBody" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                <stop offset="15%" stopColor="#38BDF8" stopOpacity="0.22" />
                <stop offset="50%" stopColor="#07192F" stopOpacity="0.55" />
                <stop offset="85%" stopColor="#00E5FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0369A1" stopOpacity="0.5" />
              </linearGradient>

              {/* Dynamic Living Water Mass Gradient */}
              <linearGradient id="livingWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.7" />
                <stop offset="25%" stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="65%" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#032042" stopOpacity="0.95" />
              </linearGradient>

              {/* Water Surface Ellipse Radial Gradient */}
              <radialGradient id="waterSurfaceGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.7" />
                <stop offset="75%" stopColor="#0284C7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#032042" stopOpacity="0.3" />
              </radialGradient>

              {/* Water Whirlpool / Vortex Gradient */}
              <radialGradient id="waterVortexGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#00E5FF" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#0284C7" stopOpacity="0.55" />
                <stop offset="85%" stopColor="#031E3D" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#020E1E" stopOpacity="0" />
              </radialGradient>

              {/* Polished Gold Trim */}
              <linearGradient id="vaseGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="25%" stopColor="#FDE047" />
                <stop offset="55%" stopColor="#EAB308" />
                <stop offset="85%" stopColor="#CA8A04" />
                <stop offset="100%" stopColor="#854D0E" />
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

              {/* Botanical Stems Gradient */}
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="40%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              {/* Submerged Stems Aquatic Refraction Gradient */}
              <linearGradient id="submergedStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#0D9488" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>

              {/* LAYER 1: Deep Abyssal Midnight Sapphire Gradient (Rearest Layer) */}
              <linearGradient id="protoDeepAbyssalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#01152B" />
                <stop offset="25%" stopColor="#022B59" />
                <stop offset="60%" stopColor="#03457A" />
                <stop offset="85%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>

              {/* LAYER 2: Royal Sapphire Oceanic Gradient (Upper-Rear Layer) */}
              <linearGradient id="protoRoyalSapphireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#033B6A" />
                <stop offset="25%" stopColor="#0265A3" />
                <stop offset="60%" stopColor="#0284C7" />
                <stop offset="85%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>

              {/* LAYER 3: Flowing Ocean Wave Gradient (Mid-Layer) */}
              <linearGradient id="protoOceanWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#034975" />
                <stop offset="30%" stopColor="#0284C7" />
                <stop offset="65%" stopColor="#00B4D8" />
                <stop offset="88%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>

              {/* LAYER 4: Protagonist Electric Cyan Corolla Gradient (Inner-Forward Layer) */}
              <linearGradient id="protoCyanGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="20%" stopColor="#CFFAFE" />
                <stop offset="55%" stopColor="#00E5FF" />
                <stop offset="85%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#031E3D" />
              </linearGradient>

              {/* LAYER 5: Front Crystalline Chalice & Diamond Aqua Gradient (Foreground Layer) */}
              <linearGradient id="protoCrystallineAquaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#E0F2FE" />
                <stop offset="70%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>

              {/* Depth Shadow Filter for Posterior Floral Layers */}
              <filter id="protoPetalDepthShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodColor="#010E1C" floodOpacity="0.75" />
              </filter>

              {/* 24 Core Jewel Radial */}
              <radialGradient id="protoCoreJewel24" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="45%" stopColor="#032145" />
                <stop offset="85%" stopColor="#011326" />
                <stop offset="100%" stopColor="#000914" />
              </radialGradient>

              {/* Glow Filter for 24 */}
              <filter id="glowFilter24" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Water Clip Path for Inside the Large Vase */}
              <clipPath id="vaseInnerWaterClip">
                <path d="M 147 302 C 145 360, 141 430, 143 493 C 145 503, 255 503, 257 493 C 259 430, 255 360, 253 302 Z" />
              </clipPath>

              {/* Protagonist Celestial Flash */}
              <radialGradient id="protoCelestialFlash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="25%" stopColor="#BAE6FD" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#00E5FF" stopOpacity="0.5" />
                <stop offset="85%" stopColor="#0284C7" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#031E3D" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Base Reflection Rings */}
            <g id="isaias-floor-ambient">
              <ellipse
                cx="200"
                cy="502"
                rx="65"
                ry="10"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="0.9"
                opacity="0.25"
              />
              <motion.ellipse
                cx="200"
                cy="502"
                rx="85"
                ry="12"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="0.7"
                animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: '200px 502px' }}
              />
            </g>

            {/* =========================================================
                PART 1: THE LARGE, PROMINENT CRYSTAL VASE WITH LIVING WATER
                Width: ~115px | Height: 200px (y=300 to y=500)
                Water visibly fills from the bottom up to y=345!
               ========================================================= */}
            <g id="isaias-vase-assembly">
              {/* Translucent Smoked Crystal Glass Body */}
              <path
                d="M 144 300 C 142 360, 138 430, 140 495 C 140 507, 260 507, 260 495 C 262 430, 258 360, 256 300 Z"
                fill="url(#sleekGlassBody)"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />

              {/* Interior Empty Depth Shadow (visible when empty) */}
              <path
                d="M 146 302 C 144 360, 140 430, 142 493 C 144 503, 256 503, 258 493 C 260 430, 256 360, 254 302 Z"
                fill="#051224"
                opacity={isStepAtLeast('water-filling') ? 0.25 : 0.7}
              />

              {/* =========================================================
                  DYNAMIC WATER ENGINE:
                  Water visibly rises from the very bottom (y=495) up to
                  the resting line (y=345), giving 150px of crystal-clear depth!
                 ========================================================= */}
              <g clipPath="url(#vaseInnerWaterClip)">
                {/* 1. Initial Droplet and Floor Ripples when filling starts */}
                {step === 'water-filling' && (
                  <g id="initial-drop-and-ripples">
                    <motion.circle
                      cx="200"
                      cy="300"
                      r="3.5"
                      fill="#00E5FF"
                      initial={{ cy: 300, opacity: 0 }}
                      animate={{ cy: 495, opacity: [0, 1, 0.8, 0], scale: [0.8, 1, 1.2, 0.4] }}
                      transition={{ duration: 1.1, ease: 'easeIn' }}
                    />
                    <motion.ellipse
                      cx="200"
                      cy="495"
                      rx="8"
                      ry="2.5"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="1.4"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: [0.2, 3.5], opacity: [0, 0.9, 0] }}
                      transition={{ duration: 1.6, delay: 0.6, repeat: 2, ease: 'easeOut' }}
                    />
                    <motion.ellipse
                      cx="200"
                      cy="495"
                      rx="14"
                      ry="4"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.0"
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: [0.2, 2.8], opacity: [0, 0.75, 0] }}
                      transition={{ duration: 1.8, delay: 0.9, repeat: 2, ease: 'easeOut' }}
                    />
                  </g>
                )}

                {/* 2. Rising Water Column & Living Fluid Body */}
                {isStepAtLeast('water-filling') && (
                  <motion.g id="vase-water-column">
                    {/* Water Mass Rect filling upward */}
                    <motion.rect
                      x="135"
                      width="130"
                      fill="url(#livingWaterGrad)"
                      initial={mode === 'result' ? { y: 345, height: 160 } : { y: 495, height: 5 }}
                      animate={{ y: 345, height: 160 }}
                      transition={{ duration: 3.0, ease: [0.25, 1, 0.5, 1] }}
                    />

                    {/* Sinuous Currents & Light Caustics inside the Water */}
                    <motion.g
                      animate={{
                        y: [-5, 5, -5],
                        opacity: [0.45, 0.8, 0.45],
                      }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <path
                        d="M 160 370 Q 180 395 170 435 Q 165 460 175 485"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        opacity="0.55"
                      />
                      <path
                        d="M 235 365 Q 215 390 228 430 Q 235 455 222 485"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                      <path
                        d="M 198 360 Q 206 400 195 440 Q 192 465 204 485"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.0"
                        strokeDasharray="4 6"
                        opacity="0.4"
                      />
                    </motion.g>

                    {/* Rising Aquatic Micro-Bubbles */}
                    {[
                      { x: 170, yInit: 480, r: 1.8, delay: 0, dur: 3.4 },
                      { x: 215, yInit: 475, r: 2.2, delay: 0.8, dur: 3.0 },
                      { x: 190, yInit: 485, r: 1.5, delay: 1.5, dur: 3.8 },
                      { x: 230, yInit: 470, r: 1.9, delay: 2.2, dur: 3.2 },
                      { x: 180, yInit: 460, r: 1.6, delay: 1.0, dur: 3.5 },
                      { x: 205, yInit: 465, r: 2.0, delay: 1.8, dur: 2.9 },
                    ].map((b, bi) => (
                      <motion.circle
                        key={`water-bubble-${bi}`}
                        cx={b.x}
                        r={b.r}
                        fill="#FFFFFF"
                        stroke="#00E5FF"
                        strokeWidth="0.6"
                        initial={{ cy: b.yInit, opacity: 0 }}
                        animate={{
                          cy: [b.yInit, 350],
                          opacity: [0, 0.9, 0.25],
                          x: [b.x - 3, b.x + 3, b.x - 1],
                        }}
                        transition={{
                          duration: b.dur,
                          repeat: Infinity,
                          delay: b.delay,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}

                    {/* Dynamic Moving Meniscus Wave (Surface of the Water) */}
                    <motion.g
                      initial={mode === 'result' ? { y: 0 } : { y: 150 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 3.0, ease: [0.25, 1, 0.5, 1] }}
                    >
                      {/* Water Surface Glow Oval */}
                      <motion.ellipse
                        cx="200"
                        cy="345"
                        rx="52"
                        ry="8.5"
                        fill="url(#waterSurfaceGlow)"
                        opacity="0.45"
                        animate={{ rx: [51, 53.5, 51], ry: [8, 9.5, 8] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Fluid Surface Outer Ripple */}
                      <motion.ellipse
                        cx="200"
                        cy="345"
                        rx="52"
                        ry="8.5"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="1.4"
                        animate={{ opacity: [0.75, 1, 0.75] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      {/* Luminous Specular Wave Crest */}
                      <motion.path
                        d="M 160 345 Q 180 342 200 346 Q 220 348 240 345"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="1.2"
                        opacity="0.85"
                        animate={{
                          d: [
                            'M 160 345 Q 180 342 200 346 Q 220 348 240 345',
                            'M 160 346 Q 180 348 200 344 Q 220 342 240 346',
                            'M 160 345 Q 180 342 200 346 Q 220 348 240 345',
                          ],
                        }}
                        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      {/* Concentric ripples when stems break the water surface */}
                      {isStepAtLeast('stems-in-water') && (
                        <motion.ellipse
                          cx="200"
                          cy="345"
                          rx="30"
                          ry="5"
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth="1.2"
                          initial={{ scale: 0.2, opacity: 0 }}
                          animate={{ scale: [0.2, 1.8], opacity: [0.8, 0] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                    </motion.g>

                    {/* Gentle Water Whirlpool when blue flower forms */}
                    {isStepAtLeast('vortex-genesis') && (
                      <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '200px 345px' }}
                      >
                        <ellipse
                          cx="200"
                          cy="345"
                          rx="36"
                          ry="6"
                          fill="none"
                          stroke="#00E5FF"
                          strokeWidth="1.1"
                          strokeDasharray="6 8"
                          opacity="0.6"
                        />
                      </motion.g>
                    )}
                  </motion.g>
                )}

                {/* 3. SUBMERGED STEMS: Clearly visible inside the water volume */}
                {isStepAtLeast('stems-in-water') && (
                  <motion.g
                    id="vase-submerged-stems"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
                  >
                    {/* Central main stem plunging to bottom */}
                    <path
                      d="M 200 300 L 200 485"
                      fill="none"
                      stroke="url(#submergedStemGrad)"
                      strokeWidth="4.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 200 300 L 200 485"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      opacity="0.75"
                    />

                    {/* Left lateral submerged stem */}
                    <path
                      d="M 175 300 C 182 360, 188 420, 192 480"
                      fill="none"
                      stroke="url(#submergedStemGrad)"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />
                    {/* Right lateral submerged stem */}
                    <path
                      d="M 225 300 C 218 360, 212 420, 208 480"
                      fill="none"
                      stroke="url(#submergedStemGrad)"
                      strokeWidth="3.8"
                      strokeLinecap="round"
                    />

                    {/* Outer left submerged stem */}
                    <path
                      d="M 158 300 C 168 360, 178 420, 186 475"
                      fill="none"
                      stroke="url(#submergedStemGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                    {/* Outer right submerged stem */}
                    <path
                      d="M 242 300 C 232 360, 222 420, 214 475"
                      fill="none"
                      stroke="url(#submergedStemGrad)"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                    />
                  </motion.g>
                )}
              </g>

              {/* Glass Exterior Specular Highlights & Glints */}
              <path
                d="M 148 310 C 146 360, 142 430, 144 490"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M 252 312 C 254 360, 256 430, 254 488"
                fill="none"
                stroke="#7DD3FC"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.45"
              />

              {/* Solid Weighted Crystal Base Foot with Gold Trim */}
              <ellipse
                cx="200"
                cy="495"
                rx="60"
                ry="11"
                fill="#031E3D"
                stroke="url(#vaseGoldTrim)"
                strokeWidth="1.4"
              />
              <ellipse
                cx="200"
                cy="497"
                rx="52"
                ry="8"
                fill="#00E5FF"
                opacity="0.25"
              />

              {/* Sleek Gold Rim at Vase Mouth */}
              <ellipse
                cx="200"
                cy="300"
                rx="56"
                ry="10"
                fill="#041B33"
                stroke="url(#vaseGoldTrim)"
                strokeWidth="1.5"
              />
              <ellipse
                cx="200"
                cy="300"
                rx="48"
                ry="8"
                fill="#020E1E"
                stroke="#00E5FF"
                strokeWidth="0.8"
                opacity="0.75"
              />
            </g>

            {/* =========================================================
                PART 2: STEMS & BOTANICAL FOLIAGE GROWING FROM THE WATER
                Physical connection: Stems surge out of the vase mouth (y=300)
                and fan out into the bouquet!
               ========================================================= */}
            {isStepAtLeast('stems-growing') && (
              <g id="isaias-lush-foliage">
                {/* Impulses of aquatic energy ascending with the stems */}
                <motion.path
                  d="M 200 300 Q 185 240 135 195"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.8"
                  strokeOpacity="0.45"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1], opacity: [0.8, 0] }}
                  transition={{ duration: 1.4 }}
                />
                <motion.path
                  d="M 200 300 Q 215 240 265 195"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.8"
                  strokeOpacity="0.45"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1], opacity: [0.8, 0] }}
                  transition={{ duration: 1.4, delay: 0.15 }}
                />

                {/* Wide Emerald Leaves Anchored to Vase Opening */}
                {/* Left Background Leaf */}
                <motion.path
                  d="M 160 300 C 100 280, 60 230, 48 185 C 88 205, 130 250, 160 300"
                  fill="url(#foliageEmerald)"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '160px 300px' }}
                />
                <circle cx="58" cy="198" r="2.2" fill="#E0F7FA" opacity="0.9" />

                {/* Right Background Leaf */}
                <motion.path
                  d="M 240 300 C 300 280, 340 230, 352 185 C 312 205, 270 250, 240 300"
                  fill="url(#foliageEmerald)"
                  stroke="#10B981"
                  strokeWidth="0.8"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.95 }}
                  transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '240px 300px' }}
                />
                <circle cx="342" cy="198" r="2.2" fill="#E0F7FA" opacity="0.9" />

                {/* Mid-level Aquatic Teal Fronds */}
                <motion.path
                  d="M 175 300 C 130 260, 110 210, 100 155 C 132 188, 155 235, 175 300"
                  fill="url(#foliageAquaticTeal)"
                  stroke="#38BDF8"
                  strokeWidth="0.75"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '175px 300px' }}
                />
                <motion.path
                  d="M 225 300 C 270 260, 290 210, 300 155 C 268 188, 245 235, 225 300"
                  fill="url(#foliageAquaticTeal)"
                  stroke="#00E5FF"
                  strokeWidth="0.75"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: '225px 300px' }}
                />

                {/* Stems growing upward directly out of the vase mouth (y=300) */}
                {/* Stem to Flower 1 (135, 195) */}
                <motion.path
                  d="M 175 300 C 160 260, 145 230, 135 195"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Stem to Flower 2 (265, 195) */}
                <motion.path
                  d="M 225 300 C 240 260, 255 230, 265 195"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Stem to Flower 3 (110, 260) */}
                <motion.path
                  d="M 160 300 C 140 290, 125 280, 110 260"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Stem to Flower 4 (290, 260) */}
                <motion.path
                  d="M 240 300 C 260 290, 275 280, 290 260"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Stem to Front Grand Rose (200, 265) */}
                <motion.path
                  d="M 200 300 L 200 265"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Main Central Stem to Apex Protagonist Blue Flower (200, 155) */}
                <motion.path
                  d="M 200 300 L 200 155"
                  fill="none"
                  stroke="url(#stemGrad)"
                  strokeWidth="4.8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                />
                {/* Glowing Aquatic Sap Conduit inside Central Stem */}
                <motion.path
                  d="M 200 300 L 200 155"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
                />
              </g>
            )}

            {/* =========================================================
                PART 3: THE 5 RICH YELLOW FLOWERS (Lush & Radiant)
                Positioned to naturally bridge the vase mouth and form
                the abundant base of the bouquet!
               ========================================================= */}

            {/* FLOWER 1: Upper-Left Golden Lotus/Sunflower at (135, 195) */}
            {isStepAtLeast('yellow-cascade-1') && (
              <motion.g
                id="isaias-flower-1"
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: -12, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.34, 1.35, 0.64, 1] }}
                style={{ transformOrigin: '135px 195px' }}
              >
                {/* Water splash burst on bloom */}
                <motion.circle
                  cx="135"
                  cy="195"
                  r="35"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* Layer 1: 14 Outer Petals */}
                {[...Array(14)].map((_, i) => {
                  const deg = (i * 360) / 14;
                  return (
                    <g key={`f1-out-${i}`} transform={`rotate(${deg} 135 195)`}>
                      <path
                        d="M 135 195 C 127 172, 125 142, 135 130 C 145 142, 143 172, 135 195 Z"
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
                    <g key={`f1-in-${i}`} transform={`rotate(${deg} 135 195)`}>
                      <path
                        d="M 135 195 C 129 178, 127 155, 135 144 C 143 155, 141 178, 135 195 Z"
                        fill="url(#yellowPetalInner)"
                        stroke="#CA8A04"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {/* Textured Amber Center Disc */}
                <circle cx="135" cy="195" r="14" fill="url(#yellowCenterAmber)" stroke="#CA8A04" strokeWidth="1" />
                <circle cx="135" cy="195" r="9" fill="#78350F" />
                <circle cx="135" cy="195" r="5" fill="#FACC15" />
                <circle cx="133" cy="193" r="1.5" fill="#FFFBEB" />
              </motion.g>
            )}

            {/* FLOWER 2: Upper-Right Golden Chrysanthemum at (265, 195) */}
            {isStepAtLeast('yellow-cascade-2') && (
              <motion.g
                id="isaias-flower-2"
                initial={{ scale: 0, rotate: 45, opacity: 0 }}
                animate={{ scale: 1, rotate: 14, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.34, 1.35, 0.64, 1] }}
                style={{ transformOrigin: '265px 195px' }}
              >
                {/* Water splash burst on bloom */}
                <motion.circle
                  cx="265"
                  cy="195"
                  r="35"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                {/* 16 Radiating Slender Petals */}
                {[...Array(16)].map((_, i) => {
                  const deg = (i * 360) / 16;
                  const len = i % 2 === 0 ? 56 : 46;
                  return (
                    <g key={`f2-out-${i}`} transform={`rotate(${deg} 265 195)`}>
                      <path
                        d={`M 265 195 C 260 180, 258 ${195 - len + 10}, 265 ${195 - len} C 272 ${195 - len + 10}, 270 180, 265 195 Z`}
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
                    <g key={`f2-in-${i}`} transform={`rotate(${deg} 265 195)`}>
                      <path
                        d="M 265 195 C 261 185, 260 168, 265 162 C 270 168, 269 185, 265 195 Z"
                        fill="url(#yellowPetalInner)"
                        stroke="#FEF08A"
                        strokeWidth="0.5"
                      />
                    </g>
                  );
                })}

                {/* Golden Center */}
                <circle cx="265" cy="195" r="13" fill="url(#yellowCenterAmber)" />
                <circle cx="265" cy="195" r="8" fill="#F59E0B" />
                <circle cx="265" cy="195" r="4" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* FLOWER 3: Lower-Left Golden Ranunculus Rose at (110, 260) */}
            {isStepAtLeast('yellow-cascade-3') && (
              <motion.g
                id="isaias-flower-3"
                initial={{ scale: 0, x: -25, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.34, 1.35, 0.64, 1] }}
                style={{ transformOrigin: '110px 260px' }}
              >
                {/* 6 Large Curved Outer Cup Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f3-out-${i}`} transform={`rotate(${deg - 20} 110 260)`}>
                    <path
                      d="M 110 260 C 93 237, 97 210, 110 205 C 123 210, 127 237, 110 260 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#D97706"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* 6 Intermediate Spiraling Petals */}
                {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                  <g key={`f3-mid-${i}`} transform={`rotate(${deg - 20} 110 260)`}>
                    <path
                      d="M 110 260 C 100 243, 103 223, 110 220 C 117 223, 120 243, 110 260 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#F59E0B"
                      strokeWidth="0.6"
                    />
                  </g>
                ))}

                {/* Inner Cup & Pearl */}
                <circle cx="110" cy="260" r="11" fill="url(#yellowCenterAmber)" />
                <circle cx="110" cy="260" r="6" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="0.8" />
                <circle cx="108" cy="258" r="1.5" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* FLOWER 4: Lower-Right Golden Peony at (290, 260) */}
            {isStepAtLeast('yellow-cascade-3') && (
              <motion.g
                id="isaias-flower-4"
                initial={{ scale: 0, x: 25, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                transition={{ duration: 1.3, delay: 0.1, ease: [0.34, 1.35, 0.64, 1] }}
                style={{ transformOrigin: '290px 260px' }}
              >
                {/* 8 Scalloped Arched Outer Petals */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <g key={`f4-out-${i}`} transform={`rotate(${deg + 22.5} 290 260)`}>
                    <path
                      d="M 290 260 C 270 233, 265 205, 290 195 C 315 205, 310 233, 290 260 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#CA8A04"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* 6 Inner Radiating Cup Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f4-in-${i}`} transform={`rotate(${deg} 290 260)`}>
                    <path
                      d="M 290 260 C 277 240, 275 221, 290 215 C 305 221, 303 240, 290 260 Z"
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
                    <g key={`f4-stamen-${si}`} transform={`rotate(${sdeg} 290 260)`}>
                      <line x1="290" y1="260" x2="290" y2="243" stroke="#CA8A04" strokeWidth="1" />
                      <circle cx="290" cy="242" r="1.6" fill="#78350F" />
                    </g>
                  );
                })}
                <circle cx="290" cy="260" r="9" fill="url(#yellowCenterAmber)" />
                <circle cx="290" cy="260" r="5" fill="#FEF08A" />
              </motion.g>
            )}

            {/* FLOWER 5: Front-Center Grand Golden Rose at (200, 265)
                Nestled right at the mouth of the vase, ensuring zero gap! */}
            {isStepAtLeast('yellow-cascade-4') && (
              <motion.g
                id="isaias-flower-5"
                initial={{ scale: 0, y: 25, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ duration: 1.4, ease: [0.34, 1.35, 0.64, 1] }}
                style={{ transformOrigin: '200px 265px' }}
              >
                {/* Layer 1: 6 Broad Swirling Outer Rose Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <g key={`f5-out-${i}`} transform={`rotate(${deg} 200 265)`}>
                    <path
                      d="M 200 265 C 172 237, 175 203, 200 197 C 225 203, 228 237, 200 265 Z"
                      fill="url(#yellowPetalOuter)"
                      stroke="#D97706"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}

                {/* Layer 2: 6 Intermediate Interlocking Petals */}
                {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                  <g key={`f5-mid-${i}`} transform={`rotate(${deg} 200 265)`}>
                    <path
                      d="M 200 265 C 180 245, 182 220, 200 215 C 218 220, 220 245, 200 265 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#B45309"
                      strokeWidth="0.7"
                    />
                  </g>
                ))}

                {/* Layer 3: 5 Inner Ruffled Core Petals */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <g key={`f5-in-${i}`} transform={`rotate(${deg + 15} 200 265)`}>
                    <path
                      d="M 200 265 C 188 253, 190 235, 200 231 C 210 235, 212 253, 200 265 Z"
                      fill="url(#yellowPetalInner)"
                      stroke="#FEF08A"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}

                {/* Center Core */}
                <circle cx="200" cy="265" r="11" fill="url(#yellowCenterAmber)" />
                <circle cx="200" cy="265" r="6" fill="#FEF9C3" />
              </motion.g>
            )}

            {/* =========================================================
                PART 4: THE SPECIAL BLUE FLOWER OF ISAIAS
                Magnificent, Large, Wide, Fully-Opened Oceanic Sapphire Flower
                Positioned at (200, 155) with 160px diameter presence,
                multi-stage organic opening from water stream to full bloom,
                and the sacred '24' revealed in its glowing jewel heart!
               ========================================================= */}

            {/* Step 8 & 9: Water Current rising from the vase into the flower core */}
            {isStepAtLeast('vortex-genesis') && (
              <g id="isaias-rising-water-stream">
                {/* Ascending Luminous Fluid Sinuous Waves from Vase (y=345) to Apex (y=155) */}
                <motion.path
                  d="M 200 345 Q 186 280 208 220 Q 218 185 200 155"
                  fill="none"
                  stroke="#00E5FF"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.9, 0.6] }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                />
                <motion.path
                  d="M 200 345 Q 214 280 192 220 Q 184 185 200 155"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 0.8, 0.5] }}
                  transition={{ duration: 1.8, delay: 0.15, ease: 'easeOut' }}
                />

                {/* Floating energy pearls rising along the stem */}
                {[0.2, 0.5, 0.8, 1.1].map((del, pi) => (
                  <motion.circle
                    key={`stream-pearl-${pi}`}
                    cx="200"
                    r="2.8"
                    fill="#FFFFFF"
                    stroke="#00E5FF"
                    strokeWidth="0.8"
                    initial={{ cy: 345, opacity: 0 }}
                    animate={{
                      cy: [345, 155],
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.3, 0.5],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: isCompleted ? 0 : Infinity,
                      delay: del,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </g>
            )}

            {/* VORTEX GENESIS: Swirling Water Eddy at (200, 155) */}
            {isStepAtLeast('vortex-genesis') && (
              <motion.g
                id="isaias-water-vortex"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
              >
                {/* Concentrated Swirling Water Halo */}
                <motion.circle
                  cx="200"
                  cy="155"
                  r="48"
                  fill="url(#waterVortexGrad)"
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: [0.1, 1.2, 1.0], opacity: [0, 0.8, 0.35] }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />

                {/* Rotating Oceanic Spirals */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '200px 155px' }}
                >
                  <circle
                    cx="200"
                    cy="155"
                    r="44"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="0.9"
                    strokeDasharray="8 6"
                    opacity="0.55"
                  />
                  <circle
                    cx="200"
                    cy="155"
                    r="32"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.0"
                    strokeDasharray="5 5"
                    opacity="0.6"
                  />
                </motion.g>

                {/* Counter-Spiraling Shimmer Arc */}
                <motion.g
                  animate={{ rotate: -360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: '200px 155px' }}
                >
                  <circle
                    cx="200"
                    cy="155"
                    r="54"
                    fill="none"
                    stroke="#7DD3FC"
                    strokeWidth="0.75"
                    strokeDasharray="10 8"
                    opacity="0.4"
                  />
                </motion.g>

                {/* Condensing Water Nucleus */}
                <motion.circle
                  cx="200"
                  cy="155"
                  r="16"
                  fill="url(#protoCelestialFlash)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1.0] }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: 'drop-shadow(0 0 10px #00E5FF)' }}
                />
              </motion.g>
            )}

            {/* STAGE 10: TIGHT CLOSED BUD EMERGENCE */}
            {step === 'proto-bud-emerge' && (
              <motion.g
                id="isaias-bud-genesis"
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.34, 1.4, 0.64, 1] }}
                style={{ transformOrigin: '200px 155px' }}
              >
                {/* Central Closed Spire Bud */}
                <path
                  d="M 200 155 C 190 135, 188 95, 200 75 C 212 95, 210 135, 200 155 Z"
                  fill="url(#protoDeepAbyssalGrad)"
                  stroke="#00E5FF"
                  strokeWidth="1.3"
                />
                {/* Flanking Closed Wing Petals */}
                <path
                  d="M 200 155 C 185 138, 182 105, 192 85 C 198 100, 202 135, 200 155 Z"
                  fill="url(#protoRoyalSapphireGrad)"
                  stroke="#38BDF8"
                  strokeWidth="1.0"
                  opacity="0.85"
                />
                <path
                  d="M 200 155 C 202 135, 206 100, 212 85 C 222 105, 219 138, 200 155 Z"
                  fill="url(#protoRoyalSapphireGrad)"
                  stroke="#38BDF8"
                  strokeWidth="1.0"
                  opacity="0.85"
                />
                {/* Inner Bud Core Glow */}
                <circle cx="200" cy="140" r="8" fill="#00E5FF" opacity="0.8" />
                <circle cx="200" cy="140" r="4" fill="#FFFFFF" />
              </motion.g>
            )}

            {/* =========================================================
                STAGES 11+: THE HYBRID GRAND BLOOM
                Fusing the elongated vertical spire silhouette & aquatic identity (Design 1)
                with the wide multi-tier opened blooming petals & rotational depth (Design 2),
                revealing the sacred '24' in the center!
               ========================================================= */}
            {(isStepAtLeast('proto-spire-unfold') ||
              isStepAtLeast('proto-lateral-open') ||
              isStepAtLeast('proto-corolla-bloom') ||
              isStepAtLeast('sacred-core-24')) && (
              <motion.g
                id="isaias-protagonist-grand-bloom"
                animate={isCompleted ? { scale: [1, 1.025, 1] } : { scale: 1 }}
                transition={{ duration: 5.0, repeat: isCompleted ? Infinity : 0, ease: 'easeInOut' }}
                style={{ transformOrigin: '200px 155px' }}
              >
                {/* =========================================================
                    DELICATE AQUATIC HALO & CURRENTS (EXCLUSIVELY FOR ISAIAS' FLOWER)
                    Fine luminous blue/cyan orbital arcs & currents contoured
                    strictly to the blue protagonist flower without touching the bouquet.
                   ========================================================= */}
                {isStepAtLeast('proto-lateral-open') && (
                  <g id="proto-orbital-rings">
                    {/* HALO 1: Inner Aqua Current Ring (Radius 42px) */}
                    <motion.g
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.55, rotate: -360 }}
                      transition={{
                        scale: { duration: 1.2, ease: 'easeOut' },
                        opacity: { duration: 0.8 },
                        rotate: { duration: 38, repeat: Infinity, ease: 'linear' },
                      }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      <circle
                        cx="200"
                        cy="155"
                        r="42"
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="0.8"
                        strokeDasharray="5 6 2 6"
                      />
                    </motion.g>

                    {/* HALO 2: Segmented Oceanic Flow Ring with Subtle Pearls (Radius 56px) */}
                    <motion.g
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.65, rotate: 360 }}
                      transition={{
                        scale: { duration: 1.4, ease: 'easeOut' },
                        opacity: { duration: 1.0 },
                        rotate: { duration: 46, repeat: Infinity, ease: 'linear' },
                      }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      <circle
                        cx="200"
                        cy="155"
                        r="56"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="0.85"
                        strokeDasharray="14 8 3 7"
                      />
                      {/* Subtle Crystal Droplets at top and sides (avoiding bottom) */}
                      <circle cx="200" cy="99" r="1.6" fill="#FFFFFF" opacity="0.9" />
                      <circle cx="144" cy="155" r="1.4" fill="#BAE6FD" opacity="0.85" />
                      <circle cx="256" cy="155" r="1.4" fill="#BAE6FD" opacity="0.85" />
                    </motion.g>

                    {/* HALO 3: Upper Spire-Framing Water Wave Arc (Radius 72px, open at bottom) */}
                    <motion.g
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{
                        scale: [1, 1.025, 1],
                        opacity: [0.4, 0.6, 0.4],
                      }}
                      transition={{
                        scale: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                        opacity: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      {/* Upper 180° crowning arc framing the spire and lateral wings */}
                      <path
                        d="M 132 155 A 68 68 0 0 1 268 155"
                        fill="none"
                        stroke="#7DD3FC"
                        strokeWidth="0.8"
                        strokeDasharray="9 5 2 5"
                      />
                      <circle cx="132" cy="155" r="1.3" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="268" cy="155" r="1.3" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="200" cy="87" r="1.5" fill="#FFFFFF" opacity="0.9" />
                    </motion.g>

                    {/* HALO 4: Ultra-Fine Ethereal Crest Arc (Radius 80px, framing upper apex) */}
                    <motion.g
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 0.35,
                      }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      <path
                        d="M 148 135 A 76 76 0 0 1 252 135"
                        fill="none"
                        stroke="#00E5FF"
                        strokeWidth="0.6"
                        strokeDasharray="4 7"
                      />
                    </motion.g>
                  </g>
                )}

                {/* =========================================================
                    TIER 1: REAR ELONGATED LOTUS SPIRE & FANNED POSTERIOR WINGS
                    Tall lanceolate apex spire + symmetrical stylized posterior
                    petals that uncurl and rotate outward from (200, 155).
                    Preserves the vertical majesty while opening wide laterally!
                   ========================================================= */}
                <g id="proto-hybrid-rear-tier">
                  {/* 1. LOWER LEFT REAR PETAL (-128°) - Frames the stem base */}
                  {isStepAtLeast('proto-lateral-open') && (
                    <motion.g
                      id="proto-rear-base-left"
                      initial={{ rotate: -30, scaleY: 0.2, opacity: 0 }}
                      animate={{ rotate: -128, scaleY: 1, opacity: 0.9 }}
                      transition={{ duration: 1.3, ease: [0.34, 1.4, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                      filter="url(#protoPetalDepthShadow)"
                    >
                      <path
                        d="M 200 155 C 182 144, 180 120, 200 108 C 220 120, 218 144, 200 155 Z"
                        fill="url(#protoDeepAbyssalGrad)"
                        stroke="#0369A1"
                        strokeWidth="1.0"
                      />
                      <path d="M 200 153 L 200 112" stroke="#0284C7" strokeWidth="0.8" opacity="0.75" />
                    </motion.g>
                  )}

                  {/* 2. LOWER RIGHT REAR PETAL (+128°) - Frames the stem base */}
                  {isStepAtLeast('proto-lateral-open') && (
                    <motion.g
                      id="proto-rear-base-right"
                      initial={{ rotate: 30, scaleY: 0.2, opacity: 0 }}
                      animate={{ rotate: 128, scaleY: 1, opacity: 0.9 }}
                      transition={{ duration: 1.3, ease: [0.34, 1.4, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                      filter="url(#protoPetalDepthShadow)"
                    >
                      <path
                        d="M 200 155 C 182 144, 180 120, 200 108 C 220 120, 218 144, 200 155 Z"
                        fill="url(#protoDeepAbyssalGrad)"
                        stroke="#0369A1"
                        strokeWidth="1.0"
                      />
                      <path d="M 200 153 L 200 112" stroke="#0284C7" strokeWidth="0.8" opacity="0.75" />
                    </motion.g>
                  )}

                  {/* 3. WIDE LATERAL LEFT FANNED WING (-68°) - Expansive lateral bloom */}
                  {isStepAtLeast('proto-lateral-open') && (
                    <motion.g
                      id="proto-rear-wing-left"
                      initial={{ rotate: -15, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: -68, scale: 1, opacity: 1 }}
                      transition={{ duration: 1.35, ease: [0.34, 1.4, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                      filter="url(#protoPetalDepthShadow)"
                    >
                      <path
                        d="M 200 155 C 172 138, 166 102, 192 82 C 208 104, 212 134, 200 155 Z"
                        fill="url(#protoDeepAbyssalGrad)"
                        stroke="#00E5FF"
                        strokeWidth="1.1"
                      />
                      <path d="M 200 152 L 192 88" stroke="#38BDF8" strokeWidth="0.9" opacity="0.85" />
                      <circle cx="192" cy="84" r="1.4" fill="#BAE6FD" />
                    </motion.g>
                  )}

                  {/* 4. WIDE LATERAL RIGHT FANNED WING (+68°) - Expansive lateral bloom */}
                  {isStepAtLeast('proto-lateral-open') && (
                    <motion.g
                      id="proto-rear-wing-right"
                      initial={{ rotate: 15, scale: 0.3, opacity: 0 }}
                      animate={{ rotate: 68, scale: 1, opacity: 1 }}
                      transition={{ duration: 1.35, ease: [0.34, 1.4, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                      filter="url(#protoPetalDepthShadow)"
                    >
                      <path
                        d="M 200 155 C 188 134, 192 104, 208 82 C 234 102, 228 138, 200 155 Z"
                        fill="url(#protoDeepAbyssalGrad)"
                        stroke="#00E5FF"
                        strokeWidth="1.1"
                      />
                      <path d="M 200 152 L 208 88" stroke="#38BDF8" strokeWidth="0.9" opacity="0.85" />
                      <circle cx="208" cy="84" r="1.4" fill="#BAE6FD" />
                    </motion.g>
                  )}

                  {/* 5. MID-UPPER LEFT STYLIZED PETAL (-38°) */}
                  <motion.g
                    id="proto-rear-mid-left"
                    initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
                    animate={{ rotate: -38, scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 155px' }}
                    filter="url(#protoPetalDepthShadow)"
                  >
                    <path
                      d="M 200 155 C 172 136, 166 98, 186 75 C 200 98, 206 130, 200 155 Z"
                      fill="url(#protoRoyalSapphireGrad)"
                      stroke="#38BDF8"
                      strokeWidth="1.1"
                    />
                    <path d="M 200 152 L 188 80" stroke="#7DD3FC" strokeWidth="0.95" opacity="0.85" />
                    <circle cx="187" cy="77" r="1.4" fill="#FFFFFF" />
                  </motion.g>

                  {/* 6. MID-UPPER RIGHT STYLIZED PETAL (+38°) */}
                  <motion.g
                    id="proto-rear-mid-right"
                    initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
                    animate={{ rotate: 38, scale: 1, opacity: 1 }}
                    transition={{ duration: 1.4, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 155px' }}
                    filter="url(#protoPetalDepthShadow)"
                  >
                    <path
                      d="M 200 155 C 194 130, 200 98, 214 75 C 234 98, 228 136, 200 155 Z"
                      fill="url(#protoRoyalSapphireGrad)"
                      stroke="#38BDF8"
                      strokeWidth="1.1"
                    />
                    <path d="M 200 152 L 212 80" stroke="#7DD3FC" strokeWidth="0.95" opacity="0.85" />
                    <circle cx="213" cy="77" r="1.4" fill="#FFFFFF" />
                  </motion.g>

                  {/* 7. HIGH LEFT FLANKING PETAL (-18°) */}
                  <motion.g
                    id="proto-rear-high-left"
                    initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
                    animate={{ rotate: -18, scale: 1, opacity: 1 }}
                    transition={{ duration: 1.35, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 155px' }}
                    filter="url(#protoPetalDepthShadow)"
                  >
                    <path
                      d="M 200 155 C 178 132, 174 92, 192 65 C 204 88, 208 126, 200 155 Z"
                      fill="url(#protoDeepAbyssalGrad)"
                      stroke="#00E5FF"
                      strokeWidth="1.15"
                    />
                    <path d="M 200 152 L 193 70" stroke="#BAE6FD" strokeWidth="1.0" opacity="0.9" />
                    <circle cx="193" cy="67" r="1.5" fill="#FFFFFF" />
                  </motion.g>

                  {/* 8. HIGH RIGHT FLANKING PETAL (+18°) */}
                  <motion.g
                    id="proto-rear-high-right"
                    initial={{ rotate: 0, scale: 0.3, opacity: 0 }}
                    animate={{ rotate: 18, scale: 1, opacity: 1 }}
                    transition={{ duration: 1.35, ease: [0.34, 1.4, 0.64, 1] }}
                    style={{ transformOrigin: '200px 155px' }}
                    filter="url(#protoPetalDepthShadow)"
                  >
                    <path
                      d="M 200 155 C 192 126, 196 88, 208 65 C 226 92, 222 132, 200 155 Z"
                      fill="url(#protoDeepAbyssalGrad)"
                      stroke="#00E5FF"
                      strokeWidth="1.15"
                    />
                    <path d="M 200 152 L 207 70" stroke="#BAE6FD" strokeWidth="1.0" opacity="0.9" />
                    <circle cx="207" cy="67" r="1.5" fill="#FFFFFF" />
                  </motion.g>

                  {/* 9. CENTRAL TALL VERTICAL APEX SPIRE (Reaching to y=52, 103px vertical majesty) */}
                  <motion.g
                    id="proto-spire-center"
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1.3, ease: [0.34, 1.45, 0.64, 1] }}
                    style={{ transformOrigin: '200px 155px' }}
                  >
                    {/* Grand Oceanic Spire Body */}
                    <path
                      d="M 200 155 C 178 124, 176 80, 200 52 C 224 80, 222 124, 200 155 Z"
                      fill="url(#protoDeepAbyssalGrad)"
                      stroke="#00E5FF"
                      strokeWidth="1.35"
                    />
                    {/* Inner Royal Sapphire Contour */}
                    <path
                      d="M 200 152 C 184 126, 183 90, 200 66 C 217 90, 216 126, 200 152 Z"
                      fill="url(#protoRoyalSapphireGrad)"
                      opacity="0.85"
                    />
                    {/* Glowing Pale Cerulean Center Light Conduit */}
                    <motion.path
                      d="M 200 152 L 200 58"
                      stroke="#BAE6FD"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.0, delay: 0.2 }}
                    />
                    {/* Diamond Apex Crystal Tip */}
                    <circle cx="200" cy="55" r="2.0" fill="#FFFFFF" />
                  </motion.g>
                </g>

                {/* =========================================================
                    TIER 2: INTERMEDIATE ROYAL SAPPHIRE & OCEAN WAVE PETALS
                    8 sculpted wave petals nestled between the rear layers,
                    fanning outward to give dense blooming depth!
                   ========================================================= */}
                {isStepAtLeast('proto-lateral-open') && (
                  <g id="proto-hybrid-mid-tier">
                    {[-142, -86, -55, -26, 26, 55, 86, 142].map((angle, wi) => {
                      const isHorizontal = Math.abs(angle) > 70 && Math.abs(angle) < 110;
                      const isLower = Math.abs(angle) > 120;
                      const petalLength = isHorizontal ? 56 : isLower ? 44 : 68;
                      const petalWidth = isHorizontal ? 26 : isLower ? 22 : 30;

                      return (
                        <g key={`proto-mid-wave-${wi}`} transform={`rotate(${angle} 200 155)`}>
                          <motion.g
                            initial={{
                              scaleY: 0.2,
                              scaleX: 0.3,
                              rotate: angle > 0 ? 25 : -25,
                              opacity: 0,
                            }}
                            animate={{
                              scaleY: 1,
                              scaleX: 1,
                              rotate: 0,
                              opacity: 1,
                            }}
                            transition={{
                              duration: 1.25,
                              delay: wi * 0.035,
                              ease: [0.34, 1.45, 0.64, 1],
                            }}
                            style={{ transformOrigin: '200px 155px' }}
                            filter="url(#protoPetalDepthShadow)"
                          >
                            {/* Sculpted Wave Petal */}
                            <path
                              d={`M 200 155 C ${200 - petalWidth} 136, ${200 - petalWidth} ${155 - petalLength * 0.7}, 200 ${155 - petalLength} C ${200 + petalWidth} ${155 - petalLength * 0.7}, ${200 + petalWidth} 136, 200 155 Z`}
                              fill="url(#protoOceanWaveGrad)"
                              stroke="#7DD3FC"
                              strokeWidth="0.95"
                            />
                            {/* Inner Water Spine */}
                            <path
                              d={`M 200 153 L 200 ${155 - petalLength + 6}`}
                              stroke="#00E5FF"
                              strokeWidth="1.1"
                              strokeLinecap="round"
                              opacity="0.85"
                            />
                            {/* Specular Wave Crest Tip */}
                            <circle cx="200" cy={155 - petalLength + 4} r="1.3" fill="#FFFFFF" />
                          </motion.g>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* =========================================================
                    TIER 3: FRONTAL 8-POINTED ELECTRIC CYAN STAR COROLLA
                    Pointed crystalline lanceolate petals radiating in 8 directions,
                    cupping the jewel core with diamond clarity!
                   ========================================================= */}
                {isStepAtLeast('proto-corolla-bloom') && (
                  <g id="proto-hybrid-front-corolla">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <g key={`proto-star-petal-${i}`} transform={`rotate(${angle} 200 155)`}>
                        <motion.g
                          initial={{ scaleY: 0.15, scaleX: 0.3, opacity: 0 }}
                          animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
                          transition={{
                            duration: 1.15,
                            delay: i * 0.035,
                            ease: [0.34, 1.5, 0.64, 1],
                          }}
                          style={{ transformOrigin: '200px 155px' }}
                        >
                          {/* Pointed Cyan/White Star Petal (42px reach from center) */}
                          <path
                            d="M 200 155 C 191 143, 190 123, 200 113 C 210 123, 209 143, 200 155 Z"
                            fill="url(#protoCyanGrad)"
                            stroke="#FFFFFF"
                            strokeWidth="1.0"
                          />
                          {/* Inner White Spine Light Line */}
                          <path
                            d="M 200 153 L 200 117"
                            stroke="#FFFFFF"
                            strokeWidth="1.1"
                            strokeLinecap="round"
                            opacity="0.95"
                          />
                          <circle cx="200" cy="115" r="1.3" fill="#FFFFFF" />
                        </motion.g>
                      </g>
                    ))}
                  </g>
                )}

                {/* =========================================================
                    TIER 4 & GRAND CLIMAX: 16 GOLDEN STAMEN FILAMENTS +
                    SAPPHIRE MEDALLION WITH THE SACRED "24"
                   ========================================================= */}
                {isStepAtLeast('sacred-core-24') && (
                  <g id="proto-sacred-core-group">
                    {/* Shockwave Ripples */}
                    <motion.circle
                      cx="200"
                      cy="155"
                      r="40"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.8"
                      initial={{ scale: 0.2, opacity: 1 }}
                      animate={{ scale: 2.3, opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                    <motion.circle
                      cx="200"
                      cy="155"
                      r="34"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="2.4"
                      initial={{ scale: 0.3, opacity: 1 }}
                      animate={{ scale: 2.7, opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                    />

                    {/* 16 Radiating Golden-Cyan Stamen Filaments with Glowing Dewdrops */}
                    <motion.g
                      id="proto-stamen-halo"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                      transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      {[...Array(16)].map((_, si) => {
                        const sdeg = (si * 360) / 16;
                        return (
                          <g key={`proto-stamen-${si}`} transform={`rotate(${sdeg} 200 155)`}>
                            <line
                              x1="200"
                              y1="155"
                              x2="200"
                              y2="125"
                              stroke="#FDE047"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                            />
                            <circle cx="200" cy="124" r="2.2" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="0.8" />
                          </g>
                        );
                      })}
                    </motion.g>

                    {/* Deep Sapphire Sacred Medallion */}
                    <motion.g
                      id="proto-sacred-medallion"
                      initial={{ scale: 0, rotate: -90, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ duration: 1.0, ease: [0.34, 1.56, 0.64, 1] }}
                      style={{ transformOrigin: '200px 155px' }}
                    >
                      {/* Outer Polished Gold Bevel */}
                      <circle
                        cx="200"
                        cy="155"
                        r="23"
                        fill="url(#protoCoreJewel24)"
                        stroke="url(#vaseGoldTrim)"
                        strokeWidth="2.4"
                      />
                      {/* Inner Sapphire-Deep Ring */}
                      <circle
                        cx="200"
                        cy="155"
                        r="18"
                        fill="#021428"
                        stroke="#00E5FF"
                        strokeWidth="1.0"
                      />
                      {/* Golden Filigree Ring */}
                      <circle
                        cx="200"
                        cy="155"
                        r="15.5"
                        fill="none"
                        stroke="#FDE047"
                        strokeWidth="0.5"
                        strokeDasharray="2.5 2.5"
                      />
                    </motion.g>

                    {/* SACRED NUMBER "24" - Glowing Cyan Aura */}
                    <motion.text
                      x="200"
                      y="156"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#00E5FF"
                      fontSize="16"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                      fontWeight="800"
                      letterSpacing="0.5px"
                      filter="url(#glowFilter24)"
                      className="select-none pointer-events-none"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.35, 1], opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      24
                    </motion.text>

                    {/* SACRED NUMBER "24" - Crisp Diamond White Foreground */}
                    <motion.text
                      x="200"
                      y="156"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontSize="16"
                      fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
                      fontWeight="800"
                      letterSpacing="0.5px"
                      className="select-none pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.95 }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                    >
                      24
                    </motion.text>

                    {/* Rotating Specular Star Glint Flare */}
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.9] }}
                      transition={{ duration: 0.8, delay: 0.45 }}
                    >
                      <circle cx="193" cy="145" r="1.8" fill="#FFFFFF" opacity="0.95" />
                      <motion.path
                        d="M 193 140 L 193 150 M 188 145 L 198 145"
                        stroke="#FFFFFF"
                        strokeWidth="1.0"
                        strokeLinecap="round"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: '193px 145px' }}
                      />
                    </motion.g>
                  </g>
                )}
              </motion.g>
            )}

            {/* Ambient Floating Aquatic Sparkles & Living Starlight */}
            {isCompleted && (
              <g id="isaias-living-sparkles">
                {[
                  { x: 130, y: 175, color: '#00E5FF', size: 2.2, delay: 0.2 },
                  { x: 270, y: 165, color: '#FEF08A', size: 2.5, delay: 0.7 },
                  { x: 200, y: 85, color: '#38BDF8', size: 2.6, delay: 1.1 },
                  { x: 90, y: 250, color: '#FDE047', size: 2.2, delay: 0.4 },
                  { x: 310, y: 245, color: '#00E5FF', size: 2.4, delay: 0.9 },
                  { x: 195, y: 235, color: '#FFFFFF', size: 2.0, delay: 1.4 },
                  { x: 160, y: 400, color: '#7DD3FC', size: 2.2, delay: 0.5 },
                  { x: 240, y: 400, color: '#FACC15', size: 2.2, delay: 1.3 },
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

            {/* Interactive Touch Splash Wave on Water Surface */}
            {interactiveRipple && (
              <motion.ellipse
                key={`touch-splash-${sparkleCount}`}
                cx="200"
                cy="345"
                rx="48"
                ry="8"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1.8"
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
              />
            )}
          </svg>
        </div>

        {/* Action Controls: Clean & Direct */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full px-4">
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
                animationDurationMs={26000}
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
