import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Flower2,
  BookOpen,
  CheckCheck,
  Image as ImageIcon,
  Mic,
} from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserExperienceData, ChatPresenceState } from '../types';
import { getChatDateSeparator, getMessageDayKey } from '../lib/dateUtils';
import { AudioVoiceMessage } from './AudioVoiceMessage';
import { ImageLightboxModal } from './ImageLightboxModal';
import { AudioVoiceRecorder } from './AudioVoiceRecorder';
import { ImageSendPreviewModal } from './ImageSendPreviewModal';

interface WhatsAppUserChatViewProps {
  experience: UserExperienceData;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
}

export const WhatsAppUserChatView: React.FC<WhatsAppUserChatViewProps> = ({
  experience,
  onBackToFlowers,
  onBackToReading,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
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

  const chatId = experience.id;
  const currentUserId = experience.id;
  const currentUserName = experience.name || experience.username || 'Usuario';

  useEffect(() => {
    // 1. Mark user as actively present in this chat
    api.setUserChatPresence(chatId, 'user', true).catch(() => {});

    // 2. Start heartbeat while user is inside their chat
    const heartbeatInterval = setInterval(() => {
      api.updateUserChatHeartbeat(chatId, 'user').catch(() => {});
    }, 8000);

    let unsubscribeChat: (() => void) | undefined;
    let unsubscribePresence: (() => void) | undefined;

    const setupChat = async () => {
      try {
        await api.ensureUserChatInitialized(chatId);
      } catch {
        // silent fallback
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

    // Disconnect cleanup on pagehide / beforeunload / visibility change
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
      api.setUserChatPresence(chatId, 'user', false).catch(() => {});
      api.setUserChatTyping(chatId, 'user', false).catch(() => {});
      api.setUserChatRecording(chatId, 'user', false).catch(() => {});
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, presence.adminTyping, presence.adminRecording]);

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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    api.setUserChatTyping(chatId, 'user', false).catch(() => {});

    setIsSending(true);
    setInputText('');

    try {
      await api.sendChatMessage(
        chatId,
        trimmed,
        'user',
        currentUserId,
        currentUserName
      );
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
      currentUserId,
      currentUserName
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
      currentUserId,
      currentUserName
    );
    setIsRecordingVoice(false);
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

  return (
    <div
      id="whatsapp-user-chat-container"
      className="relative z-10 w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col h-[86vh] max-h-[720px]"
    >
      <div className="w-full h-full bg-[#EFEAE2] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D1D7DB]">
        {/* WhatsApp Header */}
        <div className="bg-[#008069] text-white px-3 sm:px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#00A884] border border-white/20 flex items-center justify-center text-white font-semibold text-base shadow-xs shrink-0">
              R
            </div>
            <div className="leading-tight">
              <h3 className="font-semibold text-base text-white tracking-wide">
                Ronald
              </h3>
              <div className="flex items-center space-x-1.5 mt-0.5">
                {presence.adminRecording ? (
                  <span className="flex items-center space-x-1.5 text-xs text-red-200 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    <span className="animate-pulse">Ronald está grabando un audio...</span>
                  </span>
                ) : presence.adminTyping ? (
                  <span className="text-xs text-[#25D366] font-medium animate-pulse">
                    escribiendo...
                  </span>
                ) : presence.adminInChat ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    <span className="text-xs text-white/95 font-medium">
                      Ronald se encuentra en este chat
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white/40" />
                    <span className="text-xs text-white/70 font-light">
                      Desconectado
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Return Navigation */}
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={onBackToFlowers}
              className="inline-flex items-center space-x-1 text-xs py-1.5 px-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <Flower2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Flor</span>
            </button>
            <button
              type="button"
              onClick={onBackToReading}
              className="inline-flex items-center space-x-1 text-xs py-1.5 px-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Releer</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Messages Scroll Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2.5 flex flex-col"
          style={{
            backgroundColor: '#EFEAE2',
            backgroundImage:
              'radial-gradient(#DFD8CE 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <span className="bg-white/85 text-[#54656F] text-xs px-4 py-2 rounded-lg shadow-2xs max-w-xs">
                Inicia tu conversación con Ronald
              </span>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isFromMe =
                msg.senderRole === 'user' || msg.senderId === currentUserId;

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
                      <span className="bg-white/90 text-[#54656F] text-[11px] font-medium px-3.5 py-1 rounded-lg shadow-2xs">
                        {dateLabel}
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex flex-col ${
                      isFromMe ? 'items-end' : 'items-start'
                    } w-full`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-xl text-sm leading-relaxed relative shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                        msg.type === 'image' ? 'p-1.5' : 'px-3.5 py-2'
                      } ${
                        isFromMe
                          ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                          : 'bg-white text-[#111B21] rounded-tl-xs'
                      }`}
                    >
                      {/* CASE 1: IMAGE MESSAGE */}
                      {msg.type === 'image' && msg.mediaUrl ? (
                        <div className="flex flex-col space-y-1 max-w-[260px] sm:max-w-[300px]">
                          <div
                            onClick={() =>
                              setLightboxData({
                                url: msg.mediaUrl!,
                                caption: msg.text !== 'Foto' ? msg.text : undefined,
                                senderName: isFromMe ? 'Tú' : 'Ronald',
                                timestamp: formatTime(msg.createdAt || msg.timestamp),
                              })
                            }
                            className="relative overflow-hidden rounded-lg bg-black/10 cursor-pointer group/img"
                          >
                            <img
                              src={msg.mediaUrl}
                              alt={msg.text || 'Foto'}
                              className="w-full max-h-[240px] object-cover transition-transform duration-200 group-hover/img:scale-105"
                              loading="lazy"
                            />
                          </div>
                          {msg.text && msg.text !== 'Foto' && (
                            <p className="whitespace-pre-wrap break-words px-1 text-xs sm:text-sm text-[#111B21]">
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
                            isMe={isFromMe}
                            accentColor="#008069"
                          />
                        </div>
                      ) : (
                        /* CASE 3: TEXT MESSAGE */
                        <p className="whitespace-pre-wrap break-words pr-2">
                          {msg.text}
                        </p>
                      )}

                      <div className="flex items-center justify-end space-x-1 mt-1 -mb-0.5">
                        <span className="text-[10px] text-[#667781] leading-none">
                          {formatTime(msg.createdAt || msg.timestamp)}
                        </span>
                        {isFromMe && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}

          {/* Indicator: Ronald recording voice note */}
          {presence.adminRecording && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start w-full"
            >
              <div className="max-w-[85%] sm:max-w-[78%] px-3.5 py-2 rounded-xl text-sm leading-relaxed relative bg-red-50 text-red-700 rounded-tl-xs shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] flex items-center space-x-2 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-medium">
                  Ronald está grabando un audio...
                </span>
              </div>
            </motion.div>
          )}

          {/* Indicator: Ronald typing text */}
          {presence.adminTyping && !presence.adminRecording && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start w-full"
            >
              <div className="max-w-[85%] sm:max-w-[78%] px-3.5 py-2 rounded-xl text-sm leading-relaxed relative bg-white text-[#111B21] rounded-tl-xs shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] flex items-center space-x-2">
                <div className="flex space-x-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008069] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-[#54656F] italic">
                  Ronald está escribiendo...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Input Bar */}
        <div className="bg-[#F0F2F5] px-3 py-2.5 border-t border-[#D1D7DB] shrink-0">
          {isRecordingVoice ? (
            <AudioVoiceRecorder
              onSendAudio={handleConfirmSendAudio}
              onRecordingStateChange={handleRecordingStateChange}
              onCancel={() => setIsRecordingVoice(false)}
              accentColor="#00A884"
              isDarkTheme={false}
            />
          ) : (
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              {/* Hidden File Input */}
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
                className="p-2.5 rounded-full hover:bg-[#E2E5E9] text-[#54656F] hover:text-[#111B21] transition-colors cursor-pointer shrink-0"
                title="Adjuntar foto"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              {/* Voice Note Button */}
              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 rounded-full hover:bg-[#E2E5E9] text-[#54656F] hover:text-[#008069] transition-colors cursor-pointer shrink-0"
                title="Grabar nota de voz"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Escribe un mensaje"
                className="flex-1 bg-white text-[#111B21] placeholder-[#667781] text-sm px-4 py-2.5 rounded-full border border-transparent focus:border-[#00A884] focus:outline-hidden transition-all shadow-2xs"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="w-10 h-10 rounded-full bg-[#00A884] hover:bg-[#008F6F] active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
                title="Enviar"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Photo Pre-Send Preview Modal */}
      {selectedPhotoFile && (
        <ImageSendPreviewModal
          imageFile={selectedPhotoFile}
          onSendImage={handleConfirmSendPhoto}
          onClose={() => setSelectedPhotoFile(null)}
          accentColor="#00A884"
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

