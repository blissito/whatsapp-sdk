import { Schema } from "@effect/schema";
import { Effect } from "effect";

export class WhatsAppError extends Schema.Class<WhatsAppError>("WhatsAppError")({
  message: Schema.String,
  cause: Schema.optional(Schema.Unknown),
  code: Schema.optional(Schema.String),
}) {
  static of(message: string, options: { cause?: unknown; code?: string } = {}) {
    return new WhatsAppError({
      message,
      cause: options.cause,
      code: options.code,
    });
  }
}

export class ApiError extends WhatsAppError {
  readonly _tag = "ApiError";
  constructor(
    public readonly status: number,
    public readonly response: unknown,
    message: string,
    options: { cause?: unknown; code?: string } = {}
  ) {
    super({ message, ...options });
  }
}

export class ValidationError extends WhatsAppError {
  readonly _tag = "ValidationError";
  constructor(message: string, public readonly details?: unknown) {
    super({ message, code: "VALIDATION_ERROR" });
  }
}

export class ConfigurationError extends WhatsAppError {
  readonly _tag = "ConfigurationError";
  constructor(message: string, public readonly details?: unknown) {
    super({ message, code: "CONFIGURATION_ERROR" });
  }
}

// Tipos y esquemas para mensajes
export const MessageResponseSchema = Schema.Struct({
  messaging_product: Schema.Literal("whatsapp"),
  contacts: Schema.Array(
    Schema.Struct({
      input: Schema.String,
      wa_id: Schema.String,
    })
  ),
  messages: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      message_status: Schema.optional(
        Schema.Union([
          Schema.Literal("accepted"),
          Schema.Literal("sent"),
          Schema.Literal("delivered"),
          Schema.Literal("read"),
          Schema.Literal("failed"),
        ])
      ),
    })
  ),
});

export type MessageResponse = Schema.Schema.Type<typeof MessageResponseSchema>;

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
  businessAccountId?: string;
  webhookVerifyToken?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  baseUrl?: string;
}

export interface WhatsAppClient {
  sendTextMessage(phoneNumber: string, text: string): Effect.Effect<MessageResponse, WhatsAppError>;
  // ... otros métodos del cliente
}

export const defaultConfig: Partial<WhatsAppConfig> = {
  apiVersion: "v17.0",
  baseUrl: "https://graph.facebook.com",
  maxRetries: 3,
  retryDelayMs: 1000,
};
