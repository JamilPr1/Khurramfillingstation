import fs from "node:fs";
import path from "node:path";
import fallback from "./fuel-prices-fallback.json";
import {
  PSO_FUEL_PRICES_URL,
  type FuelPriceBoard,
} from "./fuelPriceBoard";

export {
  PSO_FUEL_PRICES_URL,
  formatPkr,
  fuelPriceCards,
  type FuelPriceBoard,
  type FuelPriceKey,
} from "./fuelPriceBoard";

const CACHE_FILE = path.join(process.cwd(), "data", "fuel-prices.json");
const OVERRIDE_FILE = path.join(process.cwd(), "data", "fuel-prices-override.json");
const REVALIDATE_SECONDS = 2 * 60 * 60;
const MAX_AGE_MS = REVALIDATE_SECONDS * 1000;

function parsePkr(raw: string): number | null {
  const match = String(raw).replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value < 50 || value > 2000) return null;
  return value;
}

function cellAfter(html: string, label: string): number | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`${escaped}\\s*</td>\\s*<td>([^<]+)`, "i"));
  return match ? parsePkr(match[1]) : null;
}

function stripComments(html: string) {
  return html.replace(/<!--[\s\S]*?-->/g, " ");
}

function parseMdY(raw: string): Date | null {
  const match = raw.match(/([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})/);
  if (!match) return null;
  const months: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };
  const month = months[match[1].toLowerCase()];
  const day = Number(match[2]);
  const year = Number(match[3]);
  if (month == null || !day || !year) return null;
  return new Date(Date.UTC(year, month, day));
}

function formatEffectiveLabel(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Karachi",
  });
}

function parseEffectiveFor(html: string, label: string): { iso: string | null; label: string } {
  const re = /Effective From:\s*([A-Za-z]{3,10}\.?\s+\d{1,2},\s+\d{4})/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html))) {
    const after = html.slice(match.index, match.index + 8000);
    if (!after.toLowerCase().includes(label.toLowerCase())) continue;
    const raw = match[1].replace(/\s+/g, " ").trim();
    const date = parseMdY(raw);
    if (!date) return { iso: null, label: raw };
    return { iso: date.toISOString().slice(0, 10), label: formatEffectiveLabel(date) };
  }
  return { iso: null, label: "" };
}

function asBoard(raw: Partial<FuelPriceBoard> & { petrol: number; diesel: number; octane: number }): FuelPriceBoard | null {
  if (!parsePkr(String(raw.petrol)) || !parsePkr(String(raw.diesel)) || !parsePkr(String(raw.octane))) {
    return null;
  }
  const effective = raw.effective || null;
  const fromIso = effective ? new Date(`${effective}T00:00:00+05:00`) : null;
  return {
    petrol: Number(raw.petrol),
    diesel: Number(raw.diesel),
    octane: Number(raw.octane),
    effective,
    effectiveLabel:
      raw.effectiveLabel ||
      (fromIso && !Number.isNaN(fromIso.getTime()) ? formatEffectiveLabel(fromIso) : ""),
    source: raw.source || "fallback",
    sourceUrl: raw.sourceUrl || PSO_FUEL_PRICES_URL,
    fetchedAt: raw.fetchedAt || new Date().toISOString(),
  };
}

function readJsonFile(file: string): FuelPriceBoard | null {
  try {
    if (!fs.existsSync(file)) return null;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<FuelPriceBoard>;
    if (typeof parsed.petrol !== "number" || typeof parsed.diesel !== "number" || typeof parsed.octane !== "number") {
      return null;
    }
    return asBoard(parsed as FuelPriceBoard);
  } catch {
    return null;
  }
}

function writeCache(board: FuelPriceBoard) {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(board, null, 2));
  } catch {
    /* read-only hosts can skip */
  }
}

function isFresh(board: FuelPriceBoard) {
  const at = Date.parse(board.fetchedAt);
  return Number.isFinite(at) && Date.now() - at < MAX_AGE_MS;
}

export function parsePsoFuelHtml(html: string): FuelPriceBoard | null {
  const page = stripComments(html);
  const petrol = cellAfter(page, "PREMIER EURO 5");
  const diesel = cellAfter(page, "HI-CETANE DIESEL EURO 5");
  const octane = cellAfter(page, "Octane Euro 5 (Gujranwala)");
  if (petrol == null || diesel == null || octane == null) return null;
  const effective = parseEffectiveFor(page, "PREMIER EURO 5");
  return {
    petrol,
    diesel,
    octane,
    effective: effective.iso,
    effectiveLabel: effective.label,
    source: "pso",
    sourceUrl: PSO_FUEL_PRICES_URL,
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchPsoBoard(): Promise<FuelPriceBoard | null> {
  const res = await fetch(PSO_FUEL_PRICES_URL, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["fuel-prices"] },
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return null;
  const html = await res.text();
  return parsePsoFuelHtml(html);
}

export async function getFuelPrices(): Promise<FuelPriceBoard> {
  const override = readJsonFile(OVERRIDE_FILE);
  if (override) return { ...override, source: "override" };

  const cached = readJsonFile(CACHE_FILE);
  if (cached && isFresh(cached)) return { ...cached, source: "cache" };

  try {
    const live = await fetchPsoBoard();
    if (live) {
      writeCache(live);
      return live;
    }
  } catch {
    /* use cache / fallback */
  }

  if (cached) return { ...cached, source: "cache" };
  return asBoard(fallback) as FuelPriceBoard;
}
