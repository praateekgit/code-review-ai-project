export const dynamic = "force-dynamic";
export const revalidate = false;

"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackPage() {
  const search = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const session = search.get("session");

    if (!session) {
      console.error("Missing session token");
      return;
    }

    localStorage.setItem("auth_token", session);
    router.replace("/");
  }, [search]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-black">
      <div className="text-center">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
        <p className="opacity-70 mt-2">Please wait...</p>
      </div>
    </div>
  );
}
