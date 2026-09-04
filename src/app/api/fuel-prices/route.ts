import { NextResponse } from "next/server";
import { getFuelPrices } from "@/lib/fuelPrices";

export const revalidate = 7200;

export async function GET() {
  const prices = await getFuelPrices();
  return NextResponse.json(prices);
}
