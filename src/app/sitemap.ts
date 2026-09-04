import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] =
    [
      { path: "/", priority: 1, changeFrequency: "weekly" },
      { path: "/about", priority: 0.8, changeFrequency: "monthly" },
      // { path: "/fuels", priority: 0.9, changeFrequency: "monthly" },
      { path: "/team", priority: 0.7, changeFrequency: "monthly" },
      { path: "/visit", priority: 0.9, changeFrequency: "weekly" },
      { path: "/loyalty", priority: 0.8, changeFrequency: "monthly" },
    ];

  return pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
