"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { STATION } from "@/lib/config";
import { NAV, TEAM } from "@/lib/station";
import { SocialIcons } from "@/components/landing/SocialIcons";
import { Testimonials } from "@/components/station/Testimonials";
import "@/app/station.css";

export function StationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  return (
    <div className="kfs">
      <a className="kfs-skip" href="#main">
        Skip to content
      </a>
      <div className="kfs-top">
        <span>24/7 pumps · {STATION.address}</span>
        <div className="kfs-top-right">
          <SocialIcons className="kfs-top-social" />
          <a href={`tel:${STATION.phoneTel}`}>Call {STATION.phone}</a>
          <a className="kfs-top-email" href={`mailto:${STATION.email}`}>
            {STATION.email}
          </a>
        </div>
      </div>

      <header className="kfs-nav">
        <Link href="/" className="kfs-logo" onClick={() => setMenu(false)}>
          <img src="/assets/logos/logo-horizontal.png" alt="Khurram Filling Station PSO Gujranwala" />
        </Link>
        <button
          className="kfs-burger"
          type="button"
          onClick={() => setMenu((v) => !v)}
          aria-label="Menu"
          aria-expanded={menu}
          aria-controls="kfs-menu"
        >
          Menu
        </button>
        <nav id="kfs-menu" className={menu ? "open" : ""}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setMenu(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="kfs-btn kfs-btn-navy" onClick={() => setMenu(false)}>
            Login
          </Link>
          <a className="kfs-btn kfs-btn-yellow" href={`tel:${STATION.phoneTel}`}>
            Call
          </a>
        </nav>
      </header>

      <main id="main">{children}</main>

      <Testimonials className={pathname === "/" ? "kfs-on-white" : undefined} />

      <img className="kfs-swoosh" src="/assets/extras/swoosh.svg" alt="" />
      <footer className="kfs-foot">
        <div className="kfs-foot-grid">
          <div className="kfs-foot-brand">
            <div className="kfs-foot-logo">
              <img src="/assets/logos/logo-horizontal.png" alt={STATION.name} />
            </div>
            <p>{STATION.address}</p>
            <p>Open {STATION.hours}</p>
            <SocialIcons />
          </div>

          <nav className="kfs-foot-col" aria-label="Footer menu">
            <h3>Menu</h3>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/login">Login</Link>
          </nav>

          <div className="kfs-foot-col">
            <h3>Contact</h3>
            <a href={`tel:${STATION.phoneTel}`}>Mobile {STATION.phone}</a>
            <a href={`mailto:${STATION.email}`}>{STATION.email}</a>
            <a href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
              WhatsApp {STATION.phone}
            </a>
            <a href={STATION.maps} target="_blank" rel="noreferrer">
              Google Maps
            </a>
          </div>
        </div>
        <div className="kfs-foot-bar">
          <p>© {new Date().getFullYear()} {STATION.name}</p>
          <p>Petrol · Diesel · Hi-Octane · Sialkot Bypass, Gujranwala</p>
        </div>
      </footer>
    </div>
  );
}

export function TeamCards({
  showBio = false,
  people = TEAM,
}: {
  showBio?: boolean;
  people?: typeof TEAM;
}) {
  return (
    <div className={`kfs-team-grid${people.length === 2 ? " is-two" : ""}`}>
      {people.map((m) => (
        <article className="kfs-team-card" key={m.name}>
          <div className="kfs-team-pic">
            <img src={m.img} alt={`${m.name}, ${m.role} at Khurram Filling Station`} />
          </div>
          <h3>{m.name}</h3>
          <p className="kfs-team-role">{m.role}</p>
          {showBio ? <p className="kfs-team-bio">{m.bio}</p> : null}
        </article>
      ))}
    </div>
  );
}
