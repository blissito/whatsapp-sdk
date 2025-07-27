# Guía Avanzada de Uso - WhatsApp SDK

## Índice
1. [Configuración Avanzada](#configuración-avanzada)
2. [Manejo de Errores](#manejo-de-errores)
3. [Templates de Mensajes](#templates-de-mensajes)
4. [Media y Archivos](#media-y-archivos)
5. [Casos de Uso Completos](#casos-de-uso-completos)
6. [Testing](#testing)

## Configuración Avanzada

### Configuración con Variables de Entorno

```typescript
import { WhatsAppService } from '@hectorbliss/whatsapp-sdk';

// Configuración segura
const config = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  baseUrl: process.env.WHATSAPP_BASE_URL || 'https://graph.facebook.com',
  apiVersion: process.env.WHATSAPP_API_VERSION || 'v17.0'
};
```

### Configuración con Capas (Layers)

```typescript
import { Effect, Layer } from 'effect';
import { WhatsAppService, WhatsAppLive } from '@hectorbliss/whatsapp-sdk';

// Capa de configuración
const ConfigLayer = Layer.succeed(WhatsAppConfig, {
  phoneNumberId: '123456789',
  accessToken: 'your-access-token',
  baseUrl: 'https://graph.facebook.com',
  apiVersion: 'v17.0'
});

// Sistema completo
const AppLayer = ConfigLayer.pipe(
  Layer.provideMerge(WhatsAppLive)
);
```

## Manejo de Errores

### Manejo de Errores con Effect

```typescript
import { Effect, pipe } from 'effect';

const sendMessageWithRetry = (phoneNumber: string, message: string) =>
  Effect.gen(function*() {
    const service = yield* WhatsAppService;
    
    return yield* pipe(
      service.sendTextMessage({ phoneNumber, message }),
      Effect.retry(Schedule.exponential(1000).pipe(
        Schedule.compose(Schedule.recurs(3))
      )),
      Effect.catchAll(error => 
        Effect.succeed({ 
          success: false, 
          error: error.message 
        })
      )
    );
  });
```

### Tipos de Errores Comunes

```typescript
// Errores de autenticación
class WhatsAppAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WhatsAppAuthError';
  }
}

// Errores de rate limiting
class RateLimitError extends Error {
  constructor(public retryAfter: number) {
    super(`Rate limited. Retry after ${retryAfter}s`);
    this.name = 'RateLimitError';
  }
}
```

## Templates de Mensajes

### Template con Parámetros

```typescript
// Template de bienvenida
const sendWelcomeTemplate = (phoneNumber: string, userName: string) =>
  Effect.gen(function*() {
    const service = yield* WhatsAppService;
    
    return yield* service.sendTemplateMessage({
      phoneNumber,
      templateName: 'welcome_message',
      languageCode: 'es_MX',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: userName }
          ]
        }
      ]
    });
  });

// Template con botones
const sendOrderConfirmation = (phoneNumber: string, orderId: string) =>
  Effect.gen(function*() {
    const service = yield* WhatsAppService;
    
    return yield* service.sendTemplateMessage({
      phoneNumber,
      templateName: 'order_confirmation',
      languageCode: 'es_MX',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: orderId }
          ]
        },
        {
          type: 'button',
          parameters: [
            { type: 'text', text: 'Ver pedido' }
          ]
        }
      ]
    });
  });
```

## Media y Archivos

### Subida de Imágenes

```typescript
import { readFile } from 'fs/promises';

const sendImageMessage = async (phoneNumber: string, imagePath: string) =>
  Effect.gen(function*() {
    const service = yield* WhatsAppService;
    
    // Leer archivo
    const imageBuffer = yield* Effect.tryPromise({
      try: () => readFile(imagePath),
      catch: (error) => new Error(`Failed to read file: ${error}`)
    });
    
    // Subir imagen
    const { mediaId } = yield* service.uploadMedia({
      file: new Uint8Array(imageBuffer),
      mimeType: 'image/jpeg',
      filename: 'product-image.jpg'
    });
    
    // Enviar imagen
    return yield* service.sendMediaMessage({
      phoneNumber,
      mediaId,
      caption: '¡Mira nuestro nuevo producto!'
    });
  });
```

### Descarga de Media

```typescript
const downloadAndSaveMedia = (mediaUrl: string, outputPath: string) =>
  Effect.gen(function*() {
    const service = yield* WhatsAppService;
    
    // Descargar archivo
    const buffer = yield* service.downloadMedia(mediaUrl);
    
    // Guardar archivo
    yield* Effect.tryPromise({
      try: () => writeFile(outputPath, buffer),
      catch: (error) => new Error(`Failed to save file: ${error}`)
    });
    
    return { path: outputPath, size: buffer.length };
  });
```

## Casos de Uso Completos

### Sistema de Notificaciones

```typescript
class NotificationService {
  constructor(private whatsapp: WhatsAppService) {}

  sendOrderUpdate(order: Order) {
    return Effect.gen(function*() {
      const message = this.buildOrderMessage(order);
      
      return yield* this.whatsapp.sendTextMessage({
        phoneNumber: order.customerPhone,
        message
      });
    });
  }

  private buildOrderMessage(order: Order): string {
    return `¡Hola ${order.customerName}! Tu pedido #${order.id} está ${order.status}.`;
  }
}

// Uso
const notificationLayer = Layer.effect(
  NotificationService,
  Effect.gen(function*() {
    const whatsapp = yield* WhatsAppService;
    return new NotificationService(whatsapp);
  })
);
```

### Sistema de Soporte Automatizado

```typescript
class SupportBot {
  constructor(private whatsapp: WhatsAppService) {}

  handleMessage(phoneNumber: string, message: string) {
    return Effect.gen(function*() {
      const response = yield* this.generateResponse(message);
      
      return yield* this.whatsapp.sendTextMessage({
        phoneNumber,
        message: response
      });
    });
  }

  private generateResponse(message: string) {
    // Lógica de respuesta automatizada
    return Effect.succeed(`Gracias por tu mensaje: ${message}`);
  }
}
```

## Testing

### Tests Unitarios

```typescript
import { TestLayer } from '@effect/platform/HttpClient/Test';

const mockWhatsAppService = Layer.succeed(
  WhatsAppService,
  WhatsAppService.of({
    sendTextMessage: () => Effect.succeed({ messageId: 'mock-123' }),
    uploadMedia: () => Effect.succeed({ mediaId: 'media-456' }),
    getMediaInfo: () => Effect.succeed({
      id: 'media-456',
      mimeType: 'image/jpeg',
      size: 1024,
      url: 'https://example.com/image.jpg'
    }),
    downloadMedia: () => Effect.succeed(new Uint8Array([1, 2, 3])),
    sendTemplateMessage: () => Effect.succeed({ messageId: 'template-789' })
  })
);

// Test de envío de mensaje
describe('WhatsApp Service', () => {
  it('should send text message', () =>
    Effect.runPromise(
      Effect.provide(
        Effect.gen(function*() {
          const service = yield* WhatsAppService;
          const result = yield* service.sendTextMessage({
            phoneNumber: '+1234567890',
            message: 'Hello World'
          });
          expect(result.messageId).toBe('mock-123');
        }),
        mockWhatsAppService
      )
    )
  );
});
```

### Tests de Integración

```typescript
const integrationTest = Effect.gen(function*() {
  const service = yield* WhatsAppService;
  
  // Test de flujo completo
  const { mediaId } = yield* service.uploadMedia({
    file: new Uint8Array([1, 2, 3]),
    mimeType: 'text/plain'
  });
  
  const mediaInfo = yield* service.getMediaInfo(mediaId);
  expect(mediaInfo.mimeType).toBe('text/plain');
  
  const downloaded = yield* service.downloadMedia(mediaInfo.url);
  expect(downloaded).toEqual(new Uint8Array([1, 2, 3]));
});
```

## Ejemplos de Configuración por Ambiente

### Desarrollo

```typescript
// config/development.ts
export const developmentConfig = {
  phoneNumberId: 'dev-phone-id',
  accessToken: 'dev-token',
  baseUrl: 'https://graph.facebook.com',
  apiVersion: 'v17.0'
};
```

### Producción

```typescript
// config/production.ts
export const productionConfig = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
  baseUrl: 'https://graph.facebook.com',
  apiVersion: 'v17.0'
};
```

### Testing

```typescript
// config/test.ts
export const testConfig = {
  phoneNumberId: 'test-phone-id',
  accessToken: 'test-token',
  baseUrl: 'http://localhost:3000',
  apiVersion: 'v17.0'
};
```
