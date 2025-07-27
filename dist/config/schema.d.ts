import { Effect } from "effect";
import { WhatsAppConfig } from "../core/types";
import { ConfigurationError } from "../core/types";
export declare const loadConfig: (env?: Record<string, string | undefined>) => Effect.Effect<WhatsAppConfig, ConfigurationError>;
export declare const validateConfig: (config: Partial<WhatsAppConfig>) => Effect.Effect<WhatsAppConfig, ConfigurationError>;
export declare const makeConfig: (config: Partial<WhatsAppConfig>) => Effect.Effect<WhatsAppConfig, ConfigurationError>;
//# sourceMappingURL=schema.d.ts.map