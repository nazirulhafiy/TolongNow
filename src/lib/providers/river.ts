import { z } from "zod";
import type { Coordinates, RiverStation, RiverTrend } from "@/types";
import { distanceKm } from "@/lib/distance";
import { normalizeRiverStatus } from "@/lib/status";
import { isStale } from "@/lib/timestamps";

const ENDPOINT = "https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/latestreadingstrendabc.json";
const value = z.union([z.string(), z.number(), z.null()]).optional();
const feedSchema = z.array(z.object({ a: value, b: value, c: value, d: value, e: value, f: value, m: value, n: value, o: value, q: value, s: value, u: value, w: value, y: value, gg: value, hh: value }).passthrough());
const text = (input: string | number | null | undefined) => input == null ? undefined : String(input).trim() || undefined;
const number = (input: string | number | null | undefined) => { if (input === null || input === undefined || input === "") return undefined; const parsed = Number(input); return Number.isFinite(parsed) ? parsed : undefined; };
const trend = (input?: string): RiverTrend => { const normalized = input?.toLowerCase(); if (normalized === "rising") return "rising"; if (normalized === "receding" || normalized === "falling") return "falling"; if (normalized === "no change" || normalized === "steady") return "steady"; return "unknown"; };
const timestamp = (input?: string) => { if (!input) return undefined; const match = input.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})$/); return match ? `${match[3]}-${match[2]}-${match[1]}T${match[4]}:00+08:00` : undefined; };

export async function getNearbyRiverStations(coordinates: Coordinates, maxDistanceKm = 35): Promise<RiverStation[]> {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(ENDPOINT, { signal: controller.signal, next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`River provider returned ${response.status}`);
    const rows = feedSchema.parse(await response.json());
    return rows.flatMap((row): RiverStation[] => {
      const latitude = number(row.c), longitude = number(row.d);
      if (latitude === undefined || longitude === undefined) return [];
      const stationCoordinates = { latitude, longitude };
      const observedAt = timestamp(text(row.q));
      const distance = distanceKm(coordinates, stationCoordinates);
      const waterLevel = number(row.m);
      if (distance === undefined || distance > maxDistanceKm || isStale(observedAt, 180) || text(row.gg)?.toUpperCase() !== "ON" || waterLevel === undefined || waterLevel < -100) return [];
      return [{ id: text(row.a) ?? `${latitude}-${longitude}`, name: text(row.b) ?? "Unnamed JPS station", district: text(row.e), state: text(row.f), coordinates: stationCoordinates, waterLevel, status: normalizeRiverStatus(text(row.n)), statusThreshold: number(row.o), trend: trend(text(row.s)), observedAt, officialProvider: "Department of Irrigation and Drainage Malaysia (JPS)", sourceUrl: "https://publicinfobanjir.water.gov.my/", pasarApiEntryId: "flood-warning", isStale: false }];
    }).sort((a, b) => (distanceKm(coordinates, a.coordinates) ?? 999) - (distanceKm(coordinates, b.coordinates) ?? 999)).slice(0, 5);
  } finally { clearTimeout(timeout); }
}
