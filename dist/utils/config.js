"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
const dotenv_1 = __importDefault(require("dotenv"));
function loadConfig() {
    dotenv_1.default.config();
    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY not found in environment");
    }
    else {
        console.log("✅ Configuration loaded!");
    }
}
