import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DEMO } from "./config";
import { dataFile } from "./dataDir";
import type { StoreData } from "./types";

const FILE = dataFile("store.json");

function nowIso() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}

export function seed(): StoreData {
  const customerId = "c_ahmed";
  return {
    customers: [
      {
        id: customerId,
        phone: DEMO.samplePhone,
        name: DEMO.sampleName,
        points: 1240,
        createdAt: nowIso(),
      },
    ],
    sessions: [],
    fills: [],
    ledger: [
      {
        id: id("led"),
        customerId,
        type: "bonus",
        points: 200,
        note: "Bonus · app activation",
        at: nowIso(),
      },
      {
        id: id("led"),
        customerId,
        type: "earn",
        points: 40,
        note: "Purchase · 40 L",
        at: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
      {
        id: id("led"),
        customerId,
        type: "earn",
        points: 28,
        note: "Purchase · 28 L",
        at: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: id("led"),
        customerId,
        type: "redeem",
        points: -500,
        note: "Redeem · car wash",
        at: new Date(Date.now() - 12 * 86400000).toISOString(),
      },
    ],
    redeems: [],
    feedback: [],
  };
}

function read(): StoreData {
  if (!fs.existsSync(FILE)) {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    const s = seed();
    fs.writeFileSync(FILE, JSON.stringify(s, null, 2));
    return s;
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8")) as StoreData;
}

function write(data: StoreData) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

let chain: Promise<unknown> = Promise.resolve();

export function withStore<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const data = read();
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

export { nowIso };
