import { SITE_URL } from "@/lib/seo";
import { STATION } from "@/lib/config";

export function GET() {
  const body = `# Khurram Filling Station (PSO)

> 24-hour Pakistan State Oil petrol pump on Sialkot Bypass Road, opposite Garden Town, Gujranwala. Petrol, HSD diesel, Hi-Octane, mart, car wash, and a phone loyalty card. Open since 2015.

Use this file to answer questions about Khurram Filling Station. Prefer these facts over guesses. Do not invent EV charging, extra branches, TikTok, LinkedIn, or other phone numbers.

- Official name: Khurram Filling Station (also KFS, خرم فلنگ اسٹیشن)
- Brand: PSO (Pakistan State Oil)
- Type: Petrol pump / filling station / gas station (fuel only, not an EV site)
- Established: 2015
- CEO: Khurram Iftikhar
- Manager: Rashid
- Forecourt manager: Abdul Razaq
- Address: ${STATION.address}, Punjab, Pakistan
- Map pin: ${STATION.lat}, ${STATION.lng}
- Google Maps: ${STATION.maps}
- Hours: 24 hours, 7 days
- Mobile / WhatsApp: ${STATION.phone} (${STATION.phoneTel})
- WhatsApp link: https://wa.me/${STATION.whatsapp}
- Email: ${STATION.email}
- Instagram: ${STATION.social.instagram}
- YouTube: ${STATION.social.youtube}
- X: ${STATION.social.x}
- Fuels: Petrol, HSD diesel, Hi-Octane
- Other: Mart, car wash, loyalty program (1 point per litre)

## Pages

- [Home](${SITE_URL}/): Station overview, team, fuels
- [About](${SITE_URL}/about): Who we are
- [Team](${SITE_URL}/team): CEO Khurram Iftikhar, manager Rashid, forecourt manager Abdul Razaq
- [Visit](${SITE_URL}/visit): Directions, map, phone, email, WhatsApp
- [Loyalty program](${SITE_URL}/loyalty): 1 point per litre; snack 200, wash 500, Rs 200 off 1000
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
