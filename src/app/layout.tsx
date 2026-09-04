import type { Metadata, Viewport } from "next";
import { Geist, Montserrat, Outfit } from "next/font/google";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  KEYWORDS,
  SITE_URL,
  absoluteUrl,
  gasStationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import { STATION } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-kfs",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${STATION.name}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: STATION.name,
  authors: [{ name: STATION.name, url: SITE_URL }],
  creator: STATION.name,
  publisher: STATION.name,
  category: "petrol station",
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: "/",
    types: {
      "text/plain": "/llms.txt",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: SITE_URL,
    siteName: STATION.name,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: absoluteUrl("/og.jpg"),
        width: 1200,
        height: 630,
        alt: "Khurram Filling Station PSO Gujranwala at night",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl("/twitter.jpg")],
  },
  appleWebApp: {
    capable: true,
    title: "KFS Loyalty",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  other: {
    "geo.region": "PK-PB",
    "geo.placename": "Gujranwala",
    "geo.position": `${STATION.lat};${STATION.lng}`,
    ICBM: `${STATION.lat}, ${STATION.lng}`,
    "ai-content-declaration": "original",
  },
};

export const viewport: Viewport = {
  themeColor: "#152445",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${outfit.variable} ${montserrat.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt" />
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body className="min-h-full">
        <JsonLd data={[websiteJsonLd(), gasStationJsonLd()]} />
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
