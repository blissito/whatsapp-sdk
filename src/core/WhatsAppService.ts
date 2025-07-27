import { Effect } from "effect";
import { WhatsAppConfig } from "./types";
import { makeWhatsAppHttpClient } from "../http/WhatsAppHttpClient";

// Servicio mejorado con API más amigable
export interface WhatsAppService {
  sendTextMessage: (phoneNumber: string, message: string) => 
    Effect.Effect<{ messageId: string }, Error>;
  
  uploadMedia: (file: Uint8Array, mimeType: string) => 
    Effect.Effect<{ mediaId: string }, Error>;
  
  getMediaInfo: (mediaId: string) => 
    Effect.Effect<{ id: string; mimeType: string; size: number; url: string }, Error>;
  
  downloadMedia: (url: string) => 
    Effect.Effect<Uint8Array, Error>;
}

// Factory function para crear el servicio
export const createWhatsAppService = (config: WhatsAppConfig): WhatsAppService => {
  const client = makeWhatsAppHttpClient(config);
  
  return {
    sendTextMessage: (phoneNumber: string, message: string) =>
      client.sendTextMessage(phoneNumber, message).pipe(
        Effect.map(response => ({ messageId: response.messages[0].id }))
      ),
    
    uploadMedia: (file: Uint8Array, mimeType: string) =>
      client.uploadMedia({ data: file, type: mimeType }).pipe(
        Effect.map(response => ({ mediaId: response.id }))
      ),
    
    getMediaInfo: (mediaId: string) =>
      client.getMediaInfo(mediaId).pipe(
        Effect.map(response => ({
          id: response.id,
          mimeType: response.mime_type,
          size: response.file_size,
          url: response.url
        }))
      ),
    
    downloadMedia: (url: string) =>
      client.downloadMedia(url)
  };
};
