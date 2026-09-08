"use client";

import Link from "next/link";
import { STATION } from "@/lib/config";
import { Btn, Row, ScreenHeader, Section } from "@/components/ui";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

export default function StaffMorePage() {
  async function logout() {
    await fetch("/api/me?role=staff", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <>
      <ScreenHeader title="Staff" subtitle={STATION.address} />
      <div className="kfs-app-body">
        <div className="kfs-app-install">
          <h2>Download the staff app</h2>
          <p>Install Khurram Filling Station on this device for fill QR and redeem.</p>
          <InstallAppButton className="kfs-app-btn kfs-app-btn-primary" label="Download app" />
          <p id="ios-install">iPhone: Share → Add to Home Screen.</p>
        </div>
        <Section title="Station">
          <a href={`tel:${STATION.phoneTel}`}>
            <Row title="Call" sub={STATION.phone} />
          </a>
          <a href={`https://wa.me/${STATION.whatsapp}`} target="_blank" rel="noreferrer">
            <Row title="WhatsApp" sub={STATION.phone} />
          </a>
          <Row title="Hours" sub={STATION.hours} />
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
