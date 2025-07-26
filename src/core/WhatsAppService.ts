import { Effect, pipe } from "effect";
import * as Schema from "@effect/schema/Schema";
import { WhatsAppHttpClient } from "../http/WhatsAppHttpClient";
import { WhatsAppConfig, WhatsAppClient, MessageResponse } from "./types";
import { validatePhoneNumber, validateMessageText } from "../validations";
import { createTextMessageRequest } from "../utils/messageBuilders";

export class WhatsAppServiceImpl implements WhatsAppClient {
  private httpClient: WhatsAppHttpClient;

  constructor(
    private readonly config: WhatsAppConfig,
    httpClient: WhatsAppHttpClient
  ) {
    this.httpClient = httpClient;
  }

  /**
   * Envía un mensaje de texto a un número de teléfono
   */
  sendTextMessage(
    phoneNumber: string,
    text: string
  ): Effect.Effect<MessageResponse, WhatsAppError> {
    return Effect.gen(function* (_) {
      // Validar número de teléfono
      const validPhone = yield* _(
        validatePhoneNumber(phoneNumber).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError("Invalid phone number", {
                phoneNumber,
                error: error.message,
              })
          )
        )
      );

      // Validar texto del mensaje
      const validText = yield* _(
        validateMessageText(text).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError("Invalid message text", {
                text,
                error: error.message,
              })
          )
        )
      );

      // Crear y enviar el mensaje
      const messageRequest = createTextMessageRequest(validPhone, validText);
      
      const response = yield* _(
        this.httpClient.sendMessage(messageRequest).pipe(
          Effect.mapError(
            (error) =>
              new WhatsAppError("Failed to send message", {
                cause: error,
                code: "MESSAGE_SEND_FAILED",
              })
          )
        )
      );

      return response;
    }).pipe(Effect.provide(this));
  }

  // Implementar otros métodos del cliente aquí...
  // - sendMediaMessage
  // - sendTemplateMessage
  // - downloadMedia
  // - etc.
}

/**
 * Crea una nueva instancia del servicio de WhatsApp
 */
export const makeWhatsAppService = (
  config: WhatsAppConfig,
  httpClient: WhatsAppHttpClient
): WhatsAppClient => new WhatsAppServiceImpl(config, httpClient);

/**
 * Crea un cliente de WhatsApp con la configuración por defecto
 */
export const createWhatsAppClient = (
  config: Partial<WhatsAppConfig>,
  httpClient: HttpClient.HttpClient
): Effect.Effect<WhatsAppClient, ConfigurationError> =>
  Effect.gen(function* (_) {
    // Cargar configuración
    const finalConfig = yield* _(makeConfig(config));
    
    // Crear cliente HTTP
    const whatsappHttpClient = makeWhatsAppHttpClient(finalConfig, httpClient);
    
    // Crear y retornar el servicio
    return makeWhatsAppService(finalConfig, whatsappHttpClient);
  });
