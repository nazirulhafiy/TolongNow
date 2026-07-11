import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LocationSearch } from "@/components/location-search";
import { PreferenceControls, PreferencesProvider } from "@/components/preferences";

const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

describe("location-search pilot guidance", () => {
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
  beforeEach(() => {
    pushMock.mockClear();
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
    const searchInput = screen.getByRole("textbox", { name: "Neighbourhood, postcode, district or city" });
    expect(searchInput).toHaveFocus();
    fireEvent.change(searchInput, { target: { value: "Melaka Tengah" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows Melaka pilot guidance in Bahasa Melayu", () => {
    render(<PreferencesProvider><PreferenceControls/><LocationSearch /></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    expect(screen.getByText("Digunakan hanya untuk mencari maklumat berdekatan. TolongNow tidak membina sejarah lokasi peribadi.")).toBeInTheDocument();
    expect(screen.getByLabelText("Kejiranan, poskod, daerah atau bandar")).toHaveAttribute("placeholder", "cth. Melaka Tengah");
    fireEvent.click(screen.getByRole("button", { name: "Gunakan lokasi saya" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Projek rintis semasa hanya meliputi kawasan di Melaka");
  });

  it("opens the results page immediately after current location is resolved", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: vi.fn((success: PositionCallback) => success({ coords: { latitude: 2.2301451, longitude: 102.2453068 } } as GeolocationPosition)) },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ result: { id: "melaka", name: "Melaka Tengah, Melaka, Malaysia", latitude: 2.2301451, longitude: 102.2453068, district: "Melaka Tengah", state: "Melaka" } }), { status: 200 })));

    render(<PreferencesProvider><LocationSearch /></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Use my current location" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/area/selected-location?lat=2.2301451&lng=102.2453068&name=Melaka+Tengah%2C+Melaka%2C+Malaysia&district=Melaka+Tengah&state=Melaka"));
  });
});
