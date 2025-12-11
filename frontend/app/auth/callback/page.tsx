"use client";

export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = params.get("session");

    if (!session) {
      console.error("No session token");
      return;
    }

    localStorage.setItem("session_token", session);

    router.replace("/");
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p className="text-xl">⏳ Logging you in…</p>
    </div>
  );
}
