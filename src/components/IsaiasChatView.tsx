import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Flower2, BookOpen, ShieldCheck, CheckCheck } from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserExperienceData } from '../types';

interface IsaiasChatViewProps {
  experience: UserExperienceData;
  onBackToFlowers: () => void;
  onBackToReading: () => void;
}

export const IsaiasChatView: React.FC<IsaiasChatViewProps> = ({
  experience,
  onBackToFlowers,
  onBackToReading,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const chatId = 'isaias';
  const currentUserId = 'isaias';
  const currentUserName = experience.name || 'Isaias';

  // Ensure chat is initialized and subscribe to real-time Firestore updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initChat = async () => {
      try {
        await api.ensureUserChatInitialized(chatId);
      } catch (err) {
        console.warn('Chat init notice:', err);
      }

      unsubscribe = api.subscribeToChat(
        chatId,
        (liveMessages) => {
          setMessages(liveMessages);
        },
        (err) => {
          console.error('Real-time chat error:', err);
          setErrorMsg('Error de sincronización en tiempo real.');
        }
      );
    };

    initChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setErrorMsg(null);
    setInputText('');

    try {
      await api.sendChatMessage(
        chatId,
        trimmed,
        'user',
        currentUserId,
        currentUserName
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'No se pudo enviar el mensaje.');
      setInputText(trimmed); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="isaias-chat-view-container"
      className="relative z-10 w-full max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-10 flex flex-col min-h-[80vh]"
    >
      {/* Top Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md rounded-2xl bg-[#071427]/85 border border-[#00E5FF]/25 shadow-lg p-4 sm:p-5 mb-4 flex flex-wrap items-center justify-between gap-3"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-linear-to-tr from-[#0284C7] to-[#00E5FF] flex items-center justify-center text-[#030B17] font-serif font-bold text-lg shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              R
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#071427] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-semibold text-[#E2F1FF]">
                Ronald
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30">
                Creador
              </span>
            </div>
            <p className="text-xs text-[#90E0EF]/80 flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Conexión en tiempo real activa</span>
            </p>
          </div>
        </div>

        {/* Quick Navigation buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBackToFlowers}
            className="inline-flex items-center space-x-1.5 text-xs py-2 px-3.5 rounded-full bg-[#030B17]/70 hover:bg-[#00E5FF]/15 text-[#90E0EF] hover:text-[#00E5FF] border border-[#00E5FF]/25 transition-all cursor-pointer"
          >
            <Flower2 className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Volver a la flor</span>
          </button>
          <button
            type="button"
            onClick={onBackToReading}
            className="inline-flex items-center space-x-1.5 text-xs py-2 px-3.5 rounded-full bg-[#030B17]/70 hover:bg-[#00E5FF]/15 text-[#90E0EF] hover:text-[#00E5FF] border border-[#00E5FF]/25 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden sm:inline">Releer</span>
          </button>
        </div>
      </motion.div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-3 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Messages Scroll Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 backdrop-blur-md rounded-2xl sm:rounded-3xl bg-[#071427]/75 border border-[#00E5FF]/20 shadow-xl p-4 sm:p-6 overflow-y-auto max-h-[58vh] sm:max-h-[62vh] space-y-4 flex flex-col"
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-[#90E0EF]/60">
            <div className="w-8 h-8 rounded-full border-2 border-[#00E5FF]/40 border-t-[#00E5FF] animate-spin mb-3" />
            <p className="text-xs">Sincronizando conversación en tiempo real...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === 'user' || msg.senderId === 'isaias';
            const isOriginal = !!msg.isOriginalResponse;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? 'items-end' : 'items-start'
                } w-full`}
              >
                {/* Message bubble */}
                <div
                  className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md relative ${
                    isMe
                      ? isOriginal
                        ? 'bg-linear-to-r from-[#0284C7] to-[#0077B6] text-white border border-[#00E5FF]/40 rounded-tr-xs'
                        : 'bg-linear-to-r from-[#0284C7] to-[#0369A1] text-white border border-[#00E5FF]/30 rounded-tr-xs'
                      : 'bg-[#0F223D]/90 text-[#E2F1FF] border border-[#00E5FF]/25 rounded-tl-xs'
                  }`}
                >
                  {/* Badge for Original Response */}
                  {isOriginal && (
                    <div className="mb-2 pb-1.5 border-b border-white/20 flex items-center space-x-1 text-[11px] font-semibold text-[#E0F2FE]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Mi respuesta (guardada permanentemente)</span>
                    </div>
                  )}

                  {/* Message sender label for Ronald */}
                  {!isMe && (
                    <div className="text-[11px] font-semibold text-[#00E5FF] mb-1">
                      Ronald
                    </div>
                  )}

                  {/* Message text */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans">
                    {msg.text}
                  </div>

                  {/* Message time and checkmark */}
                  <div
                    className={`flex items-center justify-end space-x-1 mt-1.5 text-[10px] font-mono ${
                      isMe ? 'text-[#E0F2FE]/75' : 'text-[#90E0EF]/65'
                    }`}
                  >
                    <span>{formatTimestamp(msg.createdAt)}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#00E5FF]" />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input Control Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3.5 backdrop-blur-md rounded-2xl bg-[#071427]/90 border border-[#00E5FF]/30 shadow-lg p-2.5 sm:p-3"
      >
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <textarea
            id="isaias-chat-input"
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje para Ronald..."
            disabled={isSending}
            className="flex-1 bg-[#030B17]/60 border border-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-sm text-[#E2F1FF] placeholder-[#90E0EF]/45 focus:outline-hidden focus:border-[#00E5FF]/60 resize-none transition-colors"
          />

          <button
            id="btn-isaias-send-chat"
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="shrink-0 w-11 h-11 rounded-xl bg-linear-to-tr from-[#0284C7] to-[#00E5FF] text-[#030B17] flex items-center justify-center shadow-[0_0_16px_rgba(0,229,255,0.4)] hover:shadow-[0_0_24px_rgba(0,229,255,0.6)] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer font-bold"
            title="Enviar mensaje"
          >
            {isSending ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#030B17] border-t-transparent animate-spin" />
            ) : (
              <Send className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </form>
        <div className="mt-1.5 px-2 flex items-center justify-between text-[10px] text-[#90E0EF]/50">
          <span>Pulsa Enter para enviar · Shift + Enter para salto de línea</span>
          <span>Privado con Ronald</span>
        </div>
      </motion.div>
    </div>
  );
};
