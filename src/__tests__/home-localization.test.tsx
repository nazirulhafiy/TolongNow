import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { PreferenceControls, PreferencesProvider } from "@/components/preferences";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("homepage Bahasa Melayu copy", () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  it("translates the quick-action heading and every card description", () => {
    render(<PreferencesProvider><PreferenceControls/><Home/></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));

    expect(screen.getByRole("heading", { name: "Apakah bantuan yang anda perlukan sekarang?" })).toBeInTheDocument();
    expect(screen.getByText("Langkah seterusnya yang jelas, dengan sumber rasmi dan had liputan yang telus.")).toBeInTheDocument();
    expect(screen.getByText("Cuaca, amaran dan bantuan rasmi semasa yang berdekatan.")).toBeInTheDocument();
    expect(screen.getByText("Pautan satu ketik kepada kecemasan dan agensi rasmi.")).toBeInTheDocument();
    expect(screen.getByText("Senarai semak persediaan banjir yang tenang dan praktikal.")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Projek rintis Melaka sahaja" })).toHaveTextContent(
      "Projek rintis ini kini hanya meliputi lokasi di Melaka.",
    );
    expect(screen.getByRole("button", { name: "Teruskan ke TolongNow" })).toBeInTheDocument();
    expect(screen.queryByText("What do you need right now?")).not.toBeInTheDocument();
  });

  it("shows the pilot scope once and remembers dismissal", async () => {
    const firstVisit = render(<PreferencesProvider><Home/></PreferencesProvider>);
    const dialog = await screen.findByRole("dialog", { name: "Malacca pilot only" });
    expect(dialog).toHaveTextContent("This pilot currently serves locations in Malacca only.");

    fireEvent.click(screen.getByRole("button", { name: "Continue to TolongNow" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(localStorage.getItem("tolongnow-pilot-notice-v1")).toBe("dismissed");

    firstVisit.unmount();
    render(<PreferencesProvider><Home/></PreferencesProvider>);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("moves both location quick actions to the hero search and focuses the input", () => {
    localStorage.setItem("tolongnow-pilot-notice-v1", "dismissed");
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<PreferencesProvider><Home/></PreferencesProvider>);

    const input = screen.getByRole("textbox", { name: "Neighbourhood, postcode, district or city" });
    const checkArea = screen.getByRole("link", { name: /Check my area/ });
    const findCentres = screen.getByRole("link", { name: /Find evacuation centres/ });

    fireEvent.click(checkArea);
    expect(input).toHaveFocus();
    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: "smooth", block: "center" });

    input.blur();
    fireEvent.click(findCentres);
    expect(input).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(window.location.hash).toBe("#location-search");
  });
});
