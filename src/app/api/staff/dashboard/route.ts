import { NextResponse } from "next/server";
import { requireStaff, unauthorized } from "@/lib/auth";
import { withStore } from "@/lib/store";

export async function GET() {
  try {
    await requireStaff();
    const data = await withStore((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const fillsToday = s.fills.filter((f) => f.createdAt.slice(0, 10) === today);
      const feedback = s.feedback.slice(0, 40);
      const avg =
        feedback.length === 0
          ? 0
          : Math.round((feedback.reduce((n, f) => n + f.stars, 0) / feedback.length) * 10) / 10;
      return {
        pendingRedeems: s.redeems.filter((r) => r.status === "pending"),
        recentFills: s.fills.slice(0, 20),
        feedback,
        stats: {
          fillsToday: fillsToday.length,
          usedToday: fillsToday.filter((f) => f.usedAt).length,
          pointsToday: fillsToday.filter((f) => f.usedAt).reduce((n, f) => n + f.points, 0),
          avgRating: avg,
          feedbackCount: s.feedback.length,
        },
      };
    });
    return NextResponse.json(data);
  } catch {
    return unauthorized();
  }
}
