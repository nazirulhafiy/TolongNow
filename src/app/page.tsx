"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LocationSearch } from "@/components/location-search";
import { usePreferences } from "@/components/preferences";
import { AlertIcon, ArrowIcon, CloudIcon, PeopleIcon, PhoneIcon, PinIcon, ShieldIcon } from "@/components/icons";
import { productionApiCount } from "@/config/data-sources";

export default function Home() {
  const { t } = usePreferences();
  const [showPilotNotice, setShowPilotNotice] = useState(false);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (localStorage.getItem("tolongnow-pilot-notice-v2") !== "dismissed") setShowPilotNotice(true);
  }, []);

  useEffect(() => {
    if (!showPilotNotice) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    continueButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") dismissPilotNotice(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [showPilotNotice]);

  function dismissPilotNotice() {
    localStorage.setItem("tolongnow-pilot-notice-v2", "dismissed");
    setShowPilotNotice(false);
  }

  function focusLocationSearch() {
    const searchTool = document.getElementById("location-search");
    const searchInput = document.getElementById("location");
    if (!searchTool || !(searchInput instanceof HTMLInputElement)) return;

    window.history.replaceState(null, "", "#location-search");
    searchInput.focus({ preventScroll: true });
    searchTool.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function startPilotSearch() {
    dismissPilotNotice();
    focusLocationSearch();
  }

  function handleLocationQuickAction(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    focusLocationSearch();
  }

  return <main id="main">
    {showPilotNotice && <div className="pilot-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) dismissPilotNotice(); }}><section className="pilot-modal" role="dialog" aria-modal="true" aria-labelledby="pilot-modal-title" aria-describedby="pilot-modal-description"><button className="pilot-modal-close" onClick={dismissPilotNotice} aria-label={t.pilotDialogClose}>×</button><span className="eyebrow"><span className="pulse-dot"/>{t.pilotDialogIntro}</span><h2 id="pilot-modal-title">{t.pilotLabel}</h2><p id="pilot-modal-description">{t.pilotDialogBody}</p><button ref={continueButtonRef} className="button button-primary button-wide" onClick={startPilotSearch}>{t.pilotDialogContinue}<ArrowIcon/></button></section></div>}
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><h1>{t.safeHeading}</h1><p className="hero-lead">{t.intro}</p></div><LocationSearch/></div></section>

    <section className="quick-section"><div className="container"><div className="section-heading"><h2>{t.needNow}</h2><p>{t.nextSteps}</p></div><div className="quick-grid">
      <Link href="#location-search" className="quick-card" onClick={handleLocationQuickAction}><span className="quick-icon blue"><PinIcon/></span><div><h3>{t.checkArea}</h3><p>{t.areaCardDescription}</p></div><ArrowIcon/></Link>
      <Link href="#location-search" className="quick-card" onClick={handleLocationQuickAction}><span className="quick-icon teal"><PeopleIcon/></span><div><h3>{t.findPps}</h3><p>{t.findPpsDescription}</p></div><ArrowIcon/></Link>
      <Link href="/contacts" className="quick-card"><span className="quick-icon red"><PhoneIcon/></span><div><h3>{t.contacts}</h3><p>{t.contactsCardDescription}</p></div><ArrowIcon/></Link>
      <Link href="/prepare" className="quick-card"><span className="quick-icon amber"><ShieldIcon/></span><div><h3>{t.prepare}</h3><p>{t.prepareCardDescription}</p></div><ArrowIcon/></Link>
    </div></div></section>

    <section id="data-sources-overview" className="home-data-section" aria-labelledby="home-data-title"><div className="container">
      <div className="home-data-intro"><div><span className="eyebrow">{t.homeDataEyebrow}</span><h2 id="home-data-title">{t.homeDataTitle}</h2></div><div><p>{t.homeDataIntro.replace("{count}", String(productionApiCount))}</p><Link href="/data-sources" className="home-data-link">{t.homeDataCta}<ArrowIcon/></Link></div></div>
      <div className="home-data-grid">
        <article><span className="home-data-icon weather"><CloudIcon/></span><span className="home-data-step">01 · MET Malaysia</span><h3>{t.homeDataWeatherTitle}</h3><p>{t.homeDataWeatherBody}</p></article>
        <article><span className="home-data-icon evacuation"><PeopleIcon/></span><span className="home-data-step">02 · JKM InfoBencana</span><h3>{t.homeDataPpsTitle}</h3><p>{t.homeDataPpsBody}</p></article>
        <article><span className="home-data-icon clarity"><AlertIcon/></span><span className="home-data-step">03 · TolongNow</span><h3>{t.homeDataClarityTitle}</h3><p>{t.homeDataClarityBody}</p></article>
      </div>
      <p className="home-data-note"><ShieldIcon/>{t.homeDataNote}</p>
    </div></section>

  </main>;
}
