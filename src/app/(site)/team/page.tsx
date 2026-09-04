import type { Metadata } from "next";
import Link from "next/link";
import { TeamCards } from "@/components/station/StationShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Team",
  description:
    "Meet the team at Khurram Filling Station Gujranwala: owner Khurram Iftikhar, manager Rashid, and forecourt manager Abdulrazaq.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Team", path: "/team" },
        ])}
      />
      <section className="kfs-page-head">
        <p className="kfs-kicker">Team</p>
        <h1>The people at this station</h1>
        <p>Owner, manager and forecourt — the team that runs Khurram Filling Station on the Sialkot Bypass.</p>
      </section>

      <section className="kfs-section">
        <TeamCards showBio />
        <div className="kfs-actions" style={{ marginTop: 36 }}>
          <Link href="/visit" className="kfs-btn kfs-btn-navy">
            Visit us
          </Link>
          <Link href="/about" className="kfs-btn kfs-btn-line">
            About the station
          </Link>
        </div>
      </section>
    </>
  );
}
