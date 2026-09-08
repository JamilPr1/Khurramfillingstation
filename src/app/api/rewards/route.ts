import { NextResponse } from "next/server";
import { withStore } from "@/lib/store";

export async function GET() {
  const data = await withStore((s) => ({
    rewards: s.settings.rewards,
    pointsPerLitre: s.settings.pointsPerLitre,
  }));
  return NextResponse.json(data);
}
