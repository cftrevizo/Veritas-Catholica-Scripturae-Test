# Veritas Catholica Scripturae — Project Handoff

**Current repository package:** `VCS 1.10.0 C1.3`  
**Deployment unit:** the contents of `docs/`  
**Purpose:** this document is the single resume point for a new VCS work session.

**Reconstruction note (October 5, 2026):** this C1.3 package was rebuilt from the supplied C1 archive and the available post-C1 project conversation after prior temporary artifacts were unavailable. Read `VCS_C1_3_RECONSTRUCTION_AUDIT.md` before treating any reconstructed Padre Luis or social-media record as source-level verified.

## What VCS is

Veritas Catholica Scripturae (VCS) is a Catholic Scripture-study and formation site. It presents cross-reference exploration, Study Topics, historical and source-oriented material, and apologetics pathways. Catholic doctrine must be grounded in Scripture, the Catechism of the Catholic Church, and appropriate primary Church sources; VCS data relationships, videos, and community material do not replace those authorities.

## Current public test build

The current C1 public test build includes:

- the existing Scripture explorer and visual resources;
- 201 Study Topics and the existing Defending-the-Faith pathway;
- **Catechism Essentials**, a 12-module guided entry path with official Catechism entry links;
- **Community Relationship Review**, a read-only, filterable catalog of 673 Deuterocanon ↔ New Testament relationship candidates, with filtered Markdown download;
- selected Timeline source and date-precision cues;
- a Sources & Methodology boundary describing the 1.10 C1 test scope.

The C1 build does **not** enable public comment or feedback submission. It must remain read-only until the provenance, moderation, privacy, licensing, and review workflow is approved.

## Release sequence reconstructed in this package

| Release | Scope | Public-site effect |
| --- | --- | --- |
| 1.10.0 C1 | Catechism Essentials, 673-record Community Review catalog, Timeline readiness cues | Implemented in `docs/` |
| 1.10.0 C1.1 | Padre Luis Toro Spanish-first seed index: 6 debate/dialogue, 6 Q&A, 4 general-teaching records | Data-only |
| 1.10.0 C1.2 | Padre Luis Toro public social-media discovery layer: 12 Facebook discovery records plus YouTube/Facebook/Instagram profile leads | Data-only |
| 1.10.0 C1.3 | This handoff document and the full current-state resume instructions | Data/documentation only |

## Key data assets

### C1 study and review foundations

- `data/catechism_essentials_blueprint.json` — 12 modules, official CCC entry URLs, linked VCS topics, and review boundaries.
- `data/catechism_essentials_link_readiness.json` — link-readiness records; do not invent paragraph mappings beyond what editorial review approves.
- `data/community_relationship_review_catalog.json` — 673 review candidates with stable IDs. Candidates are not verified direct quotations, literary dependence, peer review, doctrine, or theological conclusions.
- `data/relationship_provenance_bridge.json` — boundary for the inherited `NA27-authored` label.
- `data/timeline_source_enrichment_candidates.json` — six contextual source candidates and six events requiring human source selection.
- `data/implementation_acceptance_checks.json` — accessibility, behavior, provenance, and submission requirements for future work.

### Padre Luis Toro discovery data

- `data/padre_luis_toro_source_index.json` and `.csv` — 16 Spanish-first seed records in three lanes: Protestant debate/dialogue, Protestant-objection Q&A, and general Catholic teaching.
- `data/padre_luis_toro_social_media_discovery.json` and `.csv` — 12 public social-media discovery records. It also identifies public YouTube, Facebook, and Instagram profile leads.
- `data/PADRE_LUIS_TORO_INDEX_README.md` and `data/PADRE_LUIS_TORO_SOCIAL_MEDIA_README.md` — required source, attribution, and review boundaries.
- `VCS_C1_3_RECONSTRUCTION_AUDIT.md` — request-to-artifact trace, validation record, and limits of the C1.3 reconstruction.

Padre Luis records are formation/apologetics discovery sources, not Magisterial authority. Retain the Spanish title and original platform URL. Keep the uploader/source distinct from Padre Luis Toro's actual participation; a fan repost or mirror is never treated as an affiliated or canonical source. Any public VCS use must first verify the source, content, context, timestamp, and an independent Scripture/CCC/primary-source evidence path.

## Current source rules

1. Official Catholic teaching is anchored in the Catechism and primary Church sources, not in summaries, posts, or debate videos.
2. A relationship in the community catalog is a review candidate until an approved source establishes the type of relationship.
3. Do not silently repair Scripture references or add a verse/range when the original intended locator is unclear.
4. Use visible labels for approximate and traditional dates; never render them as firm historical anchors.
5. Treat social-media and third-party uploads as discovery metadata unless the original source and content are verified.
6. Do not characterize a source as peer-reviewed merely because it is university-, museum-, or scholarly-looking.
7. Public feedback, if later added, must be moderated and must not silently become evidence, doctrine, or public content.

## Editorial/manual items still pending

- Confirm the intended verse or range for the 12 flagged Scripture-reference records.
- Supply or select a citable bibliography explaining the `NA27-authored` relationship-dataset label.
- Select exact, accountable sources for the Timeline events still marked source-needed.
- Approve paragraph-specific CCC mappings rather than inferring them from broad CCC ranges.
- Review external-source decisions and scholarly validation workbooks before promoting imported arguments into Study Topics.
- Verify every Padre Luis record selected for visible use, including original title, uploader, participation, topic, relevant timestamp, and independent Catholic evidence path.

## Recommended next implementation package

Build a **Defending the Faith / common-objection registry** rather than a personality-centered video archive:

- map each vetted Padre Luis record to an existing VCS Study Topic, a distinct objection variant, or a clearly marked candidate new topic;
- give each objection a neutral title, common Spanish/English phrasing, claim type, tradition/context only where the source identifies it, frequency signal, and a Catholic evidence path;
- display a source type such as **Padre Luis Toro reference** only after record-level review;
- keep VCS-authored English summaries distinct from Spanish source material and never publish large transcripts by default;
- do not add a public submission form until the community-feedback acceptance checks are satisfied.

## Validation before deployment

Run at least these checks after any edit:

1. Parse all edited JSON and confirm declared record counts.
2. Verify JavaScript syntax for changed assets.
3. Open `index.html`, `topics.html`, `community-review.html`, `sources.html`, and any changed page through a local static server; test the new path, filters, download, keyboard flow, and mobile layout.
4. Confirm that all external links open the intended target and that no source boundary was removed.
5. Check that `VCS_PROJECT_HANDOFF.md` reflects the package’s version, changes, data assets, and next steps.

## Repository handoff standard

For every future package:

- update this document in the same change set;
- package the full deployable `docs/` folder, not a partial patch unless the user specifically requests a patch;
- preserve the previous package as a user-owned download/source; do not rely only on a temporary workspace link;
- label the package version in file names, HTML-visible release labels, cache-busting URLs, and this document consistently.

## Starter prompt for a new chat

> I am continuing the Veritas Catholica Scripturae project. I have attached the current GitHub-ready `docs` package. Read `docs/VCS_PROJECT_HANDOFF.md` first, inspect the existing files before changing anything, preserve all source and doctrinal boundaries, update the handoff in the same package, validate JSON/JS/site behavior, and return a complete replacement `docs` ZIP.
