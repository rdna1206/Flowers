import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface NeoRoneoPlayerProps {
  audioUrl?: string;
  isDarkTheme?: boolean;
}

export const NeoRoneoPlayer: React.FC<NeoRoneoPlayerProps> = ({
  audioUrl = '/audio/neo_roneo.mp3',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasError(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn('Playback request prevented or waiting for interaction:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = parseFloat(e.target.value);
    audio.currentTime = target;
    setCurrentTime(target);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = val;
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
      audio.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      audio.muted = false;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      id="neo-roneo-player"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative z-30 w-full max-w-md mx-auto px-3 py-2"
    >
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#071427]/90 via-[#0A1B36]/90 to-[#071427]/90 border border-[#00E5FF]/30 shadow-[0_4px_24px_rgba(0,229,255,0.15)] backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 transition-all">
        {/* Glow ambient background highlight */}
        <div className="absolute inset-0 bg-radial from-[#00E5FF]/10 to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          {/* Left: Play/Pause button */}
          <motion.button
            id="btn-neo-roneo-toggle"
            type="button"
            onClick={togglePlay}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-linear-to-tr from-[#00E5FF] to-[#0284C7] text-[#030B17] shadow-[0_0_16px_rgba(0,229,255,0.6)]'
                : 'bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 text-[#00E5FF] border border-[#00E5FF]/40'
            }`}
            title={isPlaying ? 'Pausar' : 'Reproducir NEO RONEO'}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir NEO RONEO'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current stroke-[2]" />
            ) : (
              <Play className="w-4 h-4 fill-current stroke-[2] ml-0.5" />
            )}
          </motion.button>

          {/* Center: Track title & Visualizer */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center space-x-2 min-w-0">
                <Music className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#E2F1FF] truncate uppercase">
                  NEO RONEO
                </span>
              </div>

              {/* Animated aquatic frequency bars */}
              <div className="flex items-end space-x-0.5 h-3.5 shrink-0 px-1">
                {[40, 75, 100, 60, 90, 45].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isPlaying
                        ? {
                            height: [`${height * 0.25}%`, `${height}%`, `${height * 0.4}%`],
                          }
                        : { height: '20%' }
                    }
                    transition={
                      isPlaying
                        ? {
                            duration: 0.6 + (i % 3) * 0.15,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                          }
                        : { duration: 0.3 }
                    }
                    className="w-0.5 sm:w-1 bg-linear-to-t from-[#0284C7] to-[#00E5FF] rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Scrubber & Timers */}
            <div className="flex items-center space-x-2 w-full">
              <span className="text-[10px] font-mono text-[#90E0EF]/80 shrink-0">
                {formatTime(currentTime)}
              </span>
              <input
                id="neo-roneo-scrubber"
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 sm:h-1.5 bg-[#00E5FF]/20 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                aria-label="Progreso de reproducción"
              />
              <span className="text-[10px] font-mono text-[#90E0EF]/80 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Mute toggle & expandable controls */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              id="btn-neo-roneo-mute"
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#90E0EF] hover:text-[#00E5FF] transition-colors cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-md border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors cursor-pointer"
            >
              {isExpanded ? 'Menos' : 'Vol'}
            </button>
          </div>
        </div>

        {/* Expandable Volume Slider */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 pt-2 border-t border-[#00E5FF]/15 flex items-center justify-end space-x-2 overflow-hidden"
            >
              <span className="text-[10px] text-[#90E0EF]">Volumen:</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-[#00E5FF]/20 rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                aria-label="Control de volumen"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {hasError && (
          <div className="mt-1.5 text-center text-[10px] text-[#90E0EF]/70">
            Música lista. Pulsa reproducir para escuchar.
          </div>
        )}
      </div>
    </motion.div>
  );
};
