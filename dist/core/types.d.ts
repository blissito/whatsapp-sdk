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
export declare class ApiError extends Error {
    status: number;
    cause: unknown;
    constructor(status: number, cause: unknown, message?: string);
}
/**
 * Custom error class for WhatsApp specific errors
 */
export declare class WhatsAppError extends Error {
    cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
export declare const MessageResponseSchema: Schema.Struct<{
    messaging_product: Schema.Literal<["whatsapp"]>;
    contacts: Schema.Array$<Schema.Struct<{
        input: typeof Schema.String;
        wa_id: typeof Schema.String;
    }>>;
    messages: Schema.Array$<Schema.Struct<{
        id: typeof Schema.String;
    }>>;
}>;
export declare const MediaUploadResponseSchema: Schema.Struct<{
    id: typeof Schema.String;
}>;
export declare const MediaInfoResponseSchema: Schema.Struct<{
    messaging_product: Schema.Literal<["whatsapp"]>;
    url: typeof Schema.String;
    mime_type: typeof Schema.String;
    sha256: typeof Schema.String;
    file_size: typeof Schema.Number;
    id: typeof Schema.String;
}>;
