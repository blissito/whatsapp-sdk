"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWhatsAppService = void 0;
const effect_1 = require("effect");
const WhatsAppHttpClient_1 = require("../http/WhatsAppHttpClient");
// Factory function para crear el servicio
const createWhatsAppService = (config) => {
    const client = (0, WhatsAppHttpClient_1.makeWhatsAppHttpClient)(config);
    return {
        sendTextMessage: (phoneNumber, message) => client.sendTextMessage(phoneNumber, message).pipe(effect_1.Effect.map(response => ({ messageId: response.messages[0].id }))),
        uploadMedia: (file, mimeType) => client.uploadMedia({ data: file, type: mimeType }).pipe(effect_1.Effect.map(response => ({ mediaId: response.id }))),
        getMediaInfo: (mediaId) => client.getMediaInfo(mediaId).pipe(effect_1.Effect.map(response => ({
            id: response.id,
            mimeType: response.mime_type,
            size: response.file_size,
            url: response.url
        }))),
        downloadMedia: (url) => client.downloadMedia(url)
    };
};
exports.createWhatsAppService = createWhatsAppService;
//# sourceMappingURL=WhatsAppService.js.map