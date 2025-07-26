import { Effect, pipe } from "effect";
import * as Schema from "@effect/schema/Schema";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect-http";
import * as HttpBody from "effect-http/Body";
import { WhatsAppConfig } from "../core/types";
import { ApiError, MessageResponse, MessageResponseSchema } from "../core/types";

// Esquema para respuestas de error de la API
export const ErrorResponseSchema = Schema.Struct({
  error: Schema.Struct({
    message: Schema.String,
    type: Schema.String,
    code: Schema.Number,
    error_subcode: Schema.optional(Schema.Number),
    fbtrace_id: Schema.optional(Schema.String),
  }),
});

type ErrorResponse = Schema.Schema.Type<typeof ErrorResponseSchema>;

// Esquema para respuestas de carga de medios
export const MediaUploadResponseSchema = Schema.Struct({
  id: Schema.String,
});

type MediaUploadResponse = Schema.Schema.Type<typeof MediaUploadResponseSchema>;

// Esquema para información de medios
export const MediaInfoResponseSchema = Schema.Struct({
  messaging_product: Schema.Literal("whatsapp"),
  url: Schema.String,
  mime_type: Schema.String,
  sha256: Schema.String,
  file_size: Schema.Number,
  id: Schema.String,
});

type MediaInfoResponse = Schema.Schema.Type<typeof MediaInfoResponseSchema>;

export class WhatsAppHttpClient {
  constructor(
    private readonly config: WhatsAppConfig,
    private readonly httpClient: HttpClient.HttpClient
  ) {}

