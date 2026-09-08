"use client";

import Link from "next/link";
import { STATION } from "@/lib/config";
import { Btn, Row, ScreenHeader, Section } from "@/components/ui";

export default function AdminMorePage() {
  async function logout() {
    await fetch("/api/me?role=admin", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <>
      <ScreenHeader title="Admin" subtitle={STATION.email} />
      <div className="kfs-app-body">
        <Section title="Station">
          <Row title="Email" sub={STATION.email} />
          <Row title="Mobile" sub={STATION.phone} />
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
