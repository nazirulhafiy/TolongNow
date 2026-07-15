# TolongNow data reconnaissance

Last verified: 15 July 2026 (Asia/Kuching). PasarAPI catalogue version observed: 2026-07-11.

PasarAPI (`https://pasarapi.xyz/`) was used as the API discovery and implementation-reference layer. It does not own or endorse the government data below. The machine-readable catalogue checked during reconnaissance was `https://pasarapi.xyz/api/catalogue`.

## Decision summary

| PasarAPI entry ID | PasarAPI listing | Decision | Production use |
| --- | --- | --- | --- |
| `weather/forecast` | https://pasarapi.xyz/apis/weather/forecast | Selected | District forecast |
| `weather/warning` | https://pasarapi.xyz/apis/weather/warning | Selected | Current valid weather warnings |
| `flood-warning` | https://pasarapi.xyz/apis/flood-warning | Selected cautiously via canonical JPS feed | Fresh nearby river observations |
| `nominatim-osm` | https://pasarapi.xyz/apis/nominatim-osm | Selected | Submitted Malaysian location search |
| `flood-warning` data.gov.my endpoint | https://pasarapi.xyz/apis/flood-warning | Rejected endpoint | Reconnaissance only; observations were stale |
| `met-api` | https://pasarapi.xyz/ | Rejected | Requires a token and duplicates selected keyless feeds |
| `malaysia-postcodes` | https://pasarapi.xyz/ | Rejected | No coordinates; not an official live geocoder |

The `/apis/...` paths are PasarAPI SPA routes observed during verification. The catalogue endpoint remains the machine-verifiable record if those presentation routes change.

## Selected: MET Malaysia 7-day weather forecast

- PasarAPI entry ID: `weather/forecast`
- PasarAPI listing: https://pasarapi.xyz/apis/weather/forecast
- Catalogue title: 7-day weather forecast (live)
- Official provider: MET Malaysia via data.gov.my
- Official documentation: https://developer.data.gov.my/realtime-api/weather
- Endpoint: `GET https://api.data.gov.my/weather/forecast/`
- Authentication: free, no authentication
- Geographic coverage: Malaysian forecast locations/districts; filtering by location name is supported
- Update frequency: daily according to PasarAPI
- Production caching: 30 minutes
- Vercel suitability: server-side and browser accessible; CORS `Access-Control-Allow-Origin: *`; `OPTIONS` returned 200
- Real request: 200 with 2,520 rows. `?contains=Klang@location__location_name` returned 14 rows. Hulu Langat (`Ds063`) and Klang (`Ds054`) were present for 11–17 July 2026.
- Timestamp: forecast dates are present; the response does not provide an official forecast issue timestamp. HTTP retrieval time is not represented as an issue time.
- Relevant fields: `location.location_id`, `location.location_name`, `date`, morning/afternoon/night/summary forecast, `summary_when`, `min_temp`, `max_temp`
- Example shape: `{ "location": { "location_id": "Tn070", "location_name": "Shah Alam" }, "date": "2026-07-11", "summary_forecast": "Ribut petir", "min_temp": 24, "max_temp": 34 }`
- Limitations: district rather than street-level; official text is primarily Bahasa Melayu; no issue timestamp
- Decision: selected and genuinely called by the production adapter

## Selected: MET Malaysia weather warnings

- PasarAPI entry ID: `weather/warning`
- PasarAPI listing: https://pasarapi.xyz/apis/weather/warning
- Catalogue title: Weather warnings (live)
- Official provider: MET Malaysia via data.gov.my
- Official documentation: https://developer.data.gov.my/realtime-api/weather
- Endpoint: `GET https://api.data.gov.my/weather/warning/`
- Authentication: free, no authentication
- Geographic coverage: warning text describes official affected areas; no separate structured area array is supplied
- Update frequency: as issued
- Production caching: 5 minutes
- Vercel suitability: server-side and browser accessible; CORS `*`; `OPTIONS` returned 200
- Real request: 200 with eight currently returned rows. A sample was issued `2026-07-11T20:50:00` and valid to `2026-07-16T00:00:00`.
- Timestamp interpretation: warning values do not include an explicit timezone. TolongNow interprets them as Malaysia time (UTC+8) before validity checks or display formatting; values that include an explicit timezone retain that offset.
- Relevant fields: `warning_issue.issued`, BM/EN issue titles, `valid_from`, `valid_to`, BM/EN headings, text and instructions
- Example shape: `{ "warning_issue": { "issued": "2026-07-11T20:50:00", "title_en": "..." }, "valid_from": "...", "valid_to": "...", "heading_en": "...", "text_en": "..." }`
- Limitations: no canonical warning ID, structured affected-area list, warning type or severity. TolongNow does not derive severity.
- Decision: selected; validity dates are checked, official wording is preserved, and complete district or state names are used for local matching so unrelated loose-word matches are excluded

