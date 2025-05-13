// src/server.js
// Express server to handle Slack Events API webhooks

const express = require('express');
const bodyParser = require('body-parser');
const { createEventAdapter } = require('@slack/events-api');
const { config } = require('./config');
const { getMessageDetails, parseMatchInformation } = require('./integrations/slack');
const { createMondayItem } = require('./integrations/monday');
const logger = require('./utils/logger');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Slack Events API
const slackEvents = createEventAdapter(config.SLACK_SIGNING_SECRET);

// Parse request bodies
app.use(bodyParser.json());
app.use('/slack/events', slackEvents.requestListener());

// Handle Slack reaction added event
slackEvents.on('reaction_added', async (event) => {
  try {
    logger.info('Reaction added:', event);
    
    // Check if the reaction matches our watched reaction
    if (event.reaction === config.WATCHED_REACTION) {
      const { item } = event;
      
      // Get the message that was reacted to
      const message = await getMessageDetails(item.channel, item.ts);
      
      if (message) {
        // Extract match information from the message
        const matchDetails = parseMatchInformation(message);
        
        // Create a new item in Monday.com
        await createMondayItem(matchDetails);
        
        logger.info('Successfully created Monday item for match:', matchDetails.matchName);
      }
    }
  } catch (error) {
    logger.error('Error handling reaction_added event:', error);
  }
});

// Handle URL verification for Slack
app.post('/slack/events', (req, res) => {
  if (req.body.type === 'url_verification') {
    res.send({ challenge: req.body.challenge });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
function startServer() {
  return app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

// Export server for testing
module.exports = { app, startServer };
