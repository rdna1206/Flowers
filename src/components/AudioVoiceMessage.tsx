import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';

interface AudioVoiceMessageProps {
  mediaUrl: string;
  duration?: number;
  isMe: boolean;
  accentColor?: string;
  createdAt?: string;
}

export const AudioVoiceMessage: React.FC<AudioVoiceMessageProps> = ({
  mediaUrl,
  duration: initialDuration,
  isMe,
  accentColor = '#25D366',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(initialDuration || 0);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.5 | 2>(1);
  const [hasError, setHasError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setTotalDuration(Math.round(audio.duration));
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedToggle = () => {
    const nextRate: 1 | 1.5 | 2 = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const progressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, (currentTime / totalDuration) * 100)) : 0;

  if (hasError) {
    return (
      <div className="flex items-center space-x-2 py-1 text-xs text-red-300">
        <Mic className="w-4 h-4 text-red-400 shrink-0" />
        <span>Audio no disponible</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1.5 min-w-[210px] sm:min-w-[240px] max-w-full py-0.5">
      <audio ref={audioRef} src={mediaUrl} preload="metadata" />

      <div className="flex items-center space-x-2.5">
        {/* Play / Pause Circular Button */}
        <button
          type="button"
          onClick={togglePlayPause}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md cursor-pointer shrink-0 ${
            isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#25D366] text-white hover:bg-[#20bd5a]'
          }`}
          title={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 ml-0.5 fill-current" />
          )}
        </button>

        {/* Track Bar & Visualizer */}
        <div className="flex-1 flex flex-col justify-center space-y-1">
          <div className="relative flex items-center h-4 group">
            {/* Background waveform mock bars */}
            <div className="absolute inset-0 flex items-center justify-between px-0.5 pointer-events-none opacity-40">
              {[35, 60, 40, 80, 50, 90, 30, 70, 45, 85, 60, 40, 75, 55, 95, 40, 65, 50].map(
                (height, i) => (
                  <div
                    key={i}
                    className="w-[2.5px] rounded-full transition-all"
                    style={{
                      height: `${height}%`,
                      backgroundColor:
                        progressPercent >= (i / 18) * 100
                          ? isMe
                            ? '#FFFFFF'
                            : accentColor
                          : isMe
                          ? 'rgba(255,255,255,0.4)'
                          : 'rgba(148, 163, 184, 0.4)',
                    }}
                  />
                )
              )}
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min={0}
              max={totalDuration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>

          {/* Time indicator and Speed multiplier */}
          <div className="flex items-center justify-between text-[10px]">
            <span className={isMe ? 'text-white/80 font-mono' : 'text-gray-400 font-mono'}>
              {isPlaying ? formatSeconds(currentTime) : formatSeconds(totalDuration)}
            </span>

            <button
              type="button"
              onClick={handleSpeedToggle}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono transition-colors cursor-pointer ${
                isMe
                  ? 'bg-white/15 text-white hover:bg-white/25'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              title="Cambiar velocidad de reproducción"
            >
              {playbackRate}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
