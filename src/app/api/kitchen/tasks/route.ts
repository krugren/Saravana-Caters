import { NextRequest, NextResponse } from "next/server";
import { getKitchenTasksForPlan } from "@/features/kitchen/actions";
import { auth } from "@/lib/auth";

// SEC-05: Added session check — unauthenticated callers receive 401
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planId = req.nextUrl.searchParams.get("planId");
  if (!planId) return NextResponse.json({ error: "planId required" }, { status: 400 });

  const tasks = await getKitchenTasksForPlan(planId);
  return NextResponse.json(tasks);
}
