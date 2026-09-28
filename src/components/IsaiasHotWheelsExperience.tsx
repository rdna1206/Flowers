import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, VolumeX, Music } from 'lucide-react';
import type { UserExperienceData } from '../types';

interface IsaiasHotWheelsExperienceProps {
  experience: UserExperienceData;
  onBackToMenu: () => void;
  onProceedToChat?: () => void;
  onProceedToText?: () => void;
}

// Resolver for audio files that works both in Vite dev and GitHub Pages (relative base './' or subfolder deployments)
const resolveAudioCandidates = (filename: string): string[] => {
  const clean = filename.replace(/^\/+/, '');
  const base = (import.meta as any).env?.BASE_URL || './';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  
  return [
    `${prefix}${clean}`,
    `./${clean}`,
    `/${clean}`,
    clean,
  ];
};

export interface HotWheelsCarTheme {
  primaryColor: string;       // Upper metallic body
  secondaryColor: string;     // Highlight gradient / roof sheen
  accentStripe: string;       // Thin divider pinstripe (usually red or orange)
  whitePanel: string;         // Side panel lower color (crisp white)
  rimLipColor: string;        // Glowing lip ring on the 5-spoke wheels
  numberBadge: string;        // Race number on side/hood
  lightColor: string;         // Headlight glow
  glowAura: string;           // Trailing aura color
}

const CAR_PALETTES: HotWheelsCarTheme[] = [
  // 0. Hero Classic Spectraflame Royal Blue
  {
    primaryColor: '#1D4ED8',
    secondaryColor: '#2563EB',
    accentStripe: '#EF4444',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF4500',
    numberBadge: '10',
    lightColor: '#FEF08A',
    glowAura: 'rgba(0, 240, 255, 0.65)',
  },
  // 1. High-Octane Fire Crimson Red (Rojo Brillante)
  {
    primaryColor: '#B91C1C',
    secondaryColor: '#EF4444',
    accentStripe: '#F59E0B',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF5500',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(239, 68, 68, 0.65)',
  },
  // 2. Toxic Acid Lime Green (Verde Neón Brillante)
  {
    primaryColor: '#15803D',
    secondaryColor: '#22C55E',
    accentStripe: '#FACC15',
    whitePanel: '#FFFFFF',
    rimLipColor: '#84CC16',
    numberBadge: '10',
    lightColor: '#FEF08A',
    glowAura: 'rgba(74, 222, 128, 0.65)',
  },
  // 3. Sunset Blaze Neon Orange (Naranja Vibrante)
  {
    primaryColor: '#C2410C',
    secondaryColor: '#F97316',
    accentStripe: '#DC2626',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FBBF24',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(249, 115, 22, 0.65)',
  },
  // 4. Deep Ultraviolet Metallic Purple (Morado Real)
  {
    primaryColor: '#581C87',
    secondaryColor: '#9333EA',
    accentStripe: '#F43F5E',
    whitePanel: '#FFFFFF',
    rimLipColor: '#38BDF8',
    numberBadge: '10',
    lightColor: '#FEF08A',
    glowAura: 'rgba(168, 85, 247, 0.65)',
  },
  // 5. Electric Neon Hot Pink / Magenta (Rosado Neón)
  {
    primaryColor: '#9D174D',
    secondaryColor: '#EC4899',
    accentStripe: '#38BDF8',
    whitePanel: '#FFFFFF',
    rimLipColor: '#F43F5E',
    numberBadge: '24',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(244, 63, 94, 0.65)',
  },
  // 6. Speed Solar Yellow (Amarillo Neón)
  {
    primaryColor: '#CA8A04',
    secondaryColor: '#FACC15',
    accentStripe: '#DC2626',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF4500',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(250, 204, 21, 0.65)',
  },
  // 7. Electric Pearl Cyan / Turquoise (Cian Vibrante)
  {
    primaryColor: '#0369A1',
    secondaryColor: '#06B6D4',
    accentStripe: '#F97316',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF3B30',
    numberBadge: '24',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(6, 182, 212, 0.65)',
  },
  // 8. Sterling Quicksilver Platinum (Plateado Cromado)
  {
    primaryColor: '#475569',
    secondaryColor: '#94A3B8',
    accentStripe: '#EF4444',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF3B30',
    numberBadge: '10',
    lightColor: '#FEF08A',
    glowAura: 'rgba(226, 232, 240, 0.65)',
  },
  // 9. Emerald Racing Green (Verde Esmeralda)
  {
    primaryColor: '#047857',
    secondaryColor: '#10B981',
    accentStripe: '#F59E0B',
    whitePanel: '#FFFFFF',
    rimLipColor: '#34D399',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(16, 185, 129, 0.65)',
  },
  // 10. Neon Ruby Raspberry (Rosado Rubí)
  {
    primaryColor: '#831843',
    secondaryColor: '#BE185D',
    accentStripe: '#FBBF24',
    whitePanel: '#FFFFFF',
    rimLipColor: '#00F0FF',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(236, 72, 153, 0.65)',
  },
  // 11. Obsidian Metallic Midnight Black & Copper (Negro Metálico)
  {
    primaryColor: '#0F172A',
    secondaryColor: '#1E293B',
    accentStripe: '#F97316',
    whitePanel: '#E2E8F0',
    rimLipColor: '#00F0FF',
    numberBadge: '24',
    lightColor: '#38BDF8',
    glowAura: 'rgba(56, 189, 248, 0.65)',
  },
  // 12. Hyper Aqua Teal (Azul Turquesa Acuático)
  {
    primaryColor: '#0F766E',
    secondaryColor: '#14B8A6',
    accentStripe: '#EC4899',
    whitePanel: '#FFFFFF',
    rimLipColor: '#06B6D4',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(20, 184, 166, 0.65)',
  },
  // 13. Candy Apple Scarlet (Rojo Manzana Caramelo)
  {
    primaryColor: '#991B1B',
    secondaryColor: '#DC2626',
    accentStripe: '#FBBF24',
    whitePanel: '#FFFFFF',
    rimLipColor: '#F59E0B',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(220, 38, 38, 0.65)',
  },
  // 14. Cyber Lavender Violet (Lavanda Cibernético)
  {
    primaryColor: '#6B21A8',
    secondaryColor: '#A855F7',
    accentStripe: '#06B6D4',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FACC15',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(168, 85, 247, 0.65)',
  },
  // 15. Electric Indigo Sapphire (Azul Zafiro Índigo)
  {
    primaryColor: '#312E81',
    secondaryColor: '#4F46E5',
    accentStripe: '#FB7185',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF4500',
    numberBadge: '24',
    lightColor: '#38BDF8',
    glowAura: 'rgba(99, 102, 241, 0.65)',
  },
  // 16. Golden Amber Flame (Ámbar Dorado Solar)
  {
    primaryColor: '#B45309',
    secondaryColor: '#F59E0B',
    accentStripe: '#EF4444',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FACC15',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(245, 158, 11, 0.65)',
  },
  // 17. Coral Sunset Rose (Rosa Coral Sunset)
  {
    primaryColor: '#BE123C',
    secondaryColor: '#FB7185',
    accentStripe: '#0D9488',
    whitePanel: '#FFFFFF',
    rimLipColor: '#F43F5E',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(251, 113, 133, 0.65)',
  },
  // 18. Mint Ice Metallic (Verde Menta Metalizado)
  {
    primaryColor: '#047857',
    secondaryColor: '#34D399',
    accentStripe: '#9333EA',
    whitePanel: '#FFFFFF',
    rimLipColor: '#10B981',
    numberBadge: '10',
    lightColor: '#FEF08A',
    glowAura: 'rgba(52, 211, 153, 0.65)',
  },
  // 19. Titan Graphite Silver (Grafito Titanio)
  {
    primaryColor: '#334155',
    secondaryColor: '#64748B',
    accentStripe: '#22C55E',
    whitePanel: '#FFFFFF',
    rimLipColor: '#E2E8F0',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(148, 163, 184, 0.65)',
  },
  // 20. Cyber Neon Magenta (Magenta Cibernético)
  {
    primaryColor: '#701A75',
    secondaryColor: '#D946EF',
    accentStripe: '#FACC15',
    whitePanel: '#FFFFFF',
    rimLipColor: '#00F0FF',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(217, 70, 239, 0.65)',
  },
  // 21. British Racing Forest Green (Verde Bosque Competitivo)
  {
    primaryColor: '#064E3B',
    secondaryColor: '#059669',
    accentStripe: '#F97316',
    whitePanel: '#FFFFFF',
    rimLipColor: '#EF4444',
    numberBadge: '24',
    lightColor: '#FEF08A',
    glowAura: 'rgba(5, 150, 105, 0.65)',
  },
  // 22. Phoenix Sunburst Tangerine (Mandarina Fénix)
  {
    primaryColor: '#9A3412',
    secondaryColor: '#EA580C',
    accentStripe: '#FACC15',
    whitePanel: '#FFFFFF',
    rimLipColor: '#FF4500',
    numberBadge: '10',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(234, 88, 12, 0.65)',
  },
  // 23. Arctic Frost Sky Blue (Azul Cielo Glaciar)
  {
    primaryColor: '#0284C7',
    secondaryColor: '#38BDF8',
    accentStripe: '#EC4899',
    whitePanel: '#FFFFFF',
    rimLipColor: '#00F0FF',
    numberBadge: '24',
    lightColor: '#FFFFFF',
    glowAura: 'rgba(56, 189, 248, 0.65)',
  },
];

