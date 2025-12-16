import { Request, Response } from "express";
import axios from "axios";
import { getReview } from "../../utils/llm";
import Review from "../models/Review";

/**
 * ----------------------------------------
 * SHARED PROMPT TEMPLATES
 * ----------------------------------------
 */

const BASE_REVIEW_GUIDELINES = `
You are a highly experienced senior software engineer performing a professional code review.

Your goals:
- Identify bugs, logic issues, and edge cases
- Review code quality and readability
- Suggest performance optimizations
- Point out security risks (if any)
- Recommend best practices and refactoring ideas

Rules:
- Be concise but thorough
- Use bullet points
- Reference specific code behaviors
- Avoid generic advice
- Assume production-level code
`;

/**
 * ----------------------------------------
 * SIMPLE TEXT REVIEW (POST /review)
 * ----------------------------------------
 */
export async function actualReview(req: Request, res: Response) {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        ok: false,
        error: "Missing 'comment' field"
      });
    }

    const prompt = `
${BASE_REVIEW_GUIDELINES}

Review the following code or description provided by the user:

${comment}

Provide your response in the following format:

1. Summary
2. Issues & Risks
3. Suggested Improvements
4. Best Practices
`;

    const review = await getReview(prompt);

    return res.status(200).json({
      ok: true,
      review
    });
  } catch (error: any) {
    console.error("❌ Error in POST /review:", error);
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

/**
 * ----------------------------------------
 * PR REVIEW (POST /review/pr)
 * ----------------------------------------
 */
export const prReview = async (req: Request, res: Response) => {
  try {
    const { owner, repo, pull_number } = req.body;

    if (!owner || !repo || !pull_number) {
      return res.status(400).json({
        ok: false,
        error: "owner, repo, pull_number required"
      });
    }

    const GH_TOKEN = process.env.GITHUB_TOKEN;
    if (!GH_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: "GitHub token missing"
      });
    }

    // STEP 1: Fetch PR diff
    const diffUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`;
    const response = await axios.get(diffUrl, {
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github.diff",
        "User-Agent": "ai-code-reviewer"
      }
    });

    const diffText = response.data;
    if (!diffText || diffText.length < 10) {
      return res.status(400).json({
        ok: false,
        error: "Received empty or invalid diff"
      });
    }

    // STEP 2: AI Review Prompt
    const prompt = `
${BASE_REVIEW_GUIDELINES}

Review the following GitHub Pull Request diff.

Focus on:
- Code correctness
- Breaking changes
- Performance impact
- Security vulnerabilities
- Maintainability and scalability
- Test coverage gaps

GitHub PR Diff:
${diffText}

Output format:
1. Overall Assessment
2. Major Issues
3. Minor Issues
4. Suggestions
5. Final Verdict (Approve / Request Changes)
`;

    const aiReview = await getReview(prompt);

    // STEP 3: Save review
    const saved = await Review.create({
      owner,
      repo,
      pull_number,
      diff: diffText,
      reviewText: aiReview || "No review generated"
    });

    return res.status(200).json({
      ok: true,
      reviewId: saved._id.toString(),
      aiReview
    });
  } catch (err: any) {
    console.error("❌ Error in PR review:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};

/**
 * ----------------------------------------
 * REVIEW HISTORY
 * ----------------------------------------
 */
export const getHistory = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.json({
      ok: true,
      count: reviews.length,
      reviews
    });
  } catch (err: any) {
    console.error("❌ Error fetching history:", err);
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};
