// src/slack.js
const { WebClient } = require('@slack/web-api');
const config = require('./config');

// Cliente de Slack
const slackClient = new WebClient(config.slack.token);

/**
 * Verifica si un mensaje tiene el sticker que nos interesa
 */
async function hasTargetReaction(channelId, messageTs) {
  try {
    const response = await slackClient.reactions.get({
      channel: channelId,
      timestamp: messageTs,
    });

    if (response.message && response.message.reactions) {
      return response.message.reactions.some(reaction => 
        reaction.name === config.slack.triggerReaction);
    }
    return false;
  } catch (error) {
    console.error('Error al verificar reacción:', error.message);
    return false;
  }
}

/**
 * Obtiene los detalles de un mensaje
 */
async function getMessageDetails(channelId, messageTs) {
  try {
    const response = await slackClient.conversations.history({
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
    console.error('Error al obtener mensaje:', error.message);
    return null;
  }
}

/**
 * Envía un mensaje en un hilo de Slack
 */
async function sendThreadMessage(channelId, threadTs, message) {
  try {
    return await slackClient.chat.postMessage({
      channel: channelId,
      thread_ts: threadTs,
      text: message
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error.message);
  }
}

module.exports = {
  hasTargetReaction,
  getMessageDetails,
  sendThreadMessage
};
