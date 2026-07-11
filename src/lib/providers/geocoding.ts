import { z } from "zod";
import type { Coordinates } from "@/types";

const addressSchema = z.object({
  country_code: z.string().optional(),
  city: z.string().optional(),
  town: z.string().optional(),
  municipality: z.string().optional(),
  state_district: z.string().optional(),
  county: z.string().optional(),
  district: z.string().optional(),
  suburb: z.string().optional(),
  village: z.string().optional(),
  postcode: z.string().optional(),
  state: z.string().optional(),
}).passthrough();

const coordinateString = z.string().refine((value) => Number.isFinite(Number(value)), "Invalid coordinate");

const placeSchema = z.object({
  place_id: z.number(),
  lat: coordinateString,
  lon: coordinateString,
  display_name: z.string(),
  address: addressSchema.optional(),
});

const resultSchema = z.array(placeSchema);

export type GeocodeResult = { id: string; name: string; latitude: number; longitude: number; district?: string; state?: string };

export function malaysiaOnly(items: GeocodeResult[], latitudeRange: [number, number] = [-1, 8], longitudeRange: [number, number] = [99, 120]): GeocodeResult[] {
  return items.filter((item) => item.latitude >= latitudeRange[0] && item.latitude <= latitudeRange[1]
    && item.longitude >= longitudeRange[0] && item.longitude <= longitudeRange[1]
    && !(item.latitude >= 1.1 && item.latitude <= 1.5 && item.longitude >= 103.55 && item.longitude <= 104.1));
}

export async function geocodeMalaysia(query: string): Promise<GeocodeResult[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("countrycodes", "my");
    url.searchParams.set("limit", "5");
    url.searchParams.set("accept-language", "ms-MY,ms,en");
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "TolongNow/1.0 (https://pasarapi.xyz/)" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Geocoding returned ${response.status}`);
    const parsed = resultSchema.parse(await response.json());
    return malaysiaOnly(parsed.filter(isMalaysianPlace).map(normalizePlace));
  } finally {
    clearTimeout(timeout);
  }
}

export async function reverseGeocodeMalaysia(coordinates: Coordinates): Promise<GeocodeResult | undefined> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(coordinates.latitude));
    url.searchParams.set("lon", String(coordinates.longitude));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "14");
    url.searchParams.set("accept-language", "ms-MY,ms,en");
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": process.env.NOMINATIM_USER_AGENT ?? "TolongNow/1.0 (https://pasarapi.xyz/)" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Reverse geocoding returned ${response.status}`);
    const parsed = placeSchema.parse(await response.json());
    if (!isMalaysianPlace(parsed)) return undefined;
    return malaysiaOnly([normalizePlace(parsed)])[0];
  } finally {
    clearTimeout(timeout);
  }
}

function isMalaysianPlace(place: z.infer<typeof placeSchema>): boolean {
  return !place.address?.country_code || place.address.country_code.toLowerCase() === "my";
}

function normalizePlace(place: z.infer<typeof placeSchema>): GeocodeResult {
  const address = place.address;
  return {
    id: String(place.place_id),
    name: place.display_name,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
    district: address?.state_district ?? address?.county ?? address?.district ?? address?.city ?? address?.town ?? address?.municipality,
    state: address?.state,
  };
}
