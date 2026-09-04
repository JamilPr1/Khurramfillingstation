import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "GoogleOther",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "meta-externalagent",
  "FacebookBot",
  "Amazonbot",
  "YouBot",
  "Diffbot",
];

const publicAllow = ["/", "/llms.txt", "/llms-full.txt", "/ai.txt", "/sitemap.xml"];
const privateDisallow = ["/api/", "/customer/", "/staff/", "/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: privateDisallow,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: publicAllow,
        disallow: privateDisallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
