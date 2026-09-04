"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Empty, formatWhen, Row, ScreenHeader, Section } from "@/components/ui";
import type { Feedback } from "@/lib/types";

export default function StaffFeedbackPage() {
  const [rows, setRows] = useState<Feedback[]>([]);
  const [avg, setAvg] = useState(0);

  function load() {
    fetch("/api/staff/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setRows(d.feedback || []);
        setAvg(d.stats?.avgRating || 0);
      });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <ScreenHeader
        title="Feedback"
        subtitle={rows.length ? `Average ${avg} · ${rows.length} notes` : "Customer visit ratings"}
      />
      <div className="kfs-app-body">
        <Section>
          {rows.length === 0 ? (
            <Empty>No feedback yet.</Empty>
          ) : (
            rows.map((f) => (
              <Row
                key={f.id}
                title={`${"★".repeat(f.stars)}  ${f.topic}`}
                sub={`${f.customerName} · ${formatWhen(f.at)}${f.comment ? ` · ${f.comment}` : ""}`}
              />
            ))
          )}
        </Section>
        <Link href="/staff/more" className="kfs-app-btn kfs-app-btn-ghost">
          Station &amp; sign out
        </Link>
      </div>
    </>
  );
}
