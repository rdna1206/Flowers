import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import type { UserRecord } from '../types';
import { WhatsAppAdminChatWindow } from './WhatsAppAdminChatWindow';

export { WhatsAppAdminChatWindow } from './WhatsAppAdminChatWindow';
export { WhatsAppAdminMultiChatManager } from './WhatsAppAdminMultiChatManager';

export interface WhatsAppAdminChatModalProps {
  user: UserRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppAdminChatModal: React.FC<WhatsAppAdminChatModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div
        id="admin-dark-chat-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md pointer-events-auto"
        onClick={onClose}
      >
        <WhatsAppAdminChatWindow
          user={user}
          isMinimized={isMinimized}
          isMaximized={isMaximized}
          onToggleMinimize={() => setIsMinimized((prev) => !prev)}
          onToggleMaximize={() => setIsMaximized((prev) => !prev)}
          onClose={onClose}
          zIndex={100}
        />
      </div>
    </AnimatePresence>
  );
};
