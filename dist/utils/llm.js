"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
exports.getReview = getReview;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
exports.client = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
async function getReview(comment) {
    const chatCompletion = await exports.client.chat.completions.create({
        model: "llama-3.3-70b-versatile", // <-- Use a supported model
        messages: [
            { role: "system", content: "You are a code review assistant." },
            { role: "user", content: comment }
        ],
    });
    return chatCompletion.choices[0]?.message?.content;
}
