"use client"; // <-- MUST be first line

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      console.error("❌ No token received");
      router.replace("/"); // avoid hanging page
      return;
    }

    console.log("✅ Received token:", token);

    localStorage.setItem("auth_token", token);

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
