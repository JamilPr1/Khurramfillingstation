import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "About Khurram Filling Station, the 24-hour PSO petrol pump opposite Garden Town on Sialkot Bypass Road, Gujranwala. Owner-run pumps, mart, car wash and loyalty.",
  path: "/about",
});

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
        <p>
          A 24-hour PSO petrol pump on Sialkot Bypass Road, opposite Garden Town — petrol, diesel
          and Hi-Octane with a team that stays at the pump.
        </p>
      </section>

      <section className="kfs-section kfs-about">
        <div>
          <p className="kfs-kicker dark">Who we are</p>
          <h2>Fuel, service and a team that stays at the pump</h2>
          <p>
            Khurram Filling Station is a Pakistan State Oil (PSO) filling station in Gujranwala.
            Drivers on the Sialkot Bypass stop here for a clean fill of petrol, HSD diesel or
            Hi-Octane, then pick up shop items or a wash without leaving the site.
          </p>
          <p>
            The pump is owner-run by Khurram Iftikhar, with a manager and forecourt team on site
            around the clock. After you fill, scan the cashier QR in the loyalty app to earn 1
            point per litre.
          </p>
          <ul className="kfs-checks">
            <li>Opposite Garden Town, easy to find on Google Maps</li>
            <li>Petrol, HSD diesel and Hi-Octane, 24 hours</li>
            <li>Mart, car wash, and a cashier loyalty QR</li>
            <li>Owner-run, with a manager and forecourt team on site</li>
          </ul>
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
    </>
  );
}
