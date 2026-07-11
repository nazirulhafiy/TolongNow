import type { AreaSummary } from "@/types";
import { ppsSelangorPilot } from "@/data/pps-selangor-pilot";

export const sriMudaDemonstration: AreaSummary = {
  location: {
    slug: "taman-sri-muda",
    name: "Taman Sri Muda",
    district: "Shah Alam",
    state: "Selangor",
    coordinates: { latitude: 3.0209, longitude: 101.5354 },
    isPilot: true,
  },
  nearbyRiverStations: [{
    id: "demo-river-1",
    name: "Demonstration river station",
    district: "Shah Alam",
    state: "Selangor",
    coordinates: { latitude: 3.024, longitude: 101.542 },
    waterLevel: 4.8,
    status: "warning",
    trend: "rising",
    observedAt: "2021-12-18T10:00:00+08:00",
    officialProvider: "Historical demonstration fixture",
    sourceUrl: "/data-sources",
  }],
  weatherWarnings: [{
    id: "demo-warning-1",
    title: "Demonstration heavy rain warning",
    description: "Historical scenario text created to demonstrate the interface. This is not a current MET Malaysia warning.",
    affectedAreas: ["Shah Alam"],
    issuedAt: "2021-12-18T08:00:00+08:00",
    validFrom: "2021-12-18T08:00:00+08:00",
    validUntil: "2021-12-19T08:00:00+08:00",
    officialProvider: "TolongNow demonstration fixture",
    sourceUrl: "/data-sources",
    pasarApiEntryId: "demonstration-only",
  }],
  forecast: [],
  nearbyPps: ppsSelangorPilot.map((pps, index) => ({ ...pps, distanceKm: 12 + index * 2 })),
  retrievedAt: "2021-12-18T10:00:00+08:00",
  dataAvailability: {
    river: { available: true }, warnings: { available: true },
    forecast: { available: false, message: "Not included in the historical scenario." },
    pps: { available: true },
  },
  mode: "demonstration",
};
