import { NextResponse } from "next/server";
import {
  COOKIE_ADMIN,
  COOKIE_CUSTOMER,
  COOKIE_STAFF,
  getAdminSession,
  getCustomerSession,
  getStaffSession,
} from "@/lib/auth";
import { cookieOpts } from "@/lib/secret";
import { publicCustomer, withStore } from "@/lib/store";

export async function GET(req: Request) {
  const role = new URL(req.url).searchParams.get("role");
  if (role === "staff") {
    const session = await getStaffSession();
    return NextResponse.json({ role: session ? "staff" : null });
  }
  if (role === "admin") {
    const session = await getAdminSession();
    return NextResponse.json({ role: session ? "admin" : null });
  }
  const session = await getCustomerSession();
  if (!session?.customerId) return NextResponse.json({ role: null });
  const customer = await withStore((s) => s.customers.find((c) => c.id === session.customerId) ?? null);
  return NextResponse.json({
    role: "customer",
    customer: customer ? publicCustomer(customer) : null,
  });
}

export async function DELETE(req: Request) {
  const role = new URL(req.url).searchParams.get("role");
  const res = NextResponse.json({ ok: true });
  const clear = { ...cookieOpts(), maxAge: 0 };
  if (role === "staff") {
    const session = await getStaffSession();
    if (session) {
      await withStore((s) => {
        s.sessions = s.sessions.filter((x) => x.token !== session.token);
      });
    }
    res.cookies.set(COOKIE_STAFF, "", clear);
  } else if (role === "admin") {
    const session = await getAdminSession();
    if (session) {
      await withStore((s) => {
        s.sessions = s.sessions.filter((x) => x.token !== session.token);
      });
    }
    res.cookies.set(COOKIE_ADMIN, "", clear);
  } else {
    const session = await getCustomerSession();
    if (session) {
      await withStore((s) => {
        s.sessions = s.sessions.filter((x) => x.token !== session.token);
      });
    }
    res.cookies.set(COOKIE_CUSTOMER, "", clear);
  }
  return res;
}
