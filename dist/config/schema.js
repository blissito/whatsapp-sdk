"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeConfig = exports.validateConfig = exports.loadConfig = void 0;
const schema_1 = require("@effect/schema");
const effect_1 = require("effect");
const types_1 = require("../core/types");
const types_2 = require("../core/types");
// Esquema para la configuración de WhatsApp
const WhatsAppConfigSchema = schema_1.Schema.Struct({
    phoneNumberId: schema_1.Schema.String.pipe(schema_1.Schema.nonEmpty({
        message: "WHATSAPP_PHONE_NUMBER_ID is required and cannot be empty",
    })),
    accessToken: schema_1.Schema.String.pipe(schema_1.Schema.nonEmpty({
        message: "WHATSAPP_ACCESS_TOKEN is required and cannot be empty",
    })),
    apiVersion: schema_1.Schema.String.pipe(schema_1.Schema.defaultLiteral(types_1.defaultConfig.apiVersion)),
    businessAccountId: schema_1.Schema.optional(schema_1.Schema.String),
    webhookVerifyToken: schema_1.Schema.optional(schema_1.Schema.String),
    maxRetries: schema_1.Schema.Number.pipe(schema_1.Schema.positive(), schema_1.Schema.defaultLiteral(types_1.defaultConfig.maxRetries)),
    retryDelayMs: schema_1.Schema.Number.pipe(schema_1.Schema.positive(), schema_1.Schema.defaultLiteral(types_1.defaultConfig.retryDelayMs)),
    baseUrl: schema_1.Schema.String.pipe(schema_1.Schema.defaultLiteral(types_1.defaultConfig.baseUrl)),
});
// Cargar configuración desde variables de entorno
const loadConfig = (env = process.env) => effect_1.Effect.gen(function* (_) {
    const config = yield* _(effect_1.Config.all({
        phoneNumberId: effect_1.Config.string("WHATSAPP_PHONE_NUMBER_ID"),
        accessToken: effect_1.Config.secret("WHATSAPP_ACCESS_TOKEN"),
        apiVersion: effect_1.Config.string("WHATSAPP_API_VERSION").pipe(effect_1.Config.withDefault(types_1.defaultConfig.apiVersion)),
        businessAccountId: effect_1.Config.option(effect_1.Config.string("WHATSAPP_BUSINESS_ACCOUNT_ID")),
        webhookVerifyToken: effect_1.Config.option(effect_1.Config.string("WHATSAPP_WEBHOOK_VERIFY_TOKEN")),
        maxRetries: effect_1.Config.option(effect_1.Config.number("WHATSAPP_MAX_RETRIES"), types_1.defaultConfig.maxRetries),
        retryDelayMs: effect_1.Config.option(effect_1.Config.number("WHATSAPP_RETRY_DELAY_MS"), types_1.defaultConfig.retryDelayMs),
        baseUrl: effect_1.Config.string("WHATSAPP_BASE_URL").pipe(effect_1.Config.withDefault(types_1.defaultConfig.baseUrl)),
    }));
    return yield* _(schema_1.Schema.decodeUnknown(WhatsAppConfigSchema)({
        ...config,
        businessAccountId: config.businessAccountId.pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(undefined))),
        webhookVerifyToken: config.webhookVerifyToken.pipe(effect_1.Effect.catchAll(() => effect_1.Effect.succeed(undefined))),
    }), {
        errors: "all",
        onExcessProperty: "error",
    }).pipe(effect_1.Effect.mapError((error) => {
        const message = error.errors
            .map((e) => {
            if (e._tag === "Missing") {
                return `Missing required configuration: ${e.key}`;
            }
            if (e._tag === "Type") {
                return `Invalid type for ${e.key}: ${e.message}`;
            }
            return e.message;
        })
            .join("\n");
        return new types_2.ConfigurationError("Invalid configuration", {
            cause: message,
            details: error,
        });
    }));
});
exports.loadConfig = loadConfig;
// Validar configuración manual
const validateConfig = (config) => schema_1.Schema.decodeUnknown(WhatsAppConfigSchema)({
    ...types_1.defaultConfig,
    ...config,
}).pipe(effect_1.Effect.mapError((error) => new types_2.ConfigurationError("Invalid configuration", {
    cause: error,
    details: {
        message: "Configuration validation failed",
        errors: error.errors,
    },
})));
exports.validateConfig = validateConfig;
const makeConfig = (config) => (0, exports.validateConfig)({
    ...types_1.defaultConfig,
    ...config,
});
exports.makeConfig = makeConfig;
//# sourceMappingURL=schema.js.map