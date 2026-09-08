"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Btn, Field, Note, ScreenHeader } from "@/components/ui";

type Scanner = {
  start: (...args: never[]) => Promise<void>;
  stop: () => Promise<void>;
  clear: () => void;
  getState: () => number;
};

const SCANNING = 2;
const PAUSED = 3;

async function stopScanner(inst: Scanner | null) {
  if (!inst) return;
  try {
    const state = inst.getState();
    if (state === SCANNING || state === PAUSED) {
      await inst.stop();
    }
  } catch {
    /* html5-qrcode throws if start() has not finished */
  }
  try {
    inst.clear();
  } catch {
    /* element already gone */
  }
}

export default function ScanPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [camError, setCamError] = useState("");
  const claimed = useRef(false);
  const scannerRef = useRef<Scanner | null>(null);

  async function claim(value: string) {
    const digits = value.replace(/\D/g, "").slice(-6);
    if (digits.length !== 6 || busy || claimed.current) return;
    claimed.current = true;
    setBusy(true);
    setError("");
    await stopScanner(scannerRef.current);
    scannerRef.current = null;
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: digits }),
    });
    const data = await res.json();
    if (!res.ok) {
      claimed.current = false;
      setBusy(false);
      setError(data.error || "Could not add points");
      return;
    }
    router.replace(`/customer/thanks?pts=${data.points}&bal=${data.balance}&l=${data.litres}`);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const inst = new Html5Qrcode("kfs-reader") as unknown as Scanner;
        scannerRef.current = inst;
        await inst.start(
          { facingMode: "environment" } as never,
          { fps: 8, qrbox: { width: 220, height: 220 } } as never,
          ((text: string) => {
            const digits = String(text).replace(/\D/g, "").slice(-6);
            if (digits.length === 6) void claim(digits);
          }) as never,
          (() => undefined) as never,
        );
        if (cancelled) {
          await stopScanner(inst);
          scannerRef.current = null;
        }
      } catch {
        if (!cancelled) setCamError("Camera not available. Type the 6-digit code instead.");
      }
    })();
    return () => {
      cancelled = true;
      const inst = scannerRef.current;
      scannerRef.current = null;
      void stopScanner(inst);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScreenHeader title="Scan QR" subtitle="Open this screen, then scan the cashier QR" />
      <div className="kfs-app-body kfs-desk-narrow">
        <p className="mb-3 text-xs text-[#5b6472]">
          Do not scan with the phone camera app. Stay in this loyalty screen.
        </p>
        <div id="kfs-reader" className="mx-auto mb-3 w-full max-w-[260px] overflow-hidden rounded-xl bg-[#1c1f1c]" />
        {camError ? <p className="mb-3 text-xs text-[#667066]">{camError}</p> : null}
        <Field
          label="Or type the 6-digit code"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
        />
        {error ? <Note error>{error}</Note> : null}
        <Btn disabled={busy || code.length !== 6} onClick={() => void claim(code)}>
          {busy ? "Adding points…" : "Add points"}
        </Btn>
      </div>
    </>
  );
}
