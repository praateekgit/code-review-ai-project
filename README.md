AI-Powered Automated Code Review System (Node.js + LLM + GitHub API)

This project automatically reviews GitHub Pull Requests using AI + static analysis and posts comments directly on the PR.

Features

✅ Monitors GitHub PRs via webhook
✅ Fetches code diff and changed files
✅ AI code review using LLM (OpenAI or local models)
✅ Inline comments on GitHub PR
✅ Static analysis using ESLint
✅ Review scoring engine
✅ Redis-backed asynchronous worker queue
✅ Docker support
✅ Production-ready architecture

Architecture:
------------------------------------------------
GitHub Webhook → Webhook Server (Express)
      ↓
Redis Queue (BullMQ)
      ↓
Review Worker (LLM + Static Analysis)
      ↓
GitHub PR Comment API
------------------------------------------------

Tech Stack:

-> Node.js + TypeScript
-> Express for Webhook API
-> BullMQ + Redis for async processing
-> OpenAI GPT-4/4o for AI review
-> ESLint for static analysis
-> Docker + docker-compose

Installation:

git clone https://github.com/yourname/code-review-ai.git
cd code-review-ai
npm install
cp .env.example .env

Environment Variables:

GITHUB_TOKEN=ghp_xxxxx
OPENAI_API_KEY=sk-xxxx
REDIS_HOST=localhost
PORT=3000

Run the Server:

npm run dev

Docker:

docker-compose up --build

Test Webhook:

curl -X POST http://localhost:3000/webhook/github -H "Content-Type: application/json" -d @sample.json


