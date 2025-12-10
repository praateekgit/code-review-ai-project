import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("❌ Missing GITHUB_TOKEN in .env");
}

export async function fetchPullRequestDiff(owner: string, repo: string, prNumber: number) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;

    console.log("🔗 Fetching PR from:", url);

    const response = await axios.get(url, {
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3.diff"
      }
    });

    return response.data; // <-- This is the PR DIFF
  } catch (error: any) {
    console.error("❌ GitHub API Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch PR diff from GitHub");
  }
}
