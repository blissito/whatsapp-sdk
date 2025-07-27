"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLanguageCode = exports.validateTemplateName = exports.validateMessageText = exports.validatePhoneNumber = void 0;
const effect_1 = require("effect");
const types_1 = require("../core/types");
// Simple validation function
const validate = (value, isValid, errorMessage) => {
    return isValid(value)
        ? effect_1.Effect.succeed(value)
        : effect_1.Effect.fail(new types_1.ValidationError(errorMessage));
};
// Phone number validation
const PHONE_NUMBER_PATTERN = /^\d{1,4}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
const validatePhoneNumber = (phoneNumber) => validate(phoneNumber, (s) => PHONE_NUMBER_PATTERN.test(s), "Invalid phone number format. Expected format: [+][country code][area code][phone number]");
exports.validatePhoneNumber = validatePhoneNumber;
// Message text validation
const MESSAGE_MIN_LENGTH = 1;
const MESSAGE_MAX_LENGTH = 4096;
const validateMessageText = (text) => validate(text, (s) => s.length >= MESSAGE_MIN_LENGTH && s.length <= MESSAGE_MAX_LENGTH, `Message text must be between ${MESSAGE_MIN_LENGTH} and ${MESSAGE_MAX_LENGTH} characters`);
exports.validateMessageText = validateMessageText;
// Template name validation
const TEMPLATE_NAME_PATTERN = /^[a-z0-9_]+(?:\.[a-z0-9_]+)*$/;
const TEMPLATE_MAX_LENGTH = 512;
const validateTemplateName = (templateName) => validate(templateName, (s) => TEMPLATE_NAME_PATTERN.test(s) && s.length <= TEMPLATE_MAX_LENGTH, `Template name must match pattern ${TEMPLATE_NAME_PATTERN} and be at most ${TEMPLATE_MAX_LENGTH} characters`);
exports.validateTemplateName = validateTemplateName;
// Language code validation (ISO 639-1)
const LANGUAGE_CODE_PATTERN = /^[a-z]{2}_[A-Z]{2}$/;
const validateLanguageCode = (languageCode) => validate(languageCode, (s) => LANGUAGE_CODE_PATTERN.test(s), `Language code must be in format 'xx_YY' (e.g., 'en_US', 'es_ES')`);
exports.validateLanguageCode = validateLanguageCode;
//# sourceMappingURL=messages.js.map