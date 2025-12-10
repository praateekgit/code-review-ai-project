"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Backend endpoint
  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/review/history`;

  const loadHistory = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Failed to load history");
      } else {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error(err);
      setError("Cannot connect to backend");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-black p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📜 Review History</h1>

          {/* Back button */}
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            ⬅ Back
          </Link>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {/* No Reviews */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500">No reviews yet.</p>
        )}

        {/* Reviews List */}
        <div className="space-y-6 mt-4">
          {reviews.map((r, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md"
            >
              <p className="text-sm text-gray-600">
                <strong>Repo:</strong> {r.owner}/{r.repo} •{" "}
                <strong>PR:</strong> #{r.pull_number}
              </p>

              <h2 className="font-semibold text-lg mt-3">AI Review:</h2>

              <pre className="whitespace-pre-wrap bg-white p-4 border rounded mt-2 text-gray-800">
                {r.reviewText}
              </pre>

              <p className="text-gray-500 text-sm mt-3">
                ⏱ {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
