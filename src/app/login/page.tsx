"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Btn, Field, Note, PhoneShell } from "@/components/ui";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { DEMO, REWARDS, STATION } from "@/lib/config";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "staff">("customer");
  const [phone, setPhone] = useState(DEMO.samplePhone);
  const [name, setName] = useState(DEMO.sampleName);
  const [otp, setOtp] = useState(DEMO.otp);
  const [pin, setPin] = useState(DEMO.staffPin);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (role === "staff") {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      setBusy(false);
      if (!res.ok) {
        setError(data.error || "Could not sign in");
        return;
      }
      router.replace("/staff");
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name, otp }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in");
      return;
    }
    router.replace("/customer");
  }

  return (
    <PhoneShell variant="login">
      <header className="kfs-app-head">
        <div className="kfs-app-head-row">
          <img src="/assets/logos/logo-horizontal.png" alt={STATION.name} className="kfs-app-logo" />
          <div>
            <small>Loyalty program</small>
            <h1>Sign in</h1>
          </div>
        </div>
        <p>{STATION.address} · {STATION.hours}</p>
      </header>
      <div className="kfs-app-body">
        <div className="kfs-app-install" id="install">
          <h2>Download the app</h2>
          <p>
            Install Khurram Filling Station on this phone or computer. Same navy, yellow and green
            as the website. Customers use OTP. Staff use a PIN. No Play Store or App Store.
          </p>
          <InstallAppButton className="kfs-app-btn kfs-app-btn-primary" label="Download app" />
          <p id="ios-install">
            iPhone: Share → Add to Home Screen. Android or Chrome: tap Download app, or use Install
            in the browser menu.
          </p>
        </div>

        <div className="kfs-app-tabs">
          <button type="button" className={role === "customer" ? "is-on" : ""} onClick={() => setRole("customer")}>
            Customer
          </button>
          <button type="button" className={role === "staff" ? "is-on" : ""} onClick={() => setRole("staff")}>
            Staff
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {role === "customer" ? (
            <>
              <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Field
                label="Mobile number"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Field
                label="OTP"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="mb-3 text-xs text-[#5b6472]">Demo OTP: 1234</p>
            </>
          ) : (
            <>
              <Field
                label="Staff PIN"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <p className="mb-3 text-xs text-[#5b6472]">Demo PIN: 1234</p>
            </>
          )}
          {error ? <Note error>{error}</Note> : null}
          <Btn type="submit" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </Btn>
        </form>

        <div className="kfs-app-card mt-4 px-4 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6472]">1 point per litre</p>
          <p className="mt-1 text-sm text-[#152445]">
            {REWARDS.map((r) => `${r.name} ${r.points}`).join(" · ")}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={`tel:${STATION.phoneTel}`} className="kfs-app-btn kfs-app-btn-navy">
            Call
          </a>
          <a href={`https://wa.me/${STATION.whatsapp}`} className="kfs-app-btn kfs-app-btn-ghost" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>

        <Link href="/" className="mt-5 block text-center text-sm font-semibold text-[#152445]">
          Back to website
        </Link>
      </div>
    </PhoneShell>
  );
}
