"use client";

import { useEffect, useState } from "react";
import { Btn, Empty, formatWhen, Note, ScreenHeader } from "@/components/ui";
import type { RedeemRequest } from "@/lib/types";

export default function StaffRedeemPage() {
  const [rows, setRows] = useState<RedeemRequest[]>([]);
  const [msg, setMsg] = useState("");

  function load() {
    fetch("/api/staff/dashboard")
      .then((r) => r.json())
      .then((d) => setRows(d.pendingRedeems || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function act(id: string, action: "done" | "cancelled") {
    setMsg("");
    const res = await fetch(`/api/redeem/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error);
      return;
    }
    setMsg(action === "done" ? "Confirmed. Give the reward." : "Cancelled.");
    load();
  }

  return (
    <>
      <ScreenHeader title="Redeem" subtitle="Confirm when the customer is at the desk" />
      <div className="kfs-app-body">
        {msg ? <Note>{msg}</Note> : null}
        {rows.length === 0 ? (
          <Empty>Nothing waiting.</Empty>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="card mb-3 px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{r.rewardName}</p>
                  <p className="text-xs text-[#667066]">
                    {r.customerName} · {r.customerPhone}
                  </p>
                  <p className="mt-1 text-xs text-[#667066]">{formatWhen(r.createdAt)}</p>
                </div>
                <p className="text-sm font-semibold text-[#152445]">{r.points} pts</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Btn onClick={() => act(r.id, "done")}>Confirm</Btn>
                <Btn tone="ghost" onClick={() => act(r.id, "cancelled")}>
                  Cancel
                </Btn>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
