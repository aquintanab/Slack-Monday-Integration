 // Verificar si ya existe un ítem para este mensaje
      const existingItem = await mondayFunctions.findItemBySlackLink(slackLink);
      
      if (existingItem) {
        console.log(`Ya existe un ítem para este mensaje: ${existingItem.id}`);
        await slackFunctions.sendThreadMessage(
          event.item.channel,
          event.item.ts,
          `✅ Este mensaje ya fue registrado en Monday (ID: ${existingItem.id})`
        );
        return;
      }
      
      // Preparar datos para Monday
      const itemData = {
        title: message.text.slice(0, 50) + '...',  // Usar primeros 50 caracteres como título
        text: message.text,
        slackLink: slackLink
      };
      
      // Crear ítem en Monday
      try {
        const newItem = await mondayFunctions.createItem(itemData);
        
        // Confirmar en Slack
        await slackFunctions.sendThreadMessage(
          event.item.channel,
          event.item.ts,
          `✅ Mensaje registrado en Monday (ID: ${newItem.create_item.id})`
        );
        
        console.log(`Ítem creado en Monday: ${newItem.create_item.id}`);
      } catch (error) {
        console.error('Error al crear ítem:', error);
        await slackFunctions.sendThreadMessage(
          event.item.channel,
          event.item.ts,
          `❌ Error al registrar en Monday: ${error.message}`
        );
      }
    }
  }
});

// Iniciar servidor
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
