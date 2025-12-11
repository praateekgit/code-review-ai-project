"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      console.error("❌ No token found in callback URL");
      router.replace("/?error=no_token");
      return;
    }

    console.log("✅ OAuth token received:", token);

    localStorage.setItem("auth_token", token);

    // Redirect home
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
