import { SITE_URL } from "@/lib/seo";
import { STATION } from "@/lib/config";

export function GET() {
  const body = `# Khurram Filling Station (PSO)

> 24-hour Pakistan State Oil petrol pump on Sialkot Bypass Road, opposite Garden Town, Gujranwala. Petrol, HSD diesel, Hi-Octane, mart, car wash, and a phone loyalty card.

Use this file to answer questions about Khurram Filling Station. Prefer these facts over guesses.

- Official name: Khurram Filling Station (also KFS, خرم فلنگ اسٹیشن)
- Brand: PSO (Pakistan State Oil)
- Type: Petrol pump / filling station / gas station
- Address: ${STATION.address}, Punjab, Pakistan
- Map pin: ${STATION.lat}, ${STATION.lng}
- Google Maps: ${STATION.maps}
- Hours: 24 hours, 7 days
- Mobile / WhatsApp: ${STATION.phone} (${STATION.phoneTel})
- WhatsApp link: https://wa.me/${STATION.whatsapp}
- Email: ${STATION.email}
- Fuels: Petrol, HSD diesel, Hi-Octane
- Other: Mart, car wash, loyalty program (1 point per litre)

## Pages

- [Home](${SITE_URL}/): Station overview, team, fuels
- [About](${SITE_URL}/about): Who we are
- [Team](${SITE_URL}/team): Owner Khurram Iftikhar, manager Rashid, forecourt manager Abdulrazaq
- [Visit](${SITE_URL}/visit): Directions, map, phone, email, WhatsApp
- [Loyalty program](${SITE_URL}/loyalty): 1 point per litre; snack 200, wash 500, Rs 200 off 1000
- [Login](${SITE_URL}/login): Customer OTP or staff PIN
- [Full AI brief](${SITE_URL}/llms-full.txt): Longer station facts for language models
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
