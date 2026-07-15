# TolongNow

**Flood information and help near you.**
**Maklumat banjir dan bantuan berdekatan anda.**

TolongNow is a location-first flood assistance web app that brings together official Malaysian weather warnings, emergency contacts and nearby temporary evacuation centre (PPS) information in one clear, accessible interface.

It was created for the PasarAPI mini challenge as a bounty MVP—not an emergency-dispatch system or guaranteed evacuation-routing service.

## Product problem

During floods, essential information is spread across provider portals. TolongNow gives a calm, mobile-first answer to four questions: what is happening nearby, whether an official warning applies, where source-backed evacuation-centre information exists, and which official service to use next.

## MVP scope

- Browser location and submitted Malaysian place search
- Official MET Malaysia district forecasts and current warning feed
- Current JKM evacuation-centre pilot for Melaka Tengah and Alor Gajah
- One-tap 999, verified NADMA and JKM phone lines, and official JKM, JPS, JKR and NADMA links
- English/Bahasa Melayu interface controls and persistent light/dark mode
- Separate, permanently labelled demonstration scenario
- Transparent `/data-sources` page generated from one API registry
- Partial results when an external provider fails

The live evacuation-centre pilot is centred on Melaka. TolongNow checks JKM’s nationwide active flood-centre listing and shows the nearest three validated centres within 15 km of a submitted location. A successful empty JKM response is shown as no active centres nearby, while provider failures remain clearly labelled as unavailable.

Supported test locations:

- `/area/melaka-tengah` — primary live JKM pilot
- `/area/alor-gajah` — secondary live JKM pilot
- `/area/taman-sri-muda?demo=true` — non-current demonstration scenario

## Architecture

Next.js App Router and TypeScript provide Server Components for data-heavy pages and small Client Components only for location and preferences. Route handlers proxy Nominatim forward/reverse geocoding and area summaries. Zod validates raw provider responses before adapters normalize them into provider-independent types. `Promise.allSettled` keeps provider failures isolated.

The central registry at `src/config/data-sources.ts` is the source of truth for production API count, homepage attribution and `/data-sources`. Raw provider schemas remain inside `src/lib/providers/`.

Evacuation-centre records include current status, source, retrieval time, distance, occupants, families and capacity. The live provider validates both JKM’s populated response object and its provider-specific empty-array response; failures degrade to the official JKM link. When `SHOW_REPORTED_PPS_FALLBACK` is enabled and no live nearby centre is returned, TolongNow can show separately labelled, source-linked previously reported centres. The historical demonstration fixture lives in `src/data/demo-scenarios/` and is not used by the live summary builder.

Weather warnings are matched against complete district or state names in the official English and Bahasa Melayu text. This retains warnings that mention Melaka, including its waters or strait, while preventing unrelated warnings from matching a loose word such as `Tengah`.

## APIs discovered through PasarAPI

TolongNow was created for the PasarAPI mini challenge. PasarAPI was used as the discovery and implementation-reference layer for the Southeast Asian APIs integrated into this project.

| PasarAPI entry ID | PasarAPI listing | Official API/provider | Endpoint used | Purpose | Auth/cache | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| `weather/forecast` | https://pasarapi.xyz/apis/weather/forecast | MET Malaysia via data.gov.my | `https://api.data.gov.my/weather/forecast` | District forecast | none / 30 min | No issue timestamp; district-level |
| `weather/warning` | https://pasarapi.xyz/apis/weather/warning | MET Malaysia via data.gov.my | `https://api.data.gov.my/weather/warning` | Official current warnings | none / 5 min | No structured areas/severity |
| `flood-warning` | https://pasarapi.xyz/apis/flood-warning | JPS Public InfoBanjir | `.../latestreadingstrendabc.json` | Retained technical adapter; not shown without safe local threshold context | not in active user flow | Undocumented opaque schema; raw readings can be misinterpreted |
| `nominatim-osm` | https://pasarapi.xyz/apis/nominatim-osm | OpenStreetMap contributors | `https://nominatim.openstreetmap.org/search` and `/reverse` | Submitted Malaysian search and browser-location area identification | none, identified UA / 24 h | 1 req/s public policy; no autocomplete |

### Direct official integration

| Source | Official provider | Endpoint used | Purpose | Auth/cache | Limitations |
| --- | --- | --- | --- | --- | --- |
| JKM active PPS listing | Department of Social Welfare Malaysia (JKM) | `https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=1` | Active flood evacuation centres near the user | none, server-only / 5 min | Undocumented internal JSON; no SLA, CORS, schema version or response timestamp; strict validation and official-link fallback required |

PasarAPI helped discover the weather, river and geocoding integrations. Data is provided by the named official provider or OpenStreetMap contributors; PasarAPI does not own or endorse the underlying data. The JKM source is a separate direct official integration.

Full selection/rejection evidence is in [docs/data-reconnaissance.md](docs/data-reconnaissance.md).

## Safety limitations

TolongNow does not dispatch rescue services, guarantee temporary evacuation centre availability, verify road passability, generate official warnings or replace emergency-authority instructions. Live data may be delayed or unavailable. Immediate danger: call 999. Read [docs/safety-and-limitations.md](docs/safety-and-limitations.md).

## Local setup

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Environment variables

`NOMINATIM_USER_AGENT` is optional but strongly recommended for deployment. Set it to an identifying app/version and real deployment or contact URL, for example:

```text
NOMINATIM_USER_AGENT="TolongNow/1.0 (https://tolongnow.example)"
```

`SHOW_REPORTED_PPS_FALLBACK` defaults to `false`. Set it to `true` to show sourced previously reported PPS when the live JKM lookup returns no nearby active centre. Live JKM results always take priority. A district-level month-and-year label distinguishes these results from live data, and the notice links to the source article.

No API keys, authentication or database are required.

## Verification commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

## Vercel deployment

Import the repository into Vercel, keep the detected Next.js settings, add `NOMINATIM_USER_AGENT`, and deploy. Replace these placeholders after publishing:

- Live URL: `https://tolong.hafiy.my`
- GitHub URL: `https://github.com/nazirulhafiy/TolongNow`

## Bounty submission

> TolongNow is a mobile-friendly, location-first flood assistance web app for Malaysia. It combines official weather warnings, emergency contacts and current temporary evacuation centre (PPS) information from JKM. The live pilot is centred on Melaka while submitted Malaysian locations use the same distance-filtered official lookup. PasarAPI helped discover the weather and geocoding integrations.

### APIs used

- `MET Malaysia 7-day weather forecast` — MET Malaysia via data.gov.my
- `MET Malaysia weather warnings` — MET Malaysia via data.gov.my
- `Public InfoBanjir river readings` — Department of Irrigation and Drainage Malaysia (JPS)
- `Nominatim geocoding` — OpenStreetMap contributors

## Repository

Source code: [github.com/nazirulhafiy/TolongNow](https://github.com/nazirulhafiy/TolongNow)

Live site: [tolong.hafiy.my](https://tolong.hafiy.my)
