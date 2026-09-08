import { NextResponse } from "next/server";
import { COOKIE_STAFF } from "@/lib/auth";
import { clientKey, tooMany } from "@/lib/rateLimit";
import { cookieOpts, verifySecret } from "@/lib/secret";
import { newToken, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  if (tooMany(clientKey(req, "staff-login"))) {
    return NextResponse.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });
  }
  const body = (await req.json()) as { pin?: string };
  const pin = (body.pin || "").trim();
  if (!pin) {
    return NextResponse.json({ error: "Enter the staff PIN." }, { status: 400 });
  }

  const token = newToken();
  const result = await withStore((s) => {
    if (!s.settings.staffPinHash) {
      return { error: "Staff PIN is not set. Sign in as admin and set it in Settings." };
    }
    if (!verifySecret(pin, s.settings.staffPinHash)) {
      return { error: "Wrong PIN." };
    }
    s.sessions.push({ token, role: "staff", createdAt: nowIso() });
    return { ok: true as const };
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_STAFF, token, cookieOpts());
  return res;
}
