import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, Flower2, BookOpen, CheckCheck } from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, UserExperienceData } from '../types';

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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const chatId = experience.id;
  const currentUserId = experience.id;
  const currentUserName = experience.name || experience.username || 'Usuario';

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupChat = async () => {
      try {
        await api.ensureUserChatInitialized(chatId);
      } catch {
        // silent fallback
      }

      unsubscribe = api.subscribeToChat(
        chatId,
        (liveMessages) => {
          setMessages(liveMessages);
        },
        () => {
          // silent fallback
        }
      );
    };

    setupChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending) return;

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
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="text-xs text-white/90 font-light">en línea</span>
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
          {/* Date Pill */}
          <div className="flex justify-center my-1">
            <span className="bg-white/90 text-[#54656F] text-[11px] font-medium px-3 py-1 rounded-lg shadow-2xs">
              Hoy
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <span className="bg-white/85 text-[#54656F] text-xs px-4 py-2 rounded-lg shadow-2xs max-w-xs">
                Inicia tu conversación con Ronald
              </span>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromMe =
                msg.senderRole === 'user' || msg.senderId === currentUserId;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isFromMe ? 'items-end' : 'items-start'
                  } w-full`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] px-3.5 py-2 rounded-xl text-sm leading-relaxed relative shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
                      isFromMe
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
                      {isFromMe && (
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

        {/* WhatsApp Input Bar */}
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
      </div>
    </div>
  );
};
