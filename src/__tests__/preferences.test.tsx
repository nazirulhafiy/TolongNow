import React from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LocalizedText, PreferenceControls, PreferencesProvider } from "@/components/preferences";

describe("theme preference", () => {
  afterEach(cleanup);
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = "light";
  });

  it("replaces Simple View with a persistent dark-mode toggle", async () => {
    render(<PreferencesProvider><PreferenceControls /></PreferencesProvider>);
    const toggle = await screen.findByRole("button", { name: "Switch to dark mode" });
    expect(screen.queryByText("Simple View")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
    expect(localStorage.getItem("tolongnow-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light mode" })).toBePressed();
  });

  it("switches and persists Bahasa Melayu mode", async () => {
    render(<PreferencesProvider><PreferenceControls/><span data-testid="nav-label"><LocalizedText textKey="contactsNav"/></span></PreferencesProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Bahasa Melayu" }));
    await waitFor(() => expect(document.documentElement.lang).toBe("ms"));
    expect(document.documentElement.dataset.language).toBe("ms");
    expect(localStorage.getItem("tolongnow-language")).toBe("ms");
    expect(screen.getByTestId("nav-label")).toHaveTextContent("Hubungi");
    expect(screen.getByRole("button", { name: "Bahasa Melayu" })).toBePressed();
  });
});
