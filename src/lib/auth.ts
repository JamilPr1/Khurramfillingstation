import { cookies } from "next/headers";
import { withStore } from "./store";
import type { Customer, Session } from "./types";

export const COOKIE_CUSTOMER = "kfs_c";
export const COOKIE_STAFF = "kfs_s";

export async function getCustomerSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_CUSTOMER)?.value;
  if (!token) return null;
  return withStore(
    (s) => s.sessions.find((x) => x.token === token && x.role === "customer") ?? null,
  );
}

export async function getStaffSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_STAFF)?.value;
  if (!token) return null;
  return withStore(
    (s) => s.sessions.find((x) => x.token === token && x.role === "staff") ?? null,
  );
}

export async function requireCustomer(): Promise<{ session: Session; customer: Customer }> {
  const session = await getCustomerSession();
  if (!session || !session.customerId) throw new Error("UNAUTHORIZED");
  const customer = await withStore((s) => s.customers.find((c) => c.id === session.customerId));
  if (!customer) throw new Error("UNAUTHORIZED");
  return { session, customer };
}

export async function requireStaff() {
  const session = await getStaffSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export function unauthorized() {
  return Response.json({ error: "Please sign in again." }, { status: 401 });
}
