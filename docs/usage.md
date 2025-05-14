# Guía de uso para la integración Slack-Monday

Esta guía está diseñada para ayudar a los analistas de Feed Assurance a utilizar efectivamente la integración entre Slack y Monday.

## Flujo de trabajo básico

### 1. Recibir notificaciones en Slack

Las notificaciones de revisión de partidos y datos deportivos llegarán al canal designado en Slack (por ejemplo, #feed-assurance-alerts).

### 2. Marcar notificaciones para revisión

Cuando decidas revisar un partido:

1. Añade la reacción 👀 (eyes) al mensaje.
2. La aplicación detectará automáticamente esta reacción y creará un nuevo ítem en el tablero de Monday.
3. La aplicación responderá en el hilo del mensaje con una confirmación y el ID del ítem creado:
   ```
   ✅ Notificación registrada en Monday (ID: 12345678)
   ```

### 3. Gestionar la revisión en Monday

1. Accede al tablero de "Feed Assurance" en Monday.
2. Localiza el ítem recién creado (puedes usar el ID proporcionado en el hilo de Slack).
3. Realiza tu revisión y actualiza el estado según corresponda:
   - "En revisión": Mientras estás trabajando en el análisis.
   - "Completado": Cuando la revisión está finalizada.
   - "Pendiente": Si hay problemas que impiden completar la revisión.
   - "En validación": Cuando necesites una validación adicional.

### 4. Recibir actualizaciones en Slack

Cuando cambies el estado en Monday, la integración actualizará automáticamente el hilo del mensaje original en Slack:
```
☑️ Estado actualizado en Monday: En revisión
```

## Características adicionales

### Priorización con reacciones adicionales

Puedes usar reacciones adicionales para indicar la prioridad:

- 🔴 (red_circle): Alta prioridad
- 🟢 (green_circle): Baja prioridad
- ⏱️ (timer): Urgente

### Asignación de responsables

- Por defecto, la persona que añade la reacción 👀 será asignada a la revisión.
- Puedes cambiar la asignación directamente en Monday.

### Búsqueda de notificaciones

- Desde Monday: Utiliza la columna "Link de Slack" para volver al mensaje original.
- Desde Slack: Busca por el ID proporcionado en el hilo.

## Solución de problemas comunes

### La notificación no se registra en Monday

1. Verifica que hayas usado la reacción correcta (👀).
2. Espera unos segundos, ya que puede haber un pequeño retraso.
3. Si después de 30 segundos no hay confirmación, intenta añadir la reacción nuevamente.
4. Si el problema persiste, contacta al equipo de soporte técnico.

### La notificación ya existe

Si intentas registrar un mensaje que ya ha sido registrado, recibirás un mensaje como:
```
ℹ️ Este mensaje ya está siendo rastreado en Monday (ID: 12345678)
```

### Los cambios en Monday no se reflejan en Slack

1. Verifica que hayas cambiado el estado correctamente.
2. Asegúrate de que la columna "Link de Slack" contenga la URL correcta.
3. Espera unos segundos para que se procese el cambio.
4. Si el problema persiste, puedes actualizarlo manualmente respondiendo en el hilo de Slack.

## Mejores prácticas

1. **Consistencia**: Usa siempre la reacción 👀 para marcar mensajes para revisión.
2. **Responsabilidad**: Si añades la reacción, asegúrate de completar la revisión o reasignarla explícitamente.
3. **Comentarios**: Utiliza la sección de comentarios de Monday para añadir notas sobre tu análisis.
4. **Actualización de estado**: Mantén siempre actualizado el estado en Monday para que todos estén informados.
5. **Un registro por partido**: Evita crear múltiples registros para el mismo partido o evento.

## Soporte y contacto

Si encuentras problemas con la integración o tienes sugerencias para mejorarla, contacta a:

- Administrador de la integración: [Nombre y correo del administrador]
- Equipo de soporte técnico: [Contacto del equipo de soporte]
