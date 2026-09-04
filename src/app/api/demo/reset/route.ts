import { NextResponse } from "next/server";
import { seed, withStore } from "@/lib/store";

export async function POST() {
  await withStore((s) => {
    const fresh = seed();
    s.customers = fresh.customers;
    s.sessions = [];
    s.fills = fresh.fills;
    s.ledger = fresh.ledger;
    s.redeems = [];
    s.feedback = [];
  });
  return NextResponse.json({ ok: true });
}
