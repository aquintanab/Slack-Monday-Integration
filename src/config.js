// src/config.js
require('dotenv').config();

const config = {
  slack: {
    token: process.env.SLACK_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    triggerReaction: process.env.TRIGGER_REACTION || 'yc-suspended'
  },
  monday: {
    token: process.env.MONDAY_TOKEN,
    boardId: parseInt(process.env.MONDAY_BOARD_ID)
  },
  server: {
    port: process.env.PORT || 3000
  }
};

module.exports = config;
