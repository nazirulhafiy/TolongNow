# Safety and limitations

TolongNow is an informational hackathon prototype. It brings official information into a clearer interface but is not an emergency service.

- TolongNow does not dispatch or monitor rescue services.
- It does not guarantee that a temporary evacuation centre (PPS) is open, reachable or has capacity.
- It does not verify that a road is passable and does not provide evacuation routing.
- It does not generate official warnings or an overall flood-risk score.
- It does not replace instructions from emergency authorities.
- Live information may be delayed, stale, incomplete or temporarily unavailable.
- Browser location is sent only after the user selects the location option, then reverse-geocoded through OpenStreetMap to identify the area. TolongNow has no account or location database and does not retain the result.
- A below-threshold river reading is not a declaration that an area is safe.
- Historical/demo data is stored separately and always carries a permanent non-current banner.

Users in immediate danger should call **999**.

## Data-failure behaviour

External requests have timeouts, runtime response validation and provider-specific caching. The area summary uses independent settled requests, so weather warnings and contacts remain visible if river or forecast data fails. Stale river observations are omitted rather than relabelled as current. No live failure is silently replaced with demonstration data.

MET Malaysia timestamps without an explicit timezone are interpreted as Malaysia time (UTC+8) before freshness checks or display formatting. Explicit timezone offsets are preserved. This keeps server-rendered and browser-rendered warning times consistent.

A successful empty JKM response means the official feed currently lists no active PPS within the search radius; it is not labelled as an outage. An optional reported-PPS fallback may show dated, source-linked locations, but it never labels them as live or currently open. Distances are not calculated, district occupancy totals are not assigned to individual centres, and exact map pins are shown only for separately verified coordinate matches. A locality-only match opens an OpenStreetMap search instead.

The `historyPreview=true` review override changes only whether the reported fallback is eligible to render. It does not override a live JKM result, and the displayed information retains the same month-and-year label and source attribution.
