import { NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/auth";
import { newId, nowIso, publicCustomer, publicSettings, withStore } from "@/lib/store";
import { hashSecret, verifySecret } from "@/lib/secret";
import type { Reward } from "@/lib/types";

export async function GET() {
  try {
    await requireAdmin();
    const data = await withStore((s) => ({
      settings: publicSettings(s.settings),
      customers: s.customers
        .map(publicCustomer)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      stats: {
        customers: s.customers.length,
        pendingRedeems: s.redeems.filter((r) => r.status === "pending").length,
        fillsToday: s.fills.filter((f) => f.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
      },
    }));
    return NextResponse.json(data);
  } catch {
    return unauthorized();
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { rewards?: Reward[] };
    if (!Array.isArray(body.rewards) || body.rewards.length === 0) {
      return NextResponse.json({ error: "Add at least one reward." }, { status: 400 });
    }
    const rewards: Reward[] = [];
    for (const row of body.rewards) {
      const name = (row.name || "").trim();
      const points = Number(row.points);
      if (!name) return NextResponse.json({ error: "Each reward needs a name." }, { status: 400 });
      if (!Number.isFinite(points) || points < 1) {
        return NextResponse.json({ error: "Each reward needs points of 1 or more." }, { status: 400 });
      }
      const kind = row.kind === "discount" ? "discount" : "item";
      const discountPkr = kind === "discount" ? Math.max(0, Number(row.discountPkr) || 0) : 0;
      if (kind === "discount" && discountPkr < 1) {
        return NextResponse.json({ error: "Discount rewards need an amount in rupees." }, { status: 400 });
      }
      rewards.push({
        id: (row.id || "").trim() || newId("rwd"),
        name,
        points: Math.round(points),
        detail: (row.detail || "").trim() || (kind === "discount" ? `Rs ${discountPkr} off the next fill` : name),
        kind,
        discountPkr,
      });
    }
    const saved = await withStore((s) => {
      s.settings.rewards = rewards;
      return publicSettings(s.settings);
    });
    return NextResponse.json({ ok: true, settings: saved });
  } catch {
    return unauthorized();
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as {
      pointsPerLitre?: number;
      qrMinutes?: number;
      staffPin?: string;
      adminPassword?: string;
      currentPassword?: string;
      pkrPerPoint?: number;
    };
    const result = await withStore((s) => {
      if (body.pointsPerLitre !== undefined) {
        const n = Number(body.pointsPerLitre);
        if (!Number.isFinite(n) || n <= 0 || n > 20) {
          return { error: "Points per litre must be between 0.1 and 20." };
        }
        s.settings.pointsPerLitre = n;
      }
      if (body.qrMinutes !== undefined) {
        const n = Number(body.qrMinutes);
        if (!Number.isFinite(n) || n < 1 || n > 30) {
          return { error: "QR minutes must be between 1 and 30." };
        }
        s.settings.qrMinutes = Math.round(n);
      }
      if (body.pkrPerPoint !== undefined) {
        const n = Number(body.pkrPerPoint);
        if (!Number.isFinite(n) || n <= 0 || n > 50) {
          return { error: "Rupees per point must be between 0.01 and 50." };
        }
        s.settings.pkrPerPoint = n;
      }
      const staffPin = (body.staffPin || "").trim();
      if (staffPin) {
        if (!/^\d{4,6}$/.test(staffPin)) {
          return { error: "Staff PIN must be 4 to 6 digits." };
        }
        s.settings.staffPinHash = hashSecret(staffPin);
      }
      const nextPw = (body.adminPassword || "").trim();
      if (nextPw) {
        if (nextPw.length < 8) return { error: "New admin password must be at least 8 characters." };
        if (s.settings.adminPasswordHash) {
          const current = (body.currentPassword || "").trim();
          if (!verifySecret(current, s.settings.adminPasswordHash)) {
            return { error: "Current admin password is wrong." };
          }
        }
        s.settings.adminPasswordHash = hashSecret(nextPw);
      }
      return { settings: publicSettings(s.settings) };
    });
    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return unauthorized();
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = (await req.json()) as { customerId?: string; delta?: number; note?: string };
    const delta = Number(body.delta);
    if (!body.customerId || !Number.isFinite(delta) || delta === 0) {
      return NextResponse.json({ error: "Enter points to add or remove." }, { status: 400 });
    }
    const note = (body.note || "").trim() || (delta > 0 ? "Admin bonus" : "Admin adjustment");
    const result = await withStore((s) => {
      const c = s.customers.find((x) => x.id === body.customerId);
      if (!c) return { error: "Customer not found." };
      c.points = Math.max(0, c.points + Math.round(delta));
      s.ledger.unshift({
        id: newId("led"),
        customerId: c.id,
        type: delta > 0 ? "bonus" : "redeem",
        points: Math.round(delta),
        note,
        at: nowIso(),
      });
      return { customer: publicCustomer(c) };
    });
    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return unauthorized();
  }
}
