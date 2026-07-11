"use client";

import Link from "next/link";
import { LocalizedText, PreferenceControls, usePreferences } from "@/components/preferences";

function BrandLogo({ inverse = false }: { inverse?: boolean }) {
  return <span className={`brand-lockup${inverse ? " brand-lockup-inverse" : ""}`} aria-hidden="true">
    <svg className="brand-symbol" viewBox="0 0 44 44" role="img">
      <path className="brand-symbol-base" d="M22 2.5c10.2 0 18 7.6 18 17.2C40 30.8 22 42 22 42S4 30.8 4 19.7C4 10.1 11.8 2.5 22 2.5Z"/>
      <path className="brand-symbol-wave" d="M10.5 19.2c3.5 0 3.5-2.4 7-2.4s3.5 2.4 7 2.4 3.5-2.4 7-2.4"/>
      <path className="brand-symbol-wave brand-symbol-wave-lower" d="M12.5 24.7c3 0 3-2.1 6-2.1s3 2.1 6 2.1 3-2.1 6-2.1"/>
      <circle className="brand-symbol-dot" cx="22" cy="11.2" r="2.4"/>
    </svg>
    <span className="brand-wordmark"><strong>Tolong</strong><span>Now</span></span>
  </span>;
}

export function Header() {
  const { language } = usePreferences();
  return <header className="site-header"><div className="container header-inner">
    <Link href="/" className="brand" aria-label={language === "ms" ? "Laman utama TolongNow" : "TolongNow home"}><BrandLogo /></Link>
    <nav className="desktop-nav" aria-label={language === "ms" ? "Navigasi utama" : "Main navigation"}><Link href="/contacts"><LocalizedText textKey="contactsNav"/></Link><Link href="/prepare"><LocalizedText textKey="prepareNav"/></Link><Link href="/data-sources"><LocalizedText textKey="dataSourcesNav"/></Link></nav>
    <PreferenceControls />
  </div></header>;
}

export function Footer() {
  const { language } = usePreferences();
  return <footer className="site-footer"><div className="container footer-grid">
    <div className="footer-about"><Link href="/" className="brand brand-inverse" aria-label={language === "ms" ? "Laman utama TolongNow" : "TolongNow home"}><BrandLogo inverse /></Link><p><LocalizedText textKey="footerDescription"/></p></div>
    <div><h2><LocalizedText textKey="information"/></h2><Link href="/data-sources"><LocalizedText textKey="apiSources"/></Link><Link href="/about-data"><LocalizedText textKey="safetyLimitations"/></Link><Link href="/contacts"><LocalizedText textKey="contacts"/></Link></div>
    <div><h2><LocalizedText textKey="poweredByPublicData"/></h2><p><LocalizedText textKey="footerAttributionBefore"/> <a href="https://pasarapi.xyz/" target="_blank" rel="noreferrer">PasarAPI</a> <LocalizedText textKey="footerAttributionAfter"/></p></div>
  </div><div className="container footer-bottom"><span><a href="https://hafiy.my/" target="_blank" rel="noreferrer"><LocalizedText textKey="builtBy"/></a> · <LocalizedText textKey="prototypeNotice"/></span><span>© 2026 TolongNow</span></div></footer>;
}
