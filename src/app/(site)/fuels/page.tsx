import type { Metadata } from "next";
import Link from "next/link";
import { FUELS } from "@/lib/station";
import { STATION } from "@/lib/config";
import { JsonLd } from "@/components/seo/JsonLd";
import { FuelPrices } from "@/components/station/FuelPrices";
import { getFuelPrices } from "@/lib/fuelPrices";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Petrol, Diesel & Hi-Octane",
  description:
    "Petrol, HSD diesel and Hi-Octane at Khurram Filling Station, the 24-hour PSO pump on Sialkot Bypass Road, Gujranwala. Mart and car wash on site.",
  path: "/fuels",
  index: false,
});

export const revalidate = 7200;

export default async function FuelsPage() {
  const prices = await getFuelPrices();
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fuels", path: "/fuels" },
        ])}
      />
      <section className="kfs-page-head">
        <p className="kfs-kicker">Fuels</p>
        <h1>Petrol, diesel and Hi-Octane in Gujranwala</h1>
        <p>24-hour PSO fuels on Sialkot Bypass Road, plus mart and car wash at the same stop.</p>
      </section>

      <FuelPrices prices={prices} variant="paper" />

      <section className="kfs-section kfs-fuels kfs-on-white">
        <div className="kfs-cards">
          {FUELS.map((f) => (
            <article className="kfs-card" key={f.title}>
              <img src={f.icon} alt="" />
              <h3>{f.title}</h3>
              <p>{f.detail}</p>
            </article>
          ))}
        </div>
        <div className="kfs-actions" style={{ marginTop: 36 }}>
          <a className="kfs-btn kfs-btn-navy" href={`tel:${STATION.phoneTel}`}>
            Call to confirm
          </a>
          <Link href="/visit" className="kfs-btn kfs-btn-line">
            Visit the pump
          </Link>
        </div>
      </section>
    </>
  );
}
