"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPullRequestDiff = fetchPullRequestDiff;
const axios_1 = __importDefault(require("axios"));
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
    console.error("❌ Missing GITHUB_TOKEN in .env");
}
async function fetchPullRequestDiff(owner, repo, prNumber) {
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
        console.log("🔗 Fetching PR from:", url);
        const response = await axios_1.default.get(url, {
            headers: {
                "Authorization": `token ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3.diff"
            }
        });
        return response.data; // <-- This is the PR DIFF
    }
    catch (error) {
        console.error("❌ GitHub API Error:", error.response?.data || error.message);
        throw new Error("Failed to fetch PR diff from GitHub");
    }
}
