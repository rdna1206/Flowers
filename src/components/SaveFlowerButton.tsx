import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Image as ImageIcon,
  Film,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  exportFlowerAsImage,
  exportFlowerAsVideo,
  getSupportedVideoMimeType,
} from '../utils/flowerExporter';

interface SaveFlowerButtonProps {
  userName: string;
  stageContainerId?: string;
  svgElement?: SVGSVGElement | null;
  animationDurationMs: number;
  onReplayAnimation: () => void;
  ambientGlow?: string;
  className?: string;
}

type ModalState = 'idle' | 'processing-image' | 'recording-video' | 'success' | 'error';

export const SaveFlowerButton: React.FC<SaveFlowerButtonProps> = ({
  userName,
  stageContainerId,
  svgElement,
  animationDurationMs,
  onReplayAnimation,
  ambientGlow,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ModalState>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const supportedVideo = getSupportedVideoMimeType();

  const handleOpen = () => {
    setStatus('idle');
    setProgressPercent(0);
    setStatusMessage('');
    setErrorMessage('');
    setIsOpen(true);
  };

  const handleClose = () => {
    if (status === 'processing-image' || status === 'recording-video') {
      return; // Prevent closing while actively exporting
    }
    setIsOpen(false);
  };

  const handleSaveImage = async () => {
    try {
      setStatus('processing-image');
      setStatusMessage('Preparando tu flor en alta resolución...');
      setProgressPercent(30);

      await exportFlowerAsImage({
        userName,
        stageContainerId,
        svgElement,
        ambientColors: {
          glow: ambientGlow,
        },
      });

      setProgressPercent(100);
      setStatus('success');
      setStatusMessage('¡Tu flor ha sido guardada como imagen con éxito!');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2200);
    } catch (err: any) {
      console.error('Error al guardar imagen:', err);
      setStatus('error');
      setErrorMessage(
        err?.message || 'Ocurrió un inconveniente al guardar la imagen. Por favor, intenta de nuevo.'
      );
    }
  };

  const handleSaveVideo = async () => {
    try {
      setStatus('recording-video');
      setProgressPercent(0);
      setStatusMessage('Iniciando grabación de tu flor...');

      await exportFlowerAsVideo({
        userName,
        stageContainerId,
        svgElement,
        animationDurationMs,
        ambientColors: {
          glow: ambientGlow,
        },
        onReplay: onReplayAnimation,
        onProgress: (percent, msg) => {
          setProgressPercent(percent);
          setStatusMessage(msg);
        },
      });

      setStatus('success');
      setStatusMessage('¡Tu video con la animación ha sido guardado con éxito!');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2500);
    } catch (err: any) {
      console.error('Error al guardar video:', err);
      setStatus('error');
      setErrorMessage(
        err?.message || 'Ocurrió un inconveniente al generar el video. Te recomendamos la opción "Guardar como imagen".'
      );
    }
  };

  const isBusy = status === 'processing-image' || status === 'recording-video';

  return (
    <>
      {/* Elegante Botón Discreto 'Guardar Flor' */}
      <motion.button
        id="btn-save-flower-trigger"
        type="button"
        onClick={handleOpen}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        title="Guardar flor como recuerdo"
        className={`inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-[#0F172A]/90 hover:bg-[#1E293B] border border-[#F59E0B]/30 hover:border-[#F59E0B]/60 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-md transition-all cursor-pointer select-none ${className}`}
      >
        <Download className="w-4 h-4 text-[#F59E0B]" />
        <span>Guardar Flor</span>
      </motion.button>

      {/* Modal de Opciones de Guardado */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="save-flower-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isBusy) {
                handleClose();
              }
            }}
          >
            <motion.div
              id="save-flower-modal-content"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-2xl bg-[#090D16] border border-white/15 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#E6EDF8] overflow-hidden"
            >
              {/* Subtle Ambient Radial Glow inside Modal */}
              <div
                aria-hidden="true"
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#F59E0B]/15 blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#3B82F6]/15 blur-3xl pointer-events-none"
              />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-serif font-medium tracking-wide text-white">
                      Guardar Recuerdo Floral
                    </h3>
                    <p className="text-[11px] text-[#94A3B8]">
                      Conserva tu flor de {userName} para siempre
                    </p>
                  </div>
                </div>

                {!isBusy && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="mt-5 space-y-4 relative z-10">
                {/* State: Active Progress (Image or Video) */}
                {isBusy && (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#F59E0B] animate-spin" />
                      <Loader2 className="w-6 h-6 text-[#F59E0B] absolute animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white tracking-wide">
                        {statusMessage || 'Preparando tu flor...'}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {status === 'recording-video'
                          ? 'Grabando la coreografía completa de tu flor...'
                          : 'Procesando los detalles y pétalos de tu flor...'}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full max-w-xs bg-white/10 h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#F59E0B] to-[#38BDF8]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                )}

                {/* State: Success */}
                {status === 'success' && (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-white">{statusMessage}</p>
                    <p className="text-xs text-[#94A3B8]">
                      El archivo se ha descargado en tu dispositivo.
                    </p>
                  </div>
                )}

                {/* State: Error */}
                {status === 'error' && (
                  <div className="py-4 flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-red-200">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-all cursor-pointer"
                    >
                      Intentar de nuevo
                    </button>
                  </div>
                )}

                {/* State: Idle / Selection */}
                {status === 'idle' && (
                  <div className="space-y-3">
                    {/* Option 1: Guardar como Imagen */}
                    <button
                      id="btn-option-save-image"
                      type="button"
                      onClick={handleSaveImage}
                      className="w-full flex items-start space-x-3.5 p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#F59E0B]/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="p-3 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] group-hover:scale-105 transition-transform shrink-0">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-[#FDE047] transition-colors">
                            Guardar como imagen
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                            PNG HD
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                          Descarga una imagen de alta resolución con tu ramo completo, flores, tallos y fondo visual sin botones ni textos.
                        </p>
                      </div>
                    </button>

                    {/* Option 2: Guardar como Video */}
                    <button
                      id="btn-option-save-video"
                      type="button"
                      onClick={handleSaveVideo}
                      className="w-full flex items-start space-x-3.5 p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-[#38BDF8]/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="p-3 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] group-hover:scale-105 transition-transform shrink-0">
                        <Film className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-medium text-white group-hover:text-[#7DD3FC] transition-colors">
                            Guardar como video
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8]">
                            {supportedVideo.extension.toUpperCase() || 'VIDEO'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                          Graba y descarga la animación real de tu flor desde el principio hasta el florecimiento final de tu ramo.
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#64748B]">
                <span>Archivo autónomo descargable</span>
                <span>Calidad preservada</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
