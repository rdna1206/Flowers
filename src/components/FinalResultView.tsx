import React from 'react';
import { motion } from 'motion/react';
import { Flower2, Printer, BookOpen, LogOut, MessageSquare } from 'lucide-react';
import type { UserExperienceData, FlowerFormulation } from '../types';

interface FinalResultViewProps {
  experience: UserExperienceData;
  formulation: FlowerFormulation;
  onReturnToReading: () => void;
  onViewResponse?: () => void;
  onLogout: () => void;
}

export const FinalResultView: React.FC<FinalResultViewProps> = ({
  experience,
  formulation,
  onReturnToReading,
  onViewResponse,
  onLogout,
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
    (isDarkTheme ? 'rgba(10, 18, 38, 0.92)' : '#FFFFFF');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.35)' : '#E8E0D2';
  const innerBorderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.22)' : '#F2ECE4';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const bodyTextColor = isDarkTheme ? '#C8DBF4' : '#5C554E';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const buttonBg = isDarkTheme ? '#0B1736' : '#FFFFFF';
  const buttonBorder = isDarkTheme ? '#1E3A6E' : '#E2DBD2';
  const buttonText = isDarkTheme ? '#C8DBF4' : '#4A443D';
  const isSans = theme.fontStyle === 'sans';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="final-result-view-container"
      className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
    >
      {/* Screen Title */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border mb-3 shadow-xs"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: secondaryColor,
          }}
        >
          <Flower2 className="w-5 h-5 stroke-[1.4]" style={{ color: accentColor }} />
        </motion.div>
        <span
          className="text-[11px] uppercase tracking-widest font-semibold block"
          style={{ color: secondaryColor }}
        >
          Recuerdo Personal
        </span>
        <h1
          className={`${
            isSans ? 'font-sans' : 'font-serif-display'
          } text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight mt-1`}
          style={{ color: textColor }}
        >
          {experience.name}
        </h1>
      </div>

      {/* Keepsake Certificate Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        id="floral-keepsake-card"
        className="rounded-2xl sm:rounded-3xl border-2 shadow-sm p-8 sm:p-14 relative overflow-hidden print:border-none print:shadow-none print:p-0 transition-colors duration-500"
        style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
      >
        {/* Double subtle internal frame border */}
        <div
          className="border rounded-xl sm:rounded-2xl p-6 sm:p-10 relative"
          style={{ borderColor: innerBorderColor }}
        >
          {/* Corner floral accents */}
          <div className="absolute top-3 left-3 w-4 h-4 select-none" style={{ color: accentColor }}>✦</div>
          <div className="absolute top-3 right-3 w-4 h-4 select-none" style={{ color: accentColor }}>✦</div>
          <div className="absolute bottom-3 left-3 w-4 h-4 select-none" style={{ color: accentColor }}>✦</div>
          <div className="absolute bottom-3 right-3 w-4 h-4 select-none" style={{ color: accentColor }}>✦</div>

          <div className="text-center mb-8">
            <span
              className="text-[10px] uppercase tracking-widest block font-mono"
              style={{ color: secondaryColor }}
            >
              Composición Botánica
            </span>
            <h2
              className={`${
                isSans ? 'font-sans' : 'font-serif-display'
              } text-2xl sm:text-3xl font-semibold mt-1`}
              style={{ color: textColor }}
            >
              {formulation.title}
            </h2>
            <p
              className={`text-xs italic mt-1 ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{ color: secondaryColor }}
            >
              Diseñada exclusivamente para {experience.name}
            </p>
          </div>

          {/* Essence */}
          <div className="text-center max-w-lg mx-auto mb-8">
            <p
              className={`text-base sm:text-lg leading-relaxed italic ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{ color: textColor }}
            >
              "{formulation.essence}"
            </p>
          </div>

          {/* Flower Bouquet list */}
          <div className="space-y-4 my-8 max-w-md mx-auto">
            {formulation.flowers.map((flower, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 py-2.5 border-b last:border-none"
                style={{ borderColor: innerBorderColor }}
              >
                <div>
                  <h4
                    className={`${
                      isSans ? 'font-sans' : 'font-serif-display'
                    } text-base font-medium flex items-center space-x-1.5`}
                    style={{ color: textColor }}
                  >
                    <span>{flower.name}</span>
                    <span
                      className={`text-xs italic font-normal ${
                        isSans ? 'font-sans' : 'font-serif'
                      }`}
                      style={{ color: secondaryColor }}
                    >
                      ({flower.botanicalName})
                    </span>
                  </h4>
                  <p
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: bodyTextColor }}
                  >
                    {flower.meaning}
                  </p>
                </div>
                <span
                  className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border shrink-0"
                  style={{
                    color: secondaryColor,
                    borderColor: borderColor,
                    backgroundColor: subCardBg,
                  }}
                >
                  {flower.role}
                </span>
              </div>
            ))}
          </div>

          {/* Final Dedication */}
          <div
            className="mt-10 pt-6 border-t text-center max-w-lg mx-auto"
            style={{ borderColor: innerBorderColor }}
          >
            <p
              className={`text-sm sm:text-base leading-relaxed italic ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{ color: textColor }}
            >
              "{formulation.finalDedication}"
            </p>
          </div>

          <div
            className="mt-10 pt-6 flex items-center justify-between text-[11px] border-t border-dashed"
            style={{ borderColor: innerBorderColor, color: mutedTextColor }}
          >
            <div className="flex items-center space-x-1">
              <Flower2 className="w-3.5 h-3.5 stroke-[1.4]" />
            </div>
            <span>
              {new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Post-Completion Controls */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-colors shadow-xs cursor-pointer"
          style={{
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            color: buttonText,
          }}
        >
          <Printer className="w-4 h-4" />
          <span>Guardar o Imprimir Recuerdo</span>
        </button>

        {onViewResponse && (
          <button
            type="button"
            onClick={onViewResponse}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-colors shadow-xs cursor-pointer"
            style={{
              backgroundColor: buttonBg,
              borderColor: buttonBorder,
              color: buttonText,
            }}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mi Respuesta Personal</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReturnToReading}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium border transition-colors shadow-xs cursor-pointer"
          style={{
            backgroundColor: buttonBg,
            borderColor: buttonBorder,
            color: buttonText,
          }}
        >
          <BookOpen className="w-4 h-4" />
          <span>Releer mi Espacio</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-sm font-medium shadow transition-all hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <LogOut className="w-4 h-4" />
          <span>Finalizar y Salir</span>
        </button>
      </div>
    </div>
  );
};