/**
 * OFFICIAL HOT WHEELS FLAME DECAL (100% Pure Transparent - Zero Background):
 * - Literal, exact official Hot Wheels logo vector (Official Reference)
 * - Pure transparent background: zero bounding box, zero white border, zero black box
 * - Iconic Mattel Flame Red (#ED1C24) and Bright Racing Yellow (#FFF200)
 * - Exact official typography and registered trademark (R) symbol
 */
export const HotWheelsOfficialLogo: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className = '', width = 94, height = 27.4 }) => {
  return (
    <svg
      viewBox="0 0 146.38036 42.644798"
      width={width}
      height={height}
      className={`overflow-visible select-none pointer-events-none drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.65)] ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="hwOfficialClipA">
          <path d="m624.9 44.946h119.201v34.424h-119.201z" />
        </clipPath>
      </defs>
      <g clipPath="url(#hwOfficialClipA)" transform="matrix(1.25 0 0 -1.25 -781.125 99.13307)">
        {/* Exact Red Flame Silhouette (Zero outer background) */}
        <path
          d="m0 0c-9.901.946-26.918-3.095-40.962-6.182-11.257-2.473-20.409-4.031-26.553-3.796-3.446.233-6.835 1.22-9.549 3.438.428-1.066 2.516-4.07 3.406-4.402-3.592-.296-7.286-.711-10.846.065-2.843.606-5.985 1.644-8.231 3.731 1.734-3.228 4.383-6.211 7.304-8.409 5.224-3.931 12.489-3.806 18.46-1.88.11.036 1.323.388 1.958.388 1.535-.054 2.653-1.126 1.774-3.62-.735-1.876-2.236-3.342-3.968-3.368-2.299 0-2.455 1.824-5.084 1.739-4.6.122-7.553-1.908-13.727 1.54 1.253-1.241 8.502-9.187 24.029-10.824 3.957-.414 8.398-.072 10.466.145 13.463 1.414 23.963 5.995 33.227 10.036 7.858 3.54 17.287 7.225 24.343 7.616 5.923.477 10.521-1.436 12.302-5.118.797-1.646.983-3.528.582-5.479 5.911 8.439 3.304 22.689-18.931 24.38"
          fill="#ed1c24"
          transform="translate(719.2582 78.0587)"
        />
        <path d="m0 0c.014-.01.013-.01 0 0" fill="#ed1c24" transform="translate(634.2589 62.1792)" />

        {/* Exact Yellow Hot Wheels Typography and (R) symbol */}
        <g fill="#fff200">
          <path
            d="m0 0c3.074.839 5.658-.799 6.66-3.11l.001-.001c.128-.286.265-.347.407-.349.28-.003 2.127.326 2.749 1.09 0 0 .625-2.296-2.08-3.67 0 0-.381-.186-.384-.591-.002-.387-.204-2.354-.309-2.897-.046-.242-.246-.761.23-.781.394-.016 1.566.272 2.299 2.289.023.126.005-.009.005-.009-.542-4.447-3.298-7.757-6.06-8.649-1.93-.624-1.673.645-1.339 1.425 1.149 2.996 1.174 4.472 1.344 6.375.178 1.984-.297 7.85-3.523 8.878m-2.218-3.967c-.841-.183-1.328-2.412-1.425-5.573-.097-3.165.135-5.974 1.275-5.737 1.137.248 1.23 3.187 1.308 6.349.087 3.161-.358 5.14-1.158 4.961m4.542-4.161c-.13-4.712-1.386-9.214-4.828-9.969-3.208-.531-4.915 4.55-4.49 8.003.208 4.775 1.973 8.157 4.736 8.917 2.621.713 4.7-2.269 4.582-6.951"
            transform="translate(676.5761 68.6741)"
          />
          <path
            d="m0 0c-2.683-1.709-4.689-6.026-4.93-10.549-.049-.92-.455-7.48 4.385-9.66-3.167-.497-6.616-.92-8.31-.976 0 0 .492 1.602.595 4.314.085 2.238-.259 4.102-1.075 3.982-.603-.089-1.304-2.209-1.354-4.074-.065-2.462.471-4.282.471-4.282-1.897-.049-5.334-.106-9.685.746.584.092 5.485 2.86 6.109 8.625.695 6.421-4.956 8.097-7.531 9.171 3.687-.115 6.26.102 11.622.897 0 0-.657-1.037-.667-3.937-.01-2.651.558-4.056 1.082-4.048.619.009 1.2 1.385 1.303 4.201.107 2.89-.386 3.992-.386 3.992 2.476.443 4.155.669 8.371 1.598"
            transform="translate(673.3627 69.1783)"
          />
          <path
            d="m0 0c1.062-.263 5.756-1.791 6.048-8.316.266-5.976-2.193-9.566-2.933-10.506 0 0 1.612.539 3.285 1.183 1.818.7 3.616 1.42 3.616 1.42s-.506 1.323.115 3.645c.673 2.513 1.636 3.233 1.636 3.233s-.231-1.02.503-2.933c.725-1.889 1.56-2.38 1.56-2.38l2.769 1.244s-.861 1.889.438 4.73c1.098 2.402 2.45 5.322 1.338 8.838-.573 1.812-1.316 2.854-1.688 3.296-.43-.073-3.927-.739-4.707-.894.854-.35 2.686-1.449 3.022-4.492.231-2.094-.84-3.88-.84-3.88s.107.939-.649 2.01c-.721 1.021-1.418 1.265-1.418 1.265s-.069-1.425-.907-2.992c-.646-1.207-1.487-1.862-1.487-1.862s.677 2.61.004 5.258c-.622 2.447-1.932 3.399-2.49 3.704-1.169-.248-6.139-1.334-7.215-1.571m24.538 4.692c.278-2.452-.107-5.813-1.076-6.041-.794-.188-1.242 3.551-.672 5.805-1.015-.149-3.917-.613-5.189-.833 4.425-5.036 2.344-11.825-.165-16.677 1.484.669 4.09 1.787 5.533 2.379-.688 2.488-.228 5.916.646 6.2.763.248 1.48-3.805.764-5.633 1.324.571 3.158 1.212 5.089 1.88-2.458 1.092-4.571 8.59.159 13.413-1.109-.071-4.061-.368-5.089-.493"
            transform="translate(683.0206 71.2625)"
          />
          <path
            d="m0 0c-.358-.06-.779-.019-1.219.118-.693.216-1.18.417-1.772.638l.043 2.371c.288-.603 1.182-1.321 1.676-1.254.133.017.245.118.27.243.04.198-.07.454-.309.718s-.672.702-1.039 1.109c-1.634 1.812-.946 3.047-.567 3.374.542.468 1.206.361 1.479.304 1.003-.208 1.789-1.046 2.159-1.876.216-.485.36-1.015.273-1.585-.221.577-1.66 2.185-2.173 1.545-.345-.43.472-1.049 1.318-1.798 1.141-1.01 1.281-1.76 1.001-2.831-.158-.605-.552-.977-1.14-1.076"
            transform="translate(734.0744 64.9105)"
          />
          <path
            d="m0 0s-.041 1.404.514 2.744c.556 1.339 1.379 2.072 1.926 1.588.525-.467.109-1.381-.34-1.938-.448-.557-.727-.824-1.305-1.341-.577-.517-.795-1.053-.795-1.053m.987-1.058c1.302 1.221 2.793 2.288 3.345 3.849.553 1.563.544 2.628-.555 3.316-1.033.644-2.926.604-4.732-1.505-1.975-2.305-2.349-6.296-1.783-8.235.487-1.665 1.439-3.2 3.263-2.841 3.2.63 3.088 5.25 3.088 5.25s-1.194-2.122-2.277-2.191c-1.136-.072-1.408 1.364-.349 2.357"
            transform="translate(713.8787 70.1355)"
          />
          <path
            d="m0 0c.444 1.093 1.108 1.694 1.556 1.302.43-.377.097-1.124-.264-1.579s-.586-.674-1.053-1.097c-.466-.425-.64-.862-.64-.862s-.042 1.143.401 2.236m.749-4.953c-1.074-.086-1.196 1.047-.341 1.861 1.05.999 2.256 1.875 2.695 3.149.44 1.276.426 2.142-.471 2.697-.843.52-2.4.443-3.855-1.282-1.592-1.887-1.929-5.18-1.48-6.762.454-1.596 1.295-2.628 2.894-2.205 2.434.644 3.075 4.293 3.075 4.293s-1.375-1.659-2.517-1.751"
            transform="translate(721.3199 72.9361)"
          />
          <path
            d="m0 0c.775-2.736.234-7.599-1.492-9.678 2.13.208 4.11.244 5.981-.054l.107 3.827c-.708-1.738-4.626-3.95-1.496 5.004-.769.258-1.66.577-3.1.901"
            transform="translate(725.5642 75.4837)"
          />
          <path
            d="m0 0c.112 0 .154.006.188.032.034.025.054.067.054.111 0 .061-.032.107-.09.126-.031.011-.078.015-.175.015h-.096v-.284zm.007.374c.094 0 .139-.004.192-.021.092-.029.155-.113.155-.208 0-.099-.067-.181-.175-.212l.182-.4h-.126l-.168.379-.009.002h-.078-.085l-.014-.002v-.379h-.114v.841h.24zm-.614-.418c0-.36.289-.652.65-.652.358 0 .649.292.649.654 0 .364-.282.647-.643.647-.378 0-.656-.275-.656-.649m1.397-.002c0-.419-.324-.74-.747-.74-.426 0-.748.319-.748.74 0 .429.318.742.752.742.419 0 .743-.324.743-.742"
            transform="translate(736.3152 64.1878)"
          />
        </g>
      </g>
    </svg>
  );
};

/**
 * EXACT REPLICA OF THE HOT WHEELS PONTIAC GTO DIE-CAST TOY CAR (Reference Image 2):
 * - Authentic 3/4 isometric perspective
 * - Vertically stacked dual circular headlights inside chrome bezel
 * - Center split Pontiac chrome grille & chrome front wrap-around bumper
 * - Muscle hood with power scoop vent & white racing nose accent
 * - Classic hardtop fastback coupe roofline with chrome A-pillar trim
 * - Tinted clear windshield revealing steering wheel and white sport bucket seats
 * - Two-tone metallic finish: Upper metallic lacquer, lower crisp white rocker panel
 * - Red dividing pinstripe and "GTO" front fender stamping
 * - Official Hot Wheels flame logo emblazoned on the side doors
 * - Signature Hot Wheels 5-spoke mag wheels with glowing neon orange rim lips
 */
export const HotWheelsGTOVector: React.FC<{
  theme: HotWheelsCarTheme;
  scale?: number;
  flipX?: boolean;
  spinningWheels?: boolean;
}> = ({ theme, scale = 1, flipX = false, spinningWheels = true }) => {
  return (
    <svg
      viewBox="0 0 250 120"
      className="overflow-visible select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
      style={{
        width: `${250 * scale}px`,
        height: `${120 * scale}px`,
        transform: flipX ? 'scaleX(-1)' : 'none',
      }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Upper metallic body gradient */}
        <linearGradient id={`bodyGrad-${theme.primaryColor.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="25%" stopColor={theme.secondaryColor} />
          <stop offset="85%" stopColor={theme.primaryColor} />
          <stop offset="100%" stopColor="#081026" />
        </linearGradient>

        {/* Polished chrome gradient */}
        <linearGradient id="chromePolishGTO" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="75%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Glass windshield reflection */}
        <linearGradient id="windshieldGlassGTO" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.8" />
        </linearGradient>

        {/* Wheel colored lip rim (Neon Orange as in reference) */}
        <radialGradient id={`wheelRimGTO-${theme.rimLipColor.replace('#', '')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="60%" stopColor="#0F172A" />
          <stop offset="82%" stopColor={theme.rimLipColor} />
          <stop offset="96%" stopColor={theme.rimLipColor} />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
      </defs>

      {/* Ground cast shadow */}
      <ellipse cx="125" cy="106" rx="98" ry="10" fill="#000000" opacity="0.7" filter="blur(4px)" />

      {/* ======================================================== */}
      {/* 1. LOWER CHROME SILL & CHROME BUMPERS                    */}
      {/* ======================================================== */}
      {/* Polished Chrome Rocker Sill */}
      <polygon points="68,98 178,82 178,86 68,102" fill="url(#chromePolishGTO)" stroke="#475569" strokeWidth="0.8" />

      {/* Front Chrome Bumper & Split Grille Surround */}
      <path
        d="M 16 75 L 24 64 L 40 70 L 42 98 L 32 102 L 18 96 Z"
        fill="url(#chromePolishGTO)"
        stroke="#334155"
        strokeWidth="1"
      />
      {/* Pontiac Split Grille Divider Peak */}
      <polygon points="28,68 32,67 31,96 27,97" fill="#CBD5E1" stroke="#334155" strokeWidth="0.5" />

      {/* Vertically Stacked Dual Headlights (Reference Feature) */}
      <circle cx="23" cy="74" r="4.2" fill="#FEF08A" stroke="#475569" strokeWidth="1" />
      <circle cx="23" cy="74" r="2.2" fill="#FFFFFF" />
      <circle cx="24" cy="85" r="4.2" fill="#FEF08A" stroke="#475569" strokeWidth="1" />
      <circle cx="24" cy="85" r="2.2" fill="#FFFFFF" />

      {/* Rear Chrome Bumper */}
      <path
        d="M 230 52 L 244 54 L 241 66 L 225 64 Z"
        fill="url(#chromePolishGTO)"
        stroke="#475569"
        strokeWidth="1"
      />

      {/* ======================================================== */}
      {/* 2. CHASSIS / LOWER TWO-TONE WHITE SIDE PANEL             */}
      {/* ======================================================== */}
      {/* Crisp White Lower Side Door & Quarter Panel */}
      <path
        d="M 38 78 L 48 97 L 68 98 Q 78 84 94 92 L 178 82 Q 186 68 206 72 L 235 60 L 235 52 L 180 58 L 96 68 L 38 78 Z"
        fill={theme.whitePanel}
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />

      {/* Red Accent Divider Pinstripe */}
      <path
        d="M 38 76 L 96 66 L 180 56 L 235 50"
        stroke={theme.accentStripe}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Subtle silver "GTO" badge on front quarter fender - always legible left-to-right */}
      <g
        transform={
          flipX
            ? 'translate(81, 81) scale(-1, 1) rotate(7)'
            : 'translate(81, 81) rotate(-7)'
        }
      >
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#64748B"
          fontSize="5"
          fontWeight="bold"
          fontFamily="'Impact', sans-serif"
          letterSpacing="0.5"
        >
          GTO
        </text>
      </g>

      {/* Race number badge (10, 24) on rear quarter panel - always legible left-to-right */}
      <g
        transform={
          flipX
            ? 'translate(220, 57) scale(-1, 1) rotate(7)'
            : 'translate(220, 57) rotate(-7)'
        }
      >
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fill={theme.accentStripe}
          fontSize="9"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="'Arial Black', sans-serif"
        >
          {theme.numberBadge}
        </text>
      </g>

      {/* ======================================================== */}
      {/* 3. OFFICIAL HOT WHEELS DECAL EXACTLY CENTERED ON DOOR    */}
      {/* Pure transparent decal contour seamlessly on white panel */}
      {/* Counter-flipped on reverse vehicles so it is always      */}
      {/* read perfectly left-to-right (unmirrored logo & letters)  */}
      {/* ======================================================== */}
      <g
        transform={
          flipX
            ? 'translate(132, 73.5) scale(-1, 1) rotate(7)'
            : 'translate(132, 73.5) rotate(-7)'
        }
      >
        <g transform="translate(-47, -13.7)">
          <HotWheelsOfficialLogo width={94} height={27.4} />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 4. UPPER METALLIC CAR BODY (Pontiac GTO Fastback Lines)  */}
      {/* ======================================================== */}
      {/* Front Nose & Hood Surface */}
      <path
        d="M 38 76 L 24 64 L 64 48 L 94 36 L 102 54 L 96 66 Z"
        fill={`url(#bodyGrad-${theme.primaryColor.replace('#', '')})`}
        stroke="#1E3A8A"
        strokeWidth="0.8"
      />

      {/* Hood Scoop Center Line */}
      <path
        d="M 48 57 Q 66 50 82 46"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* Raised Hood Scoop Vent */}
      <polygon points="56,54 74,48 76,51 58,57" fill="#0F172A" stroke="#60A5FA" strokeWidth="0.5" />

      {/* White Accent Shield on Front Hood Nose with Hot Wheels Logo */}
      <polygon points="26,63 42,57 40,68 28,71" fill="#FFFFFF" />
      <ellipse cx="34" cy="63" rx="5" ry="3" fill="#DC2626" />
      <ellipse cx="34" cy="63" rx="4" ry="2" fill="#FBBF24" />

      {/* Sleek Hardtop Cabin Roof (Metallic) */}
      <path
        d="M 94 36 L 158 26 L 176 34 L 162 48 L 102 54 Z"
        fill={theme.secondaryColor}
        stroke="#1E3A8A"
        strokeWidth="0.8"
      />

      {/* Sloping Rear Trunk / Fastback Deck */}
      <path
        d="M 176 34 L 206 38 L 240 44 L 235 50 L 180 56 L 162 48 Z"
        fill={`url(#bodyGrad-${theme.primaryColor.replace('#', '')})`}
        stroke="#1E3A8A"
        strokeWidth="0.8"
      />

      {/* White Racing Stripes on Trunk Lid */}
      <polygon points="196,37 220,41 218,44 194,40" fill="#FFFFFF" opacity="0.9" />
      <polygon points="202,38 226,42 224,45 200,41" fill="#FFFFFF" opacity="0.9" />

      {/* Cabin Windows & Tinted Glass with Interior Seats */}
      <polygon points="68,52 94,36 102,54 74,62" fill="url(#windshieldGlassGTO)" stroke="#64748B" strokeWidth="0.8" />
      <polygon points="102,54 104,40 156,30 162,48" fill="url(#windshieldGlassGTO)" stroke="#64748B" strokeWidth="0.8" />
      <line x1="94" y1="36" x2="158" y2="26" stroke="url(#chromePolishGTO)" strokeWidth="1.2" />

      {/* Visible White Bucket Seats through glass */}
      <ellipse cx="118" cy="46" rx="4" ry="7" fill="#F8FAFC" opacity="0.85" />
      <ellipse cx="138" cy="42" rx="4" ry="7" fill="#F8FAFC" opacity="0.85" />
      <ellipse cx="98" cy="49" rx="3.5" ry="5" fill="none" stroke="#334155" strokeWidth="1" />

      {/* ======================================================== */}
      {/* 5. HOT WHEELS 5-SPOKE WHEELS & NEON ORANGE LIP RIMS      */}
      {/* Front Wheel: (cx: 56, cy: 96)                           */}
      {/* Rear Wheel:  (cx: 194, cy: 78)                          */}
      {/* ======================================================== */}
      {/* FRONT WHEEL */}
      <g transform="translate(56, 96)">
        <circle r="18" fill="#0B0F19" stroke="#1E293B" strokeWidth="1.5" />
        <circle r="14.5" fill={`url(#wheelRimGTO-${theme.rimLipColor.replace('#', '')})`} stroke={theme.rimLipColor} strokeWidth="1.2" />
        <circle r="9" fill="#0F172A" />

        <g className={spinningWheels ? 'origin-center animate-spin' : ''} style={{ animationDuration: '0.4s' }}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <line
              key={`f-spoke-${deg}`}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 12}
              y2={Math.sin((deg * Math.PI) / 180) * 12}
              stroke="#E2E8F0"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          ))}
          <circle r="3.2" fill="#94A3B8" stroke="#334155" strokeWidth="0.8" />
        </g>
      </g>

      {/* REAR WHEEL */}
      <g transform="translate(194, 78)">
        <circle r="17" fill="#0B0F19" stroke="#1E293B" strokeWidth="1.5" />
        <circle r="13.5" fill={`url(#wheelRimGTO-${theme.rimLipColor.replace('#', '')})`} stroke={theme.rimLipColor} strokeWidth="1.2" />
        <circle r="8" fill="#0F172A" />

        <g className={spinningWheels ? 'origin-center animate-spin' : ''} style={{ animationDuration: '0.4s' }}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <line
              key={`r-spoke-${deg}`}
              x1="0"
              y1="0"
              x2={Math.cos((deg * Math.PI) / 180) * 11}
              y2={Math.sin((deg * Math.PI) / 180) * 11}
              stroke="#E2E8F0"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          ))}
          <circle r="2.8" fill="#94A3B8" stroke="#334155" strokeWidth="0.8" />
        </g>
      </g>
    </svg>
  );
};

