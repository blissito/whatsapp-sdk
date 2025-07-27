"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaInfoResponseSchema = exports.MediaUploadResponseSchema = exports.MessageResponseSchema = exports.WhatsAppError = exports.ApiError = void 0;
const effect_1 = require("effect");
/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(status, cause, message) {
        super(message || `API request failed with status ${status}`);
        this.status = status;
        this.cause = cause;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
/**
 * Custom error class for WhatsApp specific errors
 */
class WhatsAppError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'WhatsAppError';
    }
}
exports.WhatsAppError = WhatsAppError;
// Schema for validating message responses
exports.MessageResponseSchema = effect_1.Schema.Struct({
    messaging_product: effect_1.Schema.Literal("whatsapp"),
    contacts: effect_1.Schema.Array(effect_1.Schema.Struct({
        input: effect_1.Schema.String,
        wa_id: effect_1.Schema.String
    })),
    messages: effect_1.Schema.Array(effect_1.Schema.Struct({
        id: effect_1.Schema.String
    }))
});
// Schema for validating media upload responses
exports.MediaUploadResponseSchema = effect_1.Schema.Struct({
    id: effect_1.Schema.String
});
// Schema for validating media info responses
exports.MediaInfoResponseSchema = effect_1.Schema.Struct({
    messaging_product: effect_1.Schema.Literal("whatsapp"),
    url: effect_1.Schema.String,
    mime_type: effect_1.Schema.String,
    sha256: effect_1.Schema.String,
    file_size: effect_1.Schema.Number,
    id: effect_1.Schema.String
});
//# sourceMappingURL=types.js.map