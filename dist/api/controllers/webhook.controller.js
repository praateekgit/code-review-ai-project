"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const llm_1 = require("../../utils/llm");
const axios_1 = __importDefault(require("axios"));
const handleWebhook = async (req, res) => {
    try {
        const event = req.headers["x-github-event"];
        // Only act on Pull Request events
        if (event !== "pull_request") {
            return res.status(200).json({ ok: true, msg: "Ignored non-PR event" });
        }
        const action = req.body.action;
        const pullRequest = req.body.pull_request;
        // Trigger only when PR is opened or synchronized
        if (!["opened", "synchronize", "edited"].includes(action)) {
            return res.status(200).json({ ok: true, msg: "PR action ignored" });
        }
        const diffUrl = pullRequest.diff_url;
        // Fetch diff from GitHub
        const diffResponse = await axios_1.default.get(diffUrl, {
            headers: { Accept: "application/vnd.github.v3.diff" }
        });
        const diffText = diffResponse.data;
        // Send to LLM for review
        const reviewText = await (0, llm_1.getReview)(`Review this pull request diff:\n${diffText}`);
        // POST comment back to PR
        await axios_1.default.post(pullRequest.comments_url, { body: `### 🤖 AI Code Review\n${reviewText}` }, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });
        res.status(200).json({ ok: true, review: reviewText });
    }
    catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).json({ ok: false, error: err.message });
    }
};
exports.handleWebhook = handleWebhook;
