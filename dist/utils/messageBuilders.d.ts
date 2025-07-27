import { Effect } from "effect";
import { ValidationError } from "../core/types";
/**
 * Interfaz para los parámetros de un mensaje de texto
 */
interface TextMessageParams {
    messaging_product: string;
    recipient_type: string;
    to: string;
    type: string;
    text: {
        body: string;
        preview_url: boolean;
    };
}
/**
 * Crea un objeto de solicitud para enviar un mensaje de texto
 */
export declare const createTextMessageRequest: (to: string, text: string, preview_url?: boolean) => Effect.Effect<TextMessageParams, ValidationError>;
/**
 * Crea un objeto de solicitud para enviar un mensaje de imagen
 */
interface ImageMessageParams {
    messaging_product: string;
    recipient_type: string;
    to: string;
    type: string;
    image: {
        id: string;
        caption?: string;
    };
}
export declare const createImageMessageRequest: (to: string, mediaIdOrUrl: string, caption?: string) => Effect.Effect<ImageMessageParams, ValidationError>;
export {};
//# sourceMappingURL=messageBuilders.d.ts.map