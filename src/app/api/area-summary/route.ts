import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildAreaSummary } from "@/lib/area-summary";
import { isInsidePilotArea } from "@/config/pilot-areas";

const querySchema = z.object({
  lat: z.coerce.number().min(-1).max(8),
  lng: z.coerce.number().min(99).max(120),
  name: z.string().trim().min(1).max(160).default("Selected location"),
});

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid Malaysian location." }, { status: 400 });
  const coordinates = { latitude: parsed.data.lat, longitude: parsed.data.lng };
  const summary = await buildAreaSummary({ slug: "selected-location", name: parsed.data.name, state: "Malaysia", coordinates, isPilot: isInsidePilotArea(coordinates) });
  return NextResponse.json(summary);
}
