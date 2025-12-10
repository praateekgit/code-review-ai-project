"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReview = generateReview;
const llm_1 = require("../utils/llm");
async function generateReview(comment) {
    const result = await (0, llm_1.getReview)(comment);
    return result;
}
