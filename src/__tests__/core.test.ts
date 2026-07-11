import { describe, expect, it } from "vitest";
import { distanceKm, sortPpsByDistance } from "@/lib/distance";
import { isInsidePilotArea } from "@/config/pilot-areas";
import { isStale } from "@/lib/timestamps";
import { isWarningCurrentlyValid, normalizeRiverStatus, ppsStatusLabels } from "@/lib/status";
import { malaysiaOnly } from "@/lib/providers/geocoding";
import { dataSources, productionApiCount, productionDataSources } from "@/config/data-sources";
import { ppsSelangorPilot } from "@/data/pps-selangor-pilot";
import { sriMudaDemonstration } from "@/data/demo-scenarios/sri-muda-2021";
import { en } from "@/i18n/en";
import { ms } from "@/i18n/ms";

describe("distance and PPS ranking", () => {
  it("calculates known straight-line distance", () => {
    const km = distanceKm({ latitude: 3.0209, longitude: 101.5354 }, { latitude: 3.0877, longitude: 101.7952 });
    expect(km).toBeGreaterThan(25);
    expect(km).toBeLessThan(30);
  });
  it("handles missing coordinates", () => expect(distanceKm(undefined, { latitude: 3, longitude: 101 })).toBeUndefined());
  it("sorts PPS by distance without mutating the source", () => {
    const reversed = [...ppsSelangorPilot].reverse();
    const sorted = sortPpsByDistance(reversed, { latitude: 3.0877, longitude: 101.7952 });
    expect(sorted[0].id).toBe("pps-sk-sungai-serai");
    expect(reversed).toEqual([...ppsSelangorPilot].reverse());
  });
});

describe("safety mappings", () => {
  it("maps every PPS status to the required label", () => expect(ppsStatusLabels).toEqual({ active: "Active now", historical: "Previously used as an evacuation centre", inactive: "Confirmed inactive", unknown: "Current operating status unknown" }));
  it("preserves supported official river statuses and rejects others", () => { expect(normalizeRiverStatus("DANGER")).toBe("danger"); expect(normalizeRiverStatus("ERROR")).toBe("unknown"); });
  it("detects stale and invalid timestamps", () => { const now = new Date("2026-07-11T16:00:00Z"); expect(isStale("2024-02-23 14:45:00", 180, now)).toBe(true); expect(isStale("invalid", 180, now)).toBe(true); });
  it("honours warning validity dates", () => { const now = new Date("2026-07-11T12:00:00Z"); expect(isWarningCurrentlyValid("2026-07-11T00:00:00Z", "2026-07-12T00:00:00Z", now)).toBe(true); expect(isWarningCurrentlyValid(undefined, "2026-07-10T00:00:00Z", now)).toBe(false); });
  it("interprets timezone-less MET Malaysia warning dates as UTC+8", () => {
    expect(isWarningCurrentlyValid("2026-07-12T01:00:00", "2026-07-12T06:00:00", new Date("2026-07-11T19:00:00Z"))).toBe(true);
    expect(isWarningCurrentlyValid("2026-07-12T01:00:00", undefined, new Date("2026-07-11T16:59:59Z"))).toBe(false);
    expect(isWarningCurrentlyValid(undefined, "2026-07-12T06:00:00", new Date("2026-07-11T22:00:01Z"))).toBe(false);
  });
});

describe("coverage, language and source truth", () => {
  it("detects Melaka pilot and outside-pilot coordinates", () => { expect(isInsidePilotArea({ latitude: 2.2673, longitude: 102.1938 })).toBe(true); expect(isInsidePilotArea({ latitude: 3.0209, longitude: 101.5354 })).toBe(false); });
  it("keeps demonstration data explicitly separated", () => { expect(sriMudaDemonstration.mode).toBe("demonstration"); expect(sriMudaDemonstration.weatherWarnings[0].pasarApiEntryId).toBe("demonstration-only"); });
  it("contains matching English and Bahasa Melayu string keys", () => expect(Object.keys(ms).sort()).toEqual(Object.keys(en).sort()));
  it("validates Malaysia-only geocoding bounds", () => expect(malaysiaOnly([{ id: "my", name: "Shah Alam", latitude: 3.07, longitude: 101.52 }, { id: "sg", name: "Singapore", latitude: 1.29, longitude: 103.85 }]).map(item => item.id)).toEqual(["my"]));
  it("derives API count from the production registry", () => expect(productionApiCount).toBe(productionDataSources.length));
  it("keeps rejected APIs out of production sources", () => { expect(dataSources.some(source => !source.productionUsage)).toBe(true); expect(productionDataSources.every(source => source.productionUsage)).toBe(true); });
});
