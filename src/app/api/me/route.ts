import { NextResponse } from "next/server";
import { COOKIE_CUSTOMER, COOKIE_STAFF, getCustomerSession, getStaffSession } from "@/lib/auth";
import { withStore } from "@/lib/store";

export async function GET(req: Request) {
  const role = new URL(req.url).searchParams.get("role");
  if (role === "staff") {
    const session = await getStaffSession();
    return NextResponse.json({ role: session ? "staff" : null });
  }
  const session = await getCustomerSession();
  if (!session?.customerId) return NextResponse.json({ role: null });
  const customer = await withStore((s) => s.customers.find((c) => c.id === session.customerId) ?? null);
  return NextResponse.json({ role: "customer", customer });
}

export async function DELETE(req: Request) {
  const role = new URL(req.url).searchParams.get("role");
  const res = NextResponse.json({ ok: true });
  if (role === "staff") {
    const session = await getStaffSession();
    if (session) {
      await withStore((s) => {
        s.sessions = s.sessions.filter((x) => x.token !== session.token);
      });
    }
    res.cookies.set(COOKIE_STAFF, "", { httpOnly: true, path: "/", maxAge: 0 });
  } else {
    const session = await getCustomerSession();
    if (session) {
      await withStore((s) => {
        s.sessions = s.sessions.filter((x) => x.token !== session.token);
      });
    }
    res.cookies.set(COOKIE_CUSTOMER, "", { httpOnly: true, path: "/", maxAge: 0 });
  }
  return res;
}
