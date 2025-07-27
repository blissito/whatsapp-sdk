import { Effect, pipe, Context, Layer } from "effect";

import { 
  WhatsAppConfig, 
  ApiError, 
  MessageResponse, 
  MediaUploadResponse, 
  MediaInfoResponse
} from "../core/types";

/**
 * Creates an HTTP client for interacting with the WhatsApp Business API
 */
export const makeWhatsAppHttpClient = (config: WhatsAppConfig) => {
  const baseUrl = config.baseUrl || "https://graph.facebook.com";
  const version = config.apiVersion || "v17.0";
  const token = config.accessToken;

  // Helper function to make HTTP requests
  const request = <A>(method: "GET" | "POST", path: string, body?: unknown) => {
    return Effect.gen(function*() {
      const url = `${baseUrl}/${version}${path}`;
      
      const options: RequestInit = {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      
      if (method === "POST" && body) {
        options.body = JSON.stringify(body);
      }
      
      try {
        const response = yield* Effect.tryPromise({
          try: () => fetch(url, options),
          catch: (error) => new Error(`Request failed: ${error}`)
        });
        
        const responseText = yield* Effect.tryPromise({
          try: () => response.text(),
          catch: (error) => new Error(`Failed to read response: ${error}`)
        });
        
        if (response.status >= 200 && response.status < 300) {
          try {
            return JSON.parse(responseText) as A;
          } catch (e) {
            return responseText as unknown as A;
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${responseText}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new ApiError(500, error, error.message);
        }
        throw new ApiError(500, new Error(String(error)), 'Request failed');
      }
    }).pipe(
      Effect.mapError((error: unknown) => {
        if (error instanceof Error) {
          return new ApiError(500, error, error.message);
        }
        return new ApiError(500, new Error(String(error)), 'Request failed');
      })
    );
  };

  return {
    /**
     * Send a text message
     */
    sendTextMessage: (phoneNumber: string, text: string) => 
      request<MessageResponse>("POST", `/${config.phoneNumberId}/messages`, {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: { body: text }
      }),

    /**
     * Upload media to WhatsApp
     */
    uploadMedia: (media: { data: Uint8Array; type: string }) => 
      request<MediaUploadResponse>("POST", `/${config.phoneNumberId}/media`, {
        messaging_product: "whatsapp",
        file: media.data,
        type: media.type
      }),

    /**
     * Get media information
     */
    getMediaInfo: (mediaId: string) => 
      request<MediaInfoResponse>("GET", `/${mediaId}?phone_number_id=${config.phoneNumberId}`),

    /**
     * Download media
     */
    downloadMedia: (mediaUrl: string) => {
      return Effect.gen(function*() {
        const options: RequestInit = {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        };
        
        const response = yield* Effect.tryPromise({
          try: () => fetch(mediaUrl, options),
          catch: (error) => new Error(`Request failed: ${error}`)
        });
        
        const arrayBuffer = yield* Effect.tryPromise({
          try: () => response.arrayBuffer(),
          catch: (error) => new Error(`Failed to read response: ${error}`)
        });
        
        return Buffer.from(arrayBuffer);
      }).pipe(
        Effect.mapError(error => 
          new ApiError(
            500,
            error instanceof Error ? error : new Error(String(error)),
            `Failed to download media: ${error instanceof Error ? error.message : String(error)}`
          )
        )
      );
    }
  };
};

// Create a context tag for dependency injection
export class WhatsAppHttpClient extends Context.Tag("WhatsAppHttpClient")<
  WhatsAppHttpClient,
  ReturnType<typeof makeWhatsAppHttpClient>
>() {
  static Live = (config: WhatsAppConfig) => 
    Layer.succeed(WhatsAppHttpClient, makeWhatsAppHttpClient(config));
}