  private handleHttpError = (
    error: HttpClientResponse.HttpClientResponse
  ): Effect.Effect<never, ApiError> =>
    Effect.gen(function* (_) {
      const responseText = yield* _(
        Effect.tryPromise({
          try: () => error.text,
          catch: () => Effect.succeed("Failed to read response text"),
        })
      );

      // Intentar analizar como respuesta de error de la API de WhatsApp
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = {
          error: { message: responseText, type: "unknown", code: error.status },
        };
      }

      const errorResponse = yield* _(
        Schema.decodeUnknown(ErrorResponseSchema)(parsedResponse).pipe(
          Effect.catchAll(() =>
            Effect.succeed({
              error: {
                message: responseText || "Unknown API error",
                type: "unknown",
                code: error.status,
              },
            })
          )
        )
      );

      return yield* _(
        Effect.fail(
          new ApiError(
            error.status,
            errorResponse,
            errorResponse.error.message,
            { code: errorResponse.error.code.toString() }
          )
        )
      );
    });

  // Método para enviar mensajes
  sendMessage = (
    payload: unknown
  ): Effect.Effect<MessageResponse, ApiError> =>
    Effect.gen(function* (this: WhatsAppHttpClient) {
      const url = this.buildApiUrl("messages");
      const headers = this.createAuthHeaders();

      const request = HttpClientRequest.post(url).pipe(
        HttpClientRequest.setHeaders(headers),
        HttpClientRequest.setBody(HttpBody.json(payload))
      );

      const response = yield* this.httpClient
        .execute(request)
        .pipe(
          Effect.flatMap((response) =>
            response.status >= 200 && response.status < 300
              ? Effect.succeed(response)
              : this.handleHttpError(response)
          )
        );

      const responseBody = yield* Effect.tryPromise({
        try: () => response.json,
        catch: (error) =>
          new ApiError(
            response.status,
            error,
            "Failed to parse response JSON"
          ),
      });

      return yield* Schema.decodeUnknown(MessageResponseSchema)(responseBody).pipe(
        Effect.mapError(
          (error) =>
            new ApiError(
              response.status,
              responseBody,
              `Invalid response format: ${error.message}`
            )
        )
      );
    });

  // Método para cargar medios
  uploadMedia = (
    formData: FormData
  ): Effect.Effect<MediaUploadResponse, ApiError> =>
    Effect.gen(function* (this: WhatsAppHttpClient) {
      const url = this.buildBusinessApiUrl("media");
      const headers = this.createMediaUploadHeaders();

      const request = HttpClientRequest.post(url).pipe(
        HttpClientRequest.setHeaders(headers),
        HttpClientRequest.setBody(HttpBody.formData(formData))
      );

      const response = yield* this.httpClient
        .execute(request)
        .pipe(
          Effect.flatMap((response) =>
            response.status >= 200 && response.status < 300
              ? Effect.succeed(response)
              : this.handleHttpError(response)
          )
        );

      const responseBody = yield* Effect.tryPromise({
        try: () => response.json,
        catch: (error) =>
          new ApiError(
            response.status,
            error,
            "Failed to parse media upload response JSON"
          ),
      });

      return yield* Schema.decodeUnknown(MediaUploadResponseSchema)(
        responseBody
      ).pipe(
        Effect.mapError(
          (error) =>
            new ApiError(
              response.status,
              responseBody,
              `Invalid media upload response format: ${error.message}`
            )
        )
      );
    });

  // Método para obtener información de un medio
  getMedia = (mediaId: string): Effect.Effect<MediaInfoResponse, ApiError> =>
    Effect.gen(function* (this: WhatsAppHttpClient) {
      const url = `${this.config.baseUrl}/${this.config.apiVersion}/${mediaId}`;
      const headers = this.createAuthHeaders();

      const request = HttpClientRequest.get(url).pipe(
        HttpClientRequest.setHeaders(headers)
      );

      const response = yield* this.httpClient
        .execute(request)
        .pipe(
          Effect.flatMap((response) =>
            response.status >= 200 && response.status < 300
              ? Effect.succeed(response)
              : this.handleHttpError(response)
          )
        );

      const responseBody = yield* Effect.tryPromise({
        try: () => response.json,
        catch: (error) =>
          new ApiError(
            response.status,
            error,
            "Failed to parse media info response JSON"
          ),
      });

      return yield* Schema.decodeUnknown(MediaInfoResponseSchema)(
        responseBody
      ).pipe(
        Effect.mapError(
          (error) =>
            new ApiError(
              response.status,
              responseBody,
              `Invalid media info response format: ${error.message}`
            )
        )
      );
    });

  // Método para descargar un medio
  downloadMedia = (mediaUrl: string): Effect.Effect<Uint8Array, ApiError> =>
    Effect.gen(function* (this: WhatsAppHttpClient) {
      const headers = this.createAuthHeaders();

      const request = HttpClientRequest.get(mediaUrl).pipe(
        HttpClientRequest.setHeaders(headers)
      );

      const response = yield* this.httpClient
        .execute(request)
        .pipe(
          Effect.flatMap((response) =>
            response.status >= 200 && response.status < 300
              ? Effect.succeed(response)
              : this.handleHttpError(response)
          )
        );

      return yield* Effect.tryPromise({
        try: () => response.arrayBuffer.then((buffer) => new Uint8Array(buffer)),
        catch: (error) =>
          new ApiError(
            response.status,
            error,
            "Failed to download media content"
          ),
      });
    });

  // Métodos de utilidad privados
  private buildApiUrl(endpoint: string): string {
    return `${this.config.baseUrl}/${this.config.apiVersion}/${this.config.phoneNumberId}/${endpoint}`;
  }

  private buildBusinessApiUrl(endpoint: string): string {
    return `${this.config.baseUrl}/${this.config.apiVersion}/${this.config.businessAccountId}/${endpoint}`;
  }

  private createAuthHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.accessToken}`,
    };
  }

  private createMediaUploadHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.accessToken}`,
    };
  }
}

export const makeWhatsAppHttpClient = (
  config: WhatsAppConfig,
  httpClient: HttpClient.HttpClient
): WhatsAppHttpClient => new WhatsAppHttpClient(config, httpClient);
