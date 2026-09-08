import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ADMIN_EMAIL, DEFAULT_REWARDS, STATION } from "./config";
import { dataFile } from "./dataDir";
import { applyMonthlyCashback, issueCardNumber, maskCard } from "./cashback";
import { hashSecret } from "./secret";
import type { Customer, PublicCustomer, Settings, StoreData } from "./types";

const FILE = dataFile("store.json");

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

export function defaultSettings(): Settings {
  return {
    pointsPerLitre: 1,
    qrMinutes: 3,
    pkrPerPoint: 0.2,
    lastCashbackMonth: "",
    staffPinHash: "",
    adminEmail: ADMIN_EMAIL,
    adminPasswordHash: "",
    rewards: DEFAULT_REWARDS.map((r) => ({ ...r })),
  };
}

function bootstrapSecrets(settings: Settings) {
  settings.adminEmail = (settings.adminEmail || ADMIN_EMAIL).trim().toLowerCase();
  const adminPw = process.env.ADMIN_PASSWORD?.trim();
  if (!settings.adminPasswordHash && adminPw) {
    settings.adminPasswordHash = hashSecret(adminPw);
  }
  const staffPin = process.env.STAFF_PIN?.trim();
  if (!settings.staffPinHash && staffPin) {
    settings.staffPinHash = hashSecret(staffPin);
  }
  if (!Array.isArray(settings.rewards) || settings.rewards.length === 0) {
    settings.rewards = DEFAULT_REWARDS.map((r) => ({ ...r }));
  }
  settings.rewards = settings.rewards.map((r) => ({
    id: r.id,
    name: r.name,
    points: Number(r.points) || 0,
    detail: r.detail || "",
    kind: r.kind === "discount" ? "discount" : "item",
    discountPkr: Number(r.discountPkr) || 0,
  }));
  if (!Number.isFinite(settings.pointsPerLitre) || settings.pointsPerLitre <= 0) {
    settings.pointsPerLitre = 1;
  }
  if (!Number.isFinite(settings.qrMinutes) || settings.qrMinutes <= 0) {
    settings.qrMinutes = 3;
  }
  if (!Number.isFinite(settings.pkrPerPoint) || settings.pkrPerPoint <= 0) {
    settings.pkrPerPoint = 0.2;
  }
  if (typeof settings.lastCashbackMonth !== "string") {
    settings.lastCashbackMonth = "";
  }
}

export function seed(): StoreData {
  return {
    customers: [],
    sessions: [],
    fills: [],
    ledger: [],
    redeems: [],
    feedback: [],
    settings: defaultSettings(),
  };
}

function migrate(raw: StoreData): StoreData {
  const data: StoreData = {
    customers: Array.isArray(raw.customers) ? raw.customers : [],
    sessions: Array.isArray(raw.sessions) ? raw.sessions : [],
    fills: Array.isArray(raw.fills) ? raw.fills : [],
    ledger: Array.isArray(raw.ledger) ? raw.ledger : [],
    redeems: Array.isArray(raw.redeems) ? raw.redeems : [],
    feedback: Array.isArray(raw.feedback) ? raw.feedback : [],
    settings: { ...defaultSettings(), ...(raw.settings || {}) },
  };
  data.customers = data.customers
    .filter((c) => c.id !== "c_ahmed")
    .map((c) => ({
      ...c,
      pinHash: c.pinHash || "",
      points: Number(c.points) || 0,
      walletPkr: Number(c.walletPkr) || 0,
      cardNumber: c.cardNumber || issueCardNumber(c.id),
    }));
  data.ledger = data.ledger.filter((l) => data.customers.some((c) => c.id === l.customerId));
  data.sessions = data.sessions.filter((s) => s.role === "staff" || s.role === "admin" || data.customers.some((c) => c.id === s.customerId));
  bootstrapSecrets(data.settings);
  return data;
}

function read(): StoreData {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const s = migrate(seed());
    fs.writeFileSync(FILE, JSON.stringify(s, null, 2));
    return s;
  }
  const parsed = JSON.parse(fs.readFileSync(FILE, "utf8")) as StoreData;
  return migrate(parsed);
}

function write(data: StoreData) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

let chain: Promise<unknown> = Promise.resolve();

export function withStore<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const data = read();
    applyMonthlyCashback(data);
    const result = await fn(data);
    write(data);
    return result;
  });
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export function newId(prefix: string) {
  return id(prefix);
}

export function newToken() {
  return randomBytes(18).toString("hex");
}

export function digitsPhone(input: string) {
  const d = input.replace(/\D/g, "");
  if (d.startsWith("92") && d.length === 12) return `0${d.slice(2)}`;
  return d;
}

export function publicCustomer(c: Customer): PublicCustomer {
  return {
    id: c.id,
    phone: c.phone,
    name: c.name,
    points: c.points,
    walletPkr: Number(c.walletPkr) || 0,
    cardMasked: maskCard(c.cardNumber || issueCardNumber(c.id)),
    createdAt: c.createdAt,
  };
}

export function publicSettings(s: Settings) {
  return {
    pointsPerLitre: s.pointsPerLitre,
    qrMinutes: s.qrMinutes,
    pkrPerPoint: s.pkrPerPoint,
    lastCashbackMonth: s.lastCashbackMonth || "",
    adminEmail: s.adminEmail || STATION.email,
    rewards: s.rewards,
    staffPinSet: Boolean(s.staffPinHash),
    adminReady: Boolean(s.adminPasswordHash),
  };
}

export { nowIso };
