// src/app/controllers/slack.js

const slackService = require('../services/slack-service');
const mondayService = require('../services/monday-service');
const logger = require('../../utils/logger');
const { parseNotificationDetails } = require('../../utils/helpers');

class SlackController {
  /**
   * Maneja los eventos de reacción de Slack
   * @param {Object} event - Evento de reacción
   * @returns {Promise<void>}
   */
  async handleReactionEvent(event) {
    try {
      // Verificar si es el sticker que activa la creación de un ítem
      if (event.reaction === process.env.TRIGGER_REACTION || event.reaction === "eyes") {
        logger.info(`Reacción detectada: ${event.reaction}`);
        
        // Obtener detalles del mensaje
        const message = await slackService.getMessageDetails(event.item.channel, event.item.ts);
        
        if (!message) {
          logger.error('No se pudo obtener el mensaje original');
          return;
        }
        
        // Generar link del mensaje para referenciar en Monday
        const slackLink = `https://slack.com/archives/${event.item.channel}/p${event.item.ts.replace('.', '')}`;
        
        // Parsear los detalles de la notificación del mensaje
        const notificationDetails = parseNotificationDetails(message.text);
        
        // Verificar si ya existe un ítem para este mensaje
        const existingItem = await mondayService.findItemBySlackLink(slackLink);
        
        if (existingItem) {
          logger.info(`Ya existe un ítem para este mensaje: ${existingItem.id}`);
          // Actualizar el thread para informar que ya está siendo rastreado
          await slackService.updateThread(
            event.item.channel,
            event.item.ts,
            `:information_source: Este mensaje ya está siendo rastreado en Monday (ID: ${existingItem.id})`
          );
          return;
        }
        
        // Crear notificación para Monday
        const notification = {
          title: notificationDetails.title || 'Nueva revisión de partido',
          date: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
          details: message.text,
          slackLink: slackLink,
          assignedTo: event.user // Usuario que agregó la reacción
        };
        
        // Crear ítem en Monday
        const newItem = await mondayService.createItem(notification);
        
        // Actualizar el thread con la información del ítem creado
        await slackService.updateThread(
          event.item.channel,
          event.item.ts,
          `:white_check_mark: Notificación registrada en Monday (ID: ${newItem.create_item.id})`
        );
        
        logger.info(`Ítem creado correctamente en Monday: ${newItem.create_item.id}`);
      }
    } catch (error) {
      logger.error(`Error al manejar evento de reacción: ${error.message}`);
    }
  }

  /**
   * Verifica si un mensaje tiene la reacción que activa la creación de un ítem
   * @param {string} channelId - ID del canal
   * @param {string} messageTs - Timestamp del mensaje
   * @returns {Promise<boolean>} - True si tiene la reacción
   */
  async hasTriggeredReaction(channelId, messageTs) {
    return await slackService.hasReaction(channelId, messageTs, process.env.TRIGGER_REACTION || "eyes");
  }
}

module.exports = new SlackController();
