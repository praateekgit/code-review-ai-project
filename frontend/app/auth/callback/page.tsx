"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function GithubCallbackPage() {
  const params = useSearchParams();

  const code = params.get("code");
  const error = params.get("error");

  useEffect(() => {
    if (!code) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
    
    // Redirect to backend callback API
    window.location.href = `${API_BASE}/review/auth/github/callback?code=${code}`;
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        GitHub Login Failed: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white text-xl">
      Redirecting, please wait…
    </div>
  );
}
