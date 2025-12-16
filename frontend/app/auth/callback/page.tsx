// frontend/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token") || searchParams.get("session");
    if (!token) {
      console.error("❌ No token in callback URL");
      router.replace("/"); // go back to home if no token
      return;
    }

    console.log("✅ Received token:", token);
    localStorage.setItem("auth_token", token);
    router.replace("/");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="mt-2 opacity-70">Please wait...</p>
      </div>
    </div>
  );
}
