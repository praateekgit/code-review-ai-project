"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = params.get("session");

    if (!session) {
      console.error("No session found in URL");
      return;
    }

    localStorage.setItem("auth_token", session);

    router.replace("/");
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="opacity-70">Please wait...</p>
      </div>
    </div>
  );
}
