# Feed Assurance Slack-Monday Integration

Esta es una integración automatizada entre Slack y Monday para el equipo de Feed Assurance de Genius Sports. La aplicación permite que al marcar con un sticker específico una notificación en Slack, se cree automáticamente un registro correspondiente en Monday con los detalles del partido o evento.

## Características

- Monitoreo de reacciones en los mensajes de Slack
- Creación automática de ítems en Monday cuando se detecta una reacción específica
- Sincronización bidireccional: los cambios de estado en Monday se reflejan en el hilo de Slack
- Sistema de registro para auditoría y depuración

## Requisitos previos

- Node.js (v14+)
- Cuenta de Slack con permisos de administración
- Cuenta de Monday con permisos para crear aplicaciones
- Monday CLI instalado

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/slack-monday-integration.git
   cd slack-monday-integration
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus propios valores
   ```

4. Configurar los archivos de configuración en la carpeta `config/`:
   ```bash
   # Editar config/default.json con los datos de tus boards de Monday y tokens de Slack
   ```

## Configuración

### Configuración de Slack

1. Ir a [api.slack.com/apps](https://api.slack.com/apps)
2. Crear una nueva app y configurar:
   - Event Subscriptions
   - Bot Token Scopes (reactions:read, channels:history, chat:write)
   - Interactivity & Shortcuts

### Configuración de Monday

1. Ir a "Developers" > "My Apps" en Monday
2. Crear una nueva app
3. Configurar los permisos:
   - boards:write
   - boards:read
   - items:write
   - items:read
4. Configurar el tablero:
   - Crear un tablero con las columnas necesarias (estado, fecha, detalles, slack_link, asignado_a)

## Uso

1. Iniciar la aplicación:
   ```bash
   npm start
   ```

2. Exponer la aplicación a Internet (para recibir eventos de Slack):
   ```bash
   # Usar ngrok, Cloudflare Tunnel u otro servicio similar
   ngrok http 3000
   ```

3. Configurar la URL de eventos en la configuración de Slack:
   - Usar la URL generada por ngrok + "/slack/events"

4. Configurar el webhook en Monday:
   - En la configuración de la aplicación de Monday, crear un webhook para el evento "change_column_value"
   - Dirigir a la URL de ngrok + "/monday/webhook"

## Funcionamiento

1. Cuando un usuario añade el sticker configurado (por defecto: 👀) a un mensaje en Slack:
   - La aplicación detecta el evento
   - Extrae la información del mensaje
   - Crea un nuevo ítem en el tablero de Monday con esa información
   - Actualiza el hilo de Slack con la confirmación y el ID del ítem

2. Cuando se cambia el estado de un ítem en Monday:
   - La aplicación detecta el cambio mediante el webhook
   - Localiza el mensaje original en Slack usando el link almacenado
   - Actualiza el hilo con la información del nuevo estado

## Estructura del código

- `/src/app`: Contiene la lógica principal de la aplicación
  - `/controllers`: Controladores para manejar eventos de Slack y Monday
  - `/services`: Servicios para interactuar con las APIs de Slack y Monday
  - `/models`: Definiciones de modelos de datos
- `/src/config`: Archivos de configuración
- `/src/utils`: Utilidades y funciones auxiliares
- `/docs`: Documentación adicional

## Contribuir

1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.
