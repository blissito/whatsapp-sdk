"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppHttpClient = exports.makeWhatsAppHttpClient = void 0;
const effect_1 = require("effect");
const types_1 = require("../core/types");
/**
 * Creates an HTTP client for interacting with the WhatsApp Business API
 */
const makeWhatsAppHttpClient = (config) => {
    const baseUrl = config.baseUrl || "https://graph.facebook.com";
    const version = config.apiVersion || "v17.0";
    const token = config.accessToken;
    // Helper function to make HTTP requests
    const request = (method, path, body) => {
        return effect_1.Effect.gen(function* () {
            const url = `${baseUrl}/${version}${path}`;
            const options = {
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
                const response = yield* effect_1.Effect.tryPromise({
                    try: () => fetch(url, options),
                    catch: (error) => new Error(`Request failed: ${error}`)
                });
                const responseText = yield* effect_1.Effect.tryPromise({
                    try: () => response.text(),
                    catch: (error) => new Error(`Failed to read response: ${error}`)
                });
                if (response.status >= 200 && response.status < 300) {
                    try {
                        return JSON.parse(responseText);
                    }
                    catch (e) {
                        return responseText;
                    }
                }
                else {
                    throw new Error(`HTTP ${response.status}: ${responseText}`);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new types_1.ApiError(500, error, error.message);
                }
                throw new types_1.ApiError(500, new Error(String(error)), 'Request failed');
            }
        }).pipe(effect_1.Effect.mapError((error) => {
            if (error instanceof Error) {
                return new types_1.ApiError(500, error, error.message);
            }
            return new types_1.ApiError(500, new Error(String(error)), 'Request failed');
        }));
    };
    return {
        /**
         * Send a text message
         */
        sendTextMessage: (phoneNumber, text) => request("POST", `/${config.phoneNumberId}/messages`, {
            messaging_product: "whatsapp",
            to: phoneNumber,
            type: "text",
            text: { body: text }
        }),
        /**
         * Upload media to WhatsApp
         */
        uploadMedia: (media) => request("POST", `/${config.phoneNumberId}/media`, {
            messaging_product: "whatsapp",
            file: media.data,
            type: media.type
        }),
        /**
         * Get media information
         */
        getMediaInfo: (mediaId) => request("GET", `/${mediaId}?phone_number_id=${config.phoneNumberId}`),
        /**
         * Download media
         */
        downloadMedia: (mediaUrl) => {
            return effect_1.Effect.gen(function* () {
                const options = {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                };
                const response = yield* effect_1.Effect.tryPromise({
                    try: () => fetch(mediaUrl, options),
                    catch: (error) => new Error(`Request failed: ${error}`)
                });
                const arrayBuffer = yield* effect_1.Effect.tryPromise({
                    try: () => response.arrayBuffer(),
                    catch: (error) => new Error(`Failed to read response: ${error}`)
                });
                return Buffer.from(arrayBuffer);
            }).pipe(effect_1.Effect.mapError(error => new types_1.ApiError(500, error instanceof Error ? error : new Error(String(error)), `Failed to download media: ${error instanceof Error ? error.message : String(error)}`)));
        }
    };
};
exports.makeWhatsAppHttpClient = makeWhatsAppHttpClient;
// Create a context tag for dependency injection
class WhatsAppHttpClient extends effect_1.Context.Tag("WhatsAppHttpClient")() {
}
exports.WhatsAppHttpClient = WhatsAppHttpClient;
WhatsAppHttpClient.Live = (config) => effect_1.Layer.succeed(WhatsAppHttpClient, (0, exports.makeWhatsAppHttpClient)(config));
//# sourceMappingURL=WhatsAppHttpClient.js.map