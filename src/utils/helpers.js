// src/utils/helpers.js

/**
 * Parsea los detalles de una notificación de texto de Slack
 * @param {string} text - Texto del mensaje
 * @returns {Object} - Detalles estructurados de la notificación
 */
function parseNotificationDetails(text) {
  // Implementación básica - se puede personalizar según el formato de las notificaciones
  
  // Intentar extraer título del partido (primera línea o contenido hasta el primer punto)
  let title = '';
  if (text.includes('\n')) {
    title = text.split('\n')[0].trim();
  } else if (text.includes('.')) {
    title = text.split('.')[0].trim();
  } else {
    title = text.slice(0, Math.min(text.length, 50)).trim();
  }
  
  // Intentar extraer otros datos relevantes
  // Por ejemplo, buscar fechas, nombres de equipos, IDs, etc.
  const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})|(\d{4}[\/\-]\d{2}[\/\-]\d{2})/);
  const date = dateMatch ? dateMatch[0] : '';
  
  // Buscar patrones como "Equipo A vs Equipo B" o similares
  const matchPattern = text.match(/([A-Za-z0-9\s]+)\s+(?:vs\.?|contra|vs)\s+([A-Za-z0-9\s]+)/i);
  let teams = '';
  if (matchPattern) {
    teams = matchPattern[0];
  }
  
  return {
    title: title || 'Nueva revisión de partido',
    date,
    teams,
    rawText: text
  };
}

/**
 * Formatea una fecha en formato ISO a un formato amigable
 * @param {string} isoDate - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
function formatDate(isoDate) {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return isoDate;
  }
}

module.exports = {
  parseNotificationDetails,
  formatDate
};
