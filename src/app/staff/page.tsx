"use client";

import { FormEvent, useEffect, useState } from "react";
import { Btn, Empty, Field, formatWhen, Note, Row, ScreenHeader, Section } from "@/components/ui";
import type { Fill } from "@/lib/types";

type Dash = {
  recentFills: Fill[];
  stats: { fillsToday: number; usedToday: number; pointsToday: number };
};

export default function StaffFillPage() {
  const [litres, setLitres] = useState("28");
  const [amount, setAmount] = useState("7280");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [qr, setQr] = useState<{
    code: string;
    points: number;
    litres: number;
    amount: number;
    img: string;
    expiresAt: string;
  } | null>(null);
  const [dash, setDash] = useState<Dash | null>(null);

  function load() {
    fetch("/api/staff/dashboard")
      .then((r) => r.json())
      .then(setDash);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/fills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ litres: Number(litres), amount: Number(amount) }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not make QR");
      return;
    }
    setQr({
      code: data.fill.code,
      points: data.fill.points,
      litres: data.fill.litres,
      amount: data.fill.amount,
      img: data.qrDataUrl,
      expiresAt: data.fill.expiresAt,
    });
    load();
  }

  if (qr) {
    return (
      <>
        <ScreenHeader
          title="Show to customer"
          subtitle={`${qr.litres} L · Rs ${qr.amount.toLocaleString()} · +${qr.points} pts`}
        />
        <div className="kfs-app-body">
          <div className="card mb-4 px-4 py-5 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr.img} alt="Fill QR" className="mx-auto w-52" />
            <p className="mt-3 text-3xl font-semibold tracking-[0.25em] text-[#152445]">{qr.code}</p>
            <p className="mt-2 text-xs text-[#667066]">Expires {formatWhen(qr.expiresAt)}</p>
          </div>
          <Btn onClick={() => setQr(null)}>New fill</Btn>
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader
        title="New fill"
        subtitle={`Today ${dash?.stats.usedToday ?? 0} scans · ${dash?.stats.pointsToday ?? 0} pts`}
      />
      <form onSubmit={onSubmit} className="kfs-app-body">
        <Field label="Litres" inputMode="decimal" value={litres} onChange={(e) => setLitres(e.target.value)} />
        <Field label="Amount (Rs)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <p className="mb-3 text-xs text-[#667066]">1 point per litre</p>
        {error ? <Note error>{error}</Note> : null}
        <Btn type="submit" disabled={busy}>
          {busy ? "Making QR…" : "Make QR"}
        </Btn>

        <div className="mt-5">
          <Section title="Recent QRs">
            {(dash?.recentFills || []).length === 0 ? (
              <Empty>No fills yet.</Empty>
            ) : (
              (dash?.recentFills || []).slice(0, 6).map((f) => (
                <Row
                  key={f.id}
                  title={`${f.litres} L · ${f.code}`}
                  sub={f.usedAt ? "Used" : "Waiting / expired"}
                  right={`+${f.points}`}
                />
              ))
            )}
          </Section>
        </div>
      </form>
    </>
  );
}
