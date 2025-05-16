// src/monday.js
const mondaySdk = require('monday-sdk-js');
const config = require('./config');

// Cliente de Monday
const monday = mondaySdk();
monday.setToken(config.monday.token);

/**
 * Crea un nuevo ítem en Monday
 */
async function createItem(data) {
  try {
    const query = `mutation($boardId: Int!, $itemName: String!, $columnValues: JSON!) {
      create_item(board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
        id
        name
      }
    }`;

    const variables = {
      boardId: config.monday.boardId,
      itemName: data.title,
      columnValues: JSON.stringify({
        'texto': data.text,
        'estado': { label: "En revisión" },
        'slack_link': data.slackLink,
        'fecha': { date: new Date().toISOString().split('T')[0] }
      })
    };

    const response = await monday.api(query, { variables });
    console.log('Ítem creado en Monday:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear ítem en Monday:', error.message);
    throw error;
  }
}

/**
 * Busca un ítem por el link de Slack
 */
async function findItemBySlackLink(slackLink) {
  try {
    const query = `query($boardId: Int!) {
      items_by_column_values(board_id: $boardId, column_id: "slack_link", column_value: "${slackLink}") {
        id
        name
      }
    }`;

    const variables = {
      boardId: config.monday.boardId
    };

    const response = await monday.api(query, { variables });
    
    if (response.data && response.data.items_by_column_values.length > 0) {
      return response.data.items_by_column_values[0];
    }
    return null;
  } catch (error) {
    console.error('Error al buscar ítem por link de Slack:', error.message);
    return null;
  }
}

module.exports = {
  createItem,
  findItemBySlackLink
};
