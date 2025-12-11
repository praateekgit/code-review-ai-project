"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --- IMPORTANT ---
// This disables all SSR & tells Next.js NOT to prerender this page.
export const dynamic = "force-dynamic";
export const runtime = "edge";
export const revalidate = 0;

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const session = params.get("session");

    if (!session) {
      console.error("❌ No session token found");
      return;
    }

    // Save session token
    localStorage.setItem("auth_token", session);

    // Redirect to homepage
    router.replace("/");
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="mt-2 opacity-70">Please wait...</p>
      </div>
    </div>
  );
}
