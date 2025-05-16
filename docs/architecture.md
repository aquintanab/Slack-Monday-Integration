# Arquitectura de la integración Slack-Monday

Este documento describe la arquitectura general y el flujo de datos de la integración entre Slack y Monday para el equipo de Feed Assurance.

## Componentes principales

```
┌─────────────┐       ┌────────────────┐       ┌─────────────┐
│   Slack     │◄──────┤ Aplicación de  │◄──────┤   Monday    │
│  Workspace  │──────►│  Integración   │──────►│   Board     │
└─────────────┘       └────────────────┘       └─────────────┘
                             │
                             │
                      ┌──────▼─────┐
                      │   Base de  │
                      │   Logs     │
                      └────────────┘
```

### 1. Aplicación de Slack

- **Propósito**: Proporcionar la interfaz donde los analistas de Feed Assurance reciben y gestionan las notificaciones iniciales.
- **Funcionalidad**: Los mensajes con reacciones específicas son detectados y enviados a la aplicación de integración.

### 2. Aplicación de Integración (Middleware)

- **Propósito**: Actuar como intermediario entre Slack y Monday, procesando eventos y sincronizando datos.
- **Componentes internos**:
  - **Controladores**: Manejan los eventos entrantes de Slack y Monday.
  - **Servicios**: Proporcionan funcionalidades específicas para interactuar con las APIs.
  - **Utilidades**: Funciones de ayuda para el procesamiento de datos y logging.

### 3. Monday Board

- **Propósito**: Proporcionar un sistema de seguimiento y gestión para todas las notificaciones de Feed Assurance.
- **Funcionalidad**: Almacena los registros de las notificaciones y permite su seguimiento detallado.

## Flujos de datos

### Flujo 1: De Slack a Monday

```
┌────────────┐     ┌───────────────┐     ┌───────────────┐     ┌────────────┐
│ Reacción   │  →  │ Evento de     │  →  │ Procesar      │  →  │ Crear ítem │
│ en Slack   │     │ Slack         │     │ notificación  │     │ en Monday  │
└────────────┘     └───────────────┘     └───────────────┘     └────────────┘
                                                                     │
                                          ┌────────────────┐         │
                                          │ Confirmar en   │  ←      │
                                          │ hilo de Slack  │
                                          └────────────────┘
```

1. Un usuario añade una reacción (sticker) a un mensaje en Slack.
2. La aplicación de Slack envía un evento a nuestro middleware.
3. El controlador de Slack procesa el evento y extrae la información relevante.
4. El servicio de Monday crea un nuevo ítem con los datos extraídos.
5. Se actualiza el hilo del mensaje original en Slack con la confirmación.

### Flujo 2: De Monday a Slack

```
┌────────────┐     ┌───────────────┐     ┌───────────────┐     ┌────────────┐
│ Cambio de  │  →  │ Webhook de    │  →  │ Buscar link   │  →  │ Actualizar │
│ estado     │     │ Monday        │     │ de Slack      │     │ hilo       │
└────────────┘     └───────────────┘     └───────────────┘     └────────────┘
```

1. Un usuario cambia el estado de un ítem en Monday.
2. Monday envía un webhook a nuestro middleware.
3. El controlador de Monday procesa el evento y busca el link de Slack asociado.
4. El servicio de Slack actualiza el hilo correspondiente con el nuevo estado.

## Modelo de datos

### Objeto de notificación

```json
{
  "title": "Partido Barcelona vs Real Madrid",
  "date": "2025-04-15",
  "details": "Notificación sobre posible error en el marcador...",
  "slackLink": "https://slack.com/archives/C01234ABCD/p1234567890",
  "assignedTo": "U01234ABCD"
}
```

## Consideraciones técnicas

### Seguridad

- Todos los tokens de API se almacenan en variables de entorno.
- La autenticación de webhooks se realiza mediante secretos compartidos.
- Los datos sensibles no se almacenan en logs.

### Escalabilidad

- La arquitectura está diseñada para manejar múltiples eventos simultáneos.
- El procesamiento asíncrono permite responder rápidamente a los webhooks.
- Los logs estructurados facilitan el monitoreo y solución de problemas.

### Extensibilidad

- La estructura modular permite añadir nuevas funcionalidades fácilmente.
- Se pueden agregar nuevos tipos de eventos o acciones sin modificar el núcleo de la aplicación.
- Los servicios están desacoplados para facilitar cambios o actualizaciones.
