import { Schema } from "@effect/schema";
import { Effect, Config } from "effect";
import { WhatsAppConfig, defaultConfig } from "../core/types";
import { ConfigurationError } from "../core/types";

// Esquema para la configuración de WhatsApp
const WhatsAppConfigSchema = Schema.Struct({
  phoneNumberId: Schema.String.pipe(
    Schema.nonEmpty({
      message: "WHATSAPP_PHONE_NUMBER_ID is required and cannot be empty",
    })
  ),
  accessToken: Schema.String.pipe(
    Schema.nonEmpty({
      message: "WHATSAPP_ACCESS_TOKEN is required and cannot be empty",
    })
  ),
  apiVersion: Schema.String.pipe(
    Schema.defaultLiteral(defaultConfig.apiVersion!)
  ),
  businessAccountId: Schema.optional(Schema.String),
  webhookVerifyToken: Schema.optional(Schema.String),
  maxRetries: Schema.Number.pipe(
    Schema.positive(),
    Schema.defaultLiteral(defaultConfig.maxRetries!)
  ),
  retryDelayMs: Schema.Number.pipe(
    Schema.positive(),
    Schema.defaultLiteral(defaultConfig.retryDelayMs!)
  ),
  baseUrl: Schema.String.pipe(Schema.defaultLiteral(defaultConfig.baseUrl!)),
});

type ConfigInput = Schema.Schema.Type<typeof WhatsAppConfigSchema>;

// Cargar configuración desde variables de entorno
export const loadConfig = (
  env: Record<string, string | undefined> = process.env
): Effect.Effect<WhatsAppConfig, ConfigurationError> =>
  Effect.gen(function* (_) {
    const config = yield* _(
      Config.all({
        phoneNumberId: Config.string("WHATSAPP_PHONE_NUMBER_ID"),
        accessToken: Config.secret("WHATSAPP_ACCESS_TOKEN"),
        apiVersion: Config.string("WHATSAPP_API_VERSION").pipe(
          Config.withDefault(defaultConfig.apiVersion!)
        ),
        businessAccountId: Config.option(
          Config.string("WHATSAPP_BUSINESS_ACCOUNT_ID")
        ),
        webhookVerifyToken: Config.option(
          Config.string("WHATSAPP_WEBHOOK_VERIFY_TOKEN")
        ),
        maxRetries: Config.option(
          Config.number("WHATSAPP_MAX_RETRIES"),
          defaultConfig.maxRetries
        ),
        retryDelayMs: Config.option(
          Config.number("WHATSAPP_RETRY_DELAY_MS"),
          defaultConfig.retryDelayMs
        ),
        baseUrl: Config.string("WHATSAPP_BASE_URL").pipe(
          Config.withDefault(defaultConfig.baseUrl!)
        ),
      })
    );

    return yield* _(
      Schema.decodeUnknown(WhatsAppConfigSchema)({
        ...config,
        businessAccountId: config.businessAccountId.pipe(
          Effect.catchAll(() => Effect.succeed(undefined))
        ),
        webhookVerifyToken: config.webhookVerifyToken.pipe(
          Effect.catchAll(() => Effect.succeed(undefined))
        ),
      }),
      {
        errors: "all",
        onExcessProperty: "error",
      }
    ).pipe(
      Effect.mapError((error) => {
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

        return new ConfigurationError("Invalid configuration", {
          cause: message,
          details: error,
        });
      })
    );
  });

// Validar configuración manual
export const validateConfig = (
  config: Partial<WhatsAppConfig>
): Effect.Effect<WhatsAppConfig, ConfigurationError> =>
  Schema.decodeUnknown(WhatsAppConfigSchema)({
    ...defaultConfig,
    ...config,
  }).pipe(
    Effect.mapError(
      (error) =>
        new ConfigurationError("Invalid configuration", {
          cause: error,
          details: {
            message: "Configuration validation failed",
            errors: error.errors,
          },
        })
    )
  );

export const makeConfig = (
  config: Partial<WhatsAppConfig>
): Effect.Effect<WhatsAppConfig, ConfigurationError> =>
  validateConfig({
    ...defaultConfig,
    ...config,
  });
