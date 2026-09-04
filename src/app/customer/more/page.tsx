"use client";

import Link from "next/link";
import { STATION } from "@/lib/config";
import { Btn, Row, ScreenHeader, Section } from "@/components/ui";
import { SocialIcons } from "@/components/landing/SocialIcons";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

export default function MorePage() {
  async function logout() {
    await fetch("/api/me?role=customer", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <>
      <ScreenHeader title="Station" subtitle={STATION.address} />
      <div className="kfs-app-body">
        <div className="kfs-app-install">
          <h2>Keep the app on this device</h2>
          <p>Download Khurram Filling Station so your loyalty card opens from the home screen.</p>
          <InstallAppButton className="kfs-app-btn kfs-app-btn-primary" label="Download app" />
          <p id="ios-install">iPhone: Share → Add to Home Screen.</p>
        </div>
        <Section>
          <a href={`tel:${STATION.phoneTel}`}>
            <Row title="Call" sub={STATION.phone} />
          </a>
          <a href={`mailto:${STATION.email}`}>
            <Row title="Email" sub={STATION.email} />
          </a>
          <a href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
            <Row title="WhatsApp" sub={STATION.phone} />
          </a>
          <a href={STATION.maps} target="_blank" rel="noreferrer">
            <Row title="Directions" sub="Open in Google Maps" />
          </a>
          <Row title="Hours" sub={STATION.hours} />
        </Section>
        <Section>
          <p style={{ margin: "0 0 10px", fontWeight: 700 }}>Social</p>
          <SocialIcons />
        </Section>
        <Link href="/" className="kfs-app-btn kfs-app-btn-ghost mb-3">
          Open website
        </Link>
        <Btn tone="ghost" onClick={logout}>
          Sign out
        </Btn>
      </div>
    </>
  );
}
