import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flower2, Sparkles, Wand2, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import type { UserExperienceData, FlowerFormulation as FlowerFormulationType } from '../types';

interface FlowerFormulationProps {
  experience: UserExperienceData;
  onFormulate: () => Promise<FlowerFormulationType | null>;
  onProceedToResponse: (formulation: FlowerFormulationType) => void;
  onBackToReading: () => void;
}

export const FlowerFormulation: React.FC<FlowerFormulationProps> = ({
  experience,
  onFormulate,
  onProceedToResponse,
  onBackToReading,
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
  const innerCardBg = isDarkTheme ? 'rgba(15, 29, 62, 0.65)' : 'rgba(250, 248, 245, 0.8)';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const bodyTextColor = isDarkTheme ? '#C8DBF4' : '#5C554E';
  const dividerColor = isDarkTheme ? 'rgba(43, 120, 228, 0.2)' : '#F0EAE1';
  const isSans = theme.fontStyle === 'sans';

  const [formulation, setFormulation] = useState<FlowerFormulationType | null>(
    experience.savedFormulation
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const result = await onFormulate();
      if (result) {
        setFormulation(result);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Ocurrió un error al preparar tu formulación floral. Inténtalo de nuevo.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      id="flower-formulation-container"
      className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border mb-4 shadow-xs"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: secondaryColor,
          }}
        >
          <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
        </motion.div>
        <h1
          className={`${
            isSans ? 'font-sans' : 'font-serif-display'
          } text-3xl sm:text-4xl font-normal tracking-tight`}
          style={{ color: textColor }}
        >
          Formulación Floral Individual
        </h1>
        <p
          className="text-xs sm:text-sm uppercase tracking-widest mt-2"
          style={{ color: secondaryColor }}
        >
          Personalizada exclusivamente para {experience.name}
        </p>
      </div>

      {/* State 1: Not yet formulated -> Invite to formulate */}
      {!formulation && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md rounded-2xl sm:rounded-3xl border p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
        >
          <div
            className="w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: subCardBg,
              borderColor: borderColor,
              color: secondaryColor,
            }}
          >
            <Flower2 className="w-8 h-8" />
          </div>

          <h2
            className={`${
              isSans ? 'font-sans' : 'font-serif-display'
            } text-2xl mb-3`}
            style={{ color: textColor }}
          >
            {isJhon ? 'Formulación Botánica Reservada' : 'El Secreto de tu Esencia'}
          </h2>

          <p
            className="text-sm leading-relaxed mb-6 font-sans max-w-md mx-auto"
            style={{ color: mutedTextColor }}
          >
            {isJhon
              ? 'La formulación de flores para Jhon será definida posteriormente utilizando su perfilamiento y las instrucciones específicas que proporcione Ronald. Cada elemento floral reflejará armonía, precisión y misterio.'
              : 'A través de tus preferencias botánicas y perfil personal, se determinará una sinergia floral única concebida exclusivamente para ti.'}
          </p>

          {errorMessage && (
            <div className="mb-6 p-3 rounded-lg bg-[#FDF2F0] border border-[#F5C6CB] text-xs text-[#902A24]">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBackToReading}
              className="text-xs py-2 px-4 transition-colors cursor-pointer"
              style={{ color: mutedTextColor }}
            >
              Volver a leer mi espacio
            </button>
            <button
              id="btn-trigger-formulation"
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-white text-sm font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Wand2 className="w-4 h-4" style={{ color: accentColor }} />
              <span>{isJhon ? 'Sintetizar Formulación Floral' : 'Realizar mi Formulación Floral'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* State 2: Generating animation */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="backdrop-blur-md rounded-2xl sm:rounded-3xl border p-12 text-center max-w-xl mx-auto shadow-sm"
          style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
        >
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-2 border-t-transparent animate-spin"
              style={{
                borderColor: 'rgba(232, 223, 200, 0.4)',
                borderTopColor: accentColor,
              }}
            />
            <Flower2
              className="w-8 h-8 animate-pulse"
              style={{ color: secondaryColor }}
            />
          </div>
          <h2
            className={`${
              isSans ? 'font-sans' : 'font-serif-display'
            } text-2xl mb-2`}
            style={{ color: textColor }}
          >
            Entrelazando flores y esencias...
          </h2>
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: mutedTextColor }}
          >
            Configurando la selección botánica personalizada para {experience.name}.
          </p>
        </motion.div>
      )}

      {/* State 3: Formulation ready */}
      {formulation && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Main Formulation Card */}
          <div
            className="backdrop-blur-md rounded-2xl sm:rounded-3xl border p-6 sm:p-10 shadow-sm relative overflow-hidden"
            style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
          >
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b"
              style={{ borderColor: dividerColor }}
            >
              <div>
                <span
                  className="text-[11px] font-medium uppercase tracking-widest"
                  style={{ color: secondaryColor }}
                >
                  Composición Personal
                </span>
                <h2
                  className={`${
                    isSans ? 'font-sans' : 'font-serif-display'
                  } text-2xl sm:text-3xl font-normal mt-1`}
                  style={{ color: textColor }}
                >
                  {formulation.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  backgroundColor: subCardBg,
                  color: mutedTextColor,
                }}
                title="Generar nueva variación floral"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reformular</span>
              </button>
            </div>

            {/* Essence Quote */}
            <div
              className={`my-6 p-4 sm:p-6 rounded-xl border-l-2 italic text-base sm:text-lg leading-relaxed ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{
                backgroundColor: innerCardBg,
                borderLeftColor: accentColor,
                color: textColor,
              }}
            >
              "{formulation.essence}"
            </div>

            {/* Flowers Grid */}
            <div className="mt-8">
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: secondaryColor }}
              >
                Flores Seleccionadas para ti
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulation.flowers.map((flower, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border transition-all"
                    style={{
                      backgroundColor: innerCardBg,
                      borderColor: borderColor,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs border border-white"
                          style={{ backgroundColor: flower.color || accentColor }}
                        />
                        <h4
                          className={`${
                            isSans ? 'font-sans' : 'font-serif-display'
                          } text-lg font-medium`}
                          style={{ color: textColor }}
                        >
                          {flower.name}
                        </h4>
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          color: secondaryColor,
                          borderColor: borderColor,
                          backgroundColor: subCardBg,
                        }}
                      >
                        {flower.role}
                      </span>
                    </div>

                    <p
                      className="text-xs italic mb-2 font-serif"
                      style={{ color: mutedTextColor }}
                    >
                      {flower.botanicalName}
                    </p>

                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: bodyTextColor }}
                    >
                      {flower.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Synergy */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: dividerColor }}>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: secondaryColor }}
              >
                Sinergia Floral
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: bodyTextColor }}>
                {formulation.synergy}
              </p>
            </div>

            {/* Dedication */}
            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: dividerColor }}>
              <p
                className={`text-sm italic leading-relaxed ${
                  isSans ? 'font-sans' : 'font-serif'
                }`}
                style={{ color: textColor }}
              >
                "{formulation.finalDedication}"
              </p>
            </div>
          </div>

          {/* Action to proceed to user response step */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onBackToReading}
              className="text-xs py-2 px-4 transition-colors cursor-pointer"
              style={{ color: mutedTextColor }}
            >
              Volver a leer mi espacio
            </button>

            <button
              id="btn-proceed-to-response"
              type="button"
              onClick={() => onProceedToResponse(formulation)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full text-white text-sm font-medium tracking-wide shadow-md hover:shadow-lg transition-all hover:opacity-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
              <span>Escribir mi Respuesta Personal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