interface RainCarConfig {
  id: string;
  paletteIndex: number;
  depthLayer: 'background' | 'midground' | 'foreground';
  scale: number;
  duration: number;
  delay: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  initialRotate: number;
  midRotate: number;
  endRotate: number;
  flipX?: boolean;
}

const RAIN_CARS_CONFIG: RainCarConfig[] = [
  // --- BACKGROUND STREAM (Behind bouquet, 1 car) ---
  {
    id: 'bg-stream-1',
    paletteIndex: 0, // Starts with Spectraflame Royal Blue
    depthLayer: 'background',
    scale: 0.50,
    duration: 6.8,
    delay: 0,
    startX: -15,
    startY: 8,
    endX: 115,
    endY: 85,
    initialRotate: 24,
    midRotate: 28,
    endRotate: 32,
  },

  // --- MIDGROUND STREAM (Weaving through bouquet, 2 cars) ---
  {
    id: 'mid-stream-1',
    paletteIndex: 5, // Starts with Neon Hot Pink
    depthLayer: 'midground',
    scale: 0.76,
    duration: 5.6,
    delay: 1.2,
    startX: -20,
    startY: 22,
    endX: 120,
    endY: 72,
    initialRotate: 18,
    midRotate: 24,
    endRotate: 20,
  },
  {
    id: 'mid-stream-2',
    paletteIndex: 10, // Starts with Ruby Raspberry
    depthLayer: 'midground',
    scale: 0.78,
    duration: 6.0,
    delay: 3.0,
    startX: 120,
    startY: 18,
    endX: -20,
    endY: 78,
    initialRotate: -20,
    midRotate: -25,
    endRotate: -18,
    flipX: true,
  },

  // --- FOREGROUND STREAM (Soaring near camera, 2 cars) ---
  {
    id: 'fg-stream-1',
    paletteIndex: 15, // Starts with Electric Indigo Sapphire
    depthLayer: 'foreground',
    scale: 0.90,
    duration: 4.8,
    delay: 0.5,
    startX: -25,
    startY: 32,
    endX: 125,
    endY: 65,
    initialRotate: 14,
    midRotate: 18,
    endRotate: 22,
  },
  {
    id: 'fg-stream-2',
    paletteIndex: 20, // Starts with Cyber Neon Magenta
    depthLayer: 'foreground',
    scale: 0.88,
    duration: 5.2,
    delay: 2.4,
    startX: 125,
    startY: 28,
    endX: -25,
    endY: 82,
    initialRotate: -22,
    midRotate: -26,
    endRotate: -20,
    flipX: true,
  },
];

