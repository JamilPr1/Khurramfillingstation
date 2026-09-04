import { NextResponse } from "next/server";
import { requireCustomer, unauthorized } from "@/lib/auth";
import { newId, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { customer } = await requireCustomer();
    const body = (await req.json()) as { code?: string };
    const code = (body.code || "").replace(/\D/g, "");
    if (code.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code from the cashier." }, { status: 400 });
    }

    const result = await withStore((s) => {
      const live = s.customers.find((c) => c.id === customer.id);
      if (!live) throw new Error("UNAUTHORIZED");
      const fill = s.fills.find((f) => f.code === code);
      if (!fill) return { error: "This QR is not valid." };
      if (fill.usedAt) return { error: "This QR was already used." };
      if (new Date(fill.expiresAt).getTime() < Date.now()) {
        return { error: "This QR has expired. Ask staff to make a new one." };
      }
      fill.usedAt = nowIso();
      fill.usedBy = live.id;
      live.points += fill.points;
      s.ledger.unshift({
        id: newId("led"),
        customerId: live.id,
        type: "earn",
        points: fill.points,
        note: `Purchase · ${fill.litres} L`,
        at: nowIso(),
      });
      return {
        ok: true,
        points: fill.points,
        litres: fill.litres,
        amount: fill.amount,
        balance: live.points,
      };
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return unauthorized();
  }
}
