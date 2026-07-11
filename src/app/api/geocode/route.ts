import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { geocodeMalaysia } from "@/lib/providers/geocoding";

const querySchema = z.string().trim().min(2).max(120);

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(request.nextUrl.searchParams.get("q"));
  if (!parsed.success) return NextResponse.json({ error: "Enter at least two characters." }, { status: 400 });
  try {
    return NextResponse.json({ results: await geocodeMalaysia(parsed.data) });
  } catch {
    return NextResponse.json({ error: "Location search is temporarily unavailable." }, { status: 503 });
  }
}
