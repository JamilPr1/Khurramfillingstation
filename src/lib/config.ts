import type { Reward } from "./types";

export const STATION = {
  name: "Khurram Filling Station",
  short: "KFS",
  address: "Opposite Garden Town, Gujranwala, Sialkot Bypass Road",
  maps: "https://www.google.com/maps/place/PSO/@32.2026267,74.198357,17z/data=!3m1!4b1!4m6!3m5!1s0x391f29c91a684009:0x9779b42f15bb88d8!8m2!3d32.2026267!4d74.198357",
  lat: 32.2026267,
  lng: 74.198357,
  phone: "0300-8640045",
  phoneTel: "+923008640045",
  whatsapp: "923008640045",
  email: "khurramfillingstationpso@gmail.com",
  hours: "24 hours",
  /** Paste full profile URLs here when the station is ready. Empty = icon shows, not linked yet. */
  social: {
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    x: "",
  },
  videos: [
    { id: "sDJdqDYPnxg", title: "Khurram Filling Station | Gujranwala Best Petrol Pump" },
    { id: "OFqqgMVNyUk", title: "Khurram Filling Station" },
  ],
};

export const DEMO = {
  otp: "1234",
  staffPin: "1234",
  samplePhone: "03001234567",
  sampleName: "Ahmed Khan",
  qrMinutes: 3,
};

/** 1 loyalty point per litre filled. */
export function pointsForLitres(litres: number) {
  return Math.max(0, Math.round(litres));
}

export const REWARDS: Reward[] = [
  { id: "snack", name: "Shop snack", points: 200, detail: "Any snack from the mart" },
  { id: "wash", name: "Car wash", points: 500, detail: "One exterior wash" },
  { id: "off200", name: "Rs 200 off", points: 1000, detail: "Taken off the next fill" },
];

export const FEEDBACK_TOPICS = [
  "Staff behaviour",
  "Waiting time",
  "Cleanliness",
  "Fuel / pump",
  "Other",
];
