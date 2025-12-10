"use client";

import { useState } from "react";

export default function Home() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [pullNumber, setPullNumber] = useState("");
  const [review, setReview] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = "https://code-review-ai-project.onrender.com";

  const getReview = async () => {
    if (!owner || !repo || !pullNumber) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const res = await fetch(`${API_BASE}/review/pr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner,
          repo,
          pull_number: Number(pullNumber),
        }),
      });

      const data = await res.json();

      if (!data.ok) setError(data.error || "Something went wrong");
      else setReview(data.aiReview);
    } catch (err) {
      setError("Failed to fetch review");
    }

    setLoading(false);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE}/review/history`);
      const data = await res.json();

      if (data.ok) setHistory(data.reviews);
      else setError("Failed to load history");
    } catch {
      setError("Could not load review history");
    }
    setLoadingHistory(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/20">
        
        <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide text-white drop-shadow-lg">
          🚀 AI Pull Request Reviewer
        </h1>

        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="GitHub Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
          />

          <input
            type="text"
            placeholder="Repository Name"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
          />

          <input
            type="number"
            placeholder="Pull Request Number"
            value={pullNumber}
            onChange={(e) => setPullNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-6 space-y-4">
          <button
            onClick={getReview}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all shadow-lg ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "🔄 Analyzing..." : "✨ Get AI Review"}
          </button>

          <button
            onClick={loadHistory}
            disabled={loadingHistory}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all shadow-lg ${
              loadingHistory
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loadingHistory ? "⏳ Loading History..." : "📜 Show Review History"}
          </button>
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-400 text-red-300 rounded-lg text-center shadow-md">
            {error}
          </div>
        )}

        {/* REVIEW OUTPUT */}
        {review && (
          <div className="mt-8 p-6 bg-white/10 border border-white/20 text-white rounded-xl whitespace-pre-wrap shadow-xl">
            <h2 className="text-xl font-bold mb-3">✨ AI Review Result</h2>
            {review}
          </div>
        )}

        {/* HISTORY SECTION */}
        {history.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              📜 Previous Reviews
            </h2>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 border border-white/20 rounded-lg shadow-md"
                >
                  <p className="text-sm text-gray-300">
                    <strong>Repo:</strong> {item.owner}/{item.repo}
                    <br />
                    <strong>PR:</strong> #{item.pull_number}
                    <br />
                    <strong>Date:</strong>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-gray-100">
                    {item.reviewText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
