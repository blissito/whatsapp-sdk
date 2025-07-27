# WhatsApp SDK 📡✨

SDK simple para enviar mensajes por WhatsApp Business API. Made by: @blissito for formmy.app

> ⚡ **Hecho con [Effect](https://effect.website/)** - Porque los errores no deberían ser sorpresas, sino... ¡efectos! (Sí, fan de la programación funcional y no me da pena admitirlo 😎)

## Instalación

```bash
npm install @hectorbliss/whatsapp-sdk
```

## Uso básico

```typescript
import { createWhatsAppService } from "@hectorbliss/whatsapp-sdk";

// Configura tu cliente
const whatsapp = createWhatsAppService({
  phoneNumberId: "TU_PHONE_NUMBER_ID",
  accessToken: "TU_ACCESS_TOKEN",
});

// Envía un mensaje
const result = await whatsapp.sendTextMessage("5215551234567", "¡Hola!");
console.log("Mensaje enviado:", result.messageId);
```

## Funciones principales

- `sendTextMessage(numero, texto)` - Envía texto
- `uploadMedia(archivo, tipo)` - Sube imágenes/videos
- `getMediaInfo(id)` - Info de archivos
- `downloadMedia(url)` - Descarga archivos

## Ejemplo completo: Flujo de pedido en WhatsApp

```typescript
import { createWhatsAppService } from "@hectorbliss/whatsapp-sdk";
import fs from "fs";

const whatsapp = createWhatsAppService({
  phoneNumberId: "TU_PHONE_NUMBER_ID",
  accessToken: "TU_ACCESS_TOKEN",
});

// 1. Cliente inicia conversación
async function manejarPedidoCompleto(cliente: string, pedido: any) {
  // Bienvenida
  await whatsapp.sendTextMessage(
    cliente,
    "🍕 ¡Hola! Gracias por contactar a *Pizza Express*. ¿Qué te gustaría ordenar?"
  );

  // Mostrar menú con imágenes
  const menuImage = fs.readFileSync("menu-pizzas.jpg");
  const { mediaId } = await whatsapp.uploadMedia(menuImage, "image/jpeg");

  await whatsapp.sendTextMessage(
    cliente,
    `📋 Aquí está nuestro menú. ¿Qué pizza te gustaría?\n\nEjemplo: "Quiero una grande de pepperoni con extra queso"`
  );

  // 2. Confirmar pedido
  const confirmacion = `✅ Pedido confirmado:\n\n🍕 ${pedido.pizza} (${pedido.tamaño})\n📍 ${pedido.direccion}\n💰 Total: $${pedido.total}\n\n¿Todo está correcto? Responde "SÍ" para proceder.`;
  await whatsapp.sendTextMessage(cliente, confirmacion);

  // 3. Procesar pago (simulado)
  await whatsapp.sendTextMessage(
    cliente,
    "💳 Procesando tu pago... ✅ Pago aprobado!"
  );

  // 4. Preparación y seguimiento
  await whatsapp.sendTextMessage(
    cliente,
    `👨‍🍳 Tu pizza está en preparación! Tiempo estimado: 25-30 minutos.\n\n📱 Puedes seguir tu pedido en tiempo real.`
  );

  // 5. Imagen de preparación
  const preparacionImage = fs.readFileSync("pizza-preparacion.jpg");
  const { mediaId: prepMediaId } = await whatsapp.uploadMedia(
    preparacionImage,
    "image/jpeg"
  );

  // 6. Envío
  await whatsapp.sendTextMessage(
    cliente,
    `🚗 ¡Tu pedido está en camino!\n\n🕐 Llegará en aproximadamente 15 minutos\n📍 Dirección: ${pedido.direccion}\n\nGracias por elegirnos! 🍕`
  );

  // 7. Entrega final
  await whatsapp.sendTextMessage(
    cliente,
    `🎉 ¡Pedido entregado!\n\nEsperamos que disfrutes tu pizza. ¿Cómo estuvo todo? Tu opinión nos ayuda a mejorar.\n\n📞 Para futuros pedidos, ¡aquí estaremos!`
  );
}

// Uso real
const pedidoEjemplo = {
  pizza: "Pepperoni con extra queso",
  tamaño: "Grande",
  direccion: "Calle Principal 123",
  total: 289.5,
};

// Ejecutar el flujo completo
manejarPedidoCompleto("5215551234567", pedidoEjemplo)
  .then(() => console.log("🚀 Flujo de pedido completo ejecutado"))
  .catch(console.error);
```

## Documentación avanzada

Ver `docs/advanced-usage.md` para ejemplos más complejos.

## Licencia

MIT
