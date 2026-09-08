import type { Metadata } from "next";
import { STATION } from "@/lib/config";
import { MAPS_EMBED } from "@/lib/station";
import { SocialIcons } from "@/components/landing/SocialIcons";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQS, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Visit & Directions",
  description:
    "Find Khurram Filling Station opposite Garden Town, Gujranwala on Sialkot Bypass Road. 24-hour PSO petrol pump. Call 0332-8119081 or WhatsApp for directions.",
  path: "/visit",
});

export default function VisitPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Visit", path: "/visit" },
        ])}
      />
      <section className="kfs-page-head">
        <p className="kfs-kicker">Visit</p>
        <h1>PSO pump opposite Garden Town, Gujranwala</h1>
        <p>{STATION.address}</p>
      </section>

      <section className="kfs-section kfs-visit">
        <div>
          <p className="kfs-kicker dark">Find the pump</p>
          <h2>Sialkot Bypass Road</h2>
          <p className="kfs-lead">{STATION.address}</p>
          <p className="kfs-lead">Hours: {STATION.hours}</p>
          <p className="kfs-lead">
            Mobile: <a href={`tel:${STATION.phoneTel}`}>{STATION.phone}</a>
          </p>
          <p className="kfs-lead">
            WhatsApp:{" "}
            <a href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              {STATION.phone}
            </a>
          </p>
          <p className="kfs-lead">
            Email: <a href={`mailto:${STATION.email}`}>{STATION.email}</a>
          </p>
          <SocialIcons />
          <div className="kfs-actions">
            <a className="kfs-btn kfs-btn-navy" href={STATION.maps} target="_blank" rel="noreferrer">
              Open in Google Maps
            </a>
            <a className="kfs-btn kfs-btn-line" href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="kfs-map">
          <iframe
            title="Khurram Filling Station on Google Maps, Sialkot Bypass Gujranwala"
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="kfs-section kfs-faq">
        <p className="kfs-kicker dark">Questions</p>
        <h2>Drivers ask this about the pump</h2>
        <div className="kfs-faq-list">
          {FAQS.map((item) => (
            <details key={item.q} className="kfs-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
