import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Khurram Filling Station",
    short_name: "KFS Loyalty",
    description:
      "Loyalty points and QR scan for Khurram Filling Station, Gujranwala. Same navy, yellow and green as the website.",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "en",
    background_color: "#152445",
    theme_color: "#152445",
    categories: ["utilities", "shopping"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
