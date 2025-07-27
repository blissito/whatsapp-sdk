import { Effect } from "effect";
import { ValidationError } from "../core/types";
export declare const validatePhoneNumber: (phoneNumber: string) => Effect.Effect<string, ValidationError, never>;
export declare const validateMessageText: (text: string) => Effect.Effect<string, ValidationError, never>;
export declare const validateTemplateName: (templateName: string) => Effect.Effect<string, ValidationError, never>;
export declare const validateLanguageCode: (languageCode: string) => Effect.Effect<string, ValidationError, never>;
//# sourceMappingURL=messages.d.ts.map