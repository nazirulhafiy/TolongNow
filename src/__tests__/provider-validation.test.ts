import { afterEach, describe, expect, it, vi } from "vitest";
import { getForecast, getWeatherWarnings } from "@/lib/providers/weather";
import { getNearbyRiverStations } from "@/lib/providers/river";
import { getNearbyActiveJkmPps } from "@/lib/providers/jkm-pps";
import { geocodeMalaysia, reverseGeocodeMalaysia } from "@/lib/providers/geocoding";

afterEach(() => vi.unstubAllGlobals());
describe("provider response validation", () => {
  it("rejects an invalid forecast response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ bad: true }), { status: 200 })));
    await expect(getForecast("Shah Alam")).rejects.toThrow();
  });
  it("rejects non-200 warning responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("unavailable", { status: 503 })));
    await expect(getWeatherWarnings()).rejects.toThrow("Provider returned 503");
  });
  it("preserves official English and Bahasa Melayu warning copy", async () => {
    const rows = [{
      warning_issue: { issued: "2026-07-12T01:00:00", title_en: "English issue", title_bm: "Isu BM" },
      valid_from: "2026-07-12T01:00:00",
      valid_to: "2026-07-16T00:00:00",
      heading_en: "Warning on Thunderstorms",
      heading_bm: "Amaran Ribut Petir",
      text_en: "Thunderstorms are expected.",
      text_bm: "Ribut petir dijangka berlaku.",
    }];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(rows), { status: 200 })));
    const result = await getWeatherWarnings(new Date("2026-07-11T19:00:00Z"));
    expect(result[0]).toMatchObject({
      title: "Warning on Thunderstorms",
      description: "Thunderstorms are expected.",
      titleMs: "Amaran Ribut Petir",
      descriptionMs: "Ribut petir dijangka berlaku.",
    });
  });
  it("omits off sensors and invalid sentinel water levels", async () => {
    const rows = [{ a: "bad", b: "Bad sensor", c: 3.02, d: 101.53, m: -9999, n: "ERROR", q: "11/07/2026 23:00", s: "No Change", gg: "OFF" }];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(rows), { status: 200 })));
    const result = await getNearbyRiverStations({ latitude: 3.02, longitude: 101.53 }, 35);
    expect(result).toEqual([]);
  });
  it("validates and distance-sorts active JKM evacuation centres", async () => {
    const payload = { points: [
      { id: 2, name: "FAR CENTRE", latti: 2.36, longi: 102.09, negeri: "Melaka", daerah: "Alor Gajah", mukim: "Dun Lendu", bencana: "Banjir", mangsa: 5, keluarga: 1, kapasiti: 30 },
      { id: 1, name: "NEAR CENTRE", latti: 2.267, longi: 102.194, negeri: "Melaka", daerah: "Melaka Tengah", mukim: "Dun Paya Rumput", bencana: "Banjir", mangsa: 12, keluarga: 4, kapasiti: 80 },
    ] };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })));
    const result = await getNearbyActiveJkmPps({ latitude: 2.27, longitude: 102.19 }, 50);
    expect(result.map((centre) => centre.id)).toEqual(["jkm-1", "jkm-2"]);
    expect(result[0]).toMatchObject({ status: "active", victimCount: 12, familyCount: 4, sourceTitle: "Official JKM InfoBencana active PPS listing" });
  });
  it("rejects malformed JKM data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ points: [{ id: 1, name: "Broken" }] }), { status: 200 })));
    await expect(getNearbyActiveJkmPps({ latitude: 2.27, longitude: 102.19 })).rejects.toThrow();
  });
  it("limits JKM results to the nearest three centres", async () => {
    const points = Array.from({ length: 4 }, (_, index) => ({ id: index, name: `CENTRE ${index}`, latti: 2.27 + index * 0.001, longi: 102.19, negeri: "Melaka", daerah: "Melaka Tengah", mukim: "Dun Paya Rumput", bencana: "Banjir", mangsa: 1, keluarga: 1, kapasiti: 10 }));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ points }), { status: 200 })));
    const result = await getNearbyActiveJkmPps({ latitude: 2.27, longitude: 102.19 });
    expect(result.map((centre) => centre.id)).toEqual(["jkm-0", "jkm-1", "jkm-2"]);
  });
  it("extracts Malaysian state districts from place search results", async () => {
    const payload = [{ place_id: 10, lat: "2.2301451", lon: "102.2453068", display_name: "Melaka Tengah, Melaka, Malaysia", address: { country_code: "my", state_district: "Melaka Tengah", state: "Melaka" } }];
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await geocodeMalaysia("Melaka Tengah");
    expect(result[0]).toMatchObject({ district: "Melaka Tengah", state: "Melaka", latitude: 2.2301451, longitude: 102.2453068 });
    expect(String(fetchMock.mock.calls[0][0])).toContain("accept-language=ms-MY%2Cms%2Cen");
  });
  it("reverse-geocodes browser coordinates into an area", async () => {
    const payload = { place_id: 11, lat: "2.2301451", lon: "102.2453068", display_name: "Melaka Tengah, Melaka, Malaysia", address: { country_code: "my", city: "Bandaraya Melaka", state_district: "Melaka Tengah", state: "Melaka" } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })));
    await expect(reverseGeocodeMalaysia({ latitude: 2.2301451, longitude: 102.2453068 })).resolves.toMatchObject({ district: "Melaka Tengah", state: "Melaka" });
  });
  it("rejects reverse-geocoded locations outside Malaysia", async () => {
    const payload = { place_id: 12, lat: "1.29027", lon: "103.851959", display_name: "Singapore", address: { country_code: "sg", state: "Singapore" } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 })));
    await expect(reverseGeocodeMalaysia({ latitude: 1.29027, longitude: 103.851959 })).resolves.toBeUndefined();
  });
});
