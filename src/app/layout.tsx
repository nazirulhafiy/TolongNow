import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BilingualText, PreferencesProvider } from "@/components/preferences";
import { Footer, Header } from "@/components/site-shell";

export const metadata: Metadata = {
  title: { default: "TolongNow — Flood information and help near you", template: "%s — TolongNow" },
  description: "A location-first flood assistance web app bringing together official Malaysian warnings, emergency contacts and nearby evacuation-centre information.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#092f3c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var saved=localStorage.getItem('tolongnow-theme');var theme=saved==='dark'||saved==='light'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.dataset.theme='light';}})();` }}/></head><body><PreferencesProvider><a className="skip-link" href="#main"><BilingualText en="Skip to main content" ms="Langkau ke kandungan utama"/></a><Header/>{children}<Footer/></PreferencesProvider></body></html>;
}
