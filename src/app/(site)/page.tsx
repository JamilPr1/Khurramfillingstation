import type { Metadata } from "next";
import { StationHome } from "@/components/station/StationHome";
import { getFuelPrices } from "@/lib/fuelPrices";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, pageMetadata } from "@/lib/seo";

export const revalidate = 7200;

export const metadata: Metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default async function HomePage() {
  const prices = await getFuelPrices();
  return <StationHome prices={prices} />;
}
