import type { Metadata } from "next";
import Link from "next/link";
import { TEAM } from "@/lib/station";
import { TeamCards } from "@/components/station/StationShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const CEO = TEAM[0];
const STAFF = TEAM.slice(1);

export const metadata: Metadata = pageMetadata({
  title: "Team",
  description:
    "Meet the team at Khurram Filling Station Gujranwala: CEO Khurram Iftikhar, manager Rashid, and forecourt manager Abdul Razaq.",
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
        <p>CEO, manager and forecourt: the team that runs Khurram Filling Station on the Sialkot Bypass.</p>
      </section>

      <section className="kfs-section kfs-ceo kfs-on-paper">
        <div>
          <p className="kfs-kicker dark">CEO message</p>
          <h2>{CEO.name}</h2>
          <p>{CEO.message}</p>
        </div>
        <div className="kfs-ceo-media">
          <img src={CEO.img} alt={`${CEO.name}, ${CEO.role} at Khurram Filling Station`} />
        </div>
      </section>

      <section className="kfs-section kfs-on-white">
        <p className="kfs-kicker dark">Our people</p>
        <h2>The team on site</h2>
        <p className="kfs-lead">Manager and forecourt, with the CEO: the people who run this pump every day.</p>
        <TeamCards showBio people={STAFF} />
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
