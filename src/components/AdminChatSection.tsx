import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
  Music,
  ExternalLink,
  Save,
  Clock,
  Sparkles,
  Cloud,
} from 'lucide-react';
import { api } from '../lib/api';
import type { ChatMessage, ChatSummary, UserRecord } from '../types';

interface AdminChatSectionProps {
  users: UserRecord[];
  onSelectUserToPreview?: (username: string) => void;
  onRefreshUsers?: () => Promise<void>;
}

export const AdminChatSection: React.FC<AdminChatSectionProps> = ({
  users,
  onSelectUserToPreview,
  onRefreshUsers,
}) => {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>('isaias');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [audioUrlInput, setAudioUrlInput] = useState('');
  const [isSavingAudio, setIsSavingAudio] = useState(false);
  const [audioSaveSuccess, setAudioSaveSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to all chats list
  useEffect(() => {
    const unsubscribe = api.subscribeToAllChats((liveChats) => {
      setChats(liveChats);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Set audio URL input when selected user changes
  useEffect(() => {
    const user = users.find((u) => u.id === selectedChatId);
    if (user) {
      setAudioUrlInput(user.audioUrl || (user.id === 'isaias' ? '/audio/neo_roneo.mp3' : ''));
    }
  }, [selectedChatId, users]);

  // Subscribe to selected chat's messages in real time
  useEffect(() => {
    if (!selectedChatId) return;

    let unsubscribe: (() => void) | undefined;

    const setupChat = async () => {
      try {
        await api.ensureUserChatInitialized(selectedChatId);
      } catch (err) {
        console.warn('Chat init error:', err);
      }

      unsubscribe = api.subscribeToChat(
        selectedChatId,
        (liveMessages) => {
          setMessages(liveMessages);
        },
        (err) => {
          console.error('Error listening to chat messages:', err);
          setErrorMsg('Error al conectar con la conversación.');
        }
      );
    };

    setupChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedChatId]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isSending || !selectedChatId) return;

    setIsSending(true);
    setErrorMsg(null);
    setInputText('');

    try {
      await api.sendChatMessage(
        selectedChatId,
        trimmed,
        'admin',
        'ronald',
        'Ronald'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al enviar respuesta.');
      setInputText(trimmed);
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

  const handleSaveAudioUrl = async () => {
    if (!selectedChatId) return;
    setIsSavingAudio(true);
    try {
      await api.updateAdminUser(selectedChatId, {
        audioUrl: audioUrlInput.trim(),
      });
      if (onRefreshUsers) {
        await onRefreshUsers();
      }
      setAudioSaveSuccess(true);
      setTimeout(() => setAudioSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error al guardar la URL de audio.');
    } finally {
      setIsSavingAudio(false);
    }
  };

  const selectedUser = users.find((u) => u.id === selectedChatId);

  // Combine known users that have chats or responses, prioritizing Isaias
  const chatUserList = users.filter((u) => u.id !== 'ronald');
  // Ensure isaias is at the top of the list
  const sortedUsers = [...chatUserList].sort((a, b) => {
    if (a.id === 'isaias') return -1;
    if (b.id === 'isaias') return 1;
    return a.name.localeCompare(b.name);
  });

  const formatTime = (isoString: string) => {
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
      {/* Sidebar: Users List for Chats */}
      <div className="lg:col-span-4 flex flex-col rounded-2xl bg-white border border-[#E8E2D9] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#EDE6DB] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#2C2926]" />
            <h3 className="text-sm font-semibold text-[#2C2926]">Conversaciones</h3>
          </div>
          <span className="flex items-center space-x-1.5 text-[11px] text-[#15803D] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded-full">
            <Cloud className="w-3 h-3 animate-pulse" />
            <span>En vivo</span>
          </span>
        </div>

        {/* User items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0EAE1]">
          {sortedUsers.map((u) => {
            const isSelected = selectedChatId === u.id;
            const chatMeta = chats.find((c) => c.userId === u.id);
            const hasResponse = u.userResponse && u.userResponse.text;
            const isIsaias = u.id === 'isaias';

            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedChatId(u.id)}
                className={`w-full text-left p-3.5 transition-all flex items-start space-x-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#2C2926] text-white'
                    : 'hover:bg-[#FAF8F5] text-[#2C2926]'
                }`}
              >
                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isIsaias
                        ? isSelected
                          ? 'bg-[#00E5FF] text-[#030B17]'
                          : 'bg-[#0284C7] text-white'
                        : isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E8E2D9] text-[#2C2926]'
                    }`}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  {isIsaias && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00E5FF] border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-white' : 'text-[#2C2926]'
                      }`}
                    >
                      {u.name}
                    </span>
                    {isIsaias && (
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm ${
                          isSelected
                            ? 'bg-[#00E5FF] text-[#030B17]'
                            : 'bg-[#0284C7]/15 text-[#0284C7]'
                        }`}
                      >
                        Exclusivo
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-white/75' : 'text-[#8C847B]'
                    }`}
                  >
                    {chatMeta?.lastMessageText ||
                      (hasResponse
                        ? `Respuesta: "${u.userResponse?.text.slice(0, 30)}..."`
                        : 'Sin mensajes')}
                  </p>

                  <div className="flex items-center space-x-2 mt-1">
                    {hasResponse && (
                      <span
                        className={`text-[10px] font-medium flex items-center space-x-0.5 ${
                          isSelected ? 'text-[#86EFAC]' : 'text-[#15803D]'
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3 inline" />
                        <span>Respuesta enviada</span>
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="lg:col-span-8 flex flex-col rounded-2xl bg-white border border-[#E8E2D9] shadow-xs overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#EDE6DB] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                selectedChatId === 'isaias'
                  ? 'bg-linear-to-tr from-[#0284C7] to-[#00E5FF] text-[#030B17]'
                  : 'bg-[#2C2926] text-white'
              }`}
            >
              {selectedUser?.name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-[#2C2926]">
                  Chat con {selectedUser?.name || selectedChatId}
                </h3>
                {selectedChatId === 'isaias' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0284C7]/15 text-[#0284C7] font-semibold">
                    @isaias
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-[#15803D] mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                <span>Sincronización en tiempo real con Firestore</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onSelectUserToPreview && (
              <button
                type="button"
                onClick={() => onSelectUserToPreview(selectedChatId)}
                className="inline-flex items-center space-x-1 text-xs py-1.5 px-3 rounded-lg border border-[#EDE6DB] bg-white text-[#2C2926] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Previsualizar experiencia de este usuario"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#8C847B]" />
                <span className="hidden sm:inline">Previsualizar</span>
              </button>
            )}
          </div>
        </div>

        {/* Audio Manager Pill for Isaias */}
        {selectedChatId === 'isaias' && (
          <div className="bg-[#071427] text-white px-4 py-2.5 border-b border-[#00E5FF]/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Music className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-xs font-semibold text-[#E2F1FF]">
                Música Exclusiva: NEO RONEO
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-1 max-w-md justify-end">
              <input
                type="text"
                value={audioUrlInput}
                onChange={(e) => setAudioUrlInput(e.target.value)}
                placeholder="URL online del audio (Firebase Storage o /audio/...)"
                className="w-full text-xs bg-[#030B17] border border-[#00E5FF]/30 rounded-lg px-2.5 py-1 text-[#E2F1FF] placeholder-white/30 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleSaveAudioUrl}
                disabled={isSavingAudio}
                className="shrink-0 inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-[#00E5FF] text-[#030B17] font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>{isSavingAudio ? '...' : 'Guardar'}</span>
              </button>
            </div>
            {audioSaveSuccess && (
              <span className="text-[10px] text-emerald-400 font-medium w-full text-right">
                Fuente de audio actualizada para Isaias.
              </span>
            )}
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[460px] space-y-3 bg-[#FAF8F5]/60">
          {messages.length === 0 ? (
            <div className="py-14 text-center text-[#8C847B]">
              <MessageSquare className="w-8 h-8 mx-auto text-[#D5CEBF] mb-2" />
              <p className="text-xs">No hay mensajes todavía en esta conversación.</p>
              <p className="text-[11px] text-[#A89F91] mt-1">
                Cuando {selectedUser?.name || 'el usuario'} envíe su respuesta, aparecerá aquí en tiempo real.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isAdmin = msg.senderRole === 'admin' || msg.senderId === 'ronald';
              const isOriginal = !!msg.isOriginalResponse;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isAdmin ? 'items-end' : 'items-start'
                  } w-full`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 shadow-2xs relative ${
                      isAdmin
                        ? 'bg-[#2C2926] text-[#FAF8F5] rounded-tr-xs'
                        : isOriginal
                        ? 'bg-linear-to-r from-[#EFF6FF] to-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] rounded-tl-xs'
                        : 'bg-white text-[#2C2926] border border-[#E8E2D9] rounded-tl-xs'
                    }`}
                  >
                    {/* Header tag */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-semibold ${
                          isAdmin
                            ? 'text-white/70'
                            : isOriginal
                            ? 'text-[#1D4ED8]'
                            : 'text-[#8C847B]'
                        }`}
                      >
                        {isAdmin ? 'Tú (Ronald)' : msg.senderName || selectedUser?.name}
                      </span>

                      {isOriginal && (
                        <span className="inline-flex items-center space-x-1 text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-[#2563EB] text-white">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Respuesta Original</span>
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>

                    {/* Time */}
                    <div
                      className={`flex items-center justify-end space-x-1 mt-1.5 text-[9px] font-mono ${
                        isAdmin ? 'text-white/50' : 'text-[#8C847B]'
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isAdmin && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-[#EDE6DB] bg-white">
          {errorMsg && (
            <div className="mb-2 p-2 rounded-lg bg-[#FDF2F0] border border-[#F5C6CB] text-[#902A24] text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Escribir respuesta en tiempo real a ${selectedUser?.name || selectedChatId}...`}
              disabled={isSending}
              className="flex-1 p-2.5 sm:p-3 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm text-[#2C2926] placeholder-[#A89F91] focus:outline-hidden focus:border-[#2C2926] resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim()}
              className="shrink-0 w-11 h-11 rounded-xl bg-[#2C2926] text-white flex items-center justify-center hover:bg-[#1A1816] disabled:opacity-40 transition-all cursor-pointer font-bold shadow-xs"
              title="Enviar respuesta"
            >
              {isSending ? (
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8C847B]">
            <span>Enter para enviar · Los mensajes se entregan instantáneamente</span>
            <span>Firestore Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
