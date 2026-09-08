const hits = new Map<string, { n: number; reset: number }>();

export function tooMany(key: string, limit = 12, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const row = hits.get(key);
  if (!row || row.reset < now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  row.n += 1;
  return row.n > limit;
}

export function clientKey(req: Request, extra: string) {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${extra}:${fwd || "local"}`;
}
