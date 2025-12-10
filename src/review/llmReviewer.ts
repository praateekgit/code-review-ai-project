import { getReview } from "../utils/llm";

export async function generateReview(comment: string) {
    const result = await getReview(comment);
    return result;
}
