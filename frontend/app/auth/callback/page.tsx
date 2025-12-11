"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = params.get("session");

    if (!session) {
      console.error("❌ No session token found in URL");
      return;
    }

    // Save JWT
    localStorage.setItem("session_token", session);

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
