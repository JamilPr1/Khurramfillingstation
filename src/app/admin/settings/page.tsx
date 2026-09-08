"use client";

import { FormEvent, useEffect, useState } from "react";
import { Btn, Field, Note, ScreenHeader } from "@/components/ui";
import { STATION } from "@/lib/config";

export default function AdminSettingsPage() {
  const [pointsPerLitre, setPointsPerLitre] = useState("1");
  const [qrMinutes, setQrMinutes] = useState("3");
  const [pkrPerPoint, setPkrPerPoint] = useState("0.2");
  const [staffPin, setStaffPin] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [staffSet, setStaffSet] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        setPointsPerLitre(String(d.settings?.pointsPerLitre ?? 1));
        setQrMinutes(String(d.settings?.qrMinutes ?? 3));
        setPkrPerPoint(String(d.settings?.pkrPerPoint ?? 0.2));
        setStaffSet(Boolean(d.settings?.staffPinSet));
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pointsPerLitre: Number(pointsPerLitre),
        qrMinutes: Number(qrMinutes),
        pkrPerPoint: Number(pkrPerPoint),
        staffPin: staffPin || undefined,
        currentPassword: currentPassword || undefined,
        adminPassword: adminPassword || undefined,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not save");
      return;
    }
    setStaffPin("");
    setCurrentPassword("");
    setAdminPassword("");
    setStaffSet(Boolean(data.settings?.staffPinSet));
    setMsg("Settings saved.");
  }

  return (
    <>
      <ScreenHeader title="Settings" subtitle={STATION.email} />
      <form onSubmit={save} className="kfs-app-body">
        {msg ? <Note>{msg}</Note> : null}
        {err ? <Note error>{err}</Note> : null}
        <Field
          label="Points per litre"
          inputMode="decimal"
          value={pointsPerLitre}
          onChange={(e) => setPointsPerLitre(e.target.value)}
        />
        <Field
          label="QR valid for (minutes)"
          inputMode="numeric"
          value={qrMinutes}
          onChange={(e) => setQrMinutes(e.target.value)}
        />
        <Field
          label="Rupees per point (month-end cashback)"
          inputMode="decimal"
          value={pkrPerPoint}
          onChange={(e) => setPkrPerPoint(e.target.value)}
        />
        <p className="mb-3 text-xs text-[#5b6472]">
          Unused points convert to rupees on the last day of each month and sit on the customer
          card. 0.2 means 1000 points become Rs 200.
        </p>
        <Field
          label={staffSet ? "New staff PIN (leave blank to keep)" : "Set staff PIN (4 to 6 digits)"}
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={staffPin}
          onChange={(e) => setStaffPin(e.target.value)}
          autoComplete="off"
        />
        <p className="mb-3 text-xs text-[#5b6472]">
          {staffSet
            ? "Staff already have a PIN. Enter a new one only if you want to change it."
            : "Set this before cashiers can sign in."}
        </p>
        <Field
          label="Current admin password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Field
          label="New admin password (optional)"
          type="password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          autoComplete="new-password"
        />
        <Btn type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </Btn>
      </form>
    </>
  );
}
