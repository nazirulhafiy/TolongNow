# Pilot coverage

> The live temporary evacuation centre (PPS) pilot is centred on Melaka. TolongNow checks JKM’s nationwide active flood-centre listing and filters centres by distance for any submitted Malaysian location; the official listing may legitimately contain no active centres.

## Melaka Tengah

This is the primary live pilot. When centres are active, TolongNow retrieves current JKM InfoBencana centres within 15 km, validates the official response, shows the nearest three centres and includes occupant, family and capacity figures. Weather warnings and district forecasts load independently.

## Alor Gajah

Alor Gajah is the second live pilot location. Its active JKM centres are handled by the same nationwide provider and distance filter as Melaka Tengah.

## Outside the pilot

Submitted Malaysian locations use the same live JKM lookup. When no active centre is returned within 15 km, TolongNow shows that exact limitation and links to the official JKM service instead of guessing.

## Empty and historical results

JKM returns a bare empty array (`[]`) when its current nationwide listing has no active centres. TolongNow treats that as a successful current lookup, not a provider outage. If `SHOW_REPORTED_PPS_FALLBACK=true`, the area page can instead show named centres from a dated report for the selected district. One district-level “Previously reported in July 2026” label distinguishes the fallback from live data, and its source link sits beside the district totals. District totals are kept separate because the report does not provide per-centre occupancy.

The sourced fallback covers four Melaka Tengah centres, two Alor Gajah centres and one Jasin centre. The Melaka Tengah report gives district totals of 942 people and 301 families. Three school cards use separately verified coordinates; JAPERUN Pantai Kundur opens an OpenStreetMap locality search because no building-level record was found.

`historyPreview=true` is a review override for this same fallback. It does not bypass live-result priority, affect the demonstration fixture or relabel reported information as current.

## Production QA expectations

- A production deployment must identify the intended Git commit and reach `READY` before browser QA begins.
- The selected-location route must return HTTP 200 without runtime error clusters.
- Current JKM results, when present, must render instead of reported cards.
- A reported fallback must show one month-and-year label, one source link and district-level totals, with no repeated live-status or verification claims on individual cards.
- Exact OpenStreetMap pins require verified coordinates. A locality-only match must use a search link instead.
- A visual QA pass requires the rendered page, responsive card layout, external links and browser console to be checked; deployment readiness alone is not a visual pass.

## Current production QA status

Checked on 15 July 2026 against commit `fb20ecd` and Vercel deployment `dpl_A7gm3Tdy6A6WXTzUc1Zm3FPMjiMi`:

- Vercel reported the Git-triggered production deployment as `READY`, with `tolong.hafiy.my` assigned as an alias.
- The selected-location route returned HTTP 200. Vercel reported no runtime error clusters in the preceding hour; observed requests were HTTP 200 or 304.
- The normal production URL rendered the successful empty-JKM state, not the reported fallback. `SHOW_REPORTED_PPS_FALLBACK` therefore still needs to be enabled in the Production environment and redeployed if the fallback should appear without the review override.
- The `historyPreview=true` URL rendered the expected July 2026 label, Melaka Tengah totals, four centre cards, source link, three coordinate-backed OpenStreetMap pins and the JAPERUN locality-search link.
- The fallback layout rendered as a two-column desktop/tablet grid and a single-column narrow-mobile stack.
- Browser QA logged React hydration error `#418` on both the normal and review URLs. The mismatch was traced to timezone-free MET Malaysia timestamps: Vercel rendered them as UTC while Malaysia browsers interpreted them as local time. The shared timestamp parser now treats timezone-free provider values as UTC+8, with explicit-timezone values preserved. Local browser hydration and automated timestamp tests pass; production confirmation requires the updated commit to deploy.

## Demonstration fixture

The Taman Sri Muda scenario dated 18 December 2021 remains demonstration-only. It never replaces a failed live response and is permanently labelled as non-current.
