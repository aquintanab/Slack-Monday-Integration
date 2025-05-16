# Configuración básica para la integración Slack-Monday

## Configuración del tablero en Monday

Para que la integración funcione correctamente, se necesita el tablero de Monday donde se va a subir la información.

### Estados sugeridos para la columna de "Estado":

1. **En revisión** (color amarillo): Cuando se está revisando el partido.
2. **Completado** (color verde): Cuando la revisión se ha finalizado correctamente.
3. **Pendiente** (color rojo): Cuando hay algún problema que impide completar la revisión.
4. **En validación** (color azul): Cuando se requiere validación adicional.

## Configuración de Slack

### Stickers/Reacciones a configurar:

- (`:yc-suspended:`): Sticker principal para marcar un mensaje que debe ser registrado en Monday.
- Otros stickers opcionales:
  - 🔴 (`red_circle`): Para marcar partidos con alta prioridad.
  - 🟢 (`green_circle`): Para marcar partidos con baja prioridad.
  - ⏱️ (`timer`): Para marcar partidos que requieren atención urgente.

### Canales recomendados:

- Crear un canal específico para notificaciones de Feed Assurance (por ejemplo, #feed-assurance-alerts).
- Asegurarse de que el bot tenga acceso a este canal.

## Integración con Monday Code

Para subir la aplicación a Monday Code, sigue estos pasos:

1. Inicializa el proyecto con Monday CLI (ya lo has hecho):
   ```bash
   monday app init
   ```

2. Configura el archivo `monday.config.json` con la información necesaria.

3. Crea la aplicación en Monday:
   ```bash
   monday app create
   ```

4. Despliega la aplicación:
   ```bash
   monday app publish
   ```

5. Configura los permisos y webhooks en la interfaz de Monday Developer Center.

## Pruebas

Antes de implementar en producción, realiza las siguientes pruebas:

1. Añadir el sticker a un mensaje en Slack y verificar que se crea el ítem en Monday.
2. Cambiar el estado de un ítem en Monday y verificar que se actualiza el hilo en Slack.
3. Verificar el manejo de casos especiales (mensajes ya registrados, errores de conexión, etc.).

## Solución de problemas comunes

- **El bot no responde a las reacciones**: Verificar los permisos del bot y asegurarse de que los eventos están configurados correctamente.
- **No se crean ítems en Monday**: Verificar el token de Monday y los IDs del tablero/columnas.
- **Los cambios en Monday no se reflejan en Slack**: Verificar que el webhook esté configurado correctamente y que la URL sea accesible desde Internet.