## Selected cautiously: JPS Public InfoBanjir river readings

- PasarAPI entry ID: `flood-warning`
- PasarAPI listing: https://pasarapi.xyz/apis/flood-warning
- Catalogue title: River water levels & flood warnings (live)
- Canonical official provider: Department of Irrigation and Drainage Malaysia (JPS)
- Official service: https://publicinfobanjir.water.gov.my/
- Endpoint used: `GET https://publicinfobanjir.water.gov.my/wp-content/themes/enlighten/data/latestreadingstrendabc.json`
- Authentication: free, no authentication
- Geographic coverage: 2,725 JPS monitoring rows nationwide during verification, with station coordinates/district/state
- Update frequency: observations around 15 minutes in the verified response; TolongNow caches for 5 minutes
- Vercel suitability: server-side only. The endpoint had no ACAO header and `OPTIONS` returned 501, so a Next.js server adapter is required.
- Real request: 200; `Last-Modified: Sat, 11 Jul 2026 15:40:19 GMT`. Taman Sri Muda station `3015084_` returned a reading timestamped 11 July 2026 23:00 MYT, official status `Normal`, trend `Receding`, water level `1.04` m and rainfall totals.
- Relevant opaque fields, verified against the official UI: `a` station ID, `b` name, `c/d` coordinates, `e/f` district/state, `m` level, `n` official status, `o` threshold displayed for the current indicator, `q` observation date/time, `s` trend, `u/w` rainfall, `gg/hh` data statuses
- Example shape: `{ "a": "3015084_", "b": "...Sri Muda", "c": 3.037722, "d": 101.5345, "m": 1.04, "n": "Normal", "q": "11/07/2026 23:00", "s": "Receding" }`
- Limitations: undocumented schema, opaque keys, no SLA, CORS unavailable, and no complete alert/warning/danger thresholds in this feed
- Safety controls: Zod validates a conservative subset; records without coordinates or timestamps are rejected; readings older than three hours are not shown; only official status/trend are normalized; field `o` is not guessed into a normal/alert/warning/danger threshold
- Decision: selected cautiously because it is the current feed used by the canonical JPS service. If it fails or becomes stale, the area page renders partial results and an official Public InfoBanjir link.

### Rejected alternative endpoint: data.gov.my flood warning snapshot

- Endpoint: `GET https://api.data.gov.my/flood-warning/`
- Authentication/CORS: free, no auth, CORS `*`
- Response: valid 200 with 1,276 rich station rows and explicit threshold fields
- Critical failure: the newest `water_level_update_datetime` in the complete response was `2024-02-23 14:45:00`. The Taman Sri Muda row (`3015084_`) was dated 23 February 2024 14:30.
- Decision: rejected for current conditions despite the PasarAPI catalogue’s REALTIME label. It remains in the registry only as a non-production reconnaissance record.

## Selected: Nominatim / OpenStreetMap

- PasarAPI entry ID: `nominatim-osm`
- PasarAPI listing: https://pasarapi.xyz/apis/nominatim-osm
- Official provider: OpenStreetMap contributors / OpenStreetMap Foundation
- Documentation: https://nominatim.org/release-docs/latest/api/Overview/
- Endpoints: `GET https://nominatim.openstreetmap.org/search` and `GET https://nominatim.openstreetmap.org/reverse`
- Authentication: no key; a valid identifying User-Agent or Referer is required
- Geographic coverage: global, constrained by TolongNow to `countrycodes=my` and validated against Malaysian coordinate bounds and `country_code`
- Update frequency: OpenStreetMap-dependent
- Production caching: 24 hours for successful submitted searches
- Vercel suitability: server route with an identifying `NOMINATIM_USER_AGENT`
- Real request: an identified request for Taman Sri Muda returned 200 with coordinates around 3.0325183, 101.5344751, display name, address, postcode, bounding box and OSM identifiers
- Relevant fields: `place_id`, `lat`, `lon`, `display_name`, `address.country_code`
- Limitations/policy: maximum 1 request per second on the public service; no client autocomplete; attribution required; cache results; self-host for heavy use
- Decision: selected. TolongNow searches only on submit, caps results at five, validates Malaysia-only results and reverse-geocodes user-approved browser coordinates to recover Malaysian administrative fields. TolongNow has no location database.

