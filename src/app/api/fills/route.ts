import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireStaff, unauthorized } from "@/lib/auth";
import { pointsForLitres } from "@/lib/config";
import { newId, nowIso, withStore } from "@/lib/store";

function six() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    await requireStaff();
    const body = (await req.json()) as { litres?: number; amount?: number };
    const litres = Number(body.litres);
    const amount = Number(body.amount);
    if (!Number.isFinite(litres) || litres <= 0) {
      return NextResponse.json({ error: "Enter litres." }, { status: 400 });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Enter amount." }, { status: 400 });
    }

    const fill = await withStore((s) => {
      const created = {
        id: newId("fill"),
        code: six(),
        litres,
        amount,
        points: pointsForLitres(litres, s.settings.pointsPerLitre),
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + s.settings.qrMinutes * 60 * 1000).toISOString(),
        usedAt: null,
        usedBy: null,
      };
      s.fills.unshift(created);
      return created;
    });

    const qrDataUrl = await QRCode.toDataURL(fill.code, {
      width: 360,
      margin: 1,
      color: { dark: "#152445", light: "#ffffff" },
    });

    return NextResponse.json({ fill, qrDataUrl });
  } catch {
    return unauthorized();
  }
}
