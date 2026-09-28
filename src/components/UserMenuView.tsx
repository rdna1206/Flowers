import React from 'react';
import { motion } from 'motion/react';
import { Flower2, MessageSquare, BookOpen, Lock, Flame } from 'lucide-react';
import type { UserExperienceData } from '../types';

interface UserMenuViewProps {
  experience: UserExperienceData;
  onGoToFlower: () => void;
  onGoToChat: () => void;
  onGoToText: () => void;
  onGoToHotWheels?: () => void;
  isChatAvailable: boolean;
}

export const UserMenuView: React.FC<UserMenuViewProps> = ({
  experience,
  onGoToFlower,
  onGoToChat,
  onGoToText,
  onGoToHotWheels,
  isChatAvailable,
}) => {
  const theme = experience.theme || {};
  const isJhon = experience.id === 'jhon' || experience.username?.toLowerCase() === 'jhon';
  const isIsaias =
    experience.id?.toLowerCase() === 'isaias' ||
    experience.username?.toLowerCase() === 'isaias' ||
    experience.name?.toLowerCase().includes('isaias') ||
    experience.name?.toLowerCase().includes('isaías');
  const isDarkTheme =
    theme.backgroundColor?.startsWith('#0') ||
    theme.backgroundColor?.startsWith('#1') ||
    isJhon ||
    true;

  const primaryColor = theme.primaryColor?.trim() || (isDarkTheme ? '#2B78E4' : '#0047AB');
  const secondaryColor = theme.secondaryColor?.trim() || (isDarkTheme ? '#3A86FF' : '#937C67');
  const accentColor = theme.accentColor?.trim() || (isDarkTheme ? '#F4D03F' : '#D4AF37');
  const surfaceColor =
    theme.surfaceColor?.trim() ||
    (isDarkTheme ? 'rgba(10, 18, 38, 0.92)' : 'rgba(255, 255, 255, 0.94)');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.3)' : '#E8E2D9';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const isSans = theme.fontStyle === 'sans';

  return (
    <div
      id="user-menu-view-container"
      className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center justify-center min-h-[78vh]"
    >
      {/* Top Identity Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border mb-3 shadow-md backdrop-blur-md"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: accentColor,
          }}
        >
          <Flower2 className="w-5 h-5 stroke-[1.5]" />
        </div>

        <h1
          className={`${
            isSans ? 'font-sans' : 'font-serif-display'
          } text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight`}
          style={{ color: textColor }}
        >
          {experience.name}
        </h1>
      </motion.div>

      {/* Options Grid */}
      <div
        className={`w-full grid ${
          isIsaias ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'
        } gap-4 sm:gap-6`}
      >
        {/* OPTION 1: IR A FLOR (Original intact experience) */}
        <motion.button
          id="btn-menu-option-flower"
          type="button"
          onClick={onGoToFlower}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden min-h-[180px] sm:min-h-[220px]"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          {/* Subtle Ambient Hover Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 35%, ${primaryColor}25 0%, transparent 70%)`,
            }}
          />

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md border"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: accentColor,
            }}
          >
            <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
          </div>

          <h2
            className="text-lg sm:text-xl font-bold tracking-wider uppercase transition-colors"
            style={{ color: textColor }}
          >
            IR A FLOR
          </h2>
        </motion.button>

        {/* OPTION FOR ISAIAS: HOT WHEELS (Second independent experience) */}
        {isIsaias && onGoToHotWheels && (
          <motion.button
            id="btn-menu-option-hot-wheels"
            type="button"
            onClick={onGoToHotWheels}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden min-h-[180px] sm:min-h-[220px]"
            style={{
              backgroundColor: surfaceColor,
              borderColor: 'rgba(255, 102, 0, 0.45)',
            }}
          >
            {/* Ambient Flame / Speed Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
              style={{
                background: 'radial-gradient(circle at 50% 35%, rgba(255, 102, 0, 0.3) 0%, transparent 70%)',
              }}
            />

            {/* Glowing Accent Badge */}
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-lg border"
              style={{
                backgroundColor: 'rgba(255, 85, 0, 0.18)',
                borderColor: 'rgba(255, 136, 0, 0.6)',
                color: '#FF6600',
              }}
            >
              <Flame className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8] text-[#FF5500] animate-pulse" />
            </div>

            <h2
              className="text-lg sm:text-xl font-black tracking-wider uppercase transition-colors bg-gradient-to-r from-[#FF5500] via-[#FFAA00] to-[#FFE600] bg-clip-text text-transparent"
            >
              HOT WHEELS
            </h2>
          </motion.button>
        )}

        {/* OPTION 2 (or 3): IR A CHAT */}
        {isChatAvailable ? (
          <motion.button
            id="btn-menu-option-chat"
            type="button"
            onClick={onGoToChat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden min-h-[180px] sm:min-h-[220px]"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            {/* Subtle Ambient Hover Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
              style={{
                background: `radial-gradient(circle at 50% 35%, ${secondaryColor}25 0%, transparent 70%)`,
              }}
            />

            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md border"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: secondaryColor,
              }}
            >
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
            </div>

            <h2
              className="text-lg sm:text-xl font-bold tracking-wider uppercase transition-colors"
              style={{ color: textColor }}
            >
              IR A CHAT
            </h2>
          </motion.button>
        ) : (
          <div
            id="btn-menu-option-chat-disabled"
            className="relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-md backdrop-blur-md opacity-40 cursor-not-allowed overflow-hidden min-h-[180px] sm:min-h-[220px]"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
            title="Chat no disponible"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xs border"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: mutedTextColor,
              }}
            >
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
            </div>

            <h2
              className="text-lg sm:text-xl font-bold tracking-wider uppercase"
              style={{ color: textColor }}
            >
              IR A CHAT
            </h2>
          </div>
        )}

        {/* OPTION 3: IR A TEXTO */}
        <motion.button
          id="btn-menu-option-text"
          type="button"
          onClick={onGoToText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden min-h-[180px] sm:min-h-[220px]"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          {/* Subtle Ambient Hover Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 35%, ${primaryColor}25 0%, transparent 70%)`,
            }}
          />

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md border"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: primaryColor,
            }}
          >
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
          </div>

          <h2
            className="text-lg sm:text-xl font-bold tracking-wider uppercase transition-colors"
            style={{ color: textColor }}
          >
            IR A TEXTO
          </h2>
        </motion.button>
      </div>
    </div>
  );
};
