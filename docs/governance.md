# Platform Governance

This document codifies the governance rules that keep the Fuggetlenfe platform coherent across Figma, tokens, Stencil core, and framework wrappers. It complements `MAINTENANCE.md` (which covers the layer split) with the rules that decide **what ships**, **when it ships**, and **why**.

The governing principle is **Source Alignment**: nothing ships as a platform primitive unless it has an authoritative Figma source that the platform can point to, resolve tokens from, and regenerate visual references against.

## 1. Source Alignment Gate

A primitive may be published on npm only if all of the following are true:

1. The design exists in the canonical Figma file, on the `Components` page, as a component set with named variants.
2. The primitive has an entry in `fuggetlenfe-tokens/src/figma-source-manifest.json` under `primitives`, with at minimum a `figma.publicComponentSetId`, a `figma.variantIds` map, a `stencil.tagName`, and a `tokens` block.
3. Every token referenced in the manifest exists in `fuggetlenfe-tokens/src/contract.css`.
4. The Stencil implementation under `stencil.sourceDir` reads only from the published `--ff-*` contract and carries no brand values in source.
5. The primitive has `status: "stable"` in the manifest.

`status: "roadmap"` primitives may have entries in the manifest (to reserve token names and document open decisions) but must not be exported from any published wrapper package.

`status: "docs-only"` items (composites) live in the manifest for traceability and in `docs/patterns/` for consumer guidance, but do not get a Stencil component or a wrapper export.

Components removed from the shipped set because they lack Figma source move to `nonShippedInventory` in the manifest as an audit trail. They are not re-introduced without a new Figma source.

## 2. The Figma Source Manifest

`fuggetlenfe-tokens/src/figma-source-manifest.json` is the single authoritative mapping between the Figma file and the platform. It is owned by the tokens repository because tokens are the contract that every downstream package consumes.

The manifest encodes:

- **`figma`** — the canonical file identity (key, version, captured timestamp, URL) so every consumer of the manifest knows exactly which snapshot of Figma it was synchronized against.
- **`pages`** — the role of each Figma page: `design-reference`, `primitive-source`, `application-example`. Only `primitive-source` pages produce shipped primitives.
- **`brands`** / **`themes`** — the official brand and theme identifiers with their aliases. Any brand pack published from this platform must match one of these IDs; community brands are published as consumer-owned packs, not platform packs.
- **`primitives`** — one entry per primitive, with the Figma component set IDs, the variant map, the Stencil tag name and source directory, the wrapper export names, the control and per-state token lists, the primitive's `status`, and the list of packages in which it `shipping`s.
- **`composites`** — items that live in Figma as composed instances (label + input, etc.) and are intentionally **not** shipped as primitives. They document the platform's opinion that the composition belongs in consumer code or in `docs/patterns/`.
- **`showcaseFrames`** — the Figma frame IDs that the token sync and the visual regression tooling use as authoritative visual references per theme × brand.
- **`applicationExamples`** — reference-only screens (login, etc.) that are not eligible for platform inclusion but serve as inspiration for a future starter-templates repository.
- **`nonShippedInventory`** — the audit trail for previously inventoried items that were removed because they lacked Figma source.

The manifest is consumed by:

- the token sync script (to know which Figma component sets to walk and which tokens to resolve),
- the Storybook build (to cross-check that every shipped primitive has a story file and a Figma reference link),
- the docs site build (to generate the primitive inventory page), and
- the Source Alignment Gate check in CI (to refuse a `status: "stable"` entry if the referenced tokens or Stencil source directory are missing).

## 3. Adding a new primitive

A new primitive goes through the following phases, in order. Skipping phases is a governance violation, not a shortcut.

1. **Figma** — the component set is authored on the `Components` page with named variants. It must have at minimum a default variant and any interactive states it promises (hover, active, disabled, error, etc.).
2. **Manifest entry with `status: "roadmap"`** — reserve the tag name, the source directory path, the wrapper export name, and the planned `--ff-*` token names. Record any open design decisions in `openDesignDecisions`.
3. **Token contract** — add the `--ff-*` variables to `fuggetlenfe-tokens/src/contract.css` with safe defaults. This is the only step that can break consumer apps if done wrong, so it lands in a dedicated PR in the tokens repository.
4. **Stencil implementation** — implement the primitive in `fuggetlenfe-components`, with unit tests, a Storybook story, and SSR compatibility. The component reads only from the token contract.
5. **Wrapper exports** — regenerate the React and Angular wrapper output targets. The wrapper PRs carry no hand-authored component code.
6. **Promote to `status: "stable"`** — update the manifest, run the Source Alignment Gate check locally, cut coordinated releases of tokens → components → wrappers in that order.

## 4. Removing a primitive

A shipped primitive is removed only if:

- its Figma source has been withdrawn, **or**
- a stakeholder decision has marked it as out of platform scope (recorded in an RFC).

Removal sequence:

1. Mark `status: "deprecated"` in the manifest with a `deprecatedAt` date and a migration note.
2. Keep the Stencil source and wrapper exports for one major version with runtime console warnings.
3. In the next major, delete the Stencil source, the wrapper exports, and the manifest entry. Move the inventory record to `nonShippedInventory` with the removal reason.

## 5. Relationship to the PoC monorepo

This repository (`fuggetlenfepoc`) is a transient PoC. The governance rules in this document apply to the production polyrepo: `fuggetlenfe-tokens`, `fuggetlenfe-components`, `fuggetlenfe-react-wrapper`, and `fuggetlenfe-angular-wrapper`. The PoC follows the same rules so that the migration to polyrepo is a move, not a rewrite.

The manifest lives in `fuggetlenfe-tokens/src/figma-source-manifest.json` (polyrepo) and is the authoritative copy. Any copy present in the PoC monorepo is a convenience mirror and must not diverge.

## 6. What is explicitly out of scope for the platform

- **Dropdown, Modal, DataTable** — previously inventoried, removed 2026-04 because they had no Figma source. See `nonShippedInventory`. They will not be re-introduced without a new Figma source.
- **Login / onboarding templates** — application-level compositions. Candidate for a future `fuggetlenfe-starter-templates` repository; not shipped as primitives.
- **Auth, session, biometry** — shell and shared auth layer responsibility, per `MAINTENANCE.md §9`.
- **Business logic, routing, data layer** — consumer application responsibility.

## 7. Change control

Any change to the manifest schema or to the rules in this document is a governance change and lands as an RFC under `docs/RFC-*.md`, referenced from the next release's changelog.