## Temporary evacuation centre (PPS) reconnaissance and pilot decision

The official JKM active temporary evacuation centre (PPS) service is https://infobencanajkmv2.jkm.gov.my/landing/. Malaysia.gov.my describes it at https://www.malaysia.gov.my/my/digital-services/semakan-pusat-pemindahan-sementara-pps-aktif.

On 12 July 2026 the JKM public UI showed six active flood centres in Melaka, 983 victims and 313 families, updated at 01:05 AM. The nationwide flood endpoint used by JKM’s own public interface returned the same six centres with names, coordinates, state, district, DUN/mukim, victim totals, family totals and capacity: https://infobencanajkmv2.jkm.gov.my/api/pusat-buka.php?a=0&b=1.

On 15 July 2026 the same endpoint returned HTTP 200 with a bare empty array (`[]`), and the public JKM page showed no active-centre markers. TolongNow treats this provider-specific empty response as a successful current lookup with no active centres, not as an outage.

This is an official but undocumented internal endpoint. It returns JSON with an incorrect `text/html` content type and provides no CORS, cache metadata, schema version, SLA or response-level update timestamp. TolongNow therefore calls it server-side only, applies an eight-second timeout, caches successful responses for five minutes, validates a strict Zod schema, filters flood records, ranks centres by distance and falls back to the official JKM page when unavailable. Retrieval time is shown separately and is not represented as JKM’s source-update time.

Decision: move the live evacuation-centre pilot to **Melaka Tengah and Alor Gajah** while using the same nationwide feed for submitted Malaysian locations. Show only the nearest three active centres within 15 km so results remain locally relevant. Retain the older Sungai Serai record only inside the clearly labelled historical demonstration fixture; do not use it in live summaries.

### Optional sourced reported-PPS fallback

Kosmo reported seven named PPS across Melaka on 12 July 2026: four in Melaka Tengah, two in Alor Gajah and one in Jasin. The article provided district totals but no per-centre occupancy or coordinates. Three Melaka Tengah school locations were subsequently matched to public EMIS directory records for their postal addresses and coordinates. OpenStreetMap confirmed the Pantai Kundor locality and postcode but not a JAPERUN building, so that card links to an OpenStreetMap locality search rather than claiming an exact pin. The article also contained conflicting statewide aggregates: the body named seven PPS while the image caption said eight, and the district family figures totalled 318 while the statewide figure said 350. TolongNow therefore uses only the seven named centres and their stated district totals. When the fallback setting is enabled, live JKM results remain authoritative; reported centres appear only when no live nearby result is returned, carry one district-level month-and-year label and link directly to the article: https://www.kosmo.com.my/2026/07/12/2-lagi-pps-dibuka-di-melaka-mangsa-banjir-kini-1005-orang/.

## Roads and emergency sources

No road-closure API appeared in the relevant PasarAPI Malaysia catalogue rows. JKR’s official eBencana portal is https://bencana.jkr.gov.my/. Its structured records can contain conflicting status and remarks, so TolongNow links to the portal and does not normalize or recommend routes.

The verified emergency number is MERS 999. Current official source: https://www.malaysia.gov.my/my/my-initiative/keselamatan-siber-dan-tindak-balas-serta-pemulihan-bencana/tindak-balas-serta-pemulihan-bencana/malaysia-emergency-response-services-mers-999.

The contact directory also includes two non-emergency agency lines, both verified on 12 July 2026: NADMA `+603 8870 4800`, published on https://www.nadma.gov.my/, and JKM `03-8000 8000`, published on https://www.jkm.gov.my/main/article/ibu-pejabat. The interface labels these for information and public enquiries; 999 remains the only life-threatening emergency action.
