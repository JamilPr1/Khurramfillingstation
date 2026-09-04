import path from "node:path";

/** Local `data/`; on Vercel the app filesystem is read-only, so use `/tmp`. */
export function dataFile(name: string) {
  const root = process.env.VERCEL
    ? path.join("/tmp", "kfs-data")
    : path.join(process.cwd(), "data");
  return path.join(root, name);
}
