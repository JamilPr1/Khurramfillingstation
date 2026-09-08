import type { Reward } from "./types";

export const STATION = {
  name: "Khurram Filling Station",
  short: "KFS",
  address: "Opposite Garden Town, Gujranwala, Sialkot Bypass Road",
  maps: "https://www.google.com/maps/place/PSO/@32.2026267,74.198357,17z/data=!3m1!4b1!4m6!3m5!1s0x391f29c91a684009:0x9779b42f15bb88d8!8m2!3d32.2026267!4d74.198357",
  lat: 32.2026267,
  lng: 74.198357,
  phone: "0332-8119081",
  phoneTel: "+923328119081",
  whatsapp: "923328119081",
  email: "khurramfillingstationpso@gmail.com",
  hours: "24 hours",
  /** Empty URL = that network is omitted from header/footer. */
  social: {
    facebook: "",
    instagram: "https://www.instagram.com/khurramfillingstationpso/",
    youtube: "https://www.youtube.com/@KhurramFillingStation",
    x: "https://x.com/Khurramfilling",
  },
  videos: [
    { id: "sDJdqDYPnxg", title: "Khurram Filling Station | Gujranwala Best Petrol Pump" },
    { id: "OFqqgMVNyUk", title: "Khurram Filling Station" },
  ],
};

export const ADMIN_EMAIL = STATION.email.toLowerCase();

export const DEFAULT_REWARDS: Reward[] = [
  {
    id: "snack",
    name: "Shop snack",
    points: 200,
    detail: "Any snack from the mart",
    kind: "item",
    discountPkr: 0,
  },
  {
    id: "wash",
    name: "Car wash",
    points: 500,
    detail: "One exterior wash",
    kind: "item",
    discountPkr: 0,
  },
  {
    id: "off200",
    name: "Rs 200 off",
    points: 1000,
    detail: "Taken off the next fill",
    kind: "discount",
    discountPkr: 200,
  },
];

export function pointsForLitres(litres: number, perLitre = 1) {
  return Math.max(0, Math.round(litres * perLitre));
}

export const FEEDBACK_TOPICS = [
  "Staff behaviour",
  "Waiting time",
  "Cleanliness",
  "Fuel / pump",
  "Other",
];
