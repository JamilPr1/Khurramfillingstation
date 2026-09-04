"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loading, Row, ScreenHeader, Section } from "@/components/ui";
import type { Customer, LedgerEntry, RedeemRequest, Reward } from "@/lib/types";

type Home = {
  customer: Customer;
  ledger: LedgerEntry[];
  pending: RedeemRequest[];
  rewards: Reward[];
};

export default function CustomerHome() {
  const [data, setData] = useState<Home | null>(null);

  useEffect(() => {
    fetch("/api/customer/home")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data?.customer) return <Loading />;

  const last = data.ledger.find((l) => l.type === "earn");
  const next =
    data.rewards.find((r) => r.points > data.customer.points) ?? data.rewards[data.rewards.length - 1];
  const left = Math.max(0, next.points - data.customer.points);
  const first = data.customer.name.split(" ")[0];

  return (
    <>
      <ScreenHeader
        title={`Hello, ${first}`}
        subtitle={`${data.customer.points.toLocaleString()} points`}
      />
      <div className="kfs-app-body">
        <div className="kfs-app-balance">
          <p className="text-xs font-medium text-[#c9d2e0]">Point balance</p>
          <strong>{data.customer.points.toLocaleString()}</strong>
          <p className="mt-1 text-sm text-[#c9d2e0]">
            {left === 0 ? `Ready to redeem ${next.name}` : `${left} points to ${next.name}`}
          </p>
        </div>

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

        <Section title="Activity">
          {last ? (
            <Row title="Last fill" sub={last.note} right={`+${last.points}`} />
          ) : (
            <Row title="Last fill" sub="Scan the cashier QR after you fill" />
          )}
          <Row title="Next reward" sub={next.name} right={left === 0 ? "Ready" : `${left} left`} />
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
