import { Queue } from "bullmq";
import { getReview } from "../utils/llm";

export const reviewQueue = new Queue("review-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
