"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewQueue = void 0;
const bullmq_1 = require("bullmq");
exports.reviewQueue = new bullmq_1.Queue("review-queue", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
