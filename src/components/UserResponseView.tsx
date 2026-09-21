import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, CheckCheck, Lock, Flower2, BookOpen, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import type { UserExperienceData, UserResponse, ChatMessage } from '../types';
import { api } from '../lib/api';

interface UserResponseViewProps {
  experience: UserExperienceData;
  onSubmitResponse: (text: string) => Promise<UserResponse | null>;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
}

export const UserResponseView: React.FC<UserResponseViewProps> = ({
  experience,
  onSubmitResponse,
  onBackToFlowers,
  onBackToReading,
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
  const [hasStartedChat, setHasStartedChat] = useState<boolean>(
    Boolean(experience.userResponse?.text)
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize and subscribe to real-time chat
  useEffect(() => {
    // Ensure chat doc exists and carries initial response if any
    api.ensureUserChatInitialized(experience.id).catch(() => {});

    // Subscribe to real-time updates
    const unsubscribe = api.subscribeToChat(
      experience.id,
      (liveMessages) => {
        setMessages(liveMessages);
        if (liveMessages.length > 0) {
          setHasStartedChat(true);
        } else {
          setHasStartedChat(false);
        }
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (err) => {
        console.warn('Chat subscription error:', err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [experience.id]);

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, hasStartedChat]);

  // First-time surprise submit from the discreet "Mi respuesta" form
  const handleFirstResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = initialResponseText.trim();
    if (!clean || isSending) return;

    setIsSending(true);

    try {
      // 1. Submit to user response document
      await onSubmitResponse(clean).catch(() => {});

      // 2. Send as first message into chat
      await api.sendChatMessage(
        experience.id,
        clean,
        'user',
        experience.id,
        experience.name
      );

      // 3. Reveal the live chat
      setHasStartedChat(true);
      setInitialResponseText('');

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

    setIsSending(true);
    setInputText('');

    try {
      await api.sendChatMessage(
        experience.id,
        clean,
        'user',
        experience.id,
        experience.name
      );

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 80);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
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
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-black" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold flex items-center space-x-1.5" style={{ color: textColor }}>
                    <span>Ronald</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-400 font-medium">
                      En línea
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: mutedTextColor }}>
                    Tu mensaje le llegó directamente
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
              className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 flex flex-col custom-scrollbar"
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
              {messages.map((msg, index) => {
                const isFromMe = msg.senderRole === 'user' || msg.senderId === experience.id;

                return (
                  <motion.div
                    key={msg.id || index}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${isFromMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
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

                      <p className="text-sm select-text font-normal">{msg.text}</p>

                      <div
                        className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${
                          isFromMe ? 'text-white/80' : isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <span>{formatMessageTime(msg.createdAt)}</span>
                        {isFromMe && <CheckCheck className="w-3.5 h-3.5 text-white/90" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar (To continue chatting in real time) */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t flex items-center space-x-2 shrink-0"
              style={{
                backgroundColor: subCardBg,
                borderColor: borderColor,
              }}
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  id="chat-user-message-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe otro mensaje para Ronald..."
                  disabled={isSending}
                  className="w-full px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-full border focus:outline-hidden transition-all"
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
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shrink-0"
                style={{ backgroundColor: primaryColor }}
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Navigation Buttons when Chat is Active */}
      {hasStartedChat && (
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center sm:justify-between gap-3">
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
        </div>
      )}
    </div>
  );
};

