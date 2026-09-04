import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "contacts.json");

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      message?: string;
    };
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Enter name, mobile and a message." }, { status: 400 });
    }

    const row = {
      id: `msg_${Date.now()}`,
      name,
      phone,
      email,
      message,
      at: new Date().toISOString(),
    };
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const prev = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : [];
    const list = Array.isArray(prev) ? prev : [];
    list.unshift(row);
    fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not send. Try WhatsApp or a call." }, { status: 500 });
  }
}
