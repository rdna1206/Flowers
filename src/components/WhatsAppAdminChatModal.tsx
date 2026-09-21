import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, CheckCheck } from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserRecord } from '../types';

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    let unsubscribe: (() => void) | undefined;

    const setupChat = async () => {
      try {
        await api.ensureUserChatInitialized(user.id);
      } catch {
        // non-blocking
      }

      unsubscribe = api.subscribeToChat(
        user.id,
        (liveMessages) => {
          setMessages(liveMessages);
        },
        () => {
          // silent fallback
        }
      );
    };

    setupChat();

    // Focus input on open
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || !user || isSending) return;

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
        id="whatsapp-admin-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg h-[88vh] max-h-[680px] bg-[#EFEAE2] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#D1D7DB]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* WhatsApp Clean Header */}
          <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#00A884] border border-white/20 flex items-center justify-center text-white font-semibold text-base shadow-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight">
                <h3 className="font-semibold text-base text-white tracking-wide">
                  {user.name}
                </h3>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  <span className="text-xs text-white/90 font-light">en línea</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* WhatsApp Chat Messages Container */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2.5 flex flex-col"
            style={{
              backgroundColor: '#EFEAE2',
              backgroundImage:
                'radial-gradient(#DFD8CE 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            {/* Date Pill */}
            <div className="flex justify-center my-1">
              <span className="bg-white/90 text-[#54656F] text-[11px] font-medium px-3 py-1 rounded-lg shadow-2xs">
                Hoy
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <span className="bg-white/85 text-[#54656F] text-xs px-4 py-2 rounded-lg shadow-2xs max-w-xs">
                  Inicia la conversación con {user.name}
                </span>
              </div>
            ) : (
              messages.map((msg) => {
                const isFromRonald =
                  msg.senderRole === 'admin' || msg.senderId === 'ronald';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      isFromRonald ? 'items-end' : 'items-start'
                    } w-full`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] px-3.5 py-2 rounded-xl text-sm leading-relaxed relative shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                        isFromRonald
                          ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs'
                          : 'bg-white text-[#111B21] rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words pr-2">
                        {msg.text}
                      </p>
                      <div className="flex items-center justify-end space-x-1 mt-1 -mb-0.5">
                        <span className="text-[10px] text-[#667781] leading-none">
                          {formatTime(msg.timestamp)}
                        </span>
                        {isFromRonald && (
                          <CheckCheck className="w-3.5 h-3.5 text-[#53BDEB]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Clean Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="bg-[#F0F2F5] px-3 py-2.5 flex items-center gap-2 border-t border-[#D1D7DB] shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
