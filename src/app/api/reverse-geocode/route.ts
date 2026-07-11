import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reverseGeocodeMalaysia } from "@/lib/providers/geocoding";

const coordinatesSchema = z.object({
  lat: z.coerce.number().min(-1).max(8),
  lng: z.coerce.number().min(99).max(120),
});

export async function GET(request: NextRequest) {
  const parsed = coordinatesSchema.safeParse({
    lat: request.nextUrl.searchParams.get("lat"),
    lng: request.nextUrl.searchParams.get("lng"),
  });
  if (!parsed.success) return NextResponse.json({ error: "Enter valid Malaysian coordinates." }, { status: 400 });
  try {
    const result = await reverseGeocodeMalaysia({ latitude: parsed.data.lat, longitude: parsed.data.lng });
    if (!result) return NextResponse.json({ error: "No Malaysian area was found for this location." }, { status: 404 });
    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Location lookup is temporarily unavailable." }, { status: 503 });
  }
}
