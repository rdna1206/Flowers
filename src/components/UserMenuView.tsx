import React from 'react';
import { motion } from 'motion/react';
import { Flower2, MessageSquare, BookOpen, ArrowRight, Lock } from 'lucide-react';
import type { UserExperienceData } from '../types';

interface UserMenuViewProps {
  experience: UserExperienceData;
  onGoToFlower: () => void;
  onGoToChat: () => void;
  onGoToText: () => void;
  isChatAvailable: boolean;
}

export const UserMenuView: React.FC<UserMenuViewProps> = ({
  experience,
  onGoToFlower,
  onGoToChat,
  onGoToText,
  isChatAvailable,
}) => {
  const theme = experience.theme || {};
  const isJhon = experience.id === 'jhon' || experience.username?.toLowerCase() === 'jhon';
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

      {/* 3 Main Options Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* OPTION 1: IR A FLOR */}
        <motion.button
          id="btn-menu-option-flower"
          type="button"
          onClick={onGoToFlower}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          {/* Subtle Ambient Hover Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${primaryColor}22 0%, transparent 70%)`,
            }}
          />

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-md border"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: accentColor,
            }}
          >
            <Flower2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
          </div>

          <h2
            className="text-lg sm:text-xl font-bold tracking-wider uppercase mb-2"
            style={{ color: textColor }}
          >
            IR A FLOR
          </h2>

          <p
            className="text-xs sm:text-sm font-light leading-relaxed mb-6"
            style={{ color: mutedTextColor }}
          >
            Experiencia visual de tu ramo
          </p>

          <div
            className="mt-auto inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 group-hover:px-5"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: accentColor,
            }}
          >
            <span>Abrir flor</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>

        {/* OPTION 2: IR A CHAT */}
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
            className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            {/* Subtle Ambient Hover Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${secondaryColor}22 0%, transparent 70%)`,
              }}
            />

            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-md border"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: secondaryColor,
              }}
            >
              <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
            </div>

            <h2
              className="text-lg sm:text-xl font-bold tracking-wider uppercase mb-2"
              style={{ color: textColor }}
            >
              IR A CHAT
            </h2>

            <p
              className="text-xs sm:text-sm font-light leading-relaxed mb-6"
              style={{ color: mutedTextColor }}
            >
              Conversación privada en tiempo real
            </p>

            <div
              className="mt-auto inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 group-hover:px-5"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: secondaryColor,
              }}
            >
              <span>Abrir chat</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>
        ) : (
          <div
            id="btn-menu-option-chat-disabled"
            className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-md backdrop-blur-md opacity-40 cursor-not-allowed overflow-hidden"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
            title="Chat no disponible para este usuario"
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xs border"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: mutedTextColor,
              }}
            >
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
            </div>

            <h2
              className="text-lg sm:text-xl font-bold tracking-wider uppercase mb-2"
              style={{ color: textColor }}
            >
              IR A CHAT
            </h2>

            <p
              className="text-xs sm:text-sm font-light leading-relaxed mb-6"
              style={{ color: mutedTextColor }}
            >
              No disponible
            </p>

            <div
              className="mt-auto inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
                color: mutedTextColor,
              }}
            >
              <span>No disponible</span>
            </div>
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
          className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border shadow-xl backdrop-blur-md transition-all cursor-pointer overflow-hidden"
          style={{
            backgroundColor: surfaceColor,
            borderColor: borderColor,
          }}
        >
          {/* Subtle Ambient Hover Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl sm:rounded-3xl"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${primaryColor}22 0%, transparent 70%)`,
            }}
          />

          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-md border"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: primaryColor,
            }}
          >
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.6]" />
          </div>

          <h2
            className="text-lg sm:text-xl font-bold tracking-wider uppercase mb-2"
            style={{ color: textColor }}
          >
            IR A TEXTO
          </h2>

          <p
            className="text-xs sm:text-sm font-light leading-relaxed mb-6"
            style={{ color: mutedTextColor }}
          >
            Leer tu texto personal
          </p>

          <div
            className="mt-auto inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 group-hover:px-5"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: primaryColor,
            }}
          >
            <span>Abrir texto</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};
