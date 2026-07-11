"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { en } from "@/i18n/en";
import { ms } from "@/i18n/ms";
import { MoonIcon, SunIcon } from "@/components/icons";

type Language = "en" | "ms";
type Theme = "light" | "dark";
type Preferences = { language: Language; setLanguage: (value: Language) => void; theme: Theme; setTheme: (value: Theme) => void; t: typeof en };
const Context = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const storedLanguage = localStorage.getItem("tolongnow-language");
    if (storedLanguage === "ms") setLanguage("ms");
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    localStorage.removeItem("tolongnow-simple");
  }, []);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dataset.language = language; localStorage.setItem("tolongnow-language", language); }, [language]);
  useEffect(() => { if (!theme) return; document.documentElement.dataset.theme = theme; localStorage.setItem("tolongnow-theme", theme); }, [theme]);
  const value = useMemo(() => ({ language, setLanguage, theme: theme ?? "light", setTheme, t: language === "en" ? en : ms as typeof en }), [language, theme]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error("usePreferences must be inside PreferencesProvider");
  return context;
}

export function LocalizedText({ textKey }: { textKey: keyof typeof en }) {
  const { t } = usePreferences();
  return <>{t[textKey]}</>;
}

export function BilingualText({ en: english, ms: malay }: { en: string; ms: string }) {
  const { language } = usePreferences();
  return <>{language === "ms" ? malay : english}</>;
}

export function PreferenceControls() {
  const { language, setLanguage, theme, setTheme, t } = usePreferences();
  const isDark = theme === "dark";
  return <div className="preference-controls" aria-label={language === "ms" ? "Pilihan paparan" : "Display preferences"}>
    <div className="segmented" aria-label={language === "ms" ? "Bahasa" : "Language"}>
      <button aria-label={language === "ms" ? "Bahasa Inggeris" : "English"} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
      <button aria-label="Bahasa Melayu" aria-pressed={language === "ms"} onClick={() => setLanguage("ms")}>BM</button>
    </div>
    <button className="theme-toggle" title={isDark ? t.lightMode : t.darkMode} aria-pressed={isDark} aria-label={isDark ? t.switchLight : t.switchDark} onClick={() => setTheme(isDark ? "light" : "dark")}>{isDark ? <SunIcon/> : <MoonIcon/>}<span className="sr-only">{isDark ? t.lightMode : t.darkMode}</span></button>
  </div>;
}
