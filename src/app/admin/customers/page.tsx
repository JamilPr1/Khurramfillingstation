"use client";

import { FormEvent, useEffect, useState } from "react";
import { Btn, Empty, Field, Note, ScreenHeader } from "@/components/ui";
import type { PublicCustomer } from "@/lib/types";

export default function AdminCustomersPage() {
  const [rows, setRows] = useState<PublicCustomer[]>([]);
  const [q, setQ] = useState("");
  const [delta, setDelta] = useState("50");
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string>("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function load() {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => setRows(d.customers || []));
  }

  useEffect(() => {
    load();
  }, []);

  const shown = rows.filter((c) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return c.name.toLowerCase().includes(s) || c.phone.includes(s);
  });

  async function adjust(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!picked) {
      setErr("Tap a customer first.");
      return;
    }
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: picked, delta: Number(delta), note }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "Could not update");
      return;
    }
    setMsg(`Updated to ${data.customer.points} points.`);
    setNote("");
    load();
  }

  return (
    <>
      <ScreenHeader title="Loyalty cards" subtitle={`${rows.length} customers`} />
      <div className="kfs-app-body kfs-desk-split is-list">
        <div>
          <Field label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or mobile" />
          {msg ? <Note>{msg}</Note> : null}
          {err ? <Note error>{err}</Note> : null}
          {shown.length === 0 ? (
            <Empty>No customers yet.</Empty>
          ) : (
            shown.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`kfs-app-card mb-2 flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left ${picked === c.id ? "ring-2 ring-[#152445]" : ""}`}
                onClick={() => setPicked(c.id)}
              >
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-[#5b6472]">{c.phone}</div>
                </div>
                <div className="text-sm font-semibold text-right">
                  {c.points} pts
                  <div className="text-xs font-medium text-[#5b6472]">
                    Rs {c.walletPkr.toLocaleString("en-PK")}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        <form onSubmit={adjust}>
          <Field
            label="Add or remove points (use minus to deduct)"
            inputMode="numeric"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
          />
          <Field label="Note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Bonus, correction…" />
          <Btn type="submit">Update points</Btn>
        </form>
      </div>
    </>
  );
}
