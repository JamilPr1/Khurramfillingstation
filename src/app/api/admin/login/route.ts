import { NextResponse } from "next/server";
import { COOKIE_ADMIN } from "@/lib/auth";
import { ADMIN_EMAIL } from "@/lib/config";
import { clientKey, tooMany } from "@/lib/rateLimit";
import { cookieOpts, hashSecret, verifySecret } from "@/lib/secret";
import { newToken, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  if (tooMany(clientKey(req, "admin-login"), 8)) {
    return NextResponse.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });
  }
  const body = (await req.json()) as { email?: string; password?: string };
  const email = (body.email || "").trim().toLowerCase();
  const password = (body.password || "").trim();
  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Wrong email or password." }, { status: 400 });
  }

  const token = newToken();
  const result = await withStore((s) => {
    if (!s.settings.adminPasswordHash) {
      const fromEnv = process.env.ADMIN_PASSWORD?.trim();
      if (fromEnv && password === fromEnv) {
        s.settings.adminPasswordHash = hashSecret(password);
      } else {
        return { error: "Admin password is not set. Add ADMIN_PASSWORD in the host environment variables, then sign in." };
      }
    } else if (!verifySecret(password, s.settings.adminPasswordHash)) {
      return { error: "Wrong email or password." };
    }
    s.sessions.push({ token, role: "admin", createdAt: nowIso() });
    return { ok: true as const };
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, token, cookieOpts());
  return res;
}