/**
 * Single Stream Car Item that dynamically changes to a new color from the 24-color pool
 * every time it finishes an animation pass and re-enters the screen.
 */
const StreamCarItem: React.FC<{
  config: RainCarConfig;
  scaleMultiplier: number;
}> = ({ config, scaleMultiplier }) => {
  const [paletteIndex, setPaletteIndex] = useState<number>(config.paletteIndex);
  const [cycleIndex, setCycleIndex] = useState<number>(0);

  const theme = CAR_PALETTES[paletteIndex % CAR_PALETTES.length];

  const beamClasses =
    config.depthLayer === 'foreground'
      ? 'top-1/2 -left-24 -translate-y-1/2 w-36 h-3 blur-[2px]'
      : config.depthLayer === 'midground'
      ? 'top-1/2 -left-20 -translate-y-1/2 w-28 h-2 blur-[1.5px]'
      : 'top-1/2 -left-16 -translate-y-1/2 w-20 h-1.5 blur-[1px]';

  const containerShadow =
    config.depthLayer === 'foreground'
      ? 'drop-shadow-[0_18px_36px_rgba(0,0,0,0.95)]'
      : config.depthLayer === 'midground'
      ? 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]'
      : 'filter blur-[0.6px] opacity-75';

  return (
    <motion.div
      key={`${config.id}-cycle-${cycleIndex}`}
      className={`absolute ${containerShadow}`}
      style={{
        top: 0,
        left: 0,
      }}
      initial={{
        x: `${config.startX}vw`,
        y: `${config.startY}vh`,
        rotate: config.initialRotate,
      }}
      animate={{
        x: [`${config.startX}vw`, `${(config.startX + config.endX) / 2}vw`, `${config.endX}vw`],
        y: [`${config.startY}vh`, `${(config.startY + config.endY) / 2}vh`, `${config.endY}vh`],
        rotate: [config.initialRotate, config.midRotate, config.endRotate],
      }}
      transition={{
        duration: config.duration,
        ease: 'linear',
        delay: cycleIndex === 0 ? Math.max(0, config.delay) : 0,
      }}
      onAnimationComplete={() => {
        // As soon as this car leaves the screen, pick a new distinct color from the 24 palettes!
        setPaletteIndex((prev) => (prev + 1) % CAR_PALETTES.length);
        setCycleIndex((c) => c + 1);
      }}
    >
      {/* Headlight front glow beam */}
      <div
        className={`absolute ${beamClasses} rounded-full`}
        style={{
          background: `linear-gradient(to left, ${theme.glowAura}, transparent)`,
        }}
      />
      <HotWheelsGTOVector
        theme={theme}
        scale={config.scale * scaleMultiplier}
        flipX={config.flipX}
        spinningWheels={true}
      />
    </motion.div>
  );
};

