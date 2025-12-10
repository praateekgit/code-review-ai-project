"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.prReview = void 0;
exports.actualReview = actualReview;
const axios_1 = __importDefault(require("axios"));
const llm_1 = require("../../utils/llm");
const Review_1 = __importDefault(require("../models/Review"));
/**
 * ----------------------------------------
 * SIMPLE TEXT REVIEW (POST /review)
 * ----------------------------------------
 */
async function actualReview(req, res) {
    try {
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({ ok: false, error: "Missing 'comment' field" });
        }
        console.log("📥 Incoming request body:", req.body);
        const review = await (0, llm_1.getReview)(comment);
        return res.status(200).json({
            ok: true,
            review,
        });
    }
    catch (error) {
        console.error("❌ Error in POST /review:", error);
        return res.status(500).json({ ok: false, error: error.message });
    }
}
/**
 * ----------------------------------------
 * PR REVIEW (POST /review/pr)
 * ----------------------------------------
 */
const prReview = async (req, res) => {
    try {
        const { owner, repo, pull_number } = req.body;
        if (!owner || !repo || !pull_number) {
            return res.status(400).json({ ok: false, error: "owner, repo, pull_number required" });
        }
        const GH_TOKEN = process.env.GITHUB_TOKEN;
        if (!GH_TOKEN) {
            return res.status(500).json({ ok: false, error: "GitHub token missing" });
        }
        // STEP 1: Fetch PR Diff from GitHub
        const diffUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
        const response = await axios_1.default.get(diffUrl, {
            headers: {
                Authorization: `Bearer ${GH_TOKEN}`,
                Accept: "application/vnd.github.diff",
                "User-Agent": "ai-code-reviewer"
            },
        });
        const diffText = response.data;
        if (!diffText || diffText.length < 5) {
            return res.status(400).json({ ok: false, error: "Received empty diff" });
        }
        console.log("📘 DIFF FETCHED FROM GITHUB\n", diffText.substring(0, 200), "...");
        // STEP 2: Send diff to Groq LLM
        const aiReview = await (0, llm_1.getReview)(`You are an expert senior engineer. Review this GitHub Pull Request diff and give detailed code review comments:\n\n${diffText}`);
        // STEP 3: Save to MongoDB
        const saved = await Review_1.default.create({
            owner,
            repo,
            pull_number,
            diff: diffText,
            reviewText: aiReview || "No review generated"
        });
        // STEP 4: Return response
        return res.status(200).json({
            ok: true,
            reviewId: saved._id.toString(),
            aiReview
        });
    }
    catch (err) {
        console.error("❌ Error in PR review:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
};
exports.prReview = prReview;
const getHistory = async (req, res) => {
    try {
        const reviews = await Review_1.default.find().sort({ createdAt: -1 });
        return res.json({
            ok: true,
            count: reviews.length,
            reviews,
        });
    }
    catch (err) {
        console.error("❌ Error fetching history:", err);
        return res.status(500).json({ ok: false, error: err.message });
    }
};
exports.getHistory = getHistory;
