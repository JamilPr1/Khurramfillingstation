import { STATION } from "./config";

export const FUELS = [
  {
    title: "Petrol",
    text: "Reliable petrol on the Sialkot Bypass, ready when you are.",
    detail: "Available 24 hours at the pump for cars, bikes and everyday trips across Gujranwala.",
    icon: "/assets/icons/drop.svg",
  },
  {
    title: "HSD Diesel",
    text: "Diesel for cars, vans and commercial vehicles at the pump.",
    detail: "HSD for pickups, trucks and commercial fleets that run this bypass every day.",
    icon: "/assets/icons/pump.svg",
  },
  {
    title: "Hi-Octane",
    text: "Premium fuel for a cleaner run and better engine response.",
    detail: "A higher-octane fill when you want a smoother run and cleaner engine response.",
    icon: "/assets/icons/gauge.svg",
  },
  {
    title: "Mart & car wash",
    text: "Shop essentials and a wash while you fill, all at one stop.",
    detail: "Snacks, shop items and a wash while you wait. One stop on the Sialkot Bypass.",
    icon: "/assets/icons/car.svg",
  },
];

export const TEAM = [
  {
    name: "Khurram Iftikhar",
    role: "CEO",
    img: "/assets/team/khurram-iftikhar-ceo.jpg?v=2",
    bio: "CEO of Khurram Filling Station. Leads the pump, the team, and the loyalty service on the Sialkot Bypass.",
    message:
      "Since 2015, Khurram Filling Station has operated as an authorised PSO dealership opposite Garden Town. We are committed to reliable fuel quality, disciplined operations, and courteous service for every customer on the Sialkot Bypass, twenty-four hours a day.",
  },
  {
    name: "Rashid",
    role: "Manager",
    img: "/assets/team/rashid-manager.jpg?v=2",
    bio: "Station manager. Looks after daily operations, staff and a clean, on-time fill for every driver.",
  },
  {
    name: "Abdul Razaq",
    role: "Forecourt Manager",
    img: "/assets/team/abdulrazaq-forecourt-manager.jpg?v=2",
    bio: "Forecourt manager. Keeps the bays moving, the pumps ready, and customers looked after on the forecourt.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Ayesha Malik",
    city: "Gujranwala",
    stars: 5,
    comment: "Raat ko 12 baje petrol chahiye tha, pump khula mila. Staff acha tha aur pump saaf tha. Ab yahi hamara regular stop hai.",
    img: "/assets/reviews/ayesha.jpg",
  },
  {
    name: "Usman Raza",
    city: "Garden Town",
    stars: 5,
    comment: "Yahan Hi-Octane consistent milta hai. Garden Town ke saamne hai to rasta nahi badalna parta. Jaldi fill ho jata hai, intezaar nahi karna parta.",
    img: "/assets/reviews/usman.jpg",
  },
  {
    name: "Fatima Noor",
    city: "Sialkot Bypass",
    stars: 4,
    comment: "Loyalty points on the phone are easy. Scanned the QR after I filled and the points showed up straight away.",
    img: "/assets/reviews/fatima.jpg",
  },
  {
    name: "Bilal Ahmed",
    city: "Gujranwala",
    stars: 5,
    comment: "Main pickup HSD pe chalta hoon. 24 ghante khula rehta hai aur diesel acha hai. Forecourt wale queue jaldi clear kar dete hain.",
    img: "/assets/reviews/bilal.jpg",
  },
  {
    name: "Sana Qureshi",
    city: "Garden Town",
    stars: 5,
    comment: "Filled up, grabbed snacks from the mart, and got the car washed in one stop. Family uses this pump every week.",
    img: "/assets/reviews/sana.jpg",
  },
  {
    name: "Imran Sheikh",
    city: "Gujranwala Cantt",
    stars: 4,
    comment: "Proper PSO pump on the bypass. Rates are fair, toilets were usable, and they helped with the loyalty card.",
    img: "/assets/reviews/imran.jpg",
  },
  {
    name: "Hassan Ali",
    city: "Sialkot Bypass",
    stars: 5,
    comment: "Came off the bypass late and every island was working. Fast fill, clear rates, and they pointed me to the loyalty login.",
    img: "/assets/reviews/hassan.jpg",
  },
  {
    name: "Maryam Javed",
    city: "Gujranwala",
    stars: 5,
    comment: "Main gaari mein baithi rehti hoon, wo fill kar dete hain. Staff izzat se baat karta hai aur shop mein bachon ke liye cheezein mil jati hain. Family ki taraf se 5 star.",
    img: "/assets/reviews/maryam.jpg",
  },
];

export const MAPS_EMBED = `https://www.google.com/maps?q=${STATION.lat},${STATION.lng}&z=17&output=embed`;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  // { href: "/fuels", label: "Fuels" }, // hidden for now; page still at /fuels
  { href: "/team", label: "Team" },
  { href: "/visit", label: "Visit" },
  { href: "/loyalty", label: "Loyalty program" },
];
