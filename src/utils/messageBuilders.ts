import { Effect } from "effect";
import { validatePhoneNumber } from "../validations/messages";

/**
 * Interfaz para los parámetros de un mensaje de texto
 */
interface TextMessageParams {
  to: string;
  text: string;
  preview_url?: boolean;
}

/**
 * Crea un objeto de solicitud para enviar un mensaje de texto
 */
export const createTextMessageRequest = (
  to: string,
  text: string,
  preview_url: boolean = false
): Effect.Effect<TextMessageParams, ValidationError> =>
  Effect.gen(function* (_) {
    // Validar el número de teléfono
    const validTo = yield* _(
      validatePhoneNumber(to).pipe(
        Effect.mapError(
          (error) =>
            new ValidationError("Invalid recipient phone number", {
              phoneNumber: to,
              error: error.message,
            })
        )
      )
    );

    // Validar el texto del mensaje
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

    return {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: validTo,
      type: "text",
      text: {
        body: validText,
        preview_url,
      },
    };
  });

/**
 * Crea un objeto de solicitud para enviar un mensaje de imagen
 */
export const createImageMessageRequest = (
  to: string,
  mediaIdOrUrl: string,
  caption?: string
): Effect.Effect<any, ValidationError> =>
  Effect.gen(function* (_) {
    const validTo = yield* _(
      validatePhoneNumber(to).pipe(
        Effect.mapError(
          (error) =>
            new ValidationError("Invalid recipient phone number", {
              phoneNumber: to,
              error: error.message,
            })
        )
      )
    );

    const baseMessage = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: validTo,
      type: "image",
      image: {
        id: mediaIdOrUrl,
      },
    };

    if (caption) {
      const validCaption = yield* _(
        validateMessageText(caption).pipe(
          Effect.mapError(
            (error) =>
              new ValidationError("Invalid caption text", {
                caption,
                error: error.message,
              })
          )
        )
      );
      baseMessage.image.caption = validCaption;
    }

    return baseMessage;
  });

// Otros constructores de mensajes pueden ir aquí
// - createDocumentMessageRequest
// - createVideoMessageRequest
// - createAudioMessageRequest
// - createTemplateMessageRequest
// - etc.
