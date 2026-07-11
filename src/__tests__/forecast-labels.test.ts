import { describe, expect, it } from "vitest";
import { localizeForecastDescription } from "@/lib/forecast-labels";

const officialForecastVocabulary: Array<[string, string]> = [
  ["Berangin", "Windy"],
  ["Hujan", "Rain"],
  ["Hujan di beberapa tempat", "Rain in a few places"],
  ["Hujan di beberapa tempat di kawasan pantai", "Rain in a few places in coastal areas"],
  ["Hujan di beberapa tempat di kawasan pedalaman", "Rain in a few places in inland areas"],
  ["Hujan di kebanyakan tempat", "Rain in most places"],
  ["Mendung", "Cloudy"],
  ["Ribut petir", "Thunderstorms"],
  ["Ribut petir di beberapa tempat", "Thunderstorms in a few places"],
  ["Ribut petir di beberapa tempat di kawasan pantai", "Thunderstorms in a few places in coastal areas"],
  ["Ribut petir di beberapa tempat di kawasan pedalaman", "Thunderstorms in a few places in inland areas"],
  ["Ribut petir di kebanyakan tempat", "Thunderstorms in most places"],
  ["Ribut petir di kebanyakan tempat di kawasan pantai", "Thunderstorms in most places in coastal areas"],
  ["Ribut petir di kebanyakan tempat di kawasan pedalaman", "Thunderstorms in most places in inland areas"],
  ["Ribut petir menyeluruh", "Widespread thunderstorms"],
  ["Tiada hujan", "No rain"],
];

describe("forecast labels", () => {
  it.each(officialForecastVocabulary)("translates %s for the English interface", (malay, english) => {
    expect(localizeForecastDescription(malay, "en")).toBe(english);
  });

  it("keeps the official wording in the Bahasa Melayu interface", () => {
    expect(localizeForecastDescription("Ribut petir di kebanyakan tempat", "ms")).toBe("Ribut petir di kebanyakan tempat");
  });

  it("does not leak unknown Malay text into the English interface", () => {
    expect(localizeForecastDescription("Keadaan baharu", "en")).toBe("Forecast details unavailable in English");
  });
});
