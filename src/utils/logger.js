// src/utils/logger.js

const winston = require('winston');
const path = require('path');

// Configuración de los formatos de log
const formats = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Crear el logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: formats,
  transports: [
    // Escribir todos los logs con nivel 'info' y menos en la consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        formats
      )
    }),
    // Escribir logs de error en un archivo
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
      level: 'error'
    }),
    // Escribir todos los logs en otro archivo
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'combined.log')
    })
  ]
});

// Si estamos en entorno de desarrollo, mostrar logs más detallados
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

module.exports = logger;
