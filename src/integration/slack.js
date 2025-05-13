// src/integrations/slack.js
// Slack API integration

const { SlackAPI } = require('@slack/web-api');
const { config } = require('../config');
const logger = require('../utils/logger');

// Initialize Slack client
const slackClient = new SlackAPI(config.SLACK_API_TOKEN);

// Get message details from Slack
async function getMessageDetails(channelId, messageTs) {
  try {
    const result = await slackClient.conversations.history({
      channel: channelId,
      latest: messageTs,
      inclusive: true,
      limit: 1
    });

    if (result.messages && result.messages.length > 0) {
      return result.messages[0];
    }
    
    logger.error('Message not found');
    return null;
  } catch (error) {
    logger.error('Error fetching message details:', error);
    throw error;
  }
}

// Parse match information from a message
function parseMatchInformation(message) {
  // This function should be customized based on your specific message format
  // For example, if the message text contains match information in a specific format
  
  const text = message.text || '';
  
  // Example parsing logic (adjust based on your actual message format)
  // Match pattern like "Team A vs Team B - suspended markets for yellow cards"
  const matchPattern = /([^-]+)(?:\s*-\s*)(.+)/;
  const match = text.match(matchPattern);
  
  if (match) {
    const matchName = match[1].trim();
    const details = match[2].trim();
    
    // Determine if this is a priority case
    const isPriority = details.toLowerCase().includes('priority') || 
                      details.toLowerCase().includes('urgent');
    
    return {
      matchName,
      details,
      date: new Date().toISOString().split('T')[0], // Use current date as default
      priority: isPriority
    };
  }
  
  // If we couldn't parse it with the pattern, return a basic object with the full text
  return {
    matchName: text.split(' ').slice(0, 5).join(' '), // Use first 5 words as match name
    details: text,
    date: new Date().toISOString().split('T')[0],
    priority: false
  };
}

module.exports = {
  slackClient,
  getMessageDetails,
  parseMatchInformation
};