export const IsaiasHotWheelsExperience: React.FC<IsaiasHotWheelsExperienceProps> = ({
  onBackToMenu,
}) => {
  // Dedicated audio player for "Lover is a Day"
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Dynamic scale multiplier for small viewports so cars and elements scale proportionally
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(() => {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < 480 || h < 640) return 0.72;
    if (w < 768 || h < 768) return 0.84;
    return 1;
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 480 || h < 640) {
        setScaleMultiplier(0.72);
      } else if (w < 768 || h < 768) {
        setScaleMultiplier(0.84);
      } else {
        setScaleMultiplier(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll and gestures while in this experience so screen never moves/scrolls
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    const originalOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';

    const preventScroll = (e: TouchEvent | WheelEvent) => {
      if ((e.target as HTMLElement)?.closest?.('button, a, input')) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.body.style.overscrollBehavior = originalOverscroll;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const candidates = resolveAudioCandidates('audio/lover_is_a_day.mp3');
    let candidateIndex = 0;

    audio.src = candidates[0];
    audio.loop = true;

    const startPlayback = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by browser policy: register first user interaction listener
          const handleFirstInteraction = () => {
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {});
            ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => {
              window.removeEventListener(ev, handleFirstInteraction);
            });
          };

          ['click', 'touchstart', 'pointerdown', 'keydown'].forEach((ev) => {
            window.addEventListener(ev, handleFirstInteraction, { once: true });
          });
        });
    };

    startPlayback();

    const handleError = () => {
      candidateIndex++;
      if (candidateIndex < candidates.length) {
        audio.src = candidates[candidateIndex];
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  const handleBack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onBackToMenu();
  };

  return (
    <div
      id="isaias-hot-wheels-bouquet"
      className="absolute inset-0 z-30 w-full h-full flex flex-col items-center justify-center overflow-hidden select-none touch-none overscroll-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #0c1630 0%, #050b18 50%, #010206 100%)',
      }}
    >
      <style>{`
        @keyframes twinkleSoft {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes starCrossPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.6) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(45deg); filter: drop-shadow(0 0 8px currentColor); }
        }
        @keyframes cosmicFloat1 {
          0% { transform: translateY(0px) translateX(0px) scale(0.7); opacity: 0; }
          20% { opacity: 0.9; }
          50% { transform: translateY(-70px) translateX(20px) scale(1.1); opacity: 1; }
          80% { opacity: 0.85; }
          100% { transform: translateY(-160px) translateX(-15px) scale(0.8); opacity: 0; }
        }
        @keyframes cosmicFloat2 {
          0% { transform: translateY(0px) translateX(0px) scale(0.8); opacity: 0; }
          25% { opacity: 0.95; }
          50% { transform: translateY(-90px) translateX(-24px) scale(1.2); opacity: 1; }
          75% { opacity: 0.8; }
          100% { transform: translateY(-190px) translateX(18px) scale(0.7); opacity: 0; }
        }
        @keyframes cosmicFloat3 {
          0% { transform: translateY(0px) translateX(0px) scale(0.7); opacity: 0; }
          30% { opacity: 1; transform: translateY(-55px) translateX(16px) scale(1.15); }
          70% { opacity: 0.9; transform: translateY(-120px) translateX(-18px) scale(1); }
          100% { transform: translateY(-180px) translateX(10px) scale(0.6); opacity: 0; }
        }
        @keyframes verticalShootingStar1 {
          0% {
            transform: translate3d(0, -180px, 0);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          12% {
            transform: translate3d(0, 110vh, 0);
            opacity: 0.9;
          }
          15% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
        }
        @keyframes verticalShootingStar2 {
          0% {
            transform: translate3d(0, -180px, 0);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          11% {
            transform: translate3d(0, 110vh, 0);
            opacity: 0.9;
          }
          14% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
        }
        @keyframes verticalShootingStar3 {
          0% {
            transform: translate3d(0, -180px, 0);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          10% {
            transform: translate3d(0, 110vh, 0);
            opacity: 0.9;
          }
          13% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
          100% {
            transform: translate3d(0, 115vh, 0);
            opacity: 0;
          }
        }
      `}</style>

      <audio ref={audioRef} preload="auto" />

      {/* Floating Minimalist Music Toggle for "Lover is a Day" (Pure icon, zero text) */}
      <motion.button
        type="button"
        onClick={toggleAudio}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-4 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center bg-[#07152B]/90 border border-[#FF4500]/40 text-[#FF4500] shadow-xl shadow-[#FF4500]/30 backdrop-blur-md cursor-pointer hover:border-[#FF4500] hover:bg-[#200A10]/95 transition-all pointer-events-auto touch-auto"
        aria-label="Música"
        title="Silenciar / Reproducir música"
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-[#FF8800] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
          </div>
        ) : (
          <VolumeX className="w-5 h-5 text-[#94A3B8]" />
        )}
      </motion.button>

      {/* ======================================================== */}
      {/* LAYER 0: STARRY GALAXY NIGHT SKY & NEBULA                */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Galaxy deep purple & cyan nebula dust */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(139,92,246,0.18)_0%,rgba(14,165,233,0.14)_45%,transparent_75%)] blur-3xl" />
        <div className="absolute top-[25%] left-[25%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.12)_0%,transparent_70%)] blur-3xl" />

        {/* Deep cyan aura behind the floral bouquet */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] md:w-[700px] h-[340px] sm:h-[520px] md:h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18)_0%,rgba(2,132,199,0.1)_45%,transparent_75%)] blur-3xl" />
        
        {/* Subtle fiery speed glow accent */}
        <div className="absolute top-[28%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[380px] h-[260px] sm:h-[380px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.09)_0%,transparent_70%)] blur-2xl" />

        {/* 1. Realistic Strictly Vertical Shooting Stars (Downward Falling Light Lines) */}
        {/* Vertical Star 1: Left celestial sector */}
        <div
          className="absolute -top-32 left-[15%] w-[1.5px] h-[120px] pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(56, 189, 248, 0.15) 30%, rgba(0, 240, 255, 0.6) 70%, #FFFFFF 100%)',
            boxShadow: '0 0 6px rgba(0, 240, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.9)',
            animation: 'verticalShootingStar1 10s infinite ease-in 1s',
            willChange: 'transform, opacity',
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full bg-white shadow-[0_0_8px_#FFFFFF,0_0_14px_#00F0FF]" />
        </div>

        {/* Vertical Star 2: Right celestial sector */}
        <div
          className="absolute -top-32 left-[78%] w-[1.5px] h-[130px] pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(251, 191, 36, 0.15) 30%, rgba(251, 191, 36, 0.6) 70%, #FFFFFF 100%)',
            boxShadow: '0 0 6px rgba(251, 191, 36, 0.8), 0 0 12px rgba(255, 255, 255, 0.9)',
            animation: 'verticalShootingStar2 14s infinite ease-in 5.5s',
            willChange: 'transform, opacity',
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2 rounded-full bg-white shadow-[0_0_8px_#FFFFFF,0_0_14px_#FBBF24]" />
        </div>

        {/* Vertical Star 3: Center-Right sector */}
        <div
          className="absolute -top-36 left-[48%] w-[1.5px] h-[140px] pointer-events-none rounded-full"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.15) 30%, rgba(168, 85, 247, 0.6) 70%, #FFFFFF 100%)',
            boxShadow: '0 0 6px rgba(168, 85, 247, 0.8), 0 0 12px rgba(255, 255, 255, 0.9)',
            animation: 'verticalShootingStar3 18s infinite ease-in 9.5s',
            willChange: 'transform, opacity',
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#FFFFFF,0_0_16px_#C084FC]" />
        </div>

        {/* 2. Sparkling 4-Point Diamond Cross Stars (✦) */}
        <div className="absolute inset-0">
          {[
            { top: '12%', left: '16%', size: 12, color: '#00F0FF', delay: '0s', duration: '3.4s' },
            { top: '22%', left: '82%', size: 14, color: '#FDE047', delay: '1.2s', duration: '4.2s' },
            { top: '42%', left: '9%', size: 11, color: '#38BDF8', delay: '2.1s', duration: '3.8s' },
            { top: '68%', left: '88%', size: 13, color: '#F43F5E', delay: '0.6s', duration: '4.6s' },
            { top: '18%', left: '50%', size: 10, color: '#FFFFFF', delay: '1.8s', duration: '3.2s' },
            { top: '56%', left: '22%', size: 12, color: '#C084FC', delay: '2.7s', duration: '4.0s' },
            { top: '80%', left: '80%', size: 11, color: '#00F0FF', delay: '1.4s', duration: '3.6s' },
            { top: '34%', left: '76%', size: 10, color: '#FDE047', delay: '0.3s', duration: '4.4s' },
          ].map((cross, i) => (
            <div
              key={`cross-${i}`}
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                top: cross.top,
                left: cross.left,
                width: `${cross.size}px`,
                height: `${cross.size}px`,
                color: cross.color,
                animation: `starCrossPulse ${cross.duration} infinite ease-in-out ${cross.delay}`,
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current" style={{ filter: `drop-shadow(0 0 4px ${cross.color})` }}>
                <path d="M12 0 L14 9.5 L24 12 L14 14.5 L12 24 L10 14.5 L0 12 L10 9.5 Z" />
              </svg>
            </div>
          ))}
        </div>

        {/* 3. Starry Constellation Twinkle Dots */}
        <div className="absolute inset-0 opacity-80">
          {[
            { top: '8%', left: '28%', size: '2px', delay: '0.2s', duration: '3.1s' },
            { top: '16%', left: '72%', size: '2.5px', delay: '1.5s', duration: '4.0s' },
            { top: '26%', left: '14%', size: '1.8px', delay: '2.4s', duration: '3.6s' },
            { top: '38%', left: '89%', size: '2.2px', delay: '0.8s', duration: '4.8s' },
            { top: '50%', left: '6%', size: '2px', delay: '1.9s', duration: '3.3s' },
            { top: '64%', left: '92%', size: '2.4px', delay: '0.5s', duration: '4.5s' },
            { top: '76%', left: '12%', size: '1.8px', delay: '2.2s', duration: '3.7s' },
            { top: '86%', left: '48%', size: '2.5px', delay: '1.1s', duration: '4.1s' },
            { top: '92%', left: '84%', size: '2px', delay: '0.4s', duration: '3.9s' },
            { top: '6%', left: '60%', size: '2px', delay: '2.8s', duration: '5.0s' },
            { top: '48%', left: '38%', size: '1.5px', delay: '1.3s', duration: '4.2s' },
            { top: '72%', left: '64%', size: '2.2px', delay: '2.0s', duration: '3.5s' },
          ].map((star, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animation: `twinkleSoft ${star.duration} infinite ease-in-out ${star.delay}`,
              }}
            />
          ))}
        </div>

        {/* 4. Multi-Layer Realistic Floating Stardust Embers (Organic Dynamic Motion) */}
        <div className="absolute inset-0">
          {[
            // Stream 1 - gentle left-to-right wave float
            { top: '88%', left: '18%', anim: 'cosmicFloat1', duration: '6.2s', delay: '0s', color: '#00F0FF', size: '2.5px' },
            { top: '82%', left: '74%', anim: 'cosmicFloat2', duration: '5.8s', delay: '1.4s', color: '#38BDF8', size: '2px' },
            { top: '78%', left: '42%', anim: 'cosmicFloat3', duration: '5.2s', delay: '2.6s', color: '#FBBF24', size: '3px' },
            { top: '92%', left: '55%', anim: 'cosmicFloat1', duration: '6.6s', delay: '0.8s', color: '#FFFFFF', size: '2px' },
            { top: '65%', left: '12%', anim: 'cosmicFloat2', duration: '5.5s', delay: '3.2s', color: '#F43F5E', size: '2.5px' },
            { top: '74%', left: '86%', anim: 'cosmicFloat3', duration: '6.0s', delay: '1.9s', color: '#00F0FF', size: '2px' },
            { top: '58%', left: '78%', anim: 'cosmicFloat1', duration: '5.0s', delay: '2.1s', color: '#C084FC', size: '2.8px' },
            { top: '85%', left: '32%', anim: 'cosmicFloat2', duration: '6.4s', delay: '0.4s', color: '#FFFFFF', size: '1.8px' },
            { top: '68%', left: '62%', anim: 'cosmicFloat3', duration: '5.7s', delay: '1.7s', color: '#38BDF8', size: '2.2px' },
            { top: '90%', left: '8%', anim: 'cosmicFloat1', duration: '7.0s', delay: '3.8s', color: '#FBBF24', size: '2.5px' },
            { top: '48%', left: '22%', anim: 'cosmicFloat2', duration: '5.4s', delay: '2.3s', color: '#00F0FF', size: '2px' },
            { top: '38%', left: '68%', anim: 'cosmicFloat3', duration: '5.9s', delay: '0.9s', color: '#F43F5E', size: '2.6px' },
            { top: '70%', left: '26%', anim: 'cosmicFloat1', duration: '6.1s', delay: '1.1s', color: '#38BDF8', size: '2px' },
            { top: '60%', left: '48%', anim: 'cosmicFloat2', duration: '5.3s', delay: '2.9s', color: '#FFFFFF', size: '2.4px' },
            { top: '84%', left: '66%', anim: 'cosmicFloat3', duration: '6.8s', delay: '0.2s', color: '#00F0FF', size: '2.2px' },
            { top: '52%', left: '84%', anim: 'cosmicFloat1', duration: '5.6s', delay: '3.5s', color: '#FDE047', size: '2.8px' },
            { top: '76%', left: '16%', anim: 'cosmicFloat2', duration: '6.3s', delay: '1.6s', color: '#C084FC', size: '2px' },
            { top: '94%', left: '44%', anim: 'cosmicFloat3', duration: '5.1s', delay: '2.8s', color: '#38BDF8', size: '3px' },
          ].map((sparkle, i) => (
            <div
              key={`sparkle-gem-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                top: sparkle.top,
                left: sparkle.left,
                width: sparkle.size,
                height: sparkle.size,
                backgroundColor: sparkle.color,
                boxShadow: `0 0 8px ${sparkle.color}, 0 0 16px ${sparkle.color}`,
                animation: `${sparkle.anim} ${sparkle.duration} infinite ease-in-out ${sparkle.delay}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 1: BACKGROUND CASCADING HOT WHEELS (Behind Bouquet)*/}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {RAIN_CARS_CONFIG.filter((c) => c.depthLayer === 'background').map((car) => (
          <StreamCarItem key={car.id} config={car} scaleMultiplier={scaleMultiplier} />
        ))}
      </div>

      {/* ======================================================== */}
      {/* LAYER 2: THE SACRED CYAN BOUQUET (CENTRAL BOTANICAL PIECE)*/}
      {/* ANIMATED GENTLE BREEZE SWAYING EFFECT                    */}
      {/* Auto-scales to fit exact viewport of phone or desktop    */}
      {/* ======================================================== */}
      <motion.div
        className="relative z-20 w-auto h-full max-h-[70dvh] sm:max-h-[76dvh] max-w-[min(90vw,460px)] sm:max-w-[520px] aspect-[600/860] flex items-center justify-center origin-bottom pointer-events-none"
        animate={{
          rotate: [-1.4, 1.2, -1.4],
          x: [-2.5, 2.5, -2.5],
        }}
        transition={{
          duration: 5.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 600 860"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-full max-h-full drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* FLOWER PETAL GRADIENTS (LUMINOUS CYAN SUNFLOWERS) */}
            <linearGradient id="cyanPetalMain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F7FF" />
              <stop offset="25%" stopColor="#7DD3FC" />
              <stop offset="70%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#034574" />
            </linearGradient>

            <linearGradient id="cyanPetalHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="85%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </linearGradient>

            <linearGradient id="cyanPetalBack" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#042038" />
            </linearGradient>

            {/* FLOWER CORE POLLEN DISC */}
            <radialGradient id="flowerCorePattern" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F243A" />
              <stop offset="45%" stopColor="#071322" />
              <stop offset="80%" stopColor="#020810" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
            </radialGradient>

            {/* STEM GRADIENT */}
            <linearGradient id="botanicalStem" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E3A2F" />
              <stop offset="50%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* VASE / WRAPPING FACETS GRADIENT */}
            <linearGradient id="crystalFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#082F49" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="crystalFacet2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#0369A1" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#041E33" stopOpacity="0.9" />
            </linearGradient>

            {/* SOFT GLOW FILTER */}
            <filter id="softCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="deepBloomGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ======================================================== */}
          {/* LAYER A: STEMS RADIATING FROM WRAPPING VASE             */}
          {/* ======================================================== */}
          <g id="stems-network">
            {/* Left Stems */}
            <path d="M 270 650 Q 230 540 180 440" stroke="url(#botanicalStem)" strokeWidth="11" strokeLinecap="round" />
            <path d="M 285 640 Q 210 500 130 330" stroke="url(#botanicalStem)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 290 620 Q 220 420 220 280" stroke="url(#botanicalStem)" strokeWidth="11" strokeLinecap="round" />

            {/* Center Stems */}
            <path d="M 300 630 Q 300 450 300 220" stroke="url(#botanicalStem)" strokeWidth="12" strokeLinecap="round" />
            <path d="M 300 630 Q 310 480 320 370" stroke="url(#botanicalStem)" strokeWidth="11" strokeLinecap="round" />

            {/* Right Stems */}
            <path d="M 310 620 Q 380 430 380 270" stroke="url(#botanicalStem)" strokeWidth="11" strokeLinecap="round" />
            <path d="M 315 640 Q 390 500 470 330" stroke="url(#botanicalStem)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 330 650 Q 370 540 420 440" stroke="url(#botanicalStem)" strokeWidth="11" strokeLinecap="round" />

            {/* Botanical Leaves swaying with the breeze */}
            <g className="origin-[210px_480px]">
              <path d="M 210 480 Q 150 490 120 430 Q 180 430 210 480 Z" fill="#064E3B" stroke="#00F0FF" strokeWidth="1" opacity="0.8" />
            </g>
            <g className="origin-[390px_470px]">
              <path d="M 390 470 Q 450 480 480 420 Q 420 420 390 470 Z" fill="#064E3B" stroke="#00F0FF" strokeWidth="1" opacity="0.8" />
            </g>
            <path d="M 240 370 Q 180 360 160 300 Q 210 320 240 370 Z" fill="#065F46" stroke="#38BDF8" strokeWidth="1.2" opacity="0.85" />
            <path d="M 360 360 Q 420 350 440 290 Q 390 310 360 360 Z" fill="#065F46" stroke="#38BDF8" strokeWidth="1.2" opacity="0.85" />
          </g>

          {/* ======================================================== */}
          {/* LAYER B: BACKGROUND CYAN BLOOMS (WITH BREEZE FLUTTER)    */}
          {/* ======================================================== */}
          <g id="background-blooms">
            {/* Bloom Top Left (140, 320) */}
            <g transform="translate(140, 320) scale(0.85)">
              <g className="animate-spin" style={{ animationDuration: '60s' }}>
                {[...Array(16)].map((_, i) => (
                  <path
                    key={`b-a-${i}`}
                    d="M 0 0 C -12 -30 -15 -62 0 -78 C 15 -62 12 -30 0 0 Z"
                    fill="url(#cyanPetalBack)"
                    stroke="#0284C7"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 22.5})`}
                  />
                ))}
              </g>
              <circle r="22" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="1.5" />
            </g>

            {/* Bloom Top Right (465, 320) */}
            <g transform="translate(465, 320) scale(0.85)">
              <g className="animate-spin" style={{ animationDuration: '65s' }}>
                {[...Array(16)].map((_, i) => (
                  <path
                    key={`b-b-${i}`}
                    d="M 0 0 C -12 -30 -15 -62 0 -78 C 15 -62 12 -30 0 0 Z"
                    fill="url(#cyanPetalBack)"
                    stroke="#0284C7"
                    strokeWidth="0.8"
                    transform={`rotate(${i * 22.5})`}
                  />
                ))}
              </g>
              <circle r="22" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="1.5" />
            </g>

            {/* Bloom Top Center Apex (300, 210) */}
            <g transform="translate(300, 210) scale(0.95)" filter="url(#softCyanGlow)">
              <g className="animate-spin" style={{ animationDuration: '70s' }}>
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`b-c-${i}`}
                    d="M 0 0 C -14 -32 -16 -68 0 -85 C 16 -68 14 -32 0 0 Z"
                    fill="url(#cyanPetalMain)"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    transform={`rotate(${i * 20})`}
                  />
                ))}
                {[...Array(18)].map((_, i) => (
                  <path
                    key={`b-c2-${i}`}
                    d="M 0 0 C -11 -25 -13 -52 0 -66 C 13 -52 11 -25 0 0 Z"
                    fill="url(#cyanPetalHighlight)"
                    transform={`rotate(${i * 20 + 10})`}
                  />
                ))}
              </g>
              <circle r="28" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="2.5" />
              {[...Array(12)].map((_, i) => (
                <circle
                  key={`b-c-dot-${i}`}
                  cx={Math.cos((i * Math.PI) / 6) * 14}
                  cy={Math.sin((i * Math.PI) / 6) * 14}
                  r="1.8"
                  fill="#7DD3FC"
                  opacity="0.8"
                />
              ))}
            </g>
          </g>

          {/* ======================================================== */}
          {/* LAYER C: MIDGROUND LARGE GLOWING CYAN BLOOMS             */}
          {/* ======================================================== */}
          <g id="midground-blooms">
            {/* Bloom Mid Left (215, 275) */}
            <g transform="translate(215, 275)" filter="url(#softCyanGlow)">
              {[...Array(16)].map((_, i) => (
                <path
                  key={`b-d-${i}`}
                  d="M 0 0 C -15 -35 -18 -72 0 -92 C 18 -72 15 -35 0 0 Z"
                  fill="url(#cyanPetalMain)"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 22.5})`}
                />
              ))}
              {[...Array(16)].map((_, i) => (
                <path
                  key={`b-d-in-${i}`}
                  d="M 0 0 C -11 -26 -13 -54 0 -68 C 13 -54 11 -26 0 0 Z"
                  fill="url(#cyanPetalHighlight)"
                  transform={`rotate(${i * 22.5 + 11.25})`}
                />
              ))}
              <circle r="32" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="3" />
              {[...Array(16)].map((_, i) => (
                <circle
                  key={`pollen-d-${i}`}
                  cx={Math.cos((i * Math.PI) / 8) * 16}
                  cy={Math.sin((i * Math.PI) / 8) * 16}
                  r="2"
                  fill="#38BDF8"
                />
              ))}
            </g>

            {/* Bloom Mid Right (385, 275) */}
            <g transform="translate(385, 275)" filter="url(#softCyanGlow)">
              {[...Array(16)].map((_, i) => (
                <path
                  key={`b-e-${i}`}
                  d="M 0 0 C -15 -35 -18 -72 0 -92 C 18 -72 15 -35 0 0 Z"
                  fill="url(#cyanPetalMain)"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 22.5 + 7})`}
                />
              ))}
              {[...Array(16)].map((_, i) => (
                <path
                  key={`b-e-in-${i}`}
                  d="M 0 0 C -11 -26 -13 -54 0 -68 C 13 -54 11 -26 0 0 Z"
                  fill="url(#cyanPetalHighlight)"
                  transform={`rotate(${i * 22.5 + 18.25})`}
                />
              ))}
              <circle r="32" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="3" />
              {[...Array(16)].map((_, i) => (
                <circle
                  key={`pollen-e-${i}`}
                  cx={Math.cos((i * Math.PI) / 8) * 16}
                  cy={Math.sin((i * Math.PI) / 8) * 16}
                  r="2"
                  fill="#38BDF8"
                />
              ))}
            </g>

            {/* Bloom Center Lower Heart (300, 365) - Radiant Sunburst */}
            <g transform="translate(300, 365)" filter="url(#deepBloomGlow)">
              {[...Array(20)].map((_, i) => (
                <path
                  key={`b-f-${i}`}
                  d="M 0 0 C -16 -38 -20 -80 0 -100 C 20 -80 16 -38 0 0 Z"
                  fill="url(#cyanPetalMain)"
                  stroke="#00F0FF"
                  strokeWidth="1.5"
                  transform={`rotate(${i * 18})`}
                />
              ))}
              {[...Array(20)].map((_, i) => (
                <path
                  key={`b-f-in-${i}`}
                  d="M 0 0 C -12 -28 -15 -62 0 -78 C 15 -62 12 -28 0 0 Z"
                  fill="url(#cyanPetalHighlight)"
                  transform={`rotate(${i * 18 + 9})`}
                />
              ))}
              <circle r="36" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="3.5" />
              {[...Array(20)].map((_, i) => (
                <circle
                  key={`pollen-f-${i}`}
                  cx={Math.cos((i * Math.PI) / 10) * 19}
                  cy={Math.sin((i * Math.PI) / 10) * 19}
                  r="2.2"
                  fill="#E0F2FE"
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <circle
                  key={`pollen-f2-${i}`}
                  cx={Math.cos((i * Math.PI) / 5) * 9}
                  cy={Math.sin((i * Math.PI) / 5) * 9}
                  r="1.8"
                  fill="#38BDF8"
                />
              ))}
            </g>

            {/* Bloom Lower Left Flank (175, 435) */}
            <g transform="translate(175, 435)">
              {[...Array(14)].map((_, i) => (
                <path
                  key={`b-g-${i}`}
                  d="M 0 0 C -14 -32 -16 -66 0 -84 C 16 -66 14 -32 0 0 Z"
                  fill="url(#cyanPetalMain)"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  transform={`rotate(${i * (360 / 14)})`}
                />
              ))}
              <circle r="26" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="2" />
            </g>

            {/* Bloom Lower Right Flank (425, 435) */}
            <g transform="translate(425, 435)">
              {[...Array(14)].map((_, i) => (
                <path
                  key={`b-h-${i}`}
                  d="M 0 0 C -14 -32 -16 -66 0 -84 C 16 -66 14 -32 0 0 Z"
                  fill="url(#cyanPetalMain)"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  transform={`rotate(${i * (360 / 14) + 12})`}
                />
              ))}
              <circle r="26" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="2" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* LAYER D: FOREGROUND ACCENT BLOOMS                        */}
          {/* ======================================================== */}
          <g id="foreground-blooms">
            <g transform="translate(245, 175) scale(0.65)" filter="url(#softCyanGlow)">
              {[...Array(12)].map((_, i) => (
                <path
                  key={`fg-fl1-${i}`}
                  d="M 0 0 C -12 -25 -14 -50 0 -64 C 14 -50 12 -25 0 0 Z"
                  fill="url(#cyanPetalHighlight)"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  transform={`rotate(${i * 30})`}
                />
              ))}
              <circle r="20" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="2" />
            </g>

            <g transform="translate(485, 235) scale(0.68)" filter="url(#softCyanGlow)">
              {[...Array(12)].map((_, i) => (
                <path
                  key={`fg-fl2-${i}`}
                  d="M 0 0 C -12 -25 -14 -50 0 -64 C 14 -50 12 -25 0 0 Z"
                  fill="url(#cyanPetalHighlight)"
                  stroke="#38BDF8"
                  strokeWidth="1"
                  transform={`rotate(${i * 30 + 15})`}
                />
              ))}
              <circle r="20" fill="url(#flowerCorePattern)" stroke="#00F0FF" strokeWidth="2" />
            </g>
          </g>

          {/* ======================================================== */}
          {/* LAYER E: GLOWING FACETED CRYSTAL BOUQUET WRAP (BASE)     */}
          {/* ======================================================== */}
          <g id="crystal-wrap-base" transform="translate(0, 0)">
            <ellipse cx="300" cy="740" rx="140" ry="32" fill="#00F0FF" opacity="0.3" filter="blur(14px)" />

            {/* Back Facets */}
            <polygon points="180,610 300,590 420,610 400,670 200,670" fill="url(#crystalFacet1)" stroke="#00F0FF" strokeWidth="1.5" />

            {/* Main Diamond Upper Surface */}
            <polygon points="160,630 300,600 440,630 380,710 220,710" fill="url(#crystalFacet2)" stroke="#7DD3FC" strokeWidth="2" opacity="0.9" />

            {/* Front Center V-Shaped Crystal Facet */}
            <polygon points="220,710 300,600 380,710 300,810" fill="url(#crystalFacet1)" stroke="#00F0FF" strokeWidth="2.5" />

            {/* Left Lower Facet */}
            <polygon points="160,630 220,710 300,810 190,750" fill="url(#crystalFacet2)" stroke="#38BDF8" strokeWidth="2" />

            {/* Right Lower Facet */}
            <polygon points="440,630 380,710 300,810 410,750" fill="url(#crystalFacet2)" stroke="#38BDF8" strokeWidth="2" />

            {/* Inner Refraction Beams */}
            <line x1="300" y1="600" x2="300" y2="810" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
            <line x1="220" y1="710" x2="380" y2="710" stroke="#E0F2FE" strokeWidth="1.8" opacity="0.75" />
            <line x1="160" y1="630" x2="440" y2="630" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.6" />

            {/* Crystal vertex sparkle points */}
            <circle cx="300" cy="600" r="4" fill="#FFFFFF" filter="url(#softCyanGlow)" />
            <circle cx="300" cy="810" r="4.5" fill="#FFFFFF" filter="url(#softCyanGlow)" />
            <circle cx="220" cy="710" r="3.5" fill="#00F0FF" />
            <circle cx="380" cy="710" r="3.5" fill="#00F0FF" />
          </g>
        </svg>
      </motion.div>

      {/* ======================================================== */}
      {/* LAYER 3: MIDGROUND CASCADING HOT WHEELS (Between Blooms) */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {RAIN_CARS_CONFIG.filter((c) => c.depthLayer === 'midground').map((car) => (
          <StreamCarItem key={car.id} config={car} scaleMultiplier={scaleMultiplier} />
        ))}
      </div>

      {/* ======================================================== */}
      {/* LAYER 4: FOREGROUND CASCADING HOT WHEELS (Near Camera)   */}
      {/* High impact, large scale, crisp Hot Wheels side flame   */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-35 overflow-hidden">
        {RAIN_CARS_CONFIG.filter((c) => c.depthLayer === 'foreground').map((car) => (
          <StreamCarItem key={car.id} config={car} scaleMultiplier={scaleMultiplier} />
        ))}
      </div>
    </div>
  );
};
