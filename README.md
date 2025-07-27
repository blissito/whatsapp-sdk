# WhatsApp SDK 📡✨

SDK simple para enviar mensajes por WhatsApp Business API.

> ⚡ **Hecho con [Effect](https://effect.website/)** - Porque los errores no deberían ser sorpresas, sino... ¡efectos! (Sí, somos fans de la programación funcional y no nos da pena admitirlo 😎)

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

## Ejemplo completo

```typescript
// Texto simple
await whatsapp.sendTextMessage("5215551234567", "¡Bienvenido!");

// Con imagen
const imagen = fs.readFileSync("foto.jpg");
const media = await whatsapp.uploadMedia(imagen, "image/jpeg");
```

## Documentación avanzada

Ver `docs/advanced-usage.md` para ejemplos más complejos.

## Licencia

MIT
