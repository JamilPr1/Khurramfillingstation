"use client";

import { useEffect, useState } from "react";
import { formatWhen, Loading, Note, Row, ScreenHeader, Section } from "@/components/ui";
import { STATION } from "@/lib/config";
import type { Customer, LedgerEntry, Reward } from "@/lib/types";

export default function PointsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function load() {
    fetch("/api/customer/home")
      .then((r) => r.json())
      .then((d) => {
        setCustomer(d.customer);
        setLedger(d.ledger || []);
        setRewards(d.rewards || []);
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
      <ScreenHeader title="Loyalty card" subtitle={`${customer.points.toLocaleString()} points`} />
      <div className="kfs-app-body">
        <div className="kfs-app-balance">
          <div className="flex items-start justify-between text-xs text-white/75">
            <span>{STATION.short}</span>
            <span>Point balance</span>
          </div>
          <strong>{customer.points.toLocaleString()}</strong>
          <div className="mt-5 flex justify-between text-xs text-white/85">
            <span>
              {customer.name}
              <br />
              {customer.phone.replace(/(\d{4})\d{3}(\d{4})/, "$1 *** $2")}
            </span>
            <span className="text-right">
              Khurram Filling Station
              <br />
              Garden Town
            </span>
          </div>
        </div>

        <Section title="Redeem at cashier">
          {rewards.map((r) => (
            <div key={r.id} className="card mb-2 flex items-center justify-between gap-3 px-3.5 py-3">
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-[#667066]">
                  {r.detail} · {r.points} pts
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

        <Section title="History">
          {ledger.map((l) => (
            <Row
              key={l.id}
              title={l.note}
              sub={formatWhen(l.at)}
              right={l.points > 0 ? `+${l.points}` : String(l.points)}
            />
          ))}
        </Section>
      </div>
    </>
  );
}
