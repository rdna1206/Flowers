import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Send, Play, Pause, AlertCircle, Loader2 } from 'lucide-react';

interface AudioVoiceRecorderProps {
  onSendAudio: (audioBlob: Blob, durationSeconds: number) => Promise<void>;
  onRecordingStateChange?: (isRecording: boolean) => void;
  onCancel: () => void;
  accentColor?: string;
  isDarkTheme?: boolean;
}

export const AudioVoiceRecorder: React.FC<AudioVoiceRecorderProps> = ({
  onSendAudio,
  onRecordingStateChange,
  onCancel,
  accentColor = '#25D366',
  isDarkTheme = true,
}) => {
  const [recordingStatus, setRecordingStatus] = useState<'requesting' | 'recording' | 'preview' | 'uploading' | 'error'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    startRecording();

    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (onRecordingStateChange) {
      onRecordingStateChange(false);
    }
  };

  const startRecording = async () => {
    try {
      setRecordingStatus('requesting');
      setErrorMessage(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta grabación de audio.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      // Determine supported mime type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType });
        setRecordedBlob(fullBlob);
        const url = URL.createObjectURL(fullBlob);
        setAudioUrl(url);
        setRecordingStatus('preview');
        if (onRecordingStateChange) onRecordingStateChange(false);
      };

      recorder.start(250); // Slice every 250ms
      setRecordingStatus('recording');
      setDuration(0);
      if (onRecordingStateChange) onRecordingStateChange(true);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      setRecordingStatus('error');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Permiso de micrófono denegado. Permite el acceso al micrófono en tu navegador.');
      } else {
        setErrorMessage(err.message || 'No se pudo iniciar el grabador de voz.');
      }
      if (onRecordingStateChange) onRecordingStateChange(false);
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCancel = () => {
    cleanup();
    onCancel();
  };

  const handleTogglePreviewPlay = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch(() => setIsPlayingPreview(false));
    }
  };

  const handleSend = async () => {
    if (!recordedBlob || recordingStatus === 'uploading') return;
    setRecordingStatus('uploading');
    try {
      await onSendAudio(recordedBlob, Math.max(1, duration));
      cleanup();
    } catch (err: any) {
      setRecordingStatus('preview');
      setErrorMessage(err.message || 'Error al enviar audio. Intenta de nuevo.');
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl border shadow-inner transition-all animate-in fade-in"
      style={{
        backgroundColor: isDarkTheme ? '#0F172A' : '#F1F5F9',
        borderColor: isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
      }}
    >
      {recordingStatus === 'requesting' && (
        <div className="flex items-center space-x-2 text-xs text-gray-400 py-1">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Iniciando micrófono...</span>
        </div>
      )}

      {recordingStatus === 'recording' && (
        <>
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-red-500 relative" />
            </div>
            <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
              {formatTime(duration)}
            </span>
            <div className="hidden sm:flex items-center space-x-1 pl-2">
              {[40, 70, 30, 90, 60, 100, 45, 80, 55, 75].map((h, i) => (
                <span
                  key={i}
                  className="w-0.5 rounded-full bg-red-400/80 animate-pulse"
                  style={{
                    height: `${h * 0.2}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 italic hidden xs:inline">Grabando audio...</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Cancelar grabación"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Stop / Finish recording */}
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
              title="Terminar y escuchar"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Listo</span>
            </button>
          </div>
        </>
      )}

      {recordingStatus === 'preview' && (
        <>
          {audioUrl && (
            <audio
              ref={previewAudioRef}
              src={audioUrl}
              onEnded={() => setIsPlayingPreview(false)}
            />
          )}
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={handleTogglePreviewPlay}
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-xs"
              title={isPlayingPreview ? 'Pausar vista previa' : 'Escuchar audio'}
            >
              {isPlayingPreview ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
              )}
            </button>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white">Audio listo</span>
              <span className="text-[10px] text-gray-400 font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Descartar audio"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="px-3.5 py-1.5 rounded-xl text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: accentColor }}
              title="Enviar nota de voz"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar audio</span>
            </button>
          </div>
        </>
      )}

      {recordingStatus === 'uploading' && (
        <div className="w-full flex items-center justify-center space-x-2 py-1 text-xs text-emerald-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Subiendo y enviando audio...</span>
        </div>
      )}

      {recordingStatus === 'error' && (
        <div className="w-full flex items-center justify-between space-x-2 text-xs text-red-300">
          <div className="flex items-center space-x-1.5 truncate">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="truncate">{errorMessage || 'Error de grabación'}</span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};
