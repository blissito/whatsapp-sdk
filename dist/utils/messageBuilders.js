"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImageMessageRequest = exports.createTextMessageRequest = void 0;
const effect_1 = require("effect");
const messages_1 = require("../validations/messages");
const types_1 = require("../core/types");
/**
 * Crea un objeto de solicitud para enviar un mensaje de texto
 */
const createTextMessageRequest = (to, text, preview_url = false) => effect_1.Effect.gen(function* (_) {
    // Validar el número de teléfono
    const validTo = yield* _((0, messages_1.validatePhoneNumber)(to).pipe(effect_1.Effect.mapError((error) => new types_1.ValidationError("Invalid recipient phone number", {
        phoneNumber: to,
        error: error.message,
    }))));
    // Validar el texto del mensaje
    const validText = yield* _((0, messages_1.validateMessageText)(text).pipe(effect_1.Effect.mapError((error) => new types_1.ValidationError("Invalid message text", {
        text,
        error: error.message,
    }))));
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
exports.createTextMessageRequest = createTextMessageRequest;
const createImageMessageRequest = (to, mediaIdOrUrl, caption) => effect_1.Effect.gen(function* (_) {
    const validTo = yield* _((0, messages_1.validatePhoneNumber)(to).pipe(effect_1.Effect.mapError((error) => new types_1.ValidationError("Invalid recipient phone number", {
        phoneNumber: to,
        error: error.message,
    }))));
    const imagePayload = {
        id: mediaIdOrUrl,
        ...(caption ? { caption } : {}),
    };
    // Validar el caption si está presente
    if (caption) {
        yield* _((0, messages_1.validateMessageText)(caption).pipe(effect_1.Effect.mapError((error) => new types_1.ValidationError("Invalid caption text", {
            caption,
            error: error.message,
        }))));
    }
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: validTo,
        type: "image",
        image: imagePayload,
    };
});
exports.createImageMessageRequest = createImageMessageRequest;
// Otros constructores de mensajes pueden ir aquí
// - createDocumentMessageRequest
// - createVideoMessageRequest
// - createAudioMessageRequest
// - createTemplateMessageRequest
// - etc.
//# sourceMappingURL=messageBuilders.js.map