import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MessageSquare,
  Minus,
  Maximize2,
  X,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { UserRecord } from '../types';
import { WhatsAppAdminChatWindow } from './WhatsAppAdminChatWindow';

export interface WhatsAppAdminMultiChatManagerProps {
  openUsers: UserRecord[];
  onCloseUser: (userId: string) => void;
  onCloseAll: () => void;
  onOpenUser?: (user: UserRecord) => void;
}

export const WhatsAppAdminMultiChatManager: React.FC<WhatsAppAdminMultiChatManagerProps> = ({
  openUsers,
  onCloseUser,
  onCloseAll,
}) => {
  const [minimizedIds, setMinimizedIds] = useState<string[]>([]);
  const [maximizedId, setMaximizedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // If a new user is opened, ensure they are unminimized and focused
  useEffect(() => {
    if (openUsers.length > 0) {
      const latestUser = openUsers[openUsers.length - 1];
      if (latestUser) {
        setMinimizedIds((prev) => prev.filter((id) => id !== latestUser.id));
        setFocusedId(latestUser.id);
      }
    }
  }, [openUsers.length]);

  // Clean up minimizedIds and maximizedId if users are closed
  useEffect(() => {
    const openIds = new Set(openUsers.map((u) => u.id));
    setMinimizedIds((prev) => prev.filter((id) => openIds.has(id)));
    if (maximizedId && !openIds.has(maximizedId)) {
      setMaximizedId(null);
    }
    if (focusedId && !openIds.has(focusedId)) {
      setFocusedId(openUsers.length > 0 ? openUsers[0].id : null);
    }
  }, [openUsers, maximizedId, focusedId]);

  if (openUsers.length === 0) {
    return null;
  }

  const handleToggleMinimize = (userId: string) => {
    setMinimizedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
    if (maximizedId === userId) {
      setMaximizedId(null);
    }
  };

  const handleToggleMaximize = (userId: string) => {
    setMaximizedId((prev) => (prev === userId ? null : userId));
    setMinimizedIds((prev) => prev.filter((id) => id !== userId));
  };

  const handleMinimizeAll = () => {
    setMinimizedIds(openUsers.map((u) => u.id));
    setMaximizedId(null);
  };

  const handleRestoreAll = () => {
    setMinimizedIds([]);
  };

  const allMinimized =
    openUsers.length > 0 &&
    openUsers.every((u) => minimizedIds.includes(u.id));

  // If any window is maximized, render it as overlay modal
  const maximizedUser = openUsers.find((u) => u.id === maximizedId);

  return (
    <>
      {/* Maximized window overlay if active */}
      <AnimatePresence>
        {maximizedUser && (
          <WhatsAppAdminChatWindow
            key={`max-${maximizedUser.id}`}
            user={maximizedUser}
            isMinimized={false}
            isMaximized={true}
            onToggleMinimize={() => handleToggleMinimize(maximizedUser.id)}
            onToggleMaximize={() => handleToggleMaximize(maximizedUser.id)}
            onClose={() => {
              setMaximizedId(null);
              onCloseUser(maximizedUser.id);
            }}
            onFocus={() => setFocusedId(maximizedUser.id)}
            zIndex={100}
          />
        )}
      </AnimatePresence>

      {/* Floating Bottom Dock for multiple chat windows */}
      <div
        id="admin-multi-chat-dock"
        className="fixed bottom-0 right-0 z-40 p-2 sm:p-4 pointer-events-none flex flex-col items-end max-w-full"
      >
        {/* Multi-Chat Control Bar (when 2+ chats are open) */}
        {openUsers.length >= 2 && !maximizedUser && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mb-2 pointer-events-auto bg-[#0F172A]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl px-3 py-1.5 flex items-center space-x-2 text-white text-xs select-none"
          >
            <div className="flex items-center space-x-1.5 text-[#38BDF8] font-semibold text-[11px] pr-1 border-r border-white/10">
              <Layers className="w-3.5 h-3.5" />
              <span>{openUsers.length} chats</span>
            </div>

            <div className="flex items-center space-x-1">
              {allMinimized ? (
                <button
                  type="button"
                  onClick={handleRestoreAll}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Restaurar todas las ventanas"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Restaurar</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleMinimizeAll}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Minimizar todas las ventanas"
                >
                  <Minus className="w-3 h-3" />
                  <span>Minimizar</span>
                </button>
              )}

              <button
                type="button"
                onClick={onCloseAll}
                className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-[11px] font-medium transition-colors flex items-center space-x-1 cursor-pointer"
                title="Cerrar todos los chats abiertos"
              >
                <X className="w-3 h-3" />
                <span>Cerrar todos</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Windows Container (Side-by-side on desktop, wrapped/scrollable) */}
        {!maximizedUser && (
          <div className="flex flex-col-reverse sm:flex-row-reverse items-end gap-3 max-w-[100vw] overflow-x-auto no-scrollbar pb-1">
            <AnimatePresence>
              {openUsers.map((u, index) => {
                const isMin = minimizedIds.includes(u.id);
                const isFoc = focusedId === u.id;

                return (
                  <WhatsAppAdminChatWindow
                    key={u.id}
                    user={u}
                    isMinimized={isMin}
                    isMaximized={false}
                    onToggleMinimize={() => handleToggleMinimize(u.id)}
                    onToggleMaximize={() => handleToggleMaximize(u.id)}
                    onClose={() => onCloseUser(u.id)}
                    onFocus={() => setFocusedId(u.id)}
                    zIndex={isFoc ? 60 : 40 + index}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};
