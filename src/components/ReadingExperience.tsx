import React from 'react';
import { motion } from 'motion/react';
import { Flower2, ArrowRight, MessageSquare } from 'lucide-react';
import type { UserExperienceData } from '../types';

interface ReadingExperienceProps {
  experience: UserExperienceData;
  onProceedToFlowers: () => void;
  onProceedToResponse?: () => void;
}

export const ReadingExperience: React.FC<ReadingExperienceProps> = ({
  experience,
  onProceedToFlowers,
  onProceedToResponse,
}) => {
  const isJhon = experience.id === 'jhon' || experience.username?.toLowerCase() === 'jhon';
  const theme = experience.theme || {};
  const isDarkTheme =
    theme.backgroundColor?.startsWith('#0') ||
    theme.backgroundColor?.startsWith('#1') ||
    isJhon;

  const primaryColor = theme.primaryColor?.trim() || (isDarkTheme ? '#0047AB' : '#2C2926');
  const secondaryColor = theme.secondaryColor?.trim() || (isDarkTheme ? '#3A86FF' : '#937C67');
  const accentColor = theme.accentColor?.trim() || (isDarkTheme ? '#F4D03F' : '#D4AF37');
  const surfaceColor =
    theme.surfaceColor?.trim() ||
    (isDarkTheme ? 'rgba(10, 18, 38, 0.88)' : 'rgba(255, 255, 255, 0.94)');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.3)' : '#E8E2D9';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const isSans = theme.fontStyle === 'sans';

  // EXACT manual text written by Ronald from admin panel. Strictly empty by default without AI text or filler.
  const rawText = experience.personalText || '';
  const hasText = rawText.trim().length > 0;

  const isLeiry = experience.id?.toLowerCase() === 'leiry' || experience.username?.toLowerCase() === 'leiry' || experience.name?.toLowerCase().includes('leiry');

  return (
    <div
      id="reading-experience-container"
      className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 transition-colors duration-700"
    >
      {/* Delicate Top Emblem */}
      <div className="text-center mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border mb-4 shadow-xs"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: secondaryColor,
          }}
        >
          <Flower2 className="w-5 h-5 stroke-[1.5]" />
        </motion.div>

        {!isLeiry && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className={`${
              isSans ? 'font-sans' : 'font-serif-display'
            } text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight`}
            style={{ color: textColor }}
          >
            {experience.name}
          </motion.h1>
        )}
      </div>

      {/* Main Letter Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="backdrop-blur-md rounded-2xl sm:rounded-3xl border shadow-sm p-6 sm:p-12 relative overflow-hidden transition-colors duration-500"
        style={{
          backgroundColor: surfaceColor,
          borderColor: borderColor,
        }}
      >
        {hasText ? (
          <div>
            {/* The EXACT text from Ronald, strictly preserving all formatting, line breaks, spaces */}
            <div
              className={`leading-relaxed text-lg sm:text-xl whitespace-pre-wrap font-normal ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{ color: textColor }}
            >
              {rawText}
            </div>

            {/* Clean action buttons */}
            <div
              className="mt-10 sm:mt-14 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ borderColor: isDarkTheme ? 'rgba(43, 120, 228, 0.2)' : '#F0EAE1' }}
            >
              <button
                id="btn-return-to-bouquet"
                type="button"
                onClick={onProceedToFlowers}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full border text-xs font-medium tracking-wide transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: subCardBg,
                }}
              >
                <Flower2 className="w-4 h-4" style={{ color: accentColor }} />
                <span>Volver a la flor</span>
              </button>

              {onProceedToResponse && (
                <button
                  id="btn-proceed-to-response"
                  type="button"
                  onClick={onProceedToResponse}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Terminar lectura y responder</span>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* When text is empty by default, indicate clearly without inventing any text */
          <div className="text-center py-10 px-4">
            <p className="text-sm sm:text-base font-serif italic mb-8 opacity-80" style={{ color: textColor }}>
              Aún no hay texto configurado para esta persona.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-proceed-direct-to-flower"
                type="button"
                onClick={onProceedToFlowers}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full border text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: subCardBg,
                }}
              >
                <Flower2 className="w-4 h-4" style={{ color: accentColor }} />
                <span>Volver a la flor</span>
              </button>

              {onProceedToResponse && (
                <button
                  id="btn-proceed-direct-to-response"
                  type="button"
                  onClick={onProceedToResponse}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Mi respuesta</span>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
