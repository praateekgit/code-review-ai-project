"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const llm_1 = require("../utils/llm");
new bullmq_1.Worker("review-queue", async (job) => {
    const { comment } = job.data;
    const review = await (0, llm_1.getReview)(comment);
    console.log("AI Review:", review);
});
