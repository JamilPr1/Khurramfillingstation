"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STATION } from "@/lib/config";
import { FUELS } from "@/lib/station";
import { isStandalonePwa } from "@/components/pwa/PwaRegister";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { TeamCards } from "@/components/station/StationShell";
import { HeroSlider } from "@/components/station/HeroSlider";
import { LogoCarousel } from "@/components/station/LogoCarousel";
import { ContactForm } from "@/components/station/ContactForm";
import { FuelPrices } from "@/components/station/FuelPrices";
import type { FuelPriceBoard } from "@/lib/fuelPriceBoard";

export function StationHome({ prices }: { prices: FuelPriceBoard }) {
  const router = useRouter();

  useEffect(() => {
    if (isStandalonePwa()) router.replace("/login");
  }, [router]);

  return (
    <>
      <section className="kfs-hero" id="top">
        <div className="kfs-hero-copy">
          <p className="kfs-kicker">Gujranwala · Sialkot Bypass</p>
          <h1>Khurram Filling Station</h1>
          <p className="kfs-hero-tag">Drive better. Go further.</p>
          <p>
            24-hour PSO petrol pump opposite Garden Town — petrol, HSD diesel and Hi-Octane,
            plus a loyalty card on your phone.
          </p>
          <div className="kfs-actions">
            <a className="kfs-btn kfs-btn-yellow" href={`tel:${STATION.phoneTel}`}>
              Call {STATION.phone}
            </a>
            <a className="kfs-btn kfs-btn-ghost" href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="kfs-btn kfs-btn-ghost" href={STATION.maps} target="_blank" rel="noreferrer">
              Open in Maps
            </a>
            <InstallAppButton className="kfs-btn kfs-btn-navy" label="Download app" />
          </div>
        </div>
        <HeroSlider />
      </section>

      <section className="kfs-strip">
        <div>
          <strong>24/7</strong>
          <span>Pumps open</span>
        </div>
        <div>
          <strong>Petrol · HSD · Hi-Octane</strong>
          <span>Fuel on site</span>
        </div>
        <div>
          <strong>Quality. Service. Trust.</strong>
          <span>At the pump</span>
        </div>
        <div>
          <strong>Garden Town</strong>
          <span>Sialkot Bypass</span>
        </div>
      </section>

      <FuelPrices prices={prices} variant="white" />

      <LogoCarousel />

      <section className="kfs-section kfs-on-white">
        <p className="kfs-kicker dark">Our people</p>
        <h2>The team at this station</h2>
        <p className="kfs-lead">Owner, manager and forecourt — the people who run Khurram Filling Station.</p>
        <TeamCards />
        <div className="kfs-actions" style={{ marginTop: 28 }}>
          <Link href="/team" className="kfs-btn kfs-btn-navy">
            Meet the team
          </Link>
          <Link href="/about" className="kfs-btn kfs-btn-line">
            About the station
          </Link>
        </div>
      </section>

      <section className="kfs-section kfs-fuels kfs-on-paper">
        <p className="kfs-kicker dark">What we offer</p>
        <h2>Fuels and services</h2>
        <p className="kfs-lead">Petrol, diesel and Hi-Octane at one stop on the Sialkot Bypass.</p>
        <div className="kfs-cards">
          {FUELS.map((f) => (
            <article className="kfs-card" key={f.title}>
              <img src={f.icon} alt="" />
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
        <div className="kfs-actions" style={{ marginTop: 28 }}>
          <Link href="/visit" className="kfs-btn kfs-btn-navy">
            Visit us
          </Link>
        </div>
      </section>

      <section className="kfs-section kfs-nap kfs-on-white">
        <div>
          <p className="kfs-kicker dark">Visit</p>
          <h2>Opposite Garden Town, Gujranwala</h2>
          <p className="kfs-lead">{STATION.address}. Open {STATION.hours}.</p>
          <p className="kfs-lead">
            Mobile <a href={`tel:${STATION.phoneTel}`}>{STATION.phone}</a>
            {" · "}
            <a href={`mailto:${STATION.email}`}>{STATION.email}</a>
          </p>
          <div className="kfs-actions" style={{ marginTop: 22 }}>
            <Link href="/visit" className="kfs-btn kfs-btn-navy">
              Directions &amp; map
            </Link>
            <a className="kfs-btn kfs-btn-line" href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
        <div className="kfs-nap-media">
          <img
            src="/assets/photos/kfs-night-forecourt.jpg?v=1"
            alt="Khurram Filling Station PSO pumps and Shop Stop at night on Sialkot Bypass, Gujranwala"
          />
        </div>
      </section>

      <div className="kfs-band-wrap kfs-on-paper">
      <div className="kfs-band">
        <section className="kfs-cta">
          <div className="kfs-cta-inner">
            <h2>Fueling your journey</h2>
            <p>Call the pump, or open the loyalty app after you fill.</p>
            <div className="kfs-actions">
              <a className="kfs-btn kfs-btn-yellow" href={`tel:${STATION.phoneTel}`}>
                Call {STATION.phone}
              </a>
              <Link href="/loyalty" className="kfs-btn kfs-btn-line">
                Loyalty program
              </Link>
              <Link href="/login" className="kfs-btn kfs-btn-line">
                Login
              </Link>
              <InstallAppButton className="kfs-btn kfs-btn-line" label="Download app" />
            </div>
            <p id="ios-install" className="kfs-cta-hint">
              iPhone: Share → Add to Home Screen. Chrome: tap Download app or Install in the address bar.
            </p>
          </div>
        </section>
        <ContactForm />
      </div>
      </div>
    </>
  );
}
