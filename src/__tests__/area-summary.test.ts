import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildAreaSummary } from "@/lib/area-summary";

const { getForecast, getWeatherWarnings, getNearbyActiveJkmPps } = vi.hoisted(() => ({
  getForecast: vi.fn(), getWeatherWarnings: vi.fn(), getNearbyActiveJkmPps: vi.fn(),
}));
vi.mock("@/lib/providers/weather", () => ({ getForecast, getWeatherWarnings }));
vi.mock("@/lib/providers/jkm-pps", () => ({ getNearbyActiveJkmPps }));
const outside = { slug: "georgetown", name: "George Town", state: "Pulau Pinang", coordinates: { latitude: 5.4141, longitude: 100.3288 }, isPilot: false };

describe("area summary resilience", () => {
  beforeEach(() => { vi.clearAllMocks(); getForecast.mockResolvedValue([]); getWeatherWarnings.mockResolvedValue([]); getNearbyActiveJkmPps.mockResolvedValue([]); });
  it("returns partial results when one API fails", async () => {
    getForecast.mockRejectedValue(new Error("timeout"));
    const result = await buildAreaSummary(outside);
    expect(result.dataAvailability.forecast.available).toBe(false);
    expect(result.dataAvailability.warnings.available).toBe(true);
    expect(result.mode).toBe("live");
  });
  it("uses an explicit no-nearby-centres message", async () => {
    const result = await buildAreaSummary(outside);
    expect(result.nearbyPps).toEqual([]);
    expect(result.dataAvailability.pps.message).toContain("within 15 km");
  });
  it("keeps other results when the JKM provider fails", async () => {
    getNearbyActiveJkmPps.mockRejectedValue(new Error("timeout"));
    const result = await buildAreaSummary(outside);
    expect(result.dataAvailability.pps.available).toBe(false);
    expect(result.dataAvailability.pps.message).toContain("temporarily unavailable");
  });
  it("does not present unrelated nationwide-feed warnings as local", async () => {
    getWeatherWarnings.mockResolvedValue([
      { id: "sea", title: "Rough seas", description: "Waters of Sabah", affectedAreas: [], officialProvider: "MET", sourceUrl: "x", pasarApiEntryId: "weather/warning" },
      { id: "local-marine", title: "Thunderstorm", description: "Expected over the waters of Pulau Pinang", affectedAreas: [], officialProvider: "MET", sourceUrl: "x", pasarApiEntryId: "weather/warning" },
      { id: "local", title: "Thunderstorm", description: "Expected in Pulau Pinang", affectedAreas: [], officialProvider: "MET", sourceUrl: "x", pasarApiEntryId: "weather/warning" },
    ]);
    const result = await buildAreaSummary(outside);
    expect(result.weatherWarnings.map((warning) => warning.id)).toEqual(["local-marine", "local"]);
  });
});
