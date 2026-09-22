import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  X,
  CheckCheck,
  Trash2,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  Mic,
} from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserRecord, ChatPresenceState } from '../types';
import { getChatDateSeparator, getMessageDayKey } from '../lib/dateUtils';
import { AudioVoiceMessage } from './AudioVoiceMessage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { AudioVoiceRecorder } from './AudioVoiceRecorder';
import { ImageSendPreviewModal } from './ImageSendPreviewModal';

interface WhatsAppAdminChatModalProps {
  user: UserRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAdminChatModal: React.FC<WhatsAppAdminChatModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);
  const [presence, setPresence] = useState<ChatPresenceState>({});

  // Media modals state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    caption?: string;
    senderName?: string;
    timestamp?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Personalized theme extraction from the user's custom flower profile
  const theme = user?.theme || {};
  const primaryColor = theme.primaryColor?.trim() || '#00E5FF';
  const secondaryColor = theme.secondaryColor?.trim() || '#0284C7';
  const accentColor = theme.accentColor?.trim() || '#38BDF8';
  const ambientGlow = theme.ambientGlow || 'rgba(0, 229, 255, 0.25)';

  useEffect(() => {
    if (!isOpen || !user) return;
    setShowClearConfirm(false);
    setIsRecordingVoice(false);
    setSelectedPhotoFile(null);
    setLightboxData(null);
    const chatId = user.id;

    // 1. Mark Ronald as active/present inside this specific user's chat
    api.setUserChatPresence(chatId, 'admin', true).catch(() => {});

    // 2. Start heartbeat while Ronald has this modal open
    const heartbeatInterval = setInterval(() => {
      api.updateUserChatHeartbeat(chatId, 'admin').catch(() => {});
    }, 8000);

    let unsubscribeChat: (() => void) | undefined;
    let unsubscribePresence: (() => void) | undefined;

    const setupChat = async () => {
      try {
        await api.ensureUserChatInitialized(chatId);
      } catch {
        // non-blocking
      }

      unsubscribeChat = api.subscribeToChat(
        chatId,
        (liveMessages) => {
          setMessages(liveMessages);
        },
        () => {
          // silent fallback
        }
      );

      unsubscribePresence = api.subscribeToChatPresence(
        chatId,
        (livePresence) => {
          setPresence(livePresence);
        }
      );
    };

    setupChat();

    // Focus input on open
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    // Disconnect cleanup on pagehide / beforeunload / visibility change
    const handleLeave = () => {
      api.setUserChatPresence(chatId, 'admin', false).catch(() => {});
      api.setUserChatTyping(chatId, 'admin', false).catch(() => {});
      api.setUserChatRecording(chatId, 'admin', false).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        api.setUserChatPresence(chatId, 'admin', false).catch(() => {});
        api.setUserChatTyping(chatId, 'admin', false).catch(() => {});
        api.setUserChatRecording(chatId, 'admin', false).catch(() => {});
      } else if (document.visibilityState === 'visible') {
        api.setUserChatPresence(chatId, 'admin', true).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (unsubscribeChat) unsubscribeChat();
      if (unsubscribePresence) unsubscribePresence();
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      api.setUserChatPresence(chatId, 'admin', false).catch(() => {});
      api.setUserChatTyping(chatId, 'admin', false).catch(() => {});
      api.setUserChatRecording(chatId, 'admin', false).catch(() => {});
    };
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, presence.userTyping, presence.userRecording]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (!user) return;
    const hasText = val.trim().length > 0;

    if (hasText) {
      api.setUserChatTyping(user.id, 'admin', true).catch(() => {});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        api.setUserChatTyping(user.id, 'admin', false).catch(() => {});
      }, 2500);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      api.setUserChatTyping(user.id, 'admin', false).catch(() => {});
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !user || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    api.setUserChatTyping(user.id, 'admin', false).catch(() => {});

    setIsSending(true);
    setInputText('');

    try {
      await api.sendChatMessage(user.id, trimmed, 'admin', 'ronald', 'Ronald');
    } catch {
      setInputText(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  // Photo Attachment Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen seleccionada supera el límite de 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedPhotoFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmSendPhoto = async (file: File, caption: string) => {
    if (!user) return;
    const uploadRes = await api.uploadChatMedia(user.id, file, 'images', file.name);
    await api.sendChatMessage(
      user.id,
      {
        type: 'image',
        text: caption,
        mediaUrl: uploadRes.url,
        fileName: uploadRes.fileName,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
      },
      'admin',
      'ronald',
      'Ronald'
    );
  };

  // Audio Voice Note Handler
  const handleRecordingStateChange = (isRecording: boolean) => {
    if (!user) return;
    api.setUserChatRecording(user.id, 'admin', isRecording).catch(() => {});
  };

  const handleConfirmSendAudio = async (audioBlob: Blob, durationSeconds: number) => {
    if (!user) return;
    const uploadRes = await api.uploadChatMedia(user.id, audioBlob, 'audios', `voice_${Date.now()}.webm`);
    await api.sendChatMessage(
      user.id,
      {
        type: 'audio',
        text: 'Mensaje de voz',
        mediaUrl: uploadRes.url,
        fileName: uploadRes.fileName,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
        audioDuration: durationSeconds,
      },
      'admin',
      'ronald',
      'Ronald'
    );
    setIsRecordingVoice(false);
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!user || deletingMsgId) return;
    setDeletingMsgId(msgId);
    try {
      await api.deleteChatMessage(user.id, msgId);
    } catch (err) {
      console.error('Error deleting message:', err);
    } finally {
      setDeletingMsgId(null);
    }
  };

  const handleClearChat = async () => {
    if (!user || isClearing) return;
    setIsClearing(true);
    try {
      await api.clearChatHistory(user.id);
      setShowClearConfirm(false);
    } catch (err) {
      console.error('Error clearing chat:', err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div
        id="admin-dark-chat-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg h-[90vh] max-h-[720px] bg-[#0A0E17] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
          style={{
            boxShadow: `0 0 50px -10px ${ambientGlow}, 0 25px 50px -12px rgba(0, 0, 0, 0.85)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar with User's Personalized Colors */}
          <div
            className="px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-white/10 backdrop-blur-md relative"
            style={{
              background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(11, 15, 25, 0.98))`,
            }}
          >
            {/* Top Color Accent Line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2.5px]"
              style={{
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
              }}
            />

            <div className="flex items-center space-x-3 min-w-0">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md shrink-0 border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 15px ${ambientGlow}`,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="leading-tight min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-base text-white tracking-wide truncate">
                    {user.name}
                  </h3>
                  <span className="text-[11px] text-gray-400 font-mono">
                    @{user.username}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-0.5">
                  {presence.userRecording ? (
                    <span className="flex items-center space-x-1.5 text-[11px] text-red-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span className="animate-pulse">{user.name} está grabando un audio...</span>
                    </span>
                  ) : presence.userTyping ? (
                    <span className="flex items-center space-x-1.5 text-[11px] text-[#25D366] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                      <span className="animate-pulse">{user.name} está escribiendo...</span>
                    </span>
                  ) : presence.userInChat ? (
                    <span className="flex items-center space-x-1.5 text-[11px] text-[#25D366] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      <span>{user.name} se encuentra en este chat</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1.5 text-[11px] text-gray-400 font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500/60" />
                      <span>Fuera del chat</span>
                    </span>
                  )}
                  <span className="text-[10px] text-white/40">•</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.2 rounded-full border border-white/10"
                    style={{
                      color: accentColor,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    Flor personalizada
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Clear Chat + Close */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                disabled={messages.length === 0}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                title="Vaciar chat / Borrar mensajes de prueba"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Confirm Clear Chat Modal Banner */}
          {showClearConfirm && (
            <div className="bg-[#2D1215] border-b border-red-500/30 p-3 px-4 flex items-center justify-between text-xs text-red-200 shrink-0">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>¿Vaciar todos los mensajes de prueba con {user.name}?</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 text-xs text-gray-300 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  disabled={isClearing}
                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isClearing ? 'Borrando...' : 'Sí, vaciar'}
                </button>
              </div>
            </div>
          )}

          {/* Dark Mode Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col custom-scrollbar"
            style={{
              backgroundColor: '#070A10',
              backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Ambient Date Marker */}
            <div className="flex justify-center my-1">
              <span className="bg-[#131B2A]/80 border border-white/10 text-[#94A3B8] text-[11px] font-medium px-3.5 py-1 rounded-full backdrop-blur-xs shadow-2xs">
                Conversación encriptada y privada
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    color: accentColor,
                  }}
                >
                  <MessageSquare className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="max-w-xs space-y-1">
                  <p className="text-sm font-medium text-white">
                    Sin mensajes aún
                  </p>
                  <p className="text-xs text-[#8C847B] leading-relaxed">
                    Cuando <span className="text-white font-medium">{user.name}</span> envíe su respuesta en «Mi respuesta» o escriba un mensaje, aparecerá aquí al instante en tiempo real.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isFromRonald =
                  msg.senderRole === 'admin' || msg.senderId === 'ronald';

                const prevMsg = index > 0 ? messages[index - 1] : null;
                const currentDateKey = getMessageDayKey(msg.createdAt || msg.timestamp);
                const prevDateKey = prevMsg
                  ? getMessageDayKey(prevMsg.createdAt || prevMsg.timestamp)
                  : null;
                const isNewDay = index === 0 || currentDateKey !== prevDateKey;
                const dateLabel = getChatDateSeparator(msg.createdAt || msg.timestamp);

                return (
                  <React.Fragment key={msg.id}>
                    {/* Centered Date Separator Pill */}
                    {isNewDay && (
                      <div className="flex justify-center my-2">
                        <span className="bg-[#131B2A]/90 border border-white/10 text-[#94A3B8] text-[11px] font-medium px-3.5 py-1 rounded-full shadow-2xs backdrop-blur-xs">
                          {dateLabel}
                        </span>
                      </div>
                    )}

                    <div
                      className={`group/msg flex flex-col ${
                        isFromRonald ? 'items-end' : 'items-start'
                      } w-full relative`}
                    >
                    <div className="flex items-end gap-1.5 max-w-[90%] sm:max-w-[82%]">
                      {/* Left side trash icon for Ronald's outgoing messages */}
                      {isFromRonald && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingMsgId === msg.id}
                          className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="Borrar mensaje de prueba"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Message Bubble (Text / Image / Audio) */}
                      <div
                        className={`rounded-2xl text-sm leading-relaxed relative shadow-md transition-all ${
                          msg.type === 'image'
                            ? 'p-2'
                            : 'px-4 py-2.5'
                        } ${
                          isFromRonald
                            ? 'bg-[#005C4B] text-white rounded-tr-xs border border-emerald-400/25'
                            : 'bg-[#151E2E] text-[#F1F5F9] rounded-tl-xs border border-white/10'
                        }`}
                        style={
                          !isFromRonald
                            ? {
                                borderLeft: `3px solid ${primaryColor}`,
                              }
                            : {}
                        }
                      >
                        {/* Header tag in bubble for user */}
                        {!isFromRonald && (
                          <div className="flex items-center space-x-1.5 mb-1">
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: primaryColor }}
                            >
                              {user.name}
                            </span>
                            {msg.isOriginalResponse && (
                              <span
                                className="text-[9px] font-medium px-1.5 py-0.2 rounded-md border border-white/10"
                                style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  color: accentColor,
                                }}
                              >
                                Respuesta enviada
                              </span>
                            )}
                          </div>
                        )}

                        {/* CASE 1: IMAGE MESSAGE */}
                        {msg.type === 'image' && msg.mediaUrl ? (
                          <div className="flex flex-col space-y-1.5 max-w-[280px] sm:max-w-[320px]">
                            <div
                              onClick={() =>
                                setLightboxData({
                                  url: msg.mediaUrl!,
                                  caption: msg.text !== 'Foto' ? msg.text : undefined,
                                  senderName: isFromRonald ? 'Ronald' : user.name,
                                  timestamp: formatTime(msg.createdAt),
                                })
                              }
                              className="relative overflow-hidden rounded-xl bg-black/40 cursor-pointer group/img border border-white/10"
                            >
                              <img
                                src={msg.mediaUrl}
                                alt={msg.text || 'Foto'}
                                className="w-full max-h-[260px] object-cover transition-transform duration-300 group-hover/img:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                <span className="bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-xs font-medium">
                                  Ver foto
                                </span>
                              </div>
                            </div>
                            {msg.text && msg.text !== 'Foto' && (
                              <p className="whitespace-pre-wrap break-words px-1 text-xs sm:text-sm text-white/95">
                                {msg.text}
                              </p>
                            )}
                          </div>
                        ) : msg.type === 'audio' && msg.mediaUrl ? (
                          /* CASE 2: AUDIO VOICE NOTE */
                          <div className="flex flex-col">
                            <AudioVoiceMessage
                              mediaUrl={msg.mediaUrl}
                              duration={msg.audioDuration}
                              isMe={isFromRonald}
                              accentColor={accentColor}
                            />
                          </div>
                        ) : (
                          /* CASE 3: STANDARD TEXT MESSAGE */
                          <p className="whitespace-pre-wrap break-words pr-1 text-sm">
                            {msg.text}
                          </p>
                        )}

                        <div className="flex items-center justify-end space-x-1.5 mt-1 -mb-0.5">
                          <span className="text-[10px] text-gray-300 font-mono">
                            {formatTime(msg.createdAt || (msg as any).timestamp)}
                          </span>
                          {isFromRonald && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#38BDF8]" />
                          )}
                        </div>
                      </div>

                      {/* Right side trash icon for User's incoming messages */}
                      {!isFromRonald && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          disabled={deletingMsgId === msg.id}
                          className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer shrink-0"
                          title="Borrar respuesta de prueba"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}

            {/* Real-time Indicator: User recording audio */}
            {presence.userRecording && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start w-full"
              >
                <div
                  className="px-4 py-2.5 rounded-2xl text-xs rounded-tl-xs border border-red-500/20 flex items-center space-x-2.5 shadow-md bg-[#1F1418] text-red-200"
                  style={{
                    borderLeft: `3px solid #EF4444`,
                  }}
                >
                  <div className="flex space-x-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  </div>
                  <span className="text-xs text-red-300 font-medium">
                    {user.name} está grabando un audio...
                  </span>
                </div>
              </motion.div>
            )}

            {/* Real-time Indicator: User typing text */}
            {presence.userTyping && !presence.userRecording && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start w-full"
              >
                <div
                  className="px-4 py-2.5 rounded-2xl text-xs rounded-tl-xs border border-white/10 flex items-center space-x-2.5 shadow-md"
                  style={{
                    backgroundColor: '#151E2E',
                    color: '#F1F5F9',
                    borderLeft: `3px solid ${primaryColor}`,
                  }}
                >
                  <div className="flex space-x-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {user.name} está escribiendo...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Bar: Voice Recorder or Standard Input Bar */}
          <div className="bg-[#0F172A] px-3.5 py-3 border-t border-white/10 shrink-0">
            {isRecordingVoice ? (
              <AudioVoiceRecorder
                onSendAudio={handleConfirmSendAudio}
                onRecordingStateChange={handleRecordingStateChange}
                onCancel={() => setIsRecordingVoice(false)}
                accentColor={accentColor}
                isDarkTheme={true}
              />
            ) : (
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                {/* Hidden File Input for photos */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />

                {/* Attach Photo Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/10"
                  title="Enviar foto"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Voice Note Mic Button */}
                <button
                  type="button"
                  onClick={() => setIsRecordingVoice(true)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer shrink-0 border border-white/10"
                  title="Grabar nota de voz"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Escribir a ${user.name}...`}
                  className="flex-1 bg-[#1E293B] text-white placeholder-gray-400 text-sm px-4 py-2.5 rounded-xl border border-white/10 focus:border-white/30 focus:outline-hidden transition-all shadow-inner"
                  style={{
                    borderColor: inputText.trim() ? accentColor : undefined,
                  }}
                />

                <button
                  type="submit"
                  disabled={isSending || !inputText.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:pointer-events-none text-white shrink-0 hover:scale-105 active:scale-95"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: inputText.trim() ? `0 0 15px ${ambientGlow}` : undefined,
                  }}
                  title="Enviar mensaje"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            )}
          </div>
        </motion.div>

        {/* Photo Pre-Send Preview Modal */}
        {selectedPhotoFile && (
          <ImageSendPreviewModal
            imageFile={selectedPhotoFile}
            onSendImage={handleConfirmSendPhoto}
            onClose={() => setSelectedPhotoFile(null)}
            accentColor={primaryColor}
          />
        )}

        {/* Fullscreen Photo Lightbox Modal */}
        {lightboxData && (
          <ImageLightboxModal
            imageUrl={lightboxData.url}
            caption={lightboxData.caption}
            senderName={lightboxData.senderName}
            timestamp={lightboxData.timestamp}
            onClose={() => setLightboxData(null)}
          />
        )}
      </div>
    </AnimatePresence>
  );
};

