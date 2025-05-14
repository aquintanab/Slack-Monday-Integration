// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/default.json');
const logger = require('./utils/logger');
const slackController = require('./app/controllers/slack');
const mondayController = require('./app/controllers/monday');

// Crear la aplicación Express
const app = express();

// Configurar middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint para verificación de Slack
app.post('/slack/events', async (req, res) => {
  const { body } = req;
  
  // Verificación de URL de Slack
  if (body.type === 'url_verification') {
    return res.json({ challenge: body.challenge });
  }
  
  // Manejar eventos de Slack
  if (body.event) {
    // Confirmar recepción del evento inmediatamente
    res.status(200).send();
    
    // Procesar el evento en segundo plano
    try {
      if (body.event.type === 'reaction_added') {
        await slackController.handleReactionEvent(body.event);
      }
    } catch (error) {
      logger.error(`Error al procesar evento de Slack: ${error.message}`);
    }
  } else {
    res.status(400).send('Evento no reconocido');
  }
});

// Endpoint para webhooks de Monday
app.post('/monday/webhook', async (req, res) => {
  const { body } = req;
  
  // Confirmar recepción del evento inmediatamente
  res.status(200).send();
  
  // Procesar el evento en segundo plano
  try {
    if (body.event && body.event.type === 'change_column_value') {
      await mondayController.handleStatusChangeEvent(body.event);
    }
  } catch (error) {
    logger.error(`Error al procesar webhook de Monday: ${error.message}`);
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || config.server.port || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor iniciado en el puerto ${PORT}`);
});
