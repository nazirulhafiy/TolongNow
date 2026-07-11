import type { AppLocation, Coordinates } from "@/types";

export const pilotAreas: AppLocation[] = [
  {
    slug: "melaka-tengah",
    name: "Melaka Tengah",
    district: "Melaka Tengah",
    state: "Melaka",
    coordinates: { latitude: 2.267295, longitude: 102.193774 },
    isPilot: true,
  },
  {
    slug: "alor-gajah",
    name: "Alor Gajah",
    district: "Alor Gajah",
    state: "Melaka",
    coordinates: { latitude: 2.352065, longitude: 102.115533 },
    isPilot: true,
  },
];

const demonstrationAreas: AppLocation[] = [{
  slug: "taman-sri-muda",
  name: "Taman Sri Muda",
  district: "Shah Alam",
  state: "Selangor",
  coordinates: { latitude: 3.0209, longitude: 101.5354 },
  isPilot: false,
}];

export function isInsidePilotArea(coordinates: Coordinates, radiusKm = 12): boolean {
  return pilotAreas.some((area) => {
    const lat = (coordinates.latitude - area.coordinates.latitude) * 111;
    const lon = (coordinates.longitude - area.coordinates.longitude) * 111 * Math.cos((coordinates.latitude * Math.PI) / 180);
    return Math.hypot(lat, lon) <= radiusKm;
  });
}

export function getPilotArea(slug: string): AppLocation | undefined {
  return [...pilotAreas, ...demonstrationAreas].find((area) => area.slug === slug);
}
