import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Check,
  CheckCheck,
  Lock,
  Flower2,
  BookOpen,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Mic,
  LogOut,
  Reply,
  Plus,
  X,
} from 'lucide-react';
import type { UserExperienceData, UserResponse, ChatMessage, ChatPresenceState } from '../types';
import { api } from '../lib/api';
import { getChatDateSeparator, getMessageDayKey } from '../lib/dateUtils';
import { AudioVoiceMessage } from './AudioVoiceMessage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { AudioVoiceRecorder } from './AudioVoiceRecorder';
import { ImageSendPreviewModal } from './ImageSendPreviewModal';
import { ChatReadReceipt } from './ChatReadReceipt';

interface UserResponseViewProps {
  experience: UserExperienceData;
  onSubmitResponse: (text: string) => Promise<UserResponse | null>;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
  onLogout?: () => void;
}

export const UserResponseView: React.FC<UserResponseViewProps> = ({
  experience,
  onSubmitResponse,
  onBackToFlowers,
  onBackToReading,
  onLogout,
}) => {
  const isJhon = experience.id === 'jhon' || experience.username?.toLowerCase() === 'jhon';
  const theme = experience.theme || {};
  const isDarkTheme =
    theme.backgroundColor?.startsWith('#0') ||
    theme.backgroundColor?.startsWith('#1') ||
    isJhon;

  const primaryColor = theme.primaryColor?.trim() || (isDarkTheme ? '#00E5FF' : '#2C2926');
  const secondaryColor = theme.secondaryColor?.trim() || (isDarkTheme ? '#3A86FF' : '#937C67');
  const accentColor = theme.accentColor?.trim() || (isDarkTheme ? '#F4D03F' : '#D4AF37');
  const surfaceColor =
    theme.surfaceColor?.trim() ||
    (isDarkTheme ? 'rgba(10, 18, 38, 0.92)' : 'rgba(255, 255, 255, 0.96)');
  const textColor = theme.textColor?.trim() || (isDarkTheme ? '#E6EDF8' : '#2C2926');
  const borderColor = isDarkTheme ? 'rgba(43, 120, 228, 0.3)' : '#E8E2D9';
  const subCardBg = isDarkTheme ? 'rgba(12, 24, 52, 0.75)' : 'rgba(250, 246, 240, 0.8)';
  const innerCardBg = isDarkTheme ? 'rgba(15, 29, 62, 0.65)' : '#FAF8F5';
  const mutedTextColor = isDarkTheme ? '#8EAFDD' : '#736C65';
  const isSans = theme.fontStyle === 'sans';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialResponseText, setInitialResponseText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [presence, setPresence] = useState<ChatPresenceState>({});
  const [hasStartedChat, setHasStartedChat] = useState<boolean>(() => {
    return Boolean(experience.userResponse?.text && experience.userResponse.text.trim().length > 0);
  });

  const [replyingTo, setReplyingTo] = useState<{ id: string; text: string; senderName: string } | null>(null);
  const [pickerMsgId, setPickerMsgId] = useState<string | null>(null);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);

  const IOS_EMOJIS = [
    '❤️', '👍', '😂', '😮', '😢', '🙏',
    '😊', '🥰', '😎', '🔥', '✨', '🎉',
    '💯', '🌹', '😍', '🥳', '👏', '🙌',
    '💪', '👑', '💡', '☕', '🌟', '🍀',
    '💙', '💚', '💛', '💜', '🤍', '🚀'
  ];

  const handleToggleReaction = async (msgId: string, emoji: string) => {
    try {
      await api.toggleMessageReaction(chatId, msgId, emoji, experience.id);
    } catch (err) {
      console.warn('Error toggling reaction:', err);
    }
  };

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

  const chatId = experience.id;

  // Initialize and subscribe to real-time chat & presence
  useEffect(() => {
    // 1. Mark presence
    api.setUserChatPresence(chatId, 'user', true).catch(() => {});

    const heartbeatInterval = setInterval(() => {
      api.updateUserChatHeartbeat(chatId, 'user').catch(() => {});
    }, 8000);

    // Ensure chat doc exists and carries initial response if any
    api.ensureUserChatInitialized(chatId).catch(() => {});

    // Subscribe to messages
    const unsubscribeMessages = api.subscribeToChat(
      chatId,
      (liveMessages) => {
        const sortedMessages = [...liveMessages].sort((a, b) => {
          const timeA = new Date(a.createdAt || a.timestamp || '').getTime();
          const timeB = new Date(b.createdAt || b.timestamp || '').getTime();
          return timeA - timeB;
        });
        setMessages(sortedMessages);
        if (liveMessages.length > 0 || (experience.userResponse?.text && experience.userResponse.text.trim().length > 0)) {
          setHasStartedChat(true);
          const hasUnread = liveMessages.some((m) => m.senderRole === 'admin' && !m.read);
          if (hasUnread) {
            api.markChatMessagesAsRead(chatId, 'user').catch(() => {});
          }
        }
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (err) => {
        console.warn('Chat subscription error:', err);
      }
    );

    // Subscribe to presence
    const unsubscribePresence = api.subscribeToChatPresence(
      chatId,
      (livePresence) => {
        setPresence(livePresence);
      }
    );

    const handleLeave = () => {
      api.setUserChatPresence(chatId, 'user', false).catch(() => {});
      api.setUserChatTyping(chatId, 'user', false).catch(() => {});
      api.setUserChatRecording(chatId, 'user', false).catch(() => {});
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        api.setUserChatPresence(chatId, 'user', false).catch(() => {});
        api.setUserChatTyping(chatId, 'user', false).catch(() => {});
        api.setUserChatRecording(chatId, 'user', false).catch(() => {});
      } else if (document.visibilityState === 'visible') {
        api.setUserChatPresence(chatId, 'user', true).catch(() => {});
        api.markChatMessagesAsRead(chatId, 'user').catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      unsubscribeMessages();
      unsubscribePresence();
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      api.setUserChatPresence(chatId, 'user', false).catch(() => {});
      api.setUserChatTyping(chatId, 'user', false).catch(() => {});
      api.setUserChatRecording(chatId, 'user', false).catch(() => {});
    };
  }, [chatId]);

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, hasStartedChat, presence.adminTyping, presence.adminRecording]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    const hasText = val.trim().length > 0;
    if (hasText) {
      api.setUserChatTyping(chatId, 'user', true).catch(() => {});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        api.setUserChatTyping(chatId, 'user', false).catch(() => {});
      }, 2500);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      api.setUserChatTyping(chatId, 'user', false).catch(() => {});
    }
  };

  // First-time surprise submit from the discreet "Mi respuesta" form
  const handleFirstResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = initialResponseText.trim();
    if (!clean || isSending) return;

    setIsSending(true);

    try {
      // Submit response (this automatically initializes the first message in live chat idempotently)
      try {
        await onSubmitResponse(clean);
      } catch (subErr) {
        console.warn('Initial response record warning:', subErr);
      }

      // Reveal the live chat
      setHasStartedChat(true);
      setInitialResponseText('');
      await api.setUserChatPresence(chatId, 'user', true).catch(() => {});

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err) {
      console.error('Error submitting initial response:', err);
    } finally {
      setIsSending(false);
    }
  };

  // Subsequent messages in the revealed chat interface
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    api.setUserChatTyping(chatId, 'user', false).catch(() => {});

    setIsSending(true);
    setInputText('');

    try {
      await api.sendChatMessage(
        chatId,
        {
          text: clean,
          type: 'text',
          replyTo: replyingTo
            ? {
                id: replyingTo.id,
                text: replyingTo.text,
                senderName: replyingTo.senderName,
              }
            : undefined,
        },
        'user',
        experience.id,
        experience.name
      );
      setReplyingTo(null);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 80);
    } catch (err) {
      console.error('Error sending message:', err);
      setInputText(clean);
    } finally {
      setIsSending(false);
    }
  };

  // Photo Attachment Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen seleccionada supera el límite de 10 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedPhotoFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmSendPhoto = async (file: File, caption: string) => {
    const uploadRes = await api.uploadChatMedia(chatId, file, 'images', file.name);
    await api.sendChatMessage(
      chatId,
      {
        type: 'image',
        text: caption,
        mediaUrl: uploadRes.url,
        fileName: uploadRes.fileName,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
      },
      'user',
      experience.id,
      experience.name
    );
  };

  // Audio Voice Note Handler
  const handleRecordingStateChange = (isRecording: boolean) => {
    api.setUserChatRecording(chatId, 'user', isRecording).catch(() => {});
  };

  const handleConfirmSendAudio = async (audioBlob: Blob, durationSeconds: number) => {
    const uploadRes = await api.uploadChatMedia(chatId, audioBlob, 'audios', `voice_${Date.now()}.webm`);
    await api.sendChatMessage(
      chatId,
      {
        type: 'audio',
        text: 'Mensaje de voz',
        mediaUrl: uploadRes.url,
        fileName: uploadRes.fileName,
        fileSize: uploadRes.fileSize,
        mimeType: uploadRes.mimeType,
        audioDuration: durationSeconds,
      },
      'user',
      experience.id,
      experience.name
    );
    setIsRecordingVoice(false);
  };

  const formatMessageTime = (isoString?: string) => {
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

  return (
    <div
      id="user-response-view-container"
      className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex flex-col min-h-[80vh]"
    >
      {/* Header with Title: "Mi respuesta" */}
      <div className="text-center mb-4 sm:mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border mb-2.5 shadow-2xs"
          style={{
            backgroundColor: subCardBg,
            borderColor: borderColor,
            color: primaryColor,
          }}
        >
          <Flower2 className="w-5 h-5 stroke-[1.4]" />
        </motion.div>

        <h1
          className={`${
            isSans ? 'font-sans' : 'font-serif-display'
          } text-2xl sm:text-3xl font-normal tracking-tight`}
          style={{ color: textColor }}
        >
          Mi respuesta
        </h1>

        {/* Private Encrypted Note */}
        <div className="flex items-center justify-center space-x-1.5 text-xs mt-1.5" style={{ color: mutedTextColor }}>
          <Lock className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span>
            {hasStartedChat
              ? 'Conversación directa y privada con Ronald'
              : 'Tu respuesta solo será vista por Ronald.'}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!hasStartedChat && messages.length === 0 ? (
          /* ========================================================= */
          /* STAGE 1: INTIMATE DISCREET RESPONSE FORM (SURPRISE EFFECT) */
          /* ========================================================= */
          <motion.div
            key="initial-form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col rounded-2xl sm:rounded-3xl border shadow-lg p-5 sm:p-8 backdrop-blur-md"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            <form onSubmit={handleFirstResponseSubmit} className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex-1 flex flex-col">
                <label
                  htmlFor="user-initial-response-textarea"
                  className="block text-xs sm:text-sm font-medium mb-2.5"
                  style={{ color: textColor }}
                >
                  Escribe lo que deseas responder o compartir:
                </label>
                <textarea
                  id="user-initial-response-textarea"
                  required
                  rows={8}
                  value={initialResponseText}
                  onChange={(e) => setInitialResponseText(e.target.value)}
                  placeholder="Escribe aquí tu respuesta..."
                  disabled={isSending}
                  className={`w-full flex-1 min-h-[180px] sm:min-h-[220px] p-4 rounded-xl border text-sm sm:text-base leading-relaxed focus:outline-hidden transition-all resize-none break-words ${
                    isSans ? 'font-sans' : 'font-serif'
                  }`}
                  style={{
                    backgroundColor: innerCardBg,
                    borderColor: borderColor,
                    color: textColor,
                  }}
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onBackToFlowers}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 text-xs py-2.5 px-4 rounded-full border transition-colors cursor-pointer"
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
                    className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 text-xs py-2.5 px-4 rounded-full border transition-colors cursor-pointer"
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

                <button
                  id="btn-submit-first-user-response"
                  type="submit"
                  disabled={isSending || !initialResponseText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-full text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSending ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar respuesta</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* STAGE 2: REVEALED REAL-TIME CHAT (SURPRISE UNLOCKED!)     */
          /* ========================================================= */
          <motion.div
            key="chat-room"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="flex-1 flex flex-col rounded-2xl sm:rounded-3xl border shadow-lg overflow-hidden backdrop-blur-md"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
              minHeight: '460px',
            }}
          >
            {/* Chat Status Header */}
            <div
              className="px-4 py-3 border-b flex items-center justify-between shrink-0"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
              }}
            >
              <div className="flex items-center space-x-2.5">
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shadow-xs"
                    style={{
                      backgroundColor: isDarkTheme ? '#0F172A' : '#F1F5F9',
                      borderColor: borderColor,
                      color: primaryColor,
                    }}
                  >
                    R
                  </div>
                  {presence.adminInChat ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-black animate-pulse" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-gray-400 border-2 border-white dark:border-black" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold flex items-center space-x-1.5" style={{ color: textColor }}>
                    <span>Ronald</span>
                    {presence.adminRecording ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-red-500/15 text-red-400 font-medium animate-pulse">
                        Grabando audio...
                      </span>
                    ) : presence.adminTyping ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-400 font-medium animate-pulse">
                        Escribiendo...
                      </span>
                    ) : presence.adminInChat ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-400 font-medium">
                        En el chat
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/10 text-gray-400 font-medium">
                        Desconectado
                      </span>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: mutedTextColor }}>
                    {presence.adminRecording
                      ? 'Ronald te está grabando una nota de voz...'
                      : presence.adminTyping
                      ? 'Ronald está respondiéndote ahora...'
                      : presence.adminInChat
                      ? 'Ronald se encuentra en este chat'
                      : 'Tu mensaje le llegará directamente'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1 text-[11px]" style={{ color: mutedTextColor }}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chat en vivo</span>
                </div>
              </div>
            </div>

            {/* Messages Container (Izquierda = Ronald, Derecha = Usuario) */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 flex flex-col-reverse custom-scrollbar"
              style={{
                backgroundColor: isDarkTheme ? 'rgba(5, 10, 20, 0.75)' : 'rgba(248, 246, 240, 0.65)',
                backgroundImage: isDarkTheme
                  ? 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
                  : 'radial-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                maxHeight: '52vh',
                minHeight: '260px',
              }}
            >
              <div ref={messagesEndRef} />

              {/* Ronald recording indicator */}
              {presence.adminRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start"
                >
                  <div
                    className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-xs text-sm rounded-bl-xs border flex items-center space-x-2 bg-red-950/40 border-red-500/30 text-red-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-medium italic">
                      Ronald está grabando un audio...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Ronald typing indicator */}
              {presence.adminTyping && !presence.adminRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start"
                >
                  <div
                    className="max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-xs text-sm rounded-bl-xs border flex items-center space-x-2"
                    style={{
                      backgroundColor: isDarkTheme ? '#131F38' : '#FFFFFF',
                      borderColor: borderColor,
                    }}
                  >
                    <div className="flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-emerald-400 font-medium italic">
                      Ronald está escribiendo...
                    </span>
                  </div>
                </motion.div>
              )}

              {[...messages].reverse().map((msg, index) => {
                const isFromMe = msg.senderRole === 'user' || msg.senderId === experience.id;

                const nextMsg = index < messages.length - 1 ? messages[messages.length - 2 - index] : null;
                const currentDateKey = getMessageDayKey(msg.createdAt || msg.timestamp);
                const nextDateKey = nextMsg
                  ? getMessageDayKey(nextMsg.createdAt || nextMsg.timestamp)
                  : null;
                const isNewDay = index === messages.length - 1 || currentDateKey !== nextDateKey;
                const dateLabel = getChatDateSeparator(msg.createdAt || msg.timestamp);

                return (
                  <React.Fragment key={msg.id || index}>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={`group relative flex flex-col ${isFromMe ? 'items-end' : 'items-start'} my-1.5`}
                    >
                      {/* Backdrop to close emoji picker/reactions when clicking anywhere outside */}
                      {(pickerMsgId === msg.id || activeReactionMsgId === msg.id) && (
                        <div
                          className="fixed inset-0 z-40 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPickerMsgId(null);
                            setActiveReactionMsgId(null);
                          }}
                        />
                      )}

                      {/* Floating iOS-style Reactions Bar (Visible on Hover on PC OR on Message Tap on Mobile) */}
                      <div
                        className={`absolute -top-10 ${
                          isFromMe ? 'right-0' : 'left-0'
                        } ${
                          activeReactionMsgId === msg.id ? 'flex' : 'hidden group-hover:flex'
                        } items-center space-x-1 bg-[#0F172A]/95 border border-white/20 backdrop-blur-md px-2.5 py-1 rounded-full shadow-2xl z-50 whitespace-nowrap`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {['❤️', '👍', '😂', '😮', '😢', '🙏'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, emoji);
                              setActiveReactionMsgId(null);
                              setPickerMsgId(null);
                            }}
                            className="text-base sm:text-lg hover:scale-130 active:scale-90 transition-transform cursor-pointer p-0.5"
                            title={`Reaccionar con ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPickerMsgId(pickerMsgId === msg.id ? null : msg.id);
                          }}
                          className="p-1 text-white hover:text-yellow-300 transition-colors rounded-full bg-white/20 hover:bg-white/30 cursor-pointer ml-0.5"
                          title="Más emojis (+)"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Full iOS Emoji Picker Popover */}
                      {pickerMsgId === msg.id && (
                        <div
                          className={`absolute z-50 ${
                            isFromMe ? 'right-0' : 'left-0'
                          } bottom-full mb-3 p-3 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl w-64 max-w-[90vw] grid grid-cols-6 gap-2 bg-[#0F172A]/95`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {IOS_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleReaction(msg.id, emoji);
                                setPickerMsgId(null);
                                setActiveReactionMsgId(null);
                              }}
                              className="text-xl p-1.5 rounded-xl hover:bg-white/20 transition-colors text-center cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl cursor-pointer ${
                          msg.type === 'image' ? 'p-2' : 'px-4 py-2.5'
                        } shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isFromMe
                            ? 'rounded-br-xs text-white shadow-md'
                            : 'rounded-bl-xs border text-left shadow-xs'
                        }`}
                        style={
                          isFromMe
                            ? {
                                backgroundColor: primaryColor,
                                color: '#FFFFFF',
                                boxShadow: `0 4px 14px ${primaryColor}35`,
                              }
                            : {
                                backgroundColor: isDarkTheme ? '#131F38' : '#FFFFFF',
                                borderColor: borderColor,
                                color: isDarkTheme ? '#F1F5F9' : '#1E293B',
                              }
                        }
                      >
                        {!isFromMe && (
                          <div className="text-[10px] font-bold text-emerald-400 mb-0.5 tracking-wide">
                            Ronald
                          </div>
                        )}

                        {/* Quoted Reply Quote Block */}
                        {msg.replyTo && (
                          <div
                            className="mb-2 p-2 rounded-xl border-l-2 text-xs opacity-95"
                            style={{
                              backgroundColor: isFromMe ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)',
                              borderColor: accentColor,
                            }}
                          >
                            <div className="font-bold text-[11px] mb-0.5" style={{ color: accentColor }}>
                              {msg.replyTo.senderName}
                            </div>
                            <div className="truncate italic text-[11px]">{msg.replyTo.text}</div>
                          </div>
                        )}

                        {/* CASE 1: IMAGE */}
                        {msg.type === 'image' && msg.mediaUrl ? (
                          <div className="flex flex-col space-y-1 max-w-[260px] sm:max-w-[300px]">
                            <div
                              onClick={() =>
                                setLightboxData({
                                  url: msg.mediaUrl!,
                                  caption: msg.text !== 'Foto' ? msg.text : undefined,
                                  senderName: isFromMe ? 'Tú' : 'Ronald',
                                  timestamp: formatMessageTime(msg.createdAt),
                                })
                              }
                              className="relative overflow-hidden rounded-xl bg-black/20 cursor-pointer group/img"
                            >
                              <img
                                src={msg.mediaUrl}
                                alt={msg.text || 'Foto'}
                                className="w-full max-h-[240px] object-cover transition-transform duration-200 group-hover/img:scale-105"
                                loading="lazy"
                              />
                            </div>
                            {msg.text && msg.text !== 'Foto' && (
                              <p className="text-sm select-text font-normal px-1">
                                {msg.text}
                              </p>
                            )}
                          </div>
                        ) : msg.type === 'audio' && msg.mediaUrl ? (
                          /* CASE 2: AUDIO */
                          <AudioVoiceMessage
                            mediaUrl={msg.mediaUrl}
                            duration={msg.audioDuration}
                            isMe={isFromMe}
                            accentColor={accentColor}
                          />
                        ) : (
                          /* CASE 3: TEXT */
                          <p className="text-sm select-text font-normal">{msg.text}</p>
                        )}

                        <div
                          className={`flex items-center justify-end space-x-1.5 mt-1 text-[10px] ${
                            isFromMe ? 'text-white/80' : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setReplyingTo({
                                id: msg.id,
                                text: msg.text,
                                senderName: isFromMe ? 'Tú' : (msg.senderName || 'Ronald'),
                              })
                            }
                            className="hover:text-cyan-400 transition-colors cursor-pointer mr-1 p-0.5"
                            title="Responder"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                          <span>{formatMessageTime(msg.createdAt)}</span>
                          {isFromMe && (
                            <ChatReadReceipt
                              read={Boolean(msg.read)}
                              isRecipientActive={Boolean(presence.adminInChat)}
                              isDarkBackground={isDarkTheme}
                              className="w-3.5 h-3.5"
                            />
                          )}
                        </div>
                      </div>

                      {/* Reactions Pills Below Message Bubble */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                          {Object.entries(msg.reactions).map(([emoji, users]) => {
                            const userList = (users || []) as string[];
                            const hasReacted = userList.includes(experience.id);
                            return (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => handleToggleReaction(msg.id, emoji)}
                                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs border shadow-2xs transition-transform hover:scale-110 cursor-pointer"
                                style={{
                                  backgroundColor: hasReacted
                                    ? isFromMe
                                      ? 'rgba(255,255,255,0.25)'
                                      : accentColor + '30'
                                    : isDarkTheme
                                    ? '#1E293B'
                                    : '#F1F5F9',
                                  borderColor: hasReacted ? accentColor : borderColor,
                                  color: textColor,
                                }}
                                title={`${userList.length} reacción(es)`}
                              >
                                <span>{emoji}</span>
                                {userList.length > 1 && (
                                  <span className="text-[10px] font-bold">{userList.length}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>

                    {/* Centered Date Separator Pill */}
                    {isNewDay && (
                      <div className="flex justify-center my-2">
                        <span
                          className="text-[11px] font-medium px-3.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs"
                          style={{
                            backgroundColor: isDarkTheme
                              ? 'rgba(19, 31, 56, 0.9)'
                              : 'rgba(255, 255, 255, 0.9)',
                            borderColor: borderColor,
                            color: mutedTextColor,
                          }}
                        >
                          {dateLabel}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Message Input Bar (To continue chatting in real time) */}
            <div
              className="p-3 sm:p-4 border-t shrink-0"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
              }}
            >
              {/* Reply Preview Banner */}
              {replyingTo && (
                <div
                  className="mb-2.5 px-3.5 py-2 rounded-xl border flex items-center justify-between text-xs backdrop-blur-md"
                  style={{
                    backgroundColor: innerCardBg,
                    borderColor: accentColor,
                    color: textColor,
                  }}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Reply className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                    <div className="truncate">
                      <span className="font-semibold">Respondiendo a {replyingTo.senderName}:</span>{' '}
                      <span className="opacity-80">{replyingTo.text}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {isRecordingVoice ? (
                <AudioVoiceRecorder
                  onSendAudio={handleConfirmSendAudio}
                  onRecordingStateChange={handleRecordingStateChange}
                  onCancel={() => setIsRecordingVoice(false)}
                  accentColor={primaryColor}
                  isDarkTheme={isDarkTheme}
                />
              ) : (
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2"
                >
                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {/* Photo Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-full border transition-colors cursor-pointer shrink-0"
                    style={{
                      backgroundColor: innerCardBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                    title="Enviar foto"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={() => setIsRecordingVoice(true)}
                    className="p-2.5 rounded-full border transition-colors cursor-pointer shrink-0"
                    style={{
                      backgroundColor: innerCardBg,
                      borderColor: borderColor,
                      color: textColor,
                    }}
                    title="Grabar audio"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      id="chat-user-message-input"
                      type="text"
                      value={inputText}
                      onChange={handleInputChange}
                      placeholder="Escribe otro mensaje para Ronald..."
                      disabled={isSending}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-full border focus:outline-hidden transition-all"
                      style={{
                        backgroundColor: innerCardBg,
                        borderColor: borderColor,
                        color: textColor,
                      }}
                    />
                  </div>

                  <button
                    id="btn-send-user-chat-message"
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0"
                    style={{ backgroundColor: primaryColor }}
                    title="Enviar mensaje"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Navigation Buttons when Chat is Active */}
      {hasStartedChat && (
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center sm:justify-between gap-3">
          {experience.hasFlowerExperience !== false ? (
            <>
              <button
                type="button"
                onClick={onBackToFlowers}
                className="inline-flex items-center space-x-2 text-xs py-2 px-4 rounded-full border transition-colors cursor-pointer"
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
                className="inline-flex items-center space-x-2 text-xs py-2 px-4 rounded-full border transition-colors cursor-pointer"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: innerCardBg,
                }}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Releer</span>
              </button>
            </>
          ) : (
            onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center space-x-2 text-xs py-2 px-4 rounded-full border transition-colors cursor-pointer mx-auto"
                style={{
                  borderColor: borderColor,
                  color: textColor,
                  backgroundColor: innerCardBg,
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            )
          )}
        </div>
      )}

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
  );
};


