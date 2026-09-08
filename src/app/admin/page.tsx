"use client";

import { FormEvent, useEffect, useState } from "react";
import { Btn, Field, Note, ScreenHeader } from "@/components/ui";
import type { Reward } from "@/lib/types";

type Row = Reward;

function blank(): Row {
  return {
    id: "",
    name: "",
    points: 200,
    detail: "",
    kind: "item",
    discountPkr: 0,
  };
}

export default function AdminRewardsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [rate, setRate] = useState(1);

  function load() {
    fetch("/api/admin/data")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.settings?.rewards || []);
        setRate(d.settings?.pointsPerLitre || 1);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function update(i: number, patch: Partial<Row>) {
    setRows((list) => list.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setMsg("");
    const res = await fetch("/api/admin/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewards: rows }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setErr(data.error || "Could not save");
      return;
    }
    setRows(data.settings.rewards);
    setMsg("Rewards saved. Customers see these on the next sign-in.");
  }

  return (
    <>
      <ScreenHeader title="Rewards & discounts" subtitle={`${rate} point per litre`} />
      <form onSubmit={save} className="kfs-app-body">
        {msg ? <Note>{msg}</Note> : null}
        {err ? <Note error>{err}</Note> : null}
        {rows.map((row, i) => (
          <div key={row.id || `new-${i}`} className="kfs-app-card mb-3 px-3.5 py-3">
            <Field label="Name" value={row.name} onChange={(e) => update(i, { name: e.target.value })} />
            <Field
              label="Points needed"
              inputMode="numeric"
              value={String(row.points)}
              onChange={(e) => update(i, { points: Number(e.target.value) || 0 })}
            />
            <label className="mb-3 block text-[13px] font-medium text-[#152445]">
              Type
              <select
                className="kfs-app-input"
                value={row.kind}
                onChange={(e) =>
                  update(i, { kind: e.target.value === "discount" ? "discount" : "item" })
                }
              >
                <option value="item">Item (snack, wash)</option>
                <option value="discount">Fuel discount (Rs off)</option>
              </select>
            </label>
            {row.kind === "discount" ? (
              <Field
                label="Discount (Rs)"
                inputMode="numeric"
                value={String(row.discountPkr || "")}
                onChange={(e) => update(i, { discountPkr: Number(e.target.value) || 0 })}
              />
            ) : null}
            <Field
              label="Detail"
              value={row.detail}
              onChange={(e) => update(i, { detail: e.target.value })}
            />
            {rows.length > 1 ? (
              <Btn
                tone="ghost"
                onClick={() => setRows((list) => list.filter((_, idx) => idx !== i))}
              >
                Remove
              </Btn>
            ) : null}
          </div>
        ))}
        <Btn tone="ghost" onClick={() => setRows((list) => [...list, blank()])}>
          Add reward
        </Btn>
        <div className="mt-3">
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save rewards"}
          </Btn>
        </div>
      </form>
    </>
  );
}
