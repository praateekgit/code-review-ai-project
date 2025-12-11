"use client";
export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Callback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      console.error("❌ Token missing in URL");
      router.replace("/");
      return;
    }

    localStorage.setItem("auth_token", token);

    router.replace("/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="opacity-60 mt-2">Please wait...</p>
      </div>
    </div>
  );
}
