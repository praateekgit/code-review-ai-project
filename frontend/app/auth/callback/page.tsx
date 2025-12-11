"use client";

import { Suspense } from "react";
import CallbackHandler from "./callback-handler";

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading…</div>}>
      <CallbackHandler />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
