# WhatsApp Business API SDK

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40formmy%2Fwhatsapp-sdk.svg)](https://badge.fury.io/js/%40formmy%2Fwhatsapp-sdk)
[![Effect-TS](https://img.shields.io/badge/built%20with-Effect--TS-8A2BE2)](https://effect.website/)

Un SDK de TypeScript para la API de WhatsApp Business, construido con Effect-TS para manejo de efectos y errores de manera segura.

## Características

- ✅ Envío de mensajes de texto
- ✅ Envío de imágenes, documentos, audio y video
- ✅ Plantillas de mensajes
- ✅ Manejo de errores tipado
- ✅ Validación de entradas
- ✅ Reintentos automáticos
- ✅ Totalmente tipado con TypeScript
- ✅ Basado en Effect-TS para programación funcional segura

## Instalación

```bash
npm install @formmy/whatsapp-sdk effect @effect/platform
```

## Uso básico

### Configuración

```typescript
import { Effect } from "effect";
import { createWhatsAppClient } from "@formmy/whatsapp-sdk";

// Crear un cliente HTTP (usando @effect/platform)
const httpClient = new HttpClient.fetch();

// Configuración
const config = {
  phoneNumberId: "TU_NUMERO_DE_TELEFONO",
  accessToken: "TU_TOKEN_DE_ACCESO",
  businessAccountId: "TU_ID_DE_CUENTA_DE_NEGOCIO", // Opcional
};

// Crear el cliente de WhatsApp
const program = createWhatsAppClient(config, httpClient).pipe(
  Effect.flatMap((whatsapp) => {
    // Usar el cliente para enviar un mensaje
    return whatsapp.sendTextMessage(
      "1234567890", // Número de teléfono del destinatario
      "¡Hola desde el SDK de WhatsApp!"
    );
  })
);

// Ejecutar el programa
Effect.runPromise(program).then(console.log).catch(console.error);
```

### Uso con variables de entorno

```typescript
import { Effect } from "effect";
import { loadConfig } from "@formmy/whatsapp-sdk";

const program = Effect.gen(function* (_) {
  // Cargar configuración desde variables de entorno
  const config = yield* _(loadConfig());
  
  // Crear cliente HTTP
  const httpClient = new HttpClient.fetch();
  
  // Crear cliente de WhatsApp
  const whatsapp = yield* _(createWhatsAppClient(config, httpClient));
  
  // Enviar mensaje
  return yield* _(whatsapp.sendTextMessage(
    "1234567890",
    "Mensaje enviado usando variables de entorno"
  ));
});

// Ejecutar
Effect.runPromise(program).then(console.log).catch(console.error);
```

## API

### WhatsAppClient

Interfaz principal para interactuar con la API de WhatsApp.

#### Métodos

- `sendTextMessage(phoneNumber: string, text: string, previewUrl?: boolean): Effect<MessageResponse>`
- `sendImageMessage(phoneNumber: string, mediaIdOrUrl: string, caption?: string): Effect<MessageResponse>`
- `sendTemplateMessage(phoneNumber: string, templateName: string, languageCode: string, components?: any[]): Effect<MessageResponse>`
- `uploadMedia(file: Buffer, type: string): Effect<MediaUploadResponse>`
- `getMedia(mediaId: string): Effect<MediaInfoResponse>`
- `downloadMedia(mediaUrl: string): Effect<Buffer>`

## Configuración

El SDK puede configurarse mediante un objeto de configuración o variables de entorno:

### Opciones de configuración

| Opción | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `phoneNumberId` | string | Sí | ID del número de teléfono de WhatsApp Business |
| `accessToken` | string | Sí | Token de acceso de la API de WhatsApp |
| `apiVersion` | string | No | Versión de la API (por defecto: "v17.0") |
| `businessAccountId` | string | No | ID de la cuenta de negocio de WhatsApp |
| `webhookVerifyToken` | string | No | Token para verificar webhooks |
| `maxRetries` | number | No | Número máximo de reintentos (por defecto: 3) |
| `retryDelayMs` | number | No | Tiempo de espera entre reintentos en ms (por defecto: 1000) |
| `baseUrl` | string | No | URL base de la API (por defecto: "https://graph.facebook.com") |

### Variables de entorno

- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_API_VERSION` (opcional)
- `WHATSAPP_BUSINESS_ACCOUNT_ID` (opcional)
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (opcional)
- `WHATSAPP_MAX_RETRIES` (opcional)
- `WHATSAPP_RETRY_DELAY_MS` (opcional)
- `WHATSAPP_BASE_URL` (opcional)

## Manejo de errores

El SDK utiliza Effect-TS para el manejo de errores. Todos los métodos devuelven un `Effect` que puede fallar con errores tipados:

- `WhatsAppError` - Clase base para todos los errores del SDK
- `ApiError` - Errores de la API de WhatsApp
- `ValidationError` - Errores de validación de entrada
- `ConfigurationError` - Errores de configuración

Ejemplo de manejo de errores:

```typescript
import { Effect, pipe } from "effect";
import { WhatsAppError, ValidationError, ApiError } from "@formmy/whatsapp-sdk";

const result = await pipe(
  whatsapp.sendTextMessage("invalid", "Hola"),
  Effect.catchAll((error) => {
    if (error instanceof ValidationError) {
      console.error("Error de validación:", error.message);
    } else if (error instanceof ApiError) {
      console.error("Error de la API:", error.message);
    } else if (error instanceof WhatsAppError) {
      console.error("Error de WhatsApp:", error.message);
    }
    return Effect.fail(error);
  }),
  Effect.runPromise
);
```

## Desarrollo

### Requisitos

- Node.js 18+
- npm 9+

### Instalación de dependencias

```bash
npm install
```

### Construir el proyecto

```bash
npm run build
```

### Ejecutar pruebas

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Formateo de código

```bash
npm run format
```

## Licencia

MIT © [Formmy](https://formmy.app)
