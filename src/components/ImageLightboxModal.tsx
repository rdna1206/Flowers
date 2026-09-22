import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ZoomIn } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  caption?: string;
  senderName?: string;
  timestamp?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  imageUrl,
  caption,
  senderName,
  timestamp,
  onClose,
}) => {
  useEffect(() => {
    if (!imageUrl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center z-10 select-none"
        >
          {/* Top Bar with Controls */}
          <div className="w-full flex items-center justify-between px-3 py-2 text-white bg-black/40 rounded-t-2xl backdrop-blur-xs">
            <div className="flex flex-col text-left">
              {senderName && (
                <span className="text-xs font-semibold text-white truncate">{senderName}</span>
              )}
              {timestamp && (
                <span className="text-[10px] text-gray-400 font-mono">{timestamp}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={imageUrl}
                target="_blank"
                rel="noreferrer"
                download="foto_chat.jpg"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Abrir imagen en nueva pestaña"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-500/30 text-white transition-colors cursor-pointer"
                title="Cerrar vista"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* High Res Image */}
          <div className="relative flex items-center justify-center max-h-[75vh] w-full overflow-hidden bg-black/50 rounded-b-2xl border border-white/10 p-2">
            <img
              src={imageUrl}
              alt={caption || 'Foto de chat'}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Caption banner if provided */}
          {caption && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-black/70 border border-white/10 text-white text-xs sm:text-sm text-center max-w-lg shadow-lg">
              {caption}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
