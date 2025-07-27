import { Effect, Context, Layer } from "effect";
import { WhatsAppConfig, ApiError, MessageResponse, MediaUploadResponse, MediaInfoResponse } from "../core/types";
/**
 * Creates an HTTP client for interacting with the WhatsApp Business API
 */
export declare const makeWhatsAppHttpClient: (config: WhatsAppConfig) => {
    /**
     * Send a text message
     */
    sendTextMessage: (phoneNumber: string, text: string) => Effect.Effect<MessageResponse, ApiError, never>;
    /**
     * Upload media to WhatsApp
     */
    uploadMedia: (media: {
        data: Uint8Array;
        type: string;
    }) => Effect.Effect<MediaUploadResponse, ApiError, never>;
    /**
     * Get media information
     */
    getMediaInfo: (mediaId: string) => Effect.Effect<MediaInfoResponse, ApiError, never>;
    /**
     * Download media
     */
    downloadMedia: (mediaUrl: string) => Effect.Effect<Buffer<ArrayBuffer>, ApiError, never>;
};
declare const WhatsAppHttpClient_base: Context.TagClass<WhatsAppHttpClient, "WhatsAppHttpClient", {
    /**
     * Send a text message
     */
    sendTextMessage: (phoneNumber: string, text: string) => Effect.Effect<MessageResponse, ApiError, never>;
    /**
     * Upload media to WhatsApp
     */
    uploadMedia: (media: {
        data: Uint8Array;
        type: string;
    }) => Effect.Effect<MediaUploadResponse, ApiError, never>;
    /**
     * Get media information
     */
    getMediaInfo: (mediaId: string) => Effect.Effect<MediaInfoResponse, ApiError, never>;
    /**
     * Download media
     */
    downloadMedia: (mediaUrl: string) => Effect.Effect<Buffer<ArrayBuffer>, ApiError, never>;
}>;
export declare class WhatsAppHttpClient extends WhatsAppHttpClient_base {
    static Live: (config: WhatsAppConfig) => Layer.Layer<WhatsAppHttpClient, never, never>;
}
export {};
