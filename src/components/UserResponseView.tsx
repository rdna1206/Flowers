import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Lock, Flower2, BookOpen, MessageSquare } from 'lucide-react';
import type { UserExperienceData, UserResponse } from '../types';

interface UserResponseViewProps {
  experience: UserExperienceData;
  onSubmitResponse: (text: string) => Promise<UserResponse | null>;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
  onProceedToChat?: () => void;
}

export const UserResponseView: React.FC<UserResponseViewProps> = ({
  experience,
  onSubmitResponse,
  onBackToFlowers,
  onBackToReading,
  onProceedToChat,
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
    (isDarkTheme ? 'rgba(10, 18, 38, 0.88)' : 'rgba(255, 255, 255, 0.95)');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.3)' : '#E8E2D9';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const innerCardBg = isDarkTheme ? 'rgba(15, 29, 62, 0.65)' : '#FAF8F5';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const dividerColor = isDarkTheme ? 'rgba(43, 120, 228, 0.2)' : '#F0EAE1';
  const isSans = theme.fontStyle === 'sans';

  const existingResponse = experience.userResponse;
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<UserResponse | null>(
    existingResponse && existingResponse.text && existingResponse.text.trim().length > 0
      ? existingResponse
      : null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || isSubmitting || submittedResponse) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await onSubmitResponse(responseText.trim());
      if (res) {
        setSubmittedResponse(res);
        if (experience.id === 'isaias' && onProceedToChat) {
          onProceedToChat();
          return;
        }
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 4500);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'No se pudo enviar tu respuesta. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="user-response-view-container"
      className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14"
    >
      {/* Header with strictly EXACT title: "Mi respuesta" */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border mb-3 shadow-2xs"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: secondaryColor,
          }}
        >
          <Flower2 className="w-5 h-5 stroke-[1.4]" />
        </motion.div>

        {/* Mandatory exact title */}
        <h1
          className={`${
            isSans ? 'font-sans' : 'font-serif-display'
          } text-2xl sm:text-4xl font-normal tracking-tight`}
          style={{ color: textColor }}
        >
          Mi respuesta
        </h1>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-md rounded-2xl sm:rounded-3xl border shadow-sm p-5 sm:p-9 relative overflow-hidden"
        style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
      >
        {/* Privacy Note */}
        <div
          className="mb-5 p-3 rounded-xl border flex items-center space-x-2 text-xs"
          style={{
            backgroundColor: innerCardBg,
            borderColor: borderColor,
            color: mutedTextColor,
          }}
        >
          <Lock className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
          <span className="leading-snug">
            {submittedResponse
              ? 'Tu respuesta ya fue enviada y solo es visible para Ronald.'
              : 'Tu respuesta solo será vista por Ronald.'}
          </span>
        </div>

        {/* Success toast */}
        {successToast && (
          <div className="mb-5 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>Respuesta enviada con éxito. Ha quedado guardada de forma definitiva.</span>
          </div>
        )}

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* PERMANENT READ-ONLY MODE (NO EDIT, NO DELETE, NO REPLACE) */}
        {submittedResponse ? (
          <div className="space-y-5">
            <div
              className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
              style={{ borderColor: dividerColor }}
            >
              <div className="flex items-center space-x-2 text-xs" style={{ color: secondaryColor }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">Respuesta enviada</span>
              </div>
              <span className="text-[11px] font-mono" style={{ color: mutedTextColor }}>
                {new Date(
                  submittedResponse.updatedAt || submittedResponse.submittedAt
                ).toLocaleString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Read-only content */}
            <div
              className={`p-4 sm:p-6 rounded-xl border text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words ${
                isSans ? 'font-sans' : 'font-serif'
              }`}
              style={{
                backgroundColor: innerCardBg,
                borderColor: borderColor,
                color: textColor,
              }}
            >
              {submittedResponse.text}
            </div>

            {/* Simple navigation controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onBackToFlowers}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs py-2.5 px-4 rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: innerCardBg,
                }}
              >
                <Flower2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span>Volver a la flor</span>
              </button>

              <button
                type="button"
                onClick={onBackToReading}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs py-2.5 px-4 rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: innerCardBg,
                }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Releer</span>
              </button>

              {(experience.id === 'isaias' || experience.id === 'jhon') && onProceedToChat && (
                <button
                  type="button"
                  onClick={onProceedToChat}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs py-2.5 px-4 rounded-full border transition-all cursor-pointer font-medium"
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    backgroundColor: innerCardBg,
                  }}
                  title="Chat con Ronald"
                >
                  <MessageSquare className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span>Chat</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* WRITE MODE (AVAILABLE ONLY ONCE BEFORE SUBMITTING) */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                id="user-response-textarea"
                required
                rows={6}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe aquí tu respuesta..."
                disabled={isSubmitting}
                className={`w-full p-4 rounded-xl border text-sm sm:text-base leading-relaxed focus:outline-hidden transition-all resize-y break-words ${
                  isSans ? 'font-sans' : 'font-serif'
                }`}
                style={{
                  backgroundColor: innerCardBg,
                  borderColor: borderColor,
                  color: textColor,
                }}
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onBackToFlowers}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs py-2.5 px-4 rounded-full border transition-colors cursor-pointer"
                  style={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    backgroundColor: innerCardBg,
                  }}
                >
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Volver a la flor</span>
                </button>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  id="btn-submit-user-response"
                  type="submit"
                  disabled={isSubmitting || !responseText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3 rounded-full text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" style={{ color: accentColor }} />
                      <span>Enviar respuesta</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
