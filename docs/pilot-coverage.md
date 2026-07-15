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

## Demonstration fixture

The Taman Sri Muda scenario dated 18 December 2021 remains demonstration-only. It never replaces a failed live response and is permanently labelled as non-current.
