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
    expect(screen.getByText("Digunakan hanya untuk mencari maklumat berdekatan. TolongNow tidak membina sejarah lokasi peribadi.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Jika berlaku kecemasan, hubungi 999" })).not.toBeInTheDocument();
    expect(screen.queryByText("Kecemasan mengancam nyawa")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Fasa rintis: Melaka sahaja" })).toHaveTextContent(
      "Dalam fasa rintis ini, TolongNow menyediakan hasil pusat pemindahan berdasarkan lokasi untuk Melaka sahaja.",
    );
    expect(screen.getByRole("button", { name: "Cari di Melaka" })).toBeInTheDocument();
    expect(screen.queryByText("What do you need right now?")).not.toBeInTheDocument();
  });

  it("shows the pilot scope once and remembers dismissal", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const firstVisit = render(<PreferencesProvider><Home/></PreferencesProvider>);
    const dialog = await screen.findByRole("dialog", { name: "Pilot phase: Malacca only" });
    expect(dialog).toHaveTextContent("During this pilot phase, TolongNow provides location-based evacuation-centre results for Malacca only.");

    fireEvent.click(screen.getByRole("button", { name: "Search in Malacca" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByRole("textbox", { name: "Neighbourhood, postcode, district or city" })).toHaveFocus();
    expect(localStorage.getItem("tolongnow-pilot-notice-v2")).toBe("dismissed");

    firstVisit.unmount();
    render(<PreferencesProvider><Home/></PreferencesProvider>);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("moves both location quick actions to the hero search and focuses the input", () => {
    localStorage.setItem("tolongnow-pilot-notice-v2", "dismissed");
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
