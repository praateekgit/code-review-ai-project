"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = searchParams.get("session");

    if (!session) {
      console.error("❌ No session token");
      router.replace("/");
      return;
    }

    localStorage.setItem("auth_token", session);
    router.replace("/");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="opacity-70 mt-2">Please wait</p>
      </div>
    </div>
  );
}
