/**
 * Utility to format chat date separators like WhatsApp:
 * - "Hoy" for messages sent today (local user timezone)
 * - "Ayer" for messages sent yesterday (local user timezone)
 * - "20 de septiembre de 2026" for older dates
 */
export function getChatDateSeparator(isoString?: string): string {
  if (!isoString) return 'Hoy';

  try {
    const msgDate = new Date(isoString);
    if (isNaN(msgDate.getTime())) return 'Hoy';

    const now = new Date();

    // Check if same day (Hoy)
    const isToday =
      msgDate.getDate() === now.getDate() &&
      msgDate.getMonth() === now.getMonth() &&
      msgDate.getFullYear() === now.getFullYear();

    if (isToday) {
      return 'Hoy';
    }

    // Check if yesterday (Ayer)
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      msgDate.getDate() === yesterday.getDate() &&
      msgDate.getMonth() === yesterday.getMonth() &&
      msgDate.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Ayer';
    }

    // Format full date in Spanish: "20 de septiembre de 2026"
    const day = msgDate.getDate();
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    const month = months[msgDate.getMonth()];
    const year = msgDate.getFullYear();

    return `${day} de ${month} de ${year}`;
  } catch {
    return 'Hoy';
  }
}

/**
 * Helper to get a unique day key for grouping messages by local date (YYYY-MM-DD)
 */
export function getMessageDayKey(isoString?: string): string {
  if (!isoString) return 'today';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'today';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  } catch {
    return 'today';
  }
}
