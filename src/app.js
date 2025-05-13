// src/app.js
// Main application entry point

const { start } = require('@mondaydotcom/apps-sdk');
const { startServer } = require('./server');
const logger = require('./utils/logger');

// Define Monday app routes and actions
start({
  // Authentication routes for OAuth 2.0
  auth: {
    clientId: process.env.MONDAY_CLIENT_ID,
    clientSecret: process.env.MONDAY_CLIENT_SECRET,
  },
  
  // Define Monday app features - actions, views, etc.
  features: {
    // Define custom actions
    actions: [
      {
        // This action will be the main integration point
        name: 'slack-monday-integration',
        title: 'Sync Slack Notifications',
        description: 'Sync Slack notifications with specific reactions to Monday.com',
        execute: async (context, params) => {
          // This would typically be triggered when the user enables the integration
          logger.info('Slack-Monday integration activated with params:', params);
          
          // In a real implementation, you would store the configuration
          // and start listening for reactions in the specific Slack channels
          
          return { success: true };
        },
      },
    ],
    
    // Define custom views if needed
    views: [
      {
        name: 'settings',
        title: 'Integration Settings',
        url: '/settings',
        type: 'board-view',
      },
    ],
  },
  
  // Middleware to log requests
  beforeRequest: (ctx, next) => {
    logger.info('Request received:', ctx.request.path);
    return next();
  },
});

// Start the Express server for handling Slack webhooks
const server = startServer();

// Handle process termination
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});
