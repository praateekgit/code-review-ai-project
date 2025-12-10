"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      console.error("Missing ?code on callback URL");
      return;
    }

    // Backend callback endpoint
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
    const url = `${API_BASE.replace(/\/$/, "")}/review/auth/github/callback?code=${code}`;

    // Redirect browser to backend to finalize login
    window.location.href = url;
  }, [searchParams]);

  return (
    <main className="min-h-screen flex items-center justify-center text-white">
      <h1 className="text-xl">⏳ Logging you in...</h1>
    </main>
  );
}
