import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { LocationSearch } from "@/components/location-search";
import { PreferenceControls, PreferencesProvider } from "@/components/preferences";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("location-search pilot guidance", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: vi.fn((_success: PositionCallback, error: PositionErrorCallback) => error({ code: 1, message: "Denied" } as GeolocationPositionError)) },
    });
  });

  it("shows Malacca pilot guidance when location access is denied", () => {
    render(<PreferencesProvider><LocationSearch /></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));
    expect(screen.getByRole("alert")).toHaveTextContent("The current pilot covers areas in Malacca");
  });

  it("shows Melaka pilot guidance in Bahasa Melayu", () => {
    render(<PreferencesProvider><PreferenceControls/><LocationSearch /></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    expect(screen.getByText("Lokasi anda digunakan untuk semakan ini sahaja. TolongNow tidak menyimpan pangkalan data lokasi.")).toBeInTheDocument();
    expect(screen.getByLabelText("Kejiranan, poskod, daerah atau bandar")).toHaveAttribute("placeholder", "cth. Melaka Tengah");
    fireEvent.click(screen.getByRole("button", { name: "Gunakan lokasi saya" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Projek rintis semasa hanya meliputi kawasan di Melaka");
  });
});
