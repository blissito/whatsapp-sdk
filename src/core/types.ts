import * as S from "@effect/schema";
import { Schema } from "effect";

/**
 * Configuration for the WhatsApp client
 */
export interface WhatsAppConfig {
  /** The phone number ID provided by Meta */
  phoneNumberId: string;
  /** The access token for the WhatsApp Business API */
  accessToken: string;
  /** The base URL for the WhatsApp API (defaults to https://graph.facebook.com) */
  baseUrl?: string;
  /** The API version to use (defaults to v17.0) */
  apiVersion?: string;
}

/**
 * Standard error response from the WhatsApp API
 */
export interface ErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

/**
 * Response when sending a message
 */
export interface MessageResponse {
  messaging_product: "whatsapp";
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

/**
 * Response when uploading media
 */
export interface MediaUploadResponse {
  id: string;
}

/**
 * Response when getting media info
 */
export interface MediaInfoResponse {
  messaging_product: "whatsapp";
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public cause: unknown,
    message?: string
  ) {
    super(message || `API request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

/**
 * Custom error class for WhatsApp specific errors
 */
export class WhatsAppError extends Error {
  constructor(
    message: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'WhatsAppError';
  }
}

// Schema for validating message responses
export const MessageResponseSchema = Schema.Struct({
  messaging_product: Schema.Literal("whatsapp"),
  contacts: Schema.Array(
    Schema.Struct({
      input: Schema.String,
      wa_id: Schema.String
    })
  ),
  messages: Schema.Array(
    Schema.Struct({
      id: Schema.String
    })
  )
});

// Schema for validating media upload responses
export const MediaUploadResponseSchema = Schema.Struct({
  id: Schema.String
});

// Schema for validating media info responses
export const MediaInfoResponseSchema = Schema.Struct({
  messaging_product: Schema.Literal("whatsapp"),
  url: Schema.String,
  mime_type: Schema.String,
  sha256: Schema.String,
  file_size: Schema.Number,
  id: Schema.String
});
