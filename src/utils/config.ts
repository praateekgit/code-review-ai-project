import dotenv from "dotenv";

export function loadConfig() {
    dotenv.config();

    if (!process.env.GROQ_API_KEY) {
        console.error("❌ GROQ_API_KEY not found in environment");
    } else {
        console.log("✅ Configuration loaded!");
    }
}
