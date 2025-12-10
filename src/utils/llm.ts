import Groq from "groq-sdk";

export const client = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function getReview(comment: string) {
    const chatCompletion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",  // <-- Use a supported model
        messages: [
            { role: "system", content: "You are a code review assistant." },
            { role: "user", content: comment }
        ],
    });
    return chatCompletion.choices[0]?.message?.content;
}
