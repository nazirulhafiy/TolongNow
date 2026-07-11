import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AreaContent } from "@/components/area-content";
import { PreferenceControls, PreferencesProvider } from "@/components/preferences";
import type { AreaSummary } from "@/types";

const summary: AreaSummary = {
  location: { slug: "selected-location", name: "Melaka Tengah", district: "Melaka Tengah", state: "Melaka", coordinates: { latitude: 2.23, longitude: 102.25 }, isPilot: true },
  nearbyRiverStations: [],
  weatherWarnings: [{
    id: "warning",
    title: "Warning on Thunderstorms",
    description: "Thunderstorms are expected.",
    titleMs: "Amaran Ribut Petir",
    descriptionMs: "Ribut petir dijangka berlaku.",
    affectedAreas: [],
    officialProvider: "MET Malaysia",
    sourceUrl: "https://api.data.gov.my/weather/warning",
    pasarApiEntryId: "weather/warning",
  }],
  forecast: [],
  nearbyPps: [],
  retrievedAt: "2026-07-12T01:00:00+08:00",
  dataAvailability: {
    river: { available: false },
    warnings: { available: true },
    forecast: { available: false },
    pps: { available: false },
  },
  mode: "live",
};

describe("area warning localization", () => {
  afterEach(() => { cleanup(); localStorage.clear(); });

  it("uses official BM warning copy in BM mode and English copy in EN mode", () => {
    render(<PreferencesProvider><PreferenceControls/><AreaContent summary={summary} demo={false}/></PreferencesProvider>);
    expect(screen.getByRole("heading", { name: "Warning on Thunderstorms" })).toBeInTheDocument();
    expect(screen.getByText("Thunderstorms are expected.")).toBeInTheDocument();
    expect(screen.getByText("TolongNow shows the latest available official information. Data may be delayed or unavailable; always follow instructions from emergency authorities.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    expect(screen.getByRole("heading", { name: "Amaran Ribut Petir" })).toBeInTheDocument();
    expect(screen.getByText("Ribut petir dijangka berlaku.")).toBeInTheDocument();
    expect(screen.getByText("TolongNow memaparkan maklumat rasmi terkini yang tersedia. Data mungkin lewat atau tidak tersedia; sentiasa patuhi arahan pihak berkuasa kecemasan.")).toBeInTheDocument();
    expect(screen.queryByText("Thunderstorms are expected.")).not.toBeInTheDocument();
  });
});
