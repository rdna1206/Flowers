import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageSendPreviewModalProps {
  imageFile: File | null;
  onSendImage: (file: File, caption: string) => Promise<void>;
  onClose: () => void;
  accentColor?: string;
}

export const ImageSendPreviewModal: React.FC<ImageSendPreviewModalProps> = ({
  imageFile,
  onSendImage,
  onClose,
  accentColor = '#25D366',
}) => {
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!imageFile) return null;

  const previewUrl = URL.createObjectURL(imageFile);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imageFile || isUploading) return;

    setIsUploading(true);
    setError(null);
    try {
      await onSendImage(imageFile, caption.trim());
      URL.revokeObjectURL(previewUrl);
      onClose();
    } catch (err: any) {
      console.error('Error sending photo:', err);
      setError(err.message || 'Error al subir la imagen. Intenta de nuevo.');
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    URL.revokeObjectURL(previewUrl);
    onClose();
  };

  const fileSizeFormatted = (imageFile.size / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
        <div className="absolute inset-0" onClick={!isUploading ? handleCancel : undefined} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-md w-full bg-[#0F172A] border border-white/15 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#151F33]">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Vista previa de la foto</span>
              <span className="text-[10px] text-gray-400 font-mono">({fileSizeFormatted})</span>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-30"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Image Container */}
          <div className="relative p-3 bg-black/60 flex items-center justify-center max-h-[50vh] overflow-hidden">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="max-h-[46vh] max-w-full object-contain rounded-xl shadow-lg border border-white/10"
            />
          </div>

          {error && (
            <div className="px-4 py-2 bg-red-950/60 border-t border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Caption input and Action buttons */}
          <form onSubmit={handleSend} className="p-3.5 bg-[#0F172A] flex flex-col space-y-3">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Añade un comentario a la foto (opcional)..."
              disabled={isUploading}
              className="w-full bg-[#1E293B] text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:border-emerald-400 focus:outline-hidden placeholder-gray-400 transition-colors shadow-inner"
            />

            <div className="flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center space-x-1.5 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Subiendo foto...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar foto</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
