import { Effect } from "effect";
import { WhatsAppConfig } from "./types";
export interface WhatsAppService {
    sendTextMessage: (phoneNumber: string, message: string) => Effect.Effect<{
        messageId: string;
    }, Error>;
    uploadMedia: (file: Uint8Array, mimeType: string) => Effect.Effect<{
        mediaId: string;
    }, Error>;
    getMediaInfo: (mediaId: string) => Effect.Effect<{
        id: string;
        mimeType: string;
        size: number;
        url: string;
    }, Error>;
    downloadMedia: (url: string) => Effect.Effect<Uint8Array, Error>;
}
export declare const createWhatsAppService: (config: WhatsAppConfig) => WhatsAppService;
