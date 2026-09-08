"use client";

import { useEffect, useState } from "react";
import { Loading, Note, ScreenHeader, Section } from "@/components/ui";
import { VirtualCard } from "@/components/app/VirtualCard";
import type { LedgerEntry, PublicCustomer, Reward } from "@/lib/types";

function stamp(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { timeZone: "Asia/Karachi" }).replace(/\//g, "-");
  const time = d.toLocaleTimeString("en-PK", {
    timeZone: "Asia/Karachi",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${date} | ${time}`;
}

function histTitle(row: LedgerEntry) {
  if (row.type === "earn") return "Purchase";
  if (row.type === "cashback") return "Monthly cashback";
  if (row.type === "bonus") return "Bonus";
  return "Redeem";
}

export default function PointsPage() {
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rate, setRate] = useState(0.2);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function load() {
    fetch("/api/customer/home")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.customer) {
          window.location.href = "/login";
          return;
        }
        setCustomer(d.customer);
        setLedger(d.ledger || []);
        setRewards(d.rewards || []);
        if (d.pkrPerPoint) setRate(d.pkrPerPoint);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }

  useEffect(() => {
    load();
  }, []);

  async function redeem(rewardId: string) {
    setErr("");
    setMsg("");
    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error);
      return;
    }
    setMsg("Ask the cashier to confirm this reward.");
    load();
  }

  if (!customer) return <Loading />;

  return (
    <>
      <ScreenHeader title="Points" subtitle="View your points balance and history." />
      <div className="kfs-app-body kfs-desk-split">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-[#5b6472]">Points details</p>
          <VirtualCard customer={customer} />

          <Section title="Redeem at cashier">
            {rewards.map((r) => (
              <div key={r.id} className="kfs-app-card mb-2 flex items-center justify-between gap-3 px-3.5 py-3">
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-[#5b6472]">
                    {r.kind === "discount" && r.discountPkr
                      ? `Rs ${r.discountPkr} off · ${r.points} pts`
                      : `${r.detail} · ${r.points} pts`}
                  </div>
                </div>
                <button
                  className="rounded-lg bg-[#f9d900] px-3 py-1.5 text-xs font-semibold text-[#152445] disabled:opacity-40"
                  disabled={customer.points < r.points}
                  onClick={() => redeem(r.id)}
                >
                  Redeem
                </button>
              </div>
            ))}
            {msg ? <Note>{msg}</Note> : null}
            {err ? <Note error>{err}</Note> : null}
          </Section>
        </div>

        <Section title="Points history">
          {ledger.length === 0 ? (
            <p className="text-sm text-[#5b6472]">No fills yet. Scan the cashier QR after you fill.</p>
          ) : (
            ledger.map((l) => (
              <div className="kfs-hist" key={l.id}>
                <div>
                  <p className="kfs-hist-title">{histTitle(l)}</p>
                  <p className="kfs-hist-when">{stamp(l.at)}</p>
                </div>
                <p className={`kfs-hist-pts ${l.points < 0 ? "is-out" : "is-in"}`}>
                  {l.points > 0 ? "+" : ""}
                  {l.points} Points
                </p>
              </div>
            ))
          )}
          <p className="kfs-note-box">
            <strong>Note</strong> · Points not redeemed are converted to rupees on the last day of
            every month ({rate} Rs per point) and added to this card.
          </p>
        </Section>
      </div>
    </>
  );
}
