import { NextResponse } from "next/server";
import { COOKIE_STAFF } from "@/lib/auth";
import { newToken, nowIso, withStore } from "@/lib/store";
import { DEMO } from "@/lib/config";

export async function POST(req: Request) {
  const body = (await req.json()) as { pin?: string };
  if ((body.pin || "").trim() !== DEMO.staffPin) {
    return NextResponse.json({ error: "Wrong PIN. Demo staff PIN is 1234." }, { status: 400 });
  }
  const token = newToken();
  await withStore((s) => {
    s.sessions = s.sessions.filter((x) => x.role !== "staff");
    s.sessions.push({ token, role: "staff", createdAt: nowIso() });
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_STAFF, token, { httpOnly: true, path: "/", sameSite: "lax" });
  return res;
}
