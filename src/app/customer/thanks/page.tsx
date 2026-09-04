"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Btn, Loading, ScreenHeader } from "@/components/ui";

function ThanksInner() {
  const q = useSearchParams();
  const pts = q.get("pts") || "0";
  const bal = q.get("bal") || "0";
  const litres = q.get("l") || "";

  return (
    <>
      <ScreenHeader
        title="Points added"
        subtitle={litres ? `${litres} L filled` : "Scan complete"}
      />
      <div className="kfs-app-body">
        <div className="kfs-app-balance text-center">
          <p className="text-xs font-medium text-[#c9d2e0]">This fill</p>
          <strong>+{pts}</strong>
          <p className="mt-1 text-sm text-[#c9d2e0]">Balance {Number(bal).toLocaleString()} points</p>
        </div>
        <p className="mb-3 text-center text-sm text-[#5b6472]">How was today’s visit?</p>
        <Link href="/customer/feedback">
          <Btn>Leave feedback</Btn>
        </Link>
        <Link href="/customer" className="mt-3 block text-center text-sm text-[#667066]">
          Skip for now
        </Link>
      </div>
    </>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ThanksInner />
    </Suspense>
  );
}
