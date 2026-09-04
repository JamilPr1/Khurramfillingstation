import { NextResponse } from "next/server";
import { requireCustomer, unauthorized } from "@/lib/auth";
import { REWARDS } from "@/lib/config";
import { newId, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { customer } = await requireCustomer();
    const body = (await req.json()) as { rewardId?: string };
    const reward = REWARDS.find((r) => r.id === body.rewardId);
    if (!reward) return NextResponse.json({ error: "Unknown reward." }, { status: 400 });

    const result = await withStore((s) => {
      const live = s.customers.find((c) => c.id === customer.id);
      if (!live) throw new Error("UNAUTHORIZED");
      if (live.points < reward.points) {
        return { error: `Need ${reward.points} points. You have ${live.points}.` };
      }
      const already = s.redeems.find(
        (r) => r.customerId === live.id && r.rewardId === reward.id && r.status === "pending",
      );
      if (already) return { error: "This reward is already waiting at the cashier." };
      const row = {
        id: newId("rdm"),
        customerId: live.id,
        customerName: live.name,
        customerPhone: live.phone,
        rewardId: reward.id,
        rewardName: reward.name,
        points: reward.points,
        status: "pending" as const,
        createdAt: nowIso(),
        doneAt: null,
      };
      s.redeems.unshift(row);
      return { ok: true, redeem: row, balance: live.points };
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return unauthorized();
  }
}
