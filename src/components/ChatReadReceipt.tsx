import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface ChatReadReceiptProps {
  read: boolean;
  isRecipientActive?: boolean;
  isDarkBackground?: boolean;
  className?: string;
}

/**
 * Realistic WhatsApp Message Read Status Indicator:
 * - Single gray check (✓): Enviado a la base de datos (destinatario desconectado)
 * - Double gray check (✓✓): Entregado (destinatario en línea / activo en el chat)
 * - Double blue check (✓✓): Leído por el destinatario (abrió o tiene el chat a la vista)
 */
export const ChatReadReceipt: React.FC<ChatReadReceiptProps> = ({
  read,
  isRecipientActive = false,
  isDarkBackground = true,
  className = 'w-3.5 h-3.5',
}) => {
  if (read) {
    return (
      <CheckCheck
        className={`${className} text-[#53BDEB] shrink-0 inline-block`}
        title="Leído"
        aria-label="Leído"
      />
    );
  }

  if (isRecipientActive) {
    return (
      <CheckCheck
        className={`${className} ${
          isDarkBackground ? 'text-gray-300' : 'text-[#8696A0]'
        } shrink-0 inline-block`}
        title="Entregado"
        aria-label="Entregado"
      />
    );
  }

  return (
    <Check
      className={`${className} ${
        isDarkBackground ? 'text-gray-300' : 'text-[#8696A0]'
      } shrink-0 inline-block`}
      title="Enviado"
      aria-label="Enviado"
    />
  );
};
