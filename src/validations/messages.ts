import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { ValidationError } from "../core/types";

// Esquema para validar números de teléfono según el formato de WhatsApp
export const PhoneNumberSchema = Schema.String.pipe(
  Schema.pattern(
    /^\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    {
      message: "must be a valid phone number with country code (e.g., 1234567890 or +1 234 567 8900)",
    }
  )
);

export const validatePhoneNumber = (
  phoneNumber: string
): Effect.Effect<string, Schema.ParseError> =>
  Schema.decodeUnknown(PhoneNumberSchema)(phoneNumber, { errors: "all" });

// Esquema para validar el texto de los mensajes
export const MessageTextSchema = Schema.String.pipe(
  Schema.minLength(1, {
    message: "Message text cannot be empty",
  }),
  Schema.maxLength(4096, {
    message: "Message text cannot exceed 4096 characters",
  })
);

export const validateMessageText = (
  text: string
): Effect.Effect<string, Schema.ParseError> =>
  Schema.decodeUnknown(MessageTextSchema)(text, { errors: "all" });

// Esquema para validar IDs de plantillas
export const TemplateNameSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z0-9_]+(?:\.[a-z0-9_]+)*$/, {
    message:
      "Template name can only contain lowercase letters, numbers, and underscores",
  }),
  Schema.maxLength(512, {
    message: "Template name cannot exceed 512 characters",
  })
);

export const validateTemplateName = (
  templateName: string
): Effect.Effect<string, Schema.ParseError> =>
  Schema.decodeUnknown(TemplateNameSchema)(templateName, { errors: "all" });

// Esquema para validar códigos de idioma (ISO 639-1)
export const LanguageCodeSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}_[A-Z]{2}$/, {
    message: "Language code must be in the format 'xx_YY' (e.g., 'en_US')",
  })
);

export const validateLanguageCode = (
  languageCode: string
): Effect.Effect<string, Schema.ParseError> =>
  Schema.decodeUnknown(LanguageCodeSchema)(languageCode, { errors: "all" });
