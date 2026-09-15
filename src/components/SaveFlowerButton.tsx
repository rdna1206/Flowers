import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Loader2, Check } from 'lucide-react';
import { exportFlowerAsImage } from '../utils/flowerExporter';

interface SaveFlowerButtonProps {
  userName: string;
  stageContainerId?: string;
  svgElement?: SVGSVGElement | null;
  animationDurationMs?: number;
  onReplayAnimation?: () => void;
  ambientGlow?: string;
  className?: string;
}

export const SaveFlowerButton: React.FC<SaveFlowerButtonProps> = ({
  userName,
  stageContainerId,
  svgElement,
  ambientGlow,
  className = '',
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setIsSuccess(false);

      await exportFlowerAsImage({
        userName,
        stageContainerId,
        svgElement,
        ambientColors: {
          glow: ambientGlow,
        },
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error al descargar flor:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.button
      id={`btn-download-flower-${userName.toLowerCase()}`}
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={!isDownloading ? { scale: 1.05 } : {}}
      whileTap={!isDownloading ? { scale: 0.95 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      title={`Descargar imagen de flor para ${userName}`}
      className={`inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-[#18181B]/90 hover:bg-[#27272A] border border-white/20 hover:border-amber-400/50 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all cursor-pointer select-none disabled:opacity-75 disabled:cursor-wait ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Descargando...</span>
        </>
      ) : isSuccess ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>¡Descargado!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-amber-400" />
          <span>Descargar</span>
        </>
      )}
    </motion.button>
  );
};
