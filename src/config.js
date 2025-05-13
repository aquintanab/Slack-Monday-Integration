// src/config.js
// Configuration for Slack-Monday Integration

// Load environment variables from .env file
require('dotenv').config();

const config = {
  // Monday.com configuration
  MONDAY_API_URL: 'https://api.monday.com/v2',
  MONDAY_API_TOKEN: process.env.MONDAY_API_TOKEN,
  MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID, // ID of your "Yellow card and Corner suspended markets" board
  
  // Slack configuration
  SLACK_API_TOKEN: process.env.SLACK_API_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  
  // Reaction/sticker configuration
  WATCHED_REACTION: 'pushpin', // Example reaction to watch for (change as needed)
  
  // Integration settings
  POLLING_INTERVAL: 60000, // 1 minute in milliseconds (for development only)
};

module.exports = { config };
