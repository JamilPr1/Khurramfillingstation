import { NextResponse } from "next/server";
import { COOKIE_CUSTOMER } from "@/lib/auth";
import { clientKey, tooMany } from "@/lib/rateLimit";
import { cookieOpts, hashSecret, verifySecret } from "@/lib/secret";
import { digitsPhone, newId, newToken, nowIso, publicCustomer, withStore } from "@/lib/store";
import { issueCardNumber } from "@/lib/cashback";

export async function POST(req: Request) {
  if (tooMany(clientKey(req, "customer-login"))) {
    return NextResponse.json({ error: "Too many tries. Wait a few minutes." }, { status: 429 });
  }
  const body = (await req.json()) as { phone?: string; name?: string; pin?: string };
  const phone = digitsPhone(body.phone || "");
  const pin = (body.pin || "").replace(/\D/g, "");
  const name = (body.name || "").trim();
  if (phone.length < 11) {
    return NextResponse.json({ error: "Enter an 11-digit mobile number." }, { status: 400 });
  }
  if (pin.length < 4 || pin.length > 6) {
    return NextResponse.json({ error: "Choose a 4 to 6 digit PIN." }, { status: 400 });
  }

  const token = newToken();
  const result = await withStore((s) => {
    let c = s.customers.find((x) => x.phone === phone);
    if (!c) {
      if (name.length < 2) {
        return { error: "Enter your name to create a loyalty card." };
      }
      c = {
        id: newId("c"),
        phone,
        name,
        pinHash: hashSecret(pin),
        points: 0,
        walletPkr: 0,
        cardNumber: "",
        createdAt: nowIso(),
      };
      c.cardNumber = issueCardNumber(c.id);
      s.customers.push(c);
    } else {
      if (!c.pinHash) {
        c.pinHash = hashSecret(pin);
      } else if (!verifySecret(pin, c.pinHash)) {
        return { error: "Wrong PIN." };
      }
      if (name.length >= 2) c.name = name;
    }
    s.sessions = s.sessions.filter((x) => x.customerId !== c.id);
    s.sessions.push({
      token,
      role: "customer",
      customerId: c.id,
      createdAt: nowIso(),
    });
    return { customer: publicCustomer(c) };
  });

  if ("error" in result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, customer: result.customer });
  res.cookies.set(COOKIE_CUSTOMER, token, cookieOpts());
  return res;
}
