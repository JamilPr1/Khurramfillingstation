import { NextResponse } from "next/server";
import { requireCustomer, unauthorized } from "@/lib/auth";
import { REWARDS } from "@/lib/config";
import { withStore } from "@/lib/store";

export async function GET() {
  try {
    const { customer } = await requireCustomer();
    const data = await withStore((s) => {
      const ledger = s.ledger
        .filter((l) => l.customerId === customer.id)
        .sort((a, b) => b.at.localeCompare(a.at));
      const pending = s.redeems.filter((r) => r.customerId === customer.id && r.status === "pending");
      const live = s.customers.find((c) => c.id === customer.id)!;
      return { customer: live, ledger, pending, rewards: REWARDS };
    });
    return NextResponse.json(data);
  } catch {
    return unauthorized();
  }
}
