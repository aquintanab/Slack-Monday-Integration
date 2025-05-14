// src/app/services/monday-service.js

const mondaySdk = require('monday-sdk-js');
const config = require('../../config/default.json');
const logger = require('../../utils/logger');

class MondayService {
  constructor() {
    this.monday = mondaySdk();
    this.monday.setToken(config.monday.token);
  }

  /**
   * Crea un nuevo ítem en Monday basado en una notificación de Slack
   * @param {Object} notification - Datos de la notificación
   * @returns {Promise<Object>} - El ítem creado
   */
  async createItem(notification) {
    try {
      const query = `mutation($boardId: Int!, $itemName: String!, $columnValues: JSON!) {
        create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
          id
          name
        }
      }`;

      const variables = {
        boardId: config.monday.boardId,
        itemName: notification.title,
        columnValues: JSON.stringify({
          'fecha': { date: notification.date },
          'estado': { label: "En revisión" },
          'detalles': notification.details,
          'slack_link': notification.slackLink,
          'asignado_a': notification.assignedTo || null
        })
      };

      const response = await this.monday.api(query, { variables });
      logger.info(`Ítem creado en Monday: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      logger.error(`Error al crear ítem en Monday: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualiza el estado de un ítem en Monday
   * @param {string} itemId - ID del ítem
   * @param {string} status - Nuevo estado
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async updateItemStatus(itemId, status) {
    try {
      const query = `mutation($itemId: Int!, $columnValues: JSON!) {
        change_column_value(item_id: $itemId, board_id: ${config.monday.boardId}, column_id: "estado", value: $columnValues) {
          id
        }
      }`;

      const variables = {
        itemId: parseInt(itemId),
        columnValues: JSON.stringify({
          label: status
        })
      };

      const response = await this.monday.api(query, { variables });
      logger.info(`Estado actualizado para ítem ${itemId}: ${status}`);
      return response.data;
    } catch (error) {
      logger.error(`Error al actualizar estado del ítem: ${error.message}`);
      throw error;
    }
  }

  /**
   * Busca un ítem por su link de Slack
   * @param {string} slackLink - Link del mensaje de Slack
   * @returns {Promise<Object|null>} - El ítem encontrado o null
   */
  async findItemBySlackLink(slackLink) {
    try {
      const query = `query($boardId: Int!) {
        items_by_column_values(board_id: $boardId, column_id: "slack_link", column_value: "${slackLink}") {
          id
          name
          column_values {
            id
            text
          }
        }
      }`;

      const variables = {
        boardId: config.monday.boardId
      };

      const response = await this.monday.api(query, { variables });
      
      if (response.data && response.data.items_by_column_values.length > 0) {
        return response.data.items_by_column_values[0];
      }
      return null;
    } catch (error) {
      logger.error(`Error al buscar ítem por link de Slack: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new MondayService();
