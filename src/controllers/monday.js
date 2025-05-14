// src/app/controllers/monday.js

const mondayService = require('../services/monday-service');
const slackService = require('../services/slack-service');
const logger = require('../../utils/logger');

class MondayController {
  /**
   * Maneja el evento de cambio de estado en Monday
   * @param {Object} event - Evento de Monday
   * @returns {Promise<void>}
   */
  async handleStatusChangeEvent(event) {
    try {
      if (event.columnId === 'estado') {
        const itemId = event.pulseId;
        const newStatus = event.value.label;
        
        logger.info(`Estado actualizado en Monday para ítem ${itemId}: ${newStatus}`);
        
        // Obtener el ítem completo para encontrar el link de Slack
        const item = await mondayService.getItemById(itemId);
        
        if (!item) {
          logger.error(`No se pudo encontrar el ítem ${itemId}`);
          return;
        }
        
        // Extraer el link de Slack de las columnas del ítem
        const slackLinkColumn = item.column_values.find(col => col.id === 'slack_link');
        
        if (!slackLinkColumn || !slackLinkColumn.text) {
          logger.error(`No se encontró link de Slack para el ítem ${itemId}`);
          return;
        }
        
        // Extraer el channel ID y timestamp del link
        const slackLink = slackLinkColumn.text;
        const matches = slackLink.match(/archives\/([A-Z0-9]+)\/p(\d+)/);
        
        if (!matches || matches.length < 3) {
          logger.error(`No se pudo parsear el link de Slack: ${slackLink}`);
          return;
        }
        
        const channelId = matches[1];
        // Convertir el timestamp al formato que usa la API de Slack (con punto decimal)
        const messageTs = `${matches[2].slice(0, -6)}.${matches[2].slice(-6)}`;
        
        // Actualizar el thread de Slack con el nuevo estado
        await slackService.updateThread(
          channelId,
          messageTs,
          `:ballot_box_with_check: Estado actualizado en Monday: *${newStatus}*`
        );
        
        logger.info(`Thread de Slack actualizado con el nuevo estado: ${newStatus}`);
      }
    } catch (error) {
      logger.error(`Error al manejar evento de cambio de estado: ${error.message}`);
    }
  }

  /**
   * Obtiene un ítem por su ID
   * @param {string} itemId - ID del ítem
   * @returns {Promise<Object|null>} - El ítem o null si no existe
   */
  async getItemById(itemId) {
    try {
      const query = `query {
        items(ids: [${itemId}]) {
          id
          name
          column_values {
            id
            text
          }
        }
      }`;
      
      const response = await mondayService.monday.api(query);
      
      if (response.data && response.data.items && response.data.items.length > 0) {
        return response.data.items[0];
      }
      return null;
    } catch (error) {
      logger.error(`Error al obtener ítem por ID: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new MondayController();
