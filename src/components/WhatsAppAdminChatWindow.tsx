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
  Minus,
  Maximize2,
  Minimize2,
  ChevronUp,
  Reply,
  Plus,
} from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserRecord, ChatPresenceState } from '../types';
import { getChatDateSeparator, getMessageDayKey } from '../lib/dateUtils';
import { AudioVoiceMessage } from './AudioVoiceMessage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { AudioVoiceRecorder } from './AudioVoiceRecorder';
import { ImageSendPreviewModal } from './ImageSendPreviewModal';
import { ChatReadReceipt } from './ChatReadReceipt';

export interface WhatsAppAdminChatWindowProps {
  user: UserRecord;
  isMinimized: boolean;
  isMaximized: boolean;
  onToggleMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  onFocus?: () => void;
  zIndex?: number;
}

export const WhatsAppAdminChatWindow: React.FC<WhatsAppAdminChatWindowProps> = ({
  user,
  isMinimized,
  isMaximized,
  onToggleMinimize,
  onToggleMaximize,
  onClose,
  onFocus,
  zIndex = 50,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deletingMsgId, setDeletingMsgId] = useState<string | null>(null);
  const [presence, setPresence] = useState<ChatPresenceState>({});
  const [unreadWhileMinimized, setUnreadWhileMinimized] = useState(0);

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
      await api.toggleMessageReaction(user.id, msgId, emoji, 'ronald');
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
  const prevMsgCountRef = useRef<number>(0);

  // Personalized theme extraction from the user's custom flower profile
  const theme = user.theme || {};
  const primaryColor = theme.primaryColor?.trim() || '#00E5FF';
  const secondaryColor = theme.secondaryColor?.trim() || '#0284C7';
  const accentColor = theme.accentColor?.trim() || '#38BDF8';
  const ambientGlow = theme.ambientGlow || 'rgba(0, 229, 255, 0.25)';

  useEffect(() => {
    setShowClearConfirm(false);
    setIsRecordingVoice(false);
    setSelectedPhotoFile(null);
    setLightboxData(null);
    const chatId = user.id;

    // 1. Mark Ronald as active/present inside this specific user's chat
    api.setUserChatPresence(chatId, 'admin', true).catch(() => {});

    // 2. Start heartbeat while Ronald has this chat open
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
          if (!isMinimized) {
            const hasUnread = liveMessages.some((m) => m.senderRole === 'user' && !m.read);
            if (hasUnread) {
              api.markChatMessagesAsRead(chatId, 'admin').catch(() => {});
            }
          }
          if (isMinimized && liveMessages.length > prevMsgCountRef.current) {
            const newCount = liveMessages.length - prevMsgCountRef.current;
            const lastMsg = liveMessages[liveMessages.length - 1];
            if (lastMsg && lastMsg.senderRole === 'user') {
              setUnreadWhileMinimized((prev) => prev + newCount);
            }
          }
          prevMsgCountRef.current = liveMessages.length;
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

    if (!isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }

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
  }, [user.id, isMinimized]);

  useEffect(() => {
    if (!isMinimized) {
      setUnreadWhileMinimized(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      const hasUnread = messages.some((m) => m.senderRole === 'user' && !m.read);
      if (hasUnread) {
        api.markChatMessagesAsRead(user.id, 'admin').catch(() => {});
      }
    }
  }, [isMinimized, messages, presence.userTyping, presence.userRecording, user.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

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
    if (!trimmed || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    api.setUserChatTyping(user.id, 'admin', false).catch(() => {});

    setIsSending(true);
    setInputText('');

    try {
      await api.sendChatMessage(
        user.id,
        {
          text: trimmed,
          type: 'text',
          replyTo: replyingTo
            ? {
                id: replyingTo.id,
                text: replyingTo.text,
                senderName: replyingTo.senderName,
              }
            : undefined,
        },
        'admin',
        'ronald',
        'Ronald'
      );
      setReplyingTo(null);
    } catch {
      setInputText(trimmed);
    } finally {
      setIsSending(false);
    }
  };

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

  const handleRecordingStateChange = (isRecording: boolean) => {
    api.setUserChatRecording(user.id, 'admin', isRecording).catch(() => {});
  };

  const handleConfirmSendAudio = async (audioBlob: Blob, durationSeconds: number) => {
    const uploadRes = await api.uploadChatMedia(
      user.id,
      audioBlob,
      'audios',
      `voice_${Date.now()}.webm`
    );
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
    if (deletingMsgId) return;
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
    if (isClearing) return;
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

  // 1. MINIMIZED STATE (Compact Bottom Dock Pill)
  if (isMinimized) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        onClick={() => {
          onToggleMinimize();
          onFocus?.();
        }}
        className="w-64 sm:w-72 bg-[#0F172A] border border-white/15 rounded-t-2xl shadow-xl flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-[#1E293B] transition-all shrink-0 select-none group relative overflow-hidden pointer-events-auto"
        style={{
          boxShadow: `0 -4px 20px -4px ${ambientGlow}`,
          zIndex,
        }}
      >
        {/* Accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px]"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          }}
        />

        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="relative">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {presence.userInChat ? (
              <span className="w-2 h-2 rounded-full bg-[#25D366] border border-[#0F172A] absolute -bottom-0.5 -right-0.5 animate-pulse" />
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                {user.name}
              </span>
              {unreadWhileMinimized > 0 && (
                <span className="text-[10px] font-bold bg-[#25D366] text-black px-1.5 py-0.2 rounded-full animate-bounce">
                  +{unreadWhileMinimized}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block truncate">
              {presence.userRecording
                ? 'Grabando audio...'
                : presence.userTyping
                ? 'Escribiendo...'
                : presence.userInChat
                ? 'En el chat'
                : 'Minimizado'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={onToggleMinimize}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Expandir chat"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // 2. MAXIMIZED STATE (Centered Fullscreen Modal) vs NORMAL DOCKED WINDOW
  const windowContent = (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: isMaximized ? 0 : 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: isMaximized ? 0 : 20 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onMouseDown={onFocus}
      className={`relative bg-[#0A0E17] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/15 pointer-events-auto select-auto ${
        isMaximized
          ? 'w-full max-w-xl h-[92vh] max-h-[760px]'
          : 'w-full sm:w-[380px] md:w-[410px] h-[540px] max-h-[85vh] shrink-0'
      }`}
      style={{
        boxShadow: `0 0 50px -10px ${ambientGlow}, 0 20px 45px -10px rgba(0, 0, 0, 0.9)`,
        zIndex,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Bar with User's Personalized Colors */}
      <div
        className="px-3.5 py-3 flex items-center justify-between shrink-0 border-b border-white/10 backdrop-blur-md relative"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(11, 15, 25, 0.99))`,
        }}
      >
        {/* Top Color Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px]"
          style={{
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
          }}
        />

        <div className="flex items-center space-x-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              boxShadow: `0 0 12px ${ambientGlow}`,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="leading-tight min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-sm text-white tracking-wide truncate max-w-[130px] sm:max-w-[180px]">
                {user.name}
              </h3>
              <span className="text-[10px] text-gray-400 font-mono shrink-0">
                @{user.username}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              {presence.userRecording ? (
                <span className="flex items-center space-x-1 text-[10px] text-red-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="animate-pulse truncate">Grabando audio...</span>
                </span>
              ) : presence.userTyping ? (
                <span className="flex items-center space-x-1 text-[10px] text-[#25D366] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                  <span className="animate-pulse truncate">Escribiendo...</span>
                </span>
              ) : presence.userInChat ? (
                <span className="flex items-center space-x-1 text-[10px] text-[#25D366] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                  <span>En chat</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[10px] text-gray-400 font-normal">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500/60" />
                  <span>Desconectado</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Window Controls: Clear, Minimize, Maximize, Close */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={messages.length === 0}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Vaciar chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMinimize}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Minimizar ventana"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleMaximize}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer hidden sm:inline-flex"
            title={isMaximized ? 'Restaurar tamaño' : 'Maximizar ventana'}
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
            title="Cerrar chat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirm Clear Chat Modal Banner */}
      {showClearConfirm && (
        <div className="bg-[#2D1215] border-b border-red-500/30 p-2.5 px-3.5 flex items-center justify-between text-xs text-red-200 shrink-0">
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-[11px]">¿Vaciar mensajes de prueba?</span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="px-2 py-0.5 text-[11px] text-gray-300 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleClearChat}
              disabled={isClearing}
              className="px-2.5 py-0.5 text-[11px] bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md transition-colors cursor-pointer shadow-xs"
            >
              {isClearing ? '...' : 'Sí, vaciar'}
            </button>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto p-3.5 space-y-2.5 flex flex-col-reverse custom-scrollbar"
        style={{
          backgroundColor: '#070A10',
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <div ref={messagesEndRef} />
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                color: accentColor,
              }}
            >
              <MessageSquare className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="max-w-xs space-y-0.5">
              <p className="text-xs font-medium text-white">Sin mensajes aún</p>
              <p className="text-[11px] text-[#8C847B] leading-relaxed">
                Cuando <span className="text-white font-medium">{user.name}</span> envíe su respuesta o escriba, aparecerá aquí en tiempo real.
              </p>
            </div>
          </div>
        ) : (
          [...messages].reverse().map((msg, index) => {
            const isFromRonald =
              msg.senderRole === 'admin' || msg.senderId === 'ronald';

            // Invertimos también la lógica de prevMsg ya que la lista está invertida
            const prevMsg = index < messages.length - 1 ? messages[messages.length - 2 - index] : null;
            const currentDateKey = getMessageDayKey(msg.createdAt || msg.timestamp);
            const prevDateKey = prevMsg
              ? getMessageDayKey(prevMsg.createdAt || prevMsg.timestamp)
              : null;
            const isNewDay = index === messages.length - 1 || currentDateKey !== prevDateKey;
            const dateLabel = getChatDateSeparator(msg.createdAt || msg.timestamp);

            return (
              <React.Fragment key={msg.id}>
                {isNewDay && (
                  <div className="flex justify-center my-1">
                    <span className="bg-[#131B2A]/90 border border-white/10 text-[#94A3B8] text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-2xs">
                      {dateLabel}
                    </span>
                  </div>
                )}

                <div
                  className={`group/msg flex flex-col ${
                    isFromRonald ? 'items-end' : 'items-start'
                  } w-full relative my-1.5`}
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
                      isFromRonald ? 'right-0' : 'left-0'
                    } ${
                      activeReactionMsgId === msg.id ? 'flex' : 'hidden group-hover/msg:flex'
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
                        isFromRonald ? 'right-0' : 'left-0'
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

                  <div className="flex items-end gap-1.5 max-w-[92%] sm:max-w-[85%]">
                    {isFromRonald && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        disabled={deletingMsgId === msg.id}
                        className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer shrink-0"
                        title="Borrar mensaje de prueba"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    <div
                      onClick={() => setActiveReactionMsgId(activeReactionMsgId === msg.id ? null : msg.id)}
                      className={`rounded-2xl text-xs leading-relaxed relative shadow-md transition-all cursor-pointer ${
                        msg.type === 'image' ? 'p-1.5' : 'px-3.5 py-2'
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
                      {!isFromRonald && (
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: primaryColor }}
                          >
                            {user.name}
                          </span>
                          {msg.isOriginalResponse && (
                            <span
                              className="text-[8.5px] font-medium px-1.5 py-0.2 rounded-md border border-white/10"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                color: accentColor,
                              }}
                            >
                              Respuesta original
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quoted Reply Quote Block */}
                      {msg.replyTo && (
                        <div
                          className="mb-2 p-2 rounded-xl border-l-2 text-xs opacity-95"
                          style={{
                            backgroundColor: isFromRonald ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.15)',
                            borderColor: primaryColor,
                          }}
                        >
                          <div className="font-bold text-[11px] mb-0.5" style={{ color: primaryColor }}>
                            {msg.replyTo.senderName}
                          </div>
                          <div className="truncate italic text-[11px] text-white/90">{msg.replyTo.text}</div>
                        </div>
                      )}

                      {/* Image Message */}
                      {msg.type === 'image' && msg.mediaUrl ? (
                        <div className="flex flex-col space-y-1 max-w-[240px]">
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
                              className="w-full max-h-[200px] object-cover transition-transform duration-300 group-hover/img:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                              <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                                Ver foto
                              </span>
                            </div>
                          </div>
                          {msg.text && msg.text !== 'Foto' && (
                            <p className="whitespace-pre-wrap break-words px-1 text-xs text-white/95">
                              {msg.text}
                            </p>
                          )}
                        </div>
                      ) : msg.type === 'audio' && msg.mediaUrl ? (
                        /* Audio Voice Note */
                        <div className="flex flex-col">
                          <AudioVoiceMessage
                            mediaUrl={msg.mediaUrl}
                            duration={msg.audioDuration}
                            isMe={isFromRonald}
                            accentColor={accentColor}
                          />
                        </div>
                      ) : (
                        /* Standard Text Message */
                        <p className="whitespace-pre-wrap break-words pr-1 text-xs sm:text-[13px]">
                          {msg.text}
                        </p>
                      )}

                      <div className="flex items-center justify-end space-x-1.5 mt-1 -mb-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingTo({
                              id: msg.id,
                              text: msg.text,
                              senderName: isFromRonald ? 'Ronald' : user.name,
                            })
                          }
                          className="hover:text-cyan-400 transition-colors cursor-pointer mr-1 p-0.5 text-white/80"
                          title="Responder"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9.5px] text-gray-300 font-mono">
                          {formatTime(msg.createdAt || (msg as any).timestamp)}
                        </span>
                        {isFromRonald && (
                          <ChatReadReceipt
                            read={Boolean(msg.read)}
                            isRecipientActive={Boolean(presence.userInChat)}
                            isDarkBackground={true}
                            className="w-3.5 h-3.5"
                          />
                        )}
                      </div>
                    </div>

                    {!isFromRonald && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        disabled={deletingMsgId === msg.id}
                        className="opacity-0 group-hover/msg:opacity-100 focus:opacity-100 p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer shrink-0"
                        title="Borrar respuesta de prueba"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Reactions Pills Below Message Bubble */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isFromRonald ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(msg.reactions).map(([emoji, users]) => {
                        const userList = (users || []) as string[];
                        const hasReacted = userList.includes('ronald');
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] border shadow-2xs transition-transform hover:scale-110 cursor-pointer"
                            style={{
                              backgroundColor: hasReacted
                                ? isFromRonald
                                  ? 'rgba(255,255,255,0.25)'
                                  : primaryColor + '30'
                                : '#1E293B',
                              borderColor: hasReacted ? primaryColor : 'rgba(255,255,255,0.15)',
                              color: '#F1F5F9',
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
                </div>
              </React.Fragment>
            );
          })
        )}

        {/* Real-time Indicator: User recording audio */}
        {presence.userRecording && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start w-full"
          >
            <div className="px-3 py-1.5 rounded-2xl text-[11px] rounded-tl-xs border border-red-500/20 flex items-center space-x-2 shadow-md bg-[#1F1418] text-red-200 border-l-3 border-l-red-500">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-300 font-medium">
                {user.name} está grabando un audio...
              </span>
            </div>
          </motion.div>
        )}

        {/* Real-time Indicator: User typing text */}
        {presence.userTyping && !presence.userRecording && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start w-full"
          >
            <div
              className="px-3 py-1.5 rounded-2xl text-[11px] rounded-tl-xs border border-white/10 flex items-center space-x-2 shadow-md bg-[#151E2E] text-gray-300"
              style={{
                borderLeft: `3px solid ${primaryColor}`,
              }}
            >
              <div className="flex space-x-1 items-center">
                <span className="w-1 h-1 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-[#38BDF8] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-medium">
                {user.name} está escribiendo...
              </span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Bar: Voice Recorder or Standard Input Bar */}
      <div className="bg-[#0F172A] px-3 py-2.5 border-t border-white/10 shrink-0">
        {/* Reply Preview Banner */}
        {replyingTo && (
          <div className="mb-2 px-3 py-2 rounded-xl border border-cyan-500/30 bg-[#131F38] flex items-center justify-between text-xs text-white">
            <div className="flex items-center space-x-2 truncate">
              <Reply className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-cyan-300">Respondiendo a {replyingTo.senderName}:</span>{' '}
                <span className="text-gray-300">{replyingTo.text}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
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
            accentColor={accentColor}
            isDarkTheme={true}
          />
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer shrink-0 border border-white/10"
              title="Enviar foto"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsRecordingVoice(true)}
              className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 transition-colors cursor-pointer shrink-0 border border-white/10"
              title="Grabar nota de voz"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Escribir a ${user.name}...`}
              className="flex-1 bg-[#1E293B] text-white placeholder-gray-400 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-white/10 focus:border-white/30 focus:outline-hidden transition-all shadow-inner"
              style={{
                borderColor: inputText.trim() ? accentColor : undefined,
              }}
            />

            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40 disabled:pointer-events-none text-white shrink-0 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                boxShadow: inputText.trim() ? `0 0 12px ${ambientGlow}` : undefined,
              }}
              title="Enviar mensaje"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        )}
      </div>

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
    </motion.div>
  );

  if (isMaximized) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md pointer-events-auto"
        onClick={onToggleMaximize}
      >
        {windowContent}
      </div>
    );
  }

  return windowContent;
};
