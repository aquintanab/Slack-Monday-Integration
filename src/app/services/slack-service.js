// src/app/services/slack-service.js

const { WebClient } = require('@slack/web-api');
const config = require('../../config/default.json');
const logger = require('../../utils/logger');

class SlackService {
  constructor() {
    this.client = new WebClient(config.slack.token);
  }

  /**
   * Verifica si un mensaje tiene un sticker específico
   * @param {string} channelId - ID del canal
   * @param {string} messageTs - Timestamp del mensaje
   * @param {string} stickerName - Nombre del sticker a buscar
   * @returns {Promise<boolean>} - True si el mensaje tiene el sticker
   */
  async hasReaction(channelId, messageTs, stickerName) {
    try {
      const response = await this.client.reactions.get({
        channel: channelId,
        timestamp: messageTs,
      });

      if (response.message && response.message.reactions) {
        return response.message.reactions.some(reaction => reaction.name === stickerName);
      }
      return false;
    } catch (error) {
      logger.error(`Error al verificar reacción: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtiene los detalles de un mensaje
   * @param {string} channelId - ID del canal
   * @param {string} messageTs - Timestamp del mensaje
   * @returns {Promise<Object>} - Detalles del mensaje
   */
  async getMessageDetails(channelId, messageTs) {
    try {
      const response = await this.client.conversations.history({
        channel: channelId,
        latest: messageTs,
        inclusive: true,
        limit: 1
      });

      if (response.messages && response.messages.length > 0) {
        return response.messages[0];
      }
      return null;
    } catch (error) {
      logger.error(`Error al obtener detalles del mensaje: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualiza un hilo en Slack con información de Monday
   * @param {string} channelId - ID del canal
   * @param {string} threadTs - Timestamp del hilo
   * @param {string} message - Mensaje a publicar
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async updateThread(channelId, threadTs, message) {
    try {
      return await this.client.chat.postMessage({
        channel: channelId,
        thread_ts: threadTs,
        text: message
      });
    } catch (error) {
      logger.error(`Error al actualizar hilo: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new SlackService();
