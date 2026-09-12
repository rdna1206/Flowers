import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Lock, Edit3, Flower2, BookOpen, Trash2 } from 'lucide-react';
import type { UserExperienceData, UserResponse } from '../types';

interface UserResponseViewProps {
  experience: UserExperienceData;
  onSubmitResponse: (text: string) => Promise<UserResponse | null>;
  onDeleteResponse?: () => Promise<boolean | void>;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
}

export const UserResponseView: React.FC<UserResponseViewProps> = ({
  experience,
  onSubmitResponse,
  onDeleteResponse,
  onBackToFlowers,
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
    (isDarkTheme ? 'rgba(10, 18, 38, 0.88)' : 'rgba(255, 255, 255, 0.95)');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.3)' : '#E8E2D9';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const innerCardBg = isDarkTheme ? 'rgba(15, 29, 62, 0.65)' : '#FAF8F5';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const dividerColor = isDarkTheme ? 'rgba(43, 120, 228, 0.2)' : '#F0EAE1';
  const isSans = theme.fontStyle === 'sans';

  const existingResponse = experience.userResponse;
  const [responseText, setResponseText] = useState(existingResponse?.text || '');
  const [isEditing, setIsEditing] = useState(!existingResponse);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<UserResponse | null>(
    existingResponse || null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await onSubmitResponse(responseText.trim());
      if (res) {
        setSubmittedResponse(res);
        setIsEditing(false);
        setSuccessToast(true);
        setTimeout(() => setSuccessToast(false), 4000);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'No se pudo enviar tu respuesta. Por favor intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteResponse) return;
    setIsSubmitting(true);
    try {
      await onDeleteResponse();
      setSubmittedResponse(null);
      setResponseText('');
      setIsEditing(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al eliminar la respuesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="user-response-view-container"
      className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
    >
      {/* Header with strictly EXACT title: "Mi respuesta" */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full border mb-3 shadow-2xs"
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
          } text-3xl sm:text-4xl font-normal tracking-tight`}
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
        className="backdrop-blur-md rounded-2xl sm:rounded-3xl border shadow-sm p-6 sm:p-10 relative overflow-hidden"
        style={{ backgroundColor: surfaceColor, borderColor: borderColor }}
      >
        {/* Privacy Note */}
        <div
          className="mb-6 p-3.5 rounded-xl border flex items-center space-x-2.5 text-xs"
          style={{
            backgroundColor: innerCardBg,
            borderColor: borderColor,
            color: mutedTextColor,
          }}
        >
          <Lock className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
          <span>Tu respuesta solo será vista por Ronald.</span>
        </div>

        {/* Success toast */}
        {successToast && (
          <div className="mb-5 p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>Respuesta guardada con éxito.</span>
          </div>
        )}

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs">
            {errorMessage}
          </div>
        )}

        {/* View / Edit Mode */}
        {submittedResponse && !isEditing ? (
          <div className="space-y-5">
            <div
              className="flex items-center justify-between pb-3 border-b"
              style={{ borderColor: dividerColor }}
            >
              <div className="flex items-center space-x-2 text-xs" style={{ color: secondaryColor }}>
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-medium">Respuesta enviada</span>
              </div>
              <span className="text-[11px]" style={{ color: mutedTextColor }}>
                {new Date(
                  submittedResponse.updatedAt || submittedResponse.submittedAt
                ).toLocaleString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div
              className={`p-4 sm:p-6 rounded-xl border text-base leading-relaxed whitespace-pre-wrap ${
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

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center space-x-1.5 text-xs py-2 px-3 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    backgroundColor: innerCardBg,
                  }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modificar</span>
                </button>

                {onDeleteResponse && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="inline-flex items-center space-x-1.5 text-xs py-2 px-3 rounded-lg border border-red-200 text-red-700 bg-red-50/70 hover:bg-red-100/70 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Borrar</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onBackToFlowers}
                  className="inline-flex items-center space-x-1.5 text-xs py-2 px-4 rounded-full border transition-colors cursor-pointer"
                  style={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    backgroundColor: innerCardBg,
                  }}
                >
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Volver a la flor</span>
                </button>

                <button
                  type="button"
                  onClick={onBackToReading}
                  className="inline-flex items-center space-x-1.5 text-xs py-2 px-4 rounded-full border transition-colors cursor-pointer"
                  style={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    backgroundColor: innerCardBg,
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Releer</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                id="user-response-textarea"
                required
                rows={6}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe aquí tu respuesta..."
                className={`w-full p-4 rounded-xl border text-sm sm:text-base leading-relaxed focus:outline-hidden transition-all resize-y ${
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
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={onBackToFlowers}
                  className="inline-flex items-center space-x-1.5 text-xs py-2 px-3 rounded-lg border transition-colors cursor-pointer"
                  style={{
                    borderColor: borderColor,
                    color: mutedTextColor,
                    backgroundColor: innerCardBg,
                  }}
                >
                  <Flower2 className="w-3.5 h-3.5" />
                  <span>Volver a la flor</span>
                </button>

                {submittedResponse && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs py-2 px-3 cursor-pointer"
                    style={{ color: mutedTextColor }}
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-submit-user-response"
                  type="submit"
                  disabled={isSubmitting || !responseText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full text-white text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all hover:opacity-95 disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    <span>Guardando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" style={{ color: accentColor }} />
                      <span>{submittedResponse ? 'Actualizar respuesta' : 'Enviar respuesta'}</span>
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
