// Core exports
export * from "./core/types";
export * from "./core/WhatsAppService";

// HTTP Client
export * from "./http/WhatsAppHttpClient";

// Configuration
export * from "./config/schema";

// Validations
export * as validations from "./validations/messages";

// Utils
export * as utils from "./utils/messageBuilders";

// Re-export Effect for convenience
export { Effect, pipe } from "effect";

// Types for better DX
export type { WhatsAppClient, WhatsAppConfig, MessageResponse } from "./core/types";
