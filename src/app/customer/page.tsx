"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loading, Row, ScreenHeader, Section } from "@/components/ui";
import { VirtualCard } from "@/components/app/VirtualCard";
import type { LedgerEntry, PublicCustomer, RedeemRequest, Reward } from "@/lib/types";

type Home = {
  customer: PublicCustomer;
  ledger: LedgerEntry[];
  pending: RedeemRequest[];
  rewards: Reward[];
};

export default function CustomerHome() {
  const [data, setData] = useState<Home | null>(null);

  useEffect(() => {
    fetch("/api/customer/home")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.customer) {
          window.location.href = "/login";
          return;
        }
        setData(d);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  if (!data?.customer) return <Loading />;

  const last = data.ledger.find((l) => l.type === "earn");
  const next =
    data.rewards.find((r) => r.points > data.customer.points) ?? data.rewards[data.rewards.length - 1];
  const left = next ? Math.max(0, next.points - data.customer.points) : 0;
  const first = data.customer.name.split(" ")[0];

  return (
    <>
      <ScreenHeader title={`Hello, ${first}`} subtitle="Your PSO loyalty card" />
      <div className="kfs-app-body kfs-desk-split">
        <div>
          <VirtualCard customer={data.customer} compact />

          <div className="kfs-app-quick">
            {[
              { href: "/customer/scan", label: "Scan QR" },
              { href: "/customer/points", label: "Card" },
              { href: "/customer/feedback", label: "Feedback" },
            ].map((a) => (
              <Link key={a.href} href={a.href}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        <Section title="Activity">
          {last ? (
            <Row title="Last fill" sub={last.note} right={`+${last.points}`} />
          ) : (
            <Row title="Last fill" sub="Scan the cashier QR after you fill" />
          )}
          <Row
            title="Next reward"
            sub={next?.name || "Ask staff"}
            right={!next ? "" : left === 0 ? "Ready" : `${left} left`}
          />
          {data.pending.length ? (
            <Row
              title="Waiting at cashier"
              sub={data.pending.map((p) => p.rewardName).join(", ")}
              right="Pending"
            />
          ) : null}
        </Section>
      </div>
    </>
  );
}
