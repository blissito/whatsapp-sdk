// Ejemplo avanzado con manejo de errores y capas
import { Effect, Layer, Context, pipe } from 'effect';
import { makeWhatsAppHttpClient } from '../src/http/WhatsAppHttpClient';

// Configuración segura
interface AppConfig {
  whatsapp: {
    phoneNumberId: string;
    accessToken: string;
  };
}

// Servicio de configuración
const AppConfig = Context.Tag<AppConfig>();

// Servicio de notificaciones
interface NotificationService {
  sendWelcomeMessage: (phoneNumber: string, name: string) => Effect.Effect<void, Error>;
  sendOrderConfirmation: (phoneNumber: string, orderId: string) => Effect.Effect<void, Error>;
}

const NotificationService = Context.Tag<NotificationService>();

// Implementación del servicio de notificaciones
const NotificationLive = Layer.effect(
  NotificationService,
  Effect.gen(function* () {
    const config = yield* AppConfig;
    const client = makeWhatsAppHttpClient(config.whatsapp);

    return NotificationService.of({
      sendWelcomeMessage: (phoneNumber, name) =>
        pipe(
          client.sendTextMessage(phoneNumber, `¡Bienvenido ${name}! Gracias por unirte a Formmy.`),
          Effect.map(() => void 0),
          Effect.catchAll(error => 
            Effect.logError(`Error enviando mensaje de bienvenida: ${error}`)
          )
        ),

      sendOrderConfirmation: (phoneNumber, orderId) =>
        pipe(
          client.sendTextMessage(
            phoneNumber, 
            `Tu pedido #${orderId} ha sido confirmado. Te notificaremos cuando esté listo.`
          ),
          Effect.map(() => void 0),
          Effect.retry({ times: 3, delay: 1000 })
        )
    });
  })
);

// Servicio de validación
interface ValidationService {
  validatePhoneNumber: (phone: string) => Effect.Effect<string, Error>;
  validateMessage: (message: string) => Effect.Effect<string, Error>;
}

const ValidationService = Context.Tag<ValidationService>();

const ValidationLive = Layer.succeed(
  ValidationService,
  ValidationService.of({
    validatePhoneNumber: (phone) => {
      const cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        return Effect.fail(new Error('Número de teléfono inválido'));
      }
      return Effect.succeed(cleanPhone);
    },
    validateMessage: (message) => {
      if (message.length === 0 || message.length > 1000) {
        return Effect.fail(new Error('Mensaje debe tener entre 1 y 1000 caracteres'));
      }
      return Effect.succeed(message);
    }
  })
);

// Servicio de negocio principal
class BusinessService {
  constructor(
    private notifications: NotificationService,
    private validation: ValidationService
  ) {}

  registerUser(user: { phone: string; name: string }) {
    return Effect.gen(function* () {
      // Validar datos
      const phoneNumber = yield* this.validation.validatePhoneNumber(user.phone);
      const name = yield* this.validation.validateMessage(user.name);
      
      // Enviar mensaje de bienvenida
      yield* this.notifications.sendWelcomeMessage(phoneNumber, name);
      
      return { success: true, phoneNumber, name };
    });
  }

  processOrder(order: { phone: string; orderId: string }) {
    return Effect.gen(function* () {
      const phoneNumber = yield* this.validation.validatePhoneNumber(order.phone);
      
      yield* this.notifications.sendOrderConfirmation(phoneNumber, order.orderId);
      
      return { success: true, orderId: order.orderId };
    });
  }
}

const BusinessService = Context.Tag<BusinessService>();

const BusinessLive = Layer.effect(
  BusinessService,
  Effect.gen(function* () {
    const notifications = yield* NotificationService;
    const validation = yield* ValidationService;
    
    return new BusinessService(notifications, validation);
  })
);

// Configuración de la aplicación
const AppConfig = Layer.succeed(AppConfig, {
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '1234567890',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || 'your-token'
  }
});

// Sistema completo
const AppLayer = AppConfig.pipe(
  Layer.provideMerge(ValidationLive),
  Layer.provideMerge(NotificationLive),
  Layer.provideMerge(BusinessLive)
);

// Uso del sistema
const exampleUsage = () => 
  Effect.gen(function* () {
    const business = yield* BusinessService;
    
    // Registrar nuevo usuario
    const result1 = yield* business.registerUser({
      phone: '+5215551234567',
      name: 'Juan Pérez'
    });
    
    console.log('Usuario registrado:', result1);
    
    // Procesar orden
    const result2 = yield* business.processOrder({
      phone: '+5215551234567',
      orderId: 'ORD-2024-001'
    });
    
    console.log('Orden procesada:', result2);
  });

// Ejecutar el ejemplo
if (require.main === module) {
  Effect.runPromise(
    Effect.provide(exampleUsage(), AppLayer)
  ).catch(console.error);
}
