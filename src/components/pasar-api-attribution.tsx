import Link from "next/link";
import { productionApiCount } from "@/config/data-sources";
import { ExternalIcon } from "@/components/icons";

export function PasarApiAttribution() {
  return <section className="pasar-card" aria-labelledby="pasar-title"><div><span className="eyebrow eyebrow-light">Powered by public data</span><h2 id="pasar-title">Built with APIs discovered through PasarAPI</h2><p>TolongNow currently combines {productionApiCount} public APIs from official providers and OpenStreetMap contributors. Every source is identified so you can verify it.</p></div><div className="pasar-actions"><a className="button button-light" href="https://pasarapi.xyz/" target="_blank" rel="noreferrer">Explore PasarAPI <ExternalIcon /></a><Link className="button button-outline-light" href="/data-sources">View our data sources <ExternalIcon /></Link></div></section>;
}
