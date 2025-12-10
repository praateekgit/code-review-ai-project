import { Request, Response } from "express";
import { getReview } from "../../utils/llm";
import axios from "axios";

export const handleWebhook = async (req: Request, res: Response) => {
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
        const diffResponse = await axios.get(diffUrl, {
            headers: { Accept: "application/vnd.github.v3.diff" }
        });

        const diffText = diffResponse.data;

        // Send to LLM for review
        const reviewText = await getReview(
            `Review this pull request diff:\n${diffText}`
        );

        // POST comment back to PR
        await axios.post(
            pullRequest.comments_url,
            { body: `### 🤖 AI Code Review\n${reviewText}` },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        res.status(200).json({ ok: true, review: reviewText });

    } catch (err: any) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).json({ ok: false, error: err.message });
    }
};
