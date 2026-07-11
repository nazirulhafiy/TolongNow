import type { Coordinates, PpsLocation } from "@/types";

const EARTH_RADIUS_KM = 6371;
const radians = (degrees: number) => (degrees * Math.PI) / 180;

export function distanceKm(from?: Coordinates, to?: Coordinates): number | undefined {
  if (!from || !to) return undefined;
  const dLat = radians(to.latitude - from.latitude);
  const dLon = radians(to.longitude - from.longitude);
  const lat1 = radians(from.latitude);
  const lat2 = radians(to.latitude);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function sortPpsByDistance(items: PpsLocation[], from?: Coordinates): PpsLocation[] {
  return items.map((item) => ({
    ...item,
    distanceKm: distanceKm(from, { latitude: item.latitude, longitude: item.longitude }),
  })).sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
}
