"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackInner() {
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (!code) return;

    // Hit backend callback
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/review/auth/github/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("GITHUB LOGIN RESULT:", data);
      })
      .catch((err) => console.error("Callback error", err));
  }, [code]);

  return (
    <div className="text-white p-10 text-center">
      <h1 className="text-3xl font-bold">⏳ Logging you in…</h1>
      <p className="text-gray-300 mt-4">Please wait...</p>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading…</div>}>
      <CallbackInner />
    </Suspense>
  );
}
