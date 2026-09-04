import { NextResponse } from "next/server";
import { requireCustomer, unauthorized } from "@/lib/auth";
import { FEEDBACK_TOPICS } from "@/lib/config";
import { newId, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { customer } = await requireCustomer();
    const body = (await req.json()) as { stars?: number; topic?: string; comment?: string };
    const stars = Number(body.stars);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Pick 1 to 5 stars." }, { status: 400 });
    }
    const topic = FEEDBACK_TOPICS.includes(body.topic || "") ? body.topic! : "Other";
    const row = await withStore((s) => {
      const live = s.customers.find((c) => c.id === customer.id)!;
      const fb = {
        id: newId("fb"),
        customerId: live.id,
        customerName: live.name,
        stars,
        topic,
        comment: (body.comment || "").trim(),
        at: nowIso(),
      };
      s.feedback.unshift(fb);
      return fb;
    });
    return NextResponse.json({ ok: true, feedback: row });
  } catch {
    return unauthorized();
  }
}
