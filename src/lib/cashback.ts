import { randomBytes } from "node:crypto";
import type { StoreData } from "./types";

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function pkToday() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { y: get("year"), m: get("month"), d: get("day") };
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function monthKey(y: number, m: number) {
  return `${y}-${pad(m)}`;
}

function prevMonth(y: number, m: number) {
  return m === 1 ? { y: y - 1, m: 12 } : { y, m: m - 1 };
}

function monthEndIso(y: number, m: number) {
  const last = daysInMonth(y, m);
  return new Date(`${y}-${pad(m)}-${pad(last)}T23:59:59+05:00`).toISOString();
}

/** Unused points become rupees on the last day of each month (Pakistan time). */
export function applyMonthlyCashback(data: StoreData) {
  const { y, m, d } = pkToday();
  const last = daysInMonth(y, m);
  const close = d >= last ? { y, m } : prevMonth(y, m);
  const closeKey = monthKey(close.y, close.m);
  if (data.settings.lastCashbackMonth === closeKey) return;

  const cutoff = monthEndIso(close.y, close.m);
  const rate = Number(data.settings.pkrPerPoint) > 0 ? Number(data.settings.pkrPerPoint) : 0.2;

  for (const c of data.customers) {
    const after = data.ledger
      .filter((l) => l.customerId === c.id && l.at > cutoff)
      .reduce((n, l) => n + l.points, 0);
    const monthEndPts = Math.max(0, Math.min(c.points, Math.round(c.points - after)));
    if (monthEndPts < 1) continue;
    const pkr = Math.round(monthEndPts * rate * 100) / 100;
    if (pkr <= 0) continue;
    for (const row of data.redeems) {
      if (row.customerId === c.id && row.status === "pending") {
        row.status = "cancelled";
        row.doneAt = nowIso();
      }
    }
    c.points -= monthEndPts;
    c.walletPkr = Math.round(((c.walletPkr || 0) + pkr) * 100) / 100;
    data.ledger.unshift({
      id: newId("led"),
      customerId: c.id,
      type: "cashback",
      points: -monthEndPts,
      pkr,
      note: `Monthly cashback · Rs ${pkr.toLocaleString("en-PK")}`,
      at: nowIso(),
    });
  }

  data.settings.lastCashbackMonth = closeKey;
}

export function issueCardNumber(id: string) {
  let n = 2015;
  for (let i = 0; i < id.length; i += 1) n = (n * 33 + id.charCodeAt(i)) >>> 0;
  const rest = String(n).padStart(12, "0").slice(-12);
  return `2015${rest}`.slice(0, 16);
}

export function maskCard(num: string) {
  const d = (num || "").replace(/\D/g, "").padEnd(16, "0").slice(0, 16);
  return `${d.slice(0, 4)} **** **** ${d.slice(-4)}`;
}
