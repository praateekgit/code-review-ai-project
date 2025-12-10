import { Worker } from "bullmq";
import { getReview } from "../utils/llm";

new Worker("review-queue", async job => {
    const { comment } = job.data;
    const review = await getReview(comment);
    console.log("AI Review:", review);
});
