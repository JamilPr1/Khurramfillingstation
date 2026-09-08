import type { Metadata } from "next";
import Link from "next/link";
import { FUELS } from "@/lib/station";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Khurram Filling Station is an authorised PSO dealership opposite Garden Town, Gujranwala, open since 2015. Petrol, HSD diesel, Hi-Octane, mart, car wash and 24-hour pumps.",
  path: "/about",
});

const WHY = [
  {
    title: "PSO fuel on the bypass",
    text: "Petrol, HSD diesel and Hi-Octane from an authorised PSO dealership. Check the board at the pump for today’s rate.",
  },
  {
    title: "Cash and card",
    text: "Pay by cash or card. After you fill, staff can help with a receipt or the loyalty scan on your phone.",
  },
  {
    title: "Mart, wash and restrooms",
    text: "Shop Stop for snacks and essentials, a car wash, and restrooms at the same stop on the Sialkot Bypass.",
  },
  {
    title: "Lit forecourt at night",
    text: "The islands stay open and lit after dark. Staff keep the queue moving for cars, bikes and pickups.",
  },
  {
    title: "Open 24 hours",
    text: "Pumps run day and night, every day. Call or WhatsApp 0332-8119081 if you need directions to Garden Town.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <section className="kfs-page-head">
        <p className="kfs-kicker">About</p>
        <h1>Khurram Filling Station, Gujranwala</h1>
        <p>An authorised PSO dealership opposite Garden Town, open 24 hours since 2015.</p>
      </section>

      <section className="kfs-section kfs-about kfs-on-paper">
        <div>
          <p className="kfs-kicker dark">About us</p>
          <h2>A PSO dealership since 2015</h2>
          <p>
            Khurram Filling Station opened in 2015 as an authorised PSO dealership opposite Garden
            Town, Gujranwala. We sell petrol, HSD diesel and Hi-Octane, with a mart and car wash on
            site. The pumps stay open 24 hours for traffic on the Sialkot Bypass.
          </p>
          <div className="kfs-actions" style={{ marginTop: 28 }}>
            <Link href="/team" className="kfs-btn kfs-btn-navy">
              Meet the team
            </Link>
            <Link href="/visit" className="kfs-btn kfs-btn-line">
              Get directions
            </Link>
          </div>
        </div>
        <div className="kfs-about-media">
          <img
            src="/assets/photos/kfs-tanker.jpg?v=2"
            alt="Pakistan State Oil tanker at sunset"
          />
        </div>
      </section>

      <section className="kfs-section kfs-on-white">
        <p className="kfs-kicker dark">Our products &amp; facilities</p>
        <h2>Fuels, mart and car wash</h2>
        <p className="kfs-lead">
          Petrol, diesel and Hi-Octane, plus a shop and a wash. One stop on the Sialkot Bypass.
        </p>
        <div className="kfs-cards">
          {FUELS.map((f) => (
            <article className="kfs-card" key={f.title}>
              <img src={f.icon} alt="" />
              <h3>{f.title}</h3>
              <p>{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kfs-section kfs-on-paper">
        <p className="kfs-kicker dark">Why choose us</p>
        <h2>Why choose us?</h2>
        <p className="kfs-lead">
          An authorised PSO pump opposite Garden Town, open day and night, with staff on the
          forecourt.
        </p>
        <div className="kfs-why-grid">
          {WHY.map((item) => (
            <article className="kfs-why-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
