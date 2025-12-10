"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

  useEffect(() => {
    if (!code) return;

    fetch(`${API_BASE}/review/auth/github/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Login success:", data);
        alert("GitHub Login Successful!");
      })
      .catch(() => alert("Login failed"));
  }, [code]);

  return (
    <div className="text-white p-10">
      Processing GitHub login...
    </div>
  );
}
