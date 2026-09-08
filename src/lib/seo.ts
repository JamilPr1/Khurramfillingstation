import type { Metadata } from "next";
import { STATION } from "./config";

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/\/$/, "");
  if (prod) return prod.startsWith("http") ? prod : `https://${prod}`;
  const preview = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (preview) return `https://${preview}`;
  return "http://localhost:3000";
}

export const SITE_URL = siteUrl();

export const KEYWORDS = [
  "Khurram Filling Station",
  "Khurram Filling Station PSO",
  "Khurram Filling Station Gujranwala",
  "Khurram Iftikhar",
  "PSO Gujranwala",
  "PSO petrol pump Gujranwala",
  "PSO Sialkot Bypass",
  "petrol pump Gujranwala",
  "petrol pump Sialkot Bypass",
  "petrol price Gujranwala",
  "diesel price Gujranwala",
  "filling station Garden Town Gujranwala",
  "Sialkot Bypass Road petrol pump",
  "diesel pump Gujranwala",
  "HSD diesel Gujranwala",
  "Hi-Octane Gujranwala",
  "24 hour petrol pump Gujranwala",
  "PSO pump opposite Garden Town",
  "car wash Gujranwala Sialkot Bypass",
  "خرم فلنگ اسٹیشن",
  "پی ایس او گوجرانوالہ",
  "پیٹرول پمپ گوجرانوالہ",
];

export const DEFAULT_TITLE = "Khurram Filling Station | PSO Petrol Pump Gujranwala";
export const DEFAULT_DESCRIPTION =
  "Khurram Filling Station is a 24-hour PSO petrol pump opposite Garden Town, Gujranwala, on Sialkot Bypass Road. Open since 2015. Petrol, HSD diesel, Hi-Octane, mart, car wash and loyalty points.";

export const FAQS = [
  {
    q: "Where is Khurram Filling Station?",
    a: "Opposite Garden Town, Gujranwala, on Sialkot Bypass Road. Open the Visit page or Google Maps for directions.",
  },
  {
    q: "What fuels are available?",
    a: "Petrol, HSD diesel and Hi-Octane, plus a mart and car wash at the same stop.",
  },
  {
    q: "Where can I see today’s petrol, Hi-Octane and diesel prices?",
    a: "The home page shows PSO’s latest notified rates for petrol, HSD diesel and Gujranwala Hi-Octane. Confirm the board at the pump, as a little freight can apply at the nozzle.",
  },
  {
    q: "Is the pump open 24 hours?",
    a: "Yes. Pumps at Khurram Filling Station run 24 hours a day, 7 days a week.",
  },
  {
    q: "How do I contact the station?",
    a: `Call or WhatsApp ${STATION.phone}, or email ${STATION.email}.`,
  },
  {
    q: "How does the loyalty card work?",
    a: "Install the app from this website, sign in with your mobile number and PIN, and scan the cashier QR after you fill. You earn points for every litre.",
  },
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const isHome = path === "/";
  const fullTitle = isHome ? title : `${title} | ${STATION.name}`;
  return {
    title: isHome ? { absolute: fullTitle } : fullTitle,
    description,
    keywords: KEYWORDS,
    alternates: { canonical: url },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: STATION.name,
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og.jpg"),
          width: 1200,
          height: 630,
          alt: `${STATION.name} at night, PSO Gujranwala`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl("/twitter.jpg")],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STATION.name,
    alternateName: ["KFS", "Khurram Filling Station PSO", "خرم فلنگ اسٹیشن"],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: ["en", "ur"],
    publisher: { "@id": `${SITE_URL}/#station` },
  };
}

export function gasStationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["GasStation", "LocalBusiness", "AutomotiveBusiness"],
    "@id": `${SITE_URL}/#station`,
    name: STATION.name,
    legalName: STATION.name,
    alternateName: ["KFS", "Khurram Filling Station PSO", "خرم فلنگ اسٹیشن"],
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    foundingDate: "2015",
    image: [absoluteUrl("/og.jpg"), absoluteUrl("/assets/photos/kfs-hero.jpg")],
    logo: absoluteUrl("/assets/logos/logo-horizontal.png"),
    telephone: STATION.phoneTel,
    email: STATION.email,
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Card",
    brand: { "@type": "Brand", name: "PSO", alternateName: "Pakistan State Oil" },
    parentOrganization: { "@type": "Organization", name: "Pakistan State Oil" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sialkot Bypass Road, Opposite Garden Town",
      addressLocality: "Gujranwala",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: STATION.lat,
      longitude: STATION.lng,
    },
    hasMap: STATION.maps,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: [
      { "@type": "City", name: "Gujranwala" },
      { "@type": "Place", name: "Garden Town Gujranwala" },
      { "@type": "Place", name: "Sialkot Bypass" },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Petrol", value: true },
      { "@type": "LocationFeatureSpecification", name: "HSD Diesel", value: true },
      { "@type": "LocationFeatureSpecification", name: "Hi-Octane", value: true },
      { "@type": "LocationFeatureSpecification", name: "Mart", value: true },
      { "@type": "LocationFeatureSpecification", name: "Car wash", value: true },
      { "@type": "LocationFeatureSpecification", name: "24 hour pumps", value: true },
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Petrol" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "HSD Diesel" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Hi-Octane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car wash" } },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: STATION.phoneTel,
        contactType: "customer service",
        areaServed: "PK",
        availableLanguage: ["en", "ur"],
      },
      {
        "@type": "ContactPoint",
        url: `https://wa.me/${STATION.whatsapp}`,
        contactType: "customer service",
        name: "WhatsApp",
      },
    ],
    sameAs: [
      `https://wa.me/${STATION.whatsapp}`,
      STATION.maps,
      STATION.social.instagram,
      STATION.social.youtube,
      STATION.social.x,
      STATION.social.facebook,
    ].filter(Boolean),
    founder: { "@type": "Person", name: "Khurram Iftikhar", jobTitle: "CEO" },
    employee: [
      { "@type": "Person", name: "Khurram Iftikhar", jobTitle: "CEO" },
      { "@type": "Person", name: "Rashid", jobTitle: "Manager" },
      { "@type": "Person", name: "Abdul Razaq", jobTitle: "Forecourt Manager" },
    ],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
