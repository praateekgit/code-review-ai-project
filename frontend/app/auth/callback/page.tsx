"use client";

import { Suspense } from "react";
import CallbackHandler from "./callback-handler";

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-2xl font-bold">⏳ Logging you in…</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
