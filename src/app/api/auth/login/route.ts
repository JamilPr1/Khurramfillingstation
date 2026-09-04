import { NextResponse } from "next/server";
import { DEMO } from "@/lib/config";
import { COOKIE_CUSTOMER } from "@/lib/auth";
import { digitsPhone, newId, newToken, nowIso, withStore } from "@/lib/store";

export async function POST(req: Request) {
  const body = (await req.json()) as { phone?: string; name?: string; otp?: string };
  const phone = digitsPhone(body.phone || "");
  if (phone.length < 11) {
    return NextResponse.json({ error: "Enter an 11-digit mobile number." }, { status: 400 });
  }
  if ((body.otp || "").trim() !== DEMO.otp) {
    return NextResponse.json({ error: "Wrong code. Demo OTP is 1234." }, { status: 400 });
  }

  const token = newToken();
  const customer = await withStore((s) => {
    let c = s.customers.find((x) => x.phone === phone);
    if (!c) {
      c = {
        id: newId("c"),
        phone,
        name: (body.name || "").trim() || "Customer",
        points: 0,
        createdAt: nowIso(),
      };
      s.customers.push(c);
    } else if (body.name?.trim()) {
      c.name = body.name.trim();
    }
    s.sessions = s.sessions.filter((x) => x.customerId !== c.id);
    s.sessions.push({
      token,
      role: "customer",
      customerId: c.id,
      createdAt: nowIso(),
    });
    return c;
  });

  const res = NextResponse.json({ ok: true, customer });
  res.cookies.set(COOKIE_CUSTOMER, token, { httpOnly: true, path: "/", sameSite: "lax" });
  return res;
}
