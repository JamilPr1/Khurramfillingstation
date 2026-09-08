"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Btn, Field, Note, PhoneShell } from "@/components/ui";
import { STATION } from "@/lib/config";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import type { Reward } from "@/lib/types";

type Role = "customer" | "staff" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [staffPin, setStaffPin] = useState("");
  const [email, setEmail] = useState(STATION.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    fetch("/api/rewards")
      .then((r) => r.json())
      .then((d) => setRewards(d.rewards || []))
      .catch(() => setRewards([]));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (role === "admin") {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setBusy(false);
      if (!res.ok) {
        setError(data.error || "Could not sign in");
        return;
      }
      router.replace("/admin");
      return;
    }
    if (role === "staff") {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: staffPin }),
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
      body: JSON.stringify({ phone, name, pin }),
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
            Install Khurram Filling Station on this device. Customers use a personal PIN. Staff use
            the station PIN. Admin sets rewards and discounts.
          </p>
          <InstallAppButton className="kfs-app-btn kfs-app-btn-primary" label="Download app" />
          <p id="ios-install">
            iPhone: Share → Add to Home Screen. Android or Chrome: tap Download app, or use Install
            in the browser menu.
          </p>
        </div>

        <div className="kfs-app-tabs is-three">
          <button type="button" className={role === "customer" ? "is-on" : ""} onClick={() => { setRole("customer"); setError(""); }}>
            Customer
          </button>
          <button type="button" className={role === "staff" ? "is-on" : ""} onClick={() => { setRole("staff"); setError(""); }}>
            Staff
          </button>
          <button type="button" className={role === "admin" ? "is-on" : ""} onClick={() => { setRole("admin"); setError(""); }}>
            Admin
          </button>
        </div>

        <form onSubmit={onSubmit}>
          {role === "customer" ? (
            <>
              <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              <Field
                label="Mobile number"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <Field
                label="PIN (4 to 6 digits)"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                autoComplete="off"
              />
              <p className="mb-3 text-xs text-[#5b6472]">
                New customers: pick a PIN and remember it. Returning customers: enter the same PIN.
              </p>
            </>
          ) : null}
          {role === "staff" ? (
            <Field
              label="Staff PIN"
              type="password"
              inputMode="numeric"
              value={staffPin}
              onChange={(e) => setStaffPin(e.target.value)}
              autoComplete="off"
            />
          ) : null}
          {role === "admin" ? (
            <>
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </>
          ) : null}
          {error ? <Note error>{error}</Note> : null}
          <Btn type="submit" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </Btn>
        </form>

        {rewards.length ? (
          <div className="kfs-app-card mt-4 px-4 py-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#5b6472]">Rewards</p>
            <p className="mt-1 text-sm text-[#152445]">
              {rewards.map((r) => `${r.name} ${r.points}`).join(" · ")}
            </p>
          </div>
        ) : null}

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
