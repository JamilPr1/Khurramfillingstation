"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Btn, Field, Note, ScreenHeader } from "@/components/ui";

export default function ScanPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [camError, setCamError] = useState("");
  const running = useRef(false);
  const claimed = useRef(false);

  async function claim(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 6 || busy || claimed.current) return;
    claimed.current = true;
    setBusy(true);
    setError("");
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: digits }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      claimed.current = false;
      setError(data.error || "Could not add points");
      return;
    }
    router.replace(`/customer/thanks?pts=${data.points}&bal=${data.balance}&l=${data.litres}`);
  }

  useEffect(() => {
    let scanner: { stop: () => Promise<void> } | null = null;
    let gone = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (gone || running.current) return;
        const inst = new Html5Qrcode("kfs-reader");
        scanner = inst;
        running.current = true;
        await inst.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 220, height: 220 } },
          (text) => {
            const digits = text.replace(/\D/g, "").slice(-6);
            if (digits.length === 6) claim(digits);
          },
          () => undefined,
        );
      } catch {
        setCamError("Camera not available. Type the 6-digit code instead.");
      }
    })();
    return () => {
      gone = true;
      if (scanner) scanner.stop().catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScreenHeader title="Scan QR" subtitle="Scan the cashier code after you fill" />
      <div className="kfs-app-body">
        <div id="kfs-reader" className="mx-auto mb-3 w-full max-w-[260px] overflow-hidden rounded-xl bg-[#1c1f1c]" />
        {camError ? <p className="mb-3 text-xs text-[#667066]">{camError}</p> : null}
        <Field
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
        />
        {error ? <Note error>{error}</Note> : null}
        <Btn disabled={busy || code.replace(/\D/g, "").length !== 6} onClick={() => claim(code)}>
          {busy ? "Adding points…" : "Add points"}
        </Btn>
      </div>
    </>
  );
}
