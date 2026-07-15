import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AreaContent } from "@/components/area-content";
import { PreferenceControls, PreferencesProvider } from "@/components/preferences";
import { getReportedPpsFallback } from "@/data/reported-pps-melaka-2026-07-12";
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

    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    expect(screen.getByRole("heading", { name: "Amaran Ribut Petir" })).toBeInTheDocument();
    expect(screen.getByText("Ribut petir dijangka berlaku.")).toBeInTheDocument();
    expect(screen.queryByText("Thunderstorms are expected.")).not.toBeInTheDocument();
  });

  it("shows sourced previously reported centres without presenting them as live", () => {
    const fallback = getReportedPpsFallback("Melaka Tengah");
    render(<PreferencesProvider><AreaContent summary={summary} demo={false} reportedPpsFallback={fallback}/></PreferencesProvider>);
    expect(screen.getByText("Previously reported in July 2026")).toBeInTheDocument();
    expect(screen.queryByText("Previously reported")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Melaka Tengah" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SJK (C) Bertam Ulu" })).toBeInTheDocument();
    expect(screen.getByText("Bertam Ulu, 76450 Melaka")).toBeInTheDocument();
    expect(screen.getByText("Pantai Kundor, Tanjung Kling, Melaka 76400")).toBeInTheDocument();
    expect(screen.getByText("942")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Source" })).toHaveAttribute("href", expect.stringContaining("kosmo.com.my"));
    const mapLinks = screen.getAllByRole("link", { name: "View on OpenStreetMap" });
    expect(mapLinks).toHaveLength(4);
    expect(mapLinks.some((link) => link.getAttribute("href")?.includes("/search?query=Pantai%20Kundor"))).toBe(true);
    expect(screen.queryByText("Current operating status unverified")).not.toBeInTheDocument();
    expect(screen.queryByText(/Source published/)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "No active evacuation centres found nearby" })).not.toBeInTheDocument();
  });

  it("keeps live JKM centres ahead of the reported fallback", () => {
    const liveSummary: AreaSummary = { ...summary, nearbyPps: [{ id: "jkm-live", name: "Live JKM centre", address: "Melaka Tengah, Melaka", district: "Melaka Tengah", state: "Melaka", latitude: 2.23, longitude: 102.25, status: "active", sourceTitle: "JKM", sourceUrl: "https://example.com", lastVerifiedAt: "2026-07-15T12:00:00+08:00" }] };
    render(<PreferencesProvider><AreaContent summary={liveSummary} demo={false} reportedPpsFallback={getReportedPpsFallback("Melaka Tengah")}/></PreferencesProvider>);
    expect(screen.getByRole("heading", { name: "Live JKM centre" })).toBeInTheDocument();
    expect(screen.queryByText("Previously reported in July 2026")).not.toBeInTheDocument();
  });
});
