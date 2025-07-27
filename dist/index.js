"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = exports.HttpClient = exports.Schema = exports.pipe = exports.Context = exports.Layer = exports.Effect = void 0;
// Core types and interfaces
__exportStar(require("./core/types"), exports);
// HTTP Client
__exportStar(require("./http/WhatsAppHttpClient"), exports);
// Re-export commonly used Effect types for convenience
var effect_1 = require("effect");
Object.defineProperty(exports, "Effect", { enumerable: true, get: function () { return effect_1.Effect; } });
Object.defineProperty(exports, "Layer", { enumerable: true, get: function () { return effect_1.Layer; } });
Object.defineProperty(exports, "Context", { enumerable: true, get: function () { return effect_1.Context; } });
Object.defineProperty(exports, "pipe", { enumerable: true, get: function () { return effect_1.pipe; } });
// Export common schemas
exports.Schema = __importStar(require("@effect/schema"));
// Export platform HTTP client for advanced usage
exports.HttpClient = __importStar(require("@effect/platform/HttpClient"));
// Export platform HTTP request builder
exports.HttpRequest = __importStar(require("@effect/platform/HttpClientRequest"));
//# sourceMappingURL=index.js.map