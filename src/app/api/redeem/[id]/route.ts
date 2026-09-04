import { NextResponse } from "next/server";
import { requireStaff, unauthorized } from "@/lib/auth";
import { newId, nowIso, withStore } from "@/lib/store";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireStaff();
    const { id } = await ctx.params;
    const body = (await req.json()) as { action?: "done" | "cancelled" };
    const action = body.action === "cancelled" ? "cancelled" : "done";

    const result = await withStore((s) => {
      const row = s.redeems.find((r) => r.id === id);
      if (!row) return { error: "Request not found." };
      if (row.status !== "pending") return { error: "Already handled." };
      if (action === "done") {
        const c = s.customers.find((x) => x.id === row.customerId);
        if (!c) return { error: "Customer missing." };
        if (c.points < row.points) return { error: "Not enough points now." };
        c.points -= row.points;
        s.ledger.unshift({
          id: newId("led"),
          customerId: c.id,
          type: "redeem",
          points: -row.points,
          note: `Redeem · ${row.rewardName}`,
          at: nowIso(),
        });
      }
      row.status = action;
      row.doneAt = nowIso();
      return { ok: true };
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return unauthorized();
  }
}
