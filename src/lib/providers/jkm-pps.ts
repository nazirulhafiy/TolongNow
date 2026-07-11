import { z } from "zod";
import { sortPpsByDistance } from "@/lib/distance";
import type { Coordinates, PpsLocation } from "@/types";

export const JKM_ACTIVE_PPS_ENDPOINT = "https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=1";
export const JKM_ACTIVE_PPS_PAGE = "https://infobencanajkmv2.jkm.gov.my/landing/index.php?a=0&b=1";

const pointSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().trim().min(1),
  latti: z.coerce.number().min(-90).max(90),
  longi: z.coerce.number().min(-180).max(180),
  negeri: z.string().trim().min(1),
  daerah: z.string().trim().min(1),
  mukim: z.string().trim().optional().default(""),
  bencana: z.string().trim().min(1),
  mangsa: z.coerce.number().int().nonnegative(),
  keluarga: z.coerce.number().int().nonnegative(),
  kapasiti: z.coerce.number().nonnegative(),
});

const responseSchema = z.object({ points: z.array(pointSchema).max(500) });

export async function getNearbyActiveJkmPps(coordinates: Coordinates, maxDistanceKm = 15, limit = 3): Promise<PpsLocation[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(JKM_ACTIVE_PPS_ENDPOINT, {
      signal: controller.signal,
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`JKM provider returned ${response.status}`);
    const { points } = responseSchema.parse(await response.json());
    const retrievedAt = new Date().toISOString();
    const centres = points
      .filter((point) => point.bencana.toLowerCase() === "banjir")
      .map((point): PpsLocation => ({
        id: `jkm-${point.id}`,
        name: titleCase(point.name),
        address: [titleCase(point.mukim), titleCase(point.daerah), point.negeri].filter(Boolean).join(", "),
        district: titleCase(point.daerah),
        state: point.negeri,
        latitude: point.latti,
        longitude: point.longi,
        status: "active",
        sourceTitle: "Official JKM InfoBencana active PPS listing",
        sourceUrl: JKM_ACTIVE_PPS_PAGE,
        lastVerifiedAt: retrievedAt,
        victimCount: point.mangsa,
        familyCount: point.keluarga,
        capacityPercent: point.kapasiti,
        notes: "Current official JKM listing retrieved server-side. Confirm operating status before travelling.",
      }));
    return sortPpsByDistance(centres, coordinates)
      .filter((centre) => (centre.distanceKm ?? Number.POSITIVE_INFINITY) <= maxDistanceKm)
      .slice(0, limit);
  } finally {
    clearTimeout(timeout);
  }
}

function titleCase(value: string): string {
  return value
    .toLocaleLowerCase("en-MY")
    .replace(/(^|[\s/-])\p{L}/gu, (letter) => letter.toLocaleUpperCase("en-MY"))
    .replace(/\b(Japerun|Perkim)\b/g, (acronym) => acronym.toUpperCase());
}
