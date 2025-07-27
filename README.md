# WhatsApp Business API SDK

A TypeScript SDK for interacting with the WhatsApp Business API, built with Effect for type-safety and functional programming patterns.

## Features

- Type-safe API client for WhatsApp Business API
- Built with [Effect](https://effect.website/) for better error handling and functional programming
- Support for sending messages, media, and handling webhooks
- Fully typed API responses and request payloads

## Installation

```bash
npm install @formmy/whatsapp-sdk
```

## Usage

### Basic Setup

```typescript
import { WhatsAppHttpClient, makeWhatsAppHttpClient } from '@formmy/whatsapp-sdk';
import { Effect, pipe } from 'effect';

// Create a client instance
const config = {
  phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
  accessToken: 'YOUR_ACCESS_TOKEN',
  // Optional: defaults to 'https://graph.facebook.com'
  baseUrl: 'https://graph.facebook.com',
  // Optional: defaults to 'v17.0'
  apiVersion: 'v17.0'
};

const client = makeWhatsAppHttpClient(config);

// Send a text message
const sendMessage = pipe(
  client.sendTextMessage('1234567890', 'Hello from Effect!'),
  Effect.flatMap(response => Effect.log(`Message sent with ID: ${response.messages[0].id}`)),
  Effect.catchAll(error => Effect.logError(`Failed to send message: ${error.message}`))
);

// Run the effect
Effect.runPromise(sendMessage);
```

### Using with Effect Layers

```typescript
import { WhatsAppHttpClient, makeWhatsAppHttpClient } from '@formmy/whatsapp-sdk';
import { Effect, Layer, pipe } from 'effect';

// Create a layer with your configuration
const WhatsAppLive = WhatsAppHttpClient.Live({
  phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
  accessToken: 'YOUR_ACCESS_TOKEN'
});

// Enviar mensaje de texto
await client.sendTextMessage('1234567890', '¡Hola desde WhatsApp!');
```

## Métodos Principales

### `sendTextMessage(numero, texto)`
Envía un mensaje de texto.

### `uploadMedia({data, type})`
Sube archivos multimedia.

### `getMediaInfo(id)`
Obtiene información de un archivo.

### `downloadMedia(url)`
Descarga archivos multimedia.

## Ejemplo Completo

```typescript
// Enviar texto
await client.sendTextMessage('5215551234567', '¡Hola!');

// Subir imagen
const imagen = fs.readFileSync('foto.jpg');
const { id } = await client.uploadMedia({
  data: new Uint8Array(imagen),
  type: 'image/jpeg'
});
```

## Licencia

MIT
