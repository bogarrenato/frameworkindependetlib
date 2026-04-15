# Fuggetlenfe Design System

Enterprise-grade, framework-independent frontend UI library monorepo.

Stencil web components serve as the single source of component logic. React and Angular consume that logic through thin, auto-generated wrapper layers. Visual identity is injected externally via a CSS custom property token contract and brand-specific style packs synced from the Figma Variables API.

## Repository shape: PoC monorepo, production polyrepo

This repository is a **transient PoC monorepo**. It exists to validate the full Figma-to-framework pipeline in a single checkout. In production every package graduates to its own independent git repository:

| PoC package | Production repository |
|---|---|
| `@fuggetlenfe/components` | `ds-components` |
| `@fuggetlenfe/tokens` | `ds-tokens` |
| `@fuggetlenfe/brand-styles` | `ds-brand-styles` |
| `@fuggetlenfe/react-wrapper` | `ds-react-wrapper` |
| `@fuggetlenfe/angular-wrapper` | `ds-angular-wrapper` |

Each consumer micro-frontend application also lives in its own repository and depends on the published design system packages via semver. The PoC uses **pnpm workspaces only**. There is no Nx and no Turborepo in this repository, and none is planned for the PoC. Build orchestration is handled by `pnpm --filter` and explicit topological ordering.

## Live site

> **GitHub Pages:** <https://bogarrenato.github.io/frameworkindependetlib/>

| Page | URL |
|---|---|
| Landing page | `/` |
| React Brand 2 app | `/react-brand-2/` |
| React Custom app | `/react-custom/` |
| Angular Brand 1 app | `/angular-brand-1/` |
| Angular Custom app | `/angular-custom/` |
| Stencil Storybook | `/storybook/stencil/` |
| React Storybook | `/storybook/react/` |
| Angular Storybook | `/storybook/angular/` |
| React wrapper docs | `/docs/react-wrapper/` |
| Angular wrapper docs | `/docs/angular-wrapper/` |

## Architecture

```
Figma Design System (source of truth)
      |
      v
Sync Layer ── scripts/sync-figma.mjs ── Figma Variables API
      |
      v
+--------------------------------------------------+
|  packages/tokens         Token contract layer     |
|    contract.css          Stable public CSS vars    |
|    figma-preset.css      Figma-derived defaults    |
+--------------------------------------------------+
      |
      v
+--------------------------------------------------+
|  packages/brand-styles   Visual identity packs    |
|    brand-1-light.css     Official brand themes     |
|    brand-2-dark.css      (data-brand + data-theme) |
|    custom-brand.css      Consumer-owned override   |
+--------------------------------------------------+
      |
      v
+--------------------------------------------------+
|  packages/components     Stencil web components   |
|    ff-button.tsx         Logic + DOM contract      |
|    ff-button.css         Structural CSS only       |
+--------------------------------------------------+
      |                          |
      v                          v
+---------------------+  +------------------------+
| packages/            |  | packages/               |
|   react-wrapper      |  |   angular-wrapper       |
| Auto-generated       |  | Auto-generated          |
| React bridge         |  | Angular standalone      |
| (no logic, no style) |  | directives (no style)   |
+---------------------+  +------------------------+
      |                          |
      v                          v
+---------------------+  +------------------------+
| apps/                |  | apps/                   |
|   react-showcase     |  |   angular-showcase      |
|   react-custom-demo  |  |   angular-custom-demo   |
| Import wrapper +     |  | Import wrapper +         |
| token contract +     |  | token contract +         |
| brand pack CSS       |  | brand pack CSS           |
+---------------------+  +------------------------+
```

## Token flow

1. **Figma** holds the design variables (colors, spacing, radii per brand and theme).
2. **`pnpm figma:sync`** reads the Figma Variables API and generates:
   - `packages/tokens/src/contract.css` (stable public API)
   - `packages/tokens/src/figma-preset.css` (Figma-derived defaults)
   - `packages/brand-styles/src/*.css` (per-brand, per-theme overrides)
3. **Components** only reference `--ff-button-*` and `--ff-color-*` variables from the contract.
4. **Consumer apps** import the contract + a brand pack. The shell element sets `data-brand` and `data-theme` attributes which activate the correct CSS overrides.

## Packages

| Package | Purpose | Public contract |
|---|---|---|
| `@fuggetlenfe/components` | Framework-independent Stencil web components | Props, slots, `::part` exports, CSS token inputs |
| `@fuggetlenfe/tokens` | Stable CSS custom property contract + Figma preset | `contract.css` variables |
| `@fuggetlenfe/brand-styles` | Per-brand, per-theme CSS packs (Figma-synced) | `data-brand` + `data-theme` selectors |
| `@fuggetlenfe/react-wrapper` | Auto-generated React component bridge + `/server` SSR entry point | `FfButton` component export |
| `@fuggetlenfe/angular-wrapper` | Auto-generated Angular standalone directive bridge + `/server` SSR entry point | `FfButton` directive export |

## Applications

| App | Framework | Brand | Purpose |
|---|---|---|---|
| `apps/react-showcase` | React | Brand 2 | Official brand demo |
| `apps/react-custom-demo` | React | Custom | Consumer-owned brand demo |
| `apps/angular-showcase` | Angular | Brand 1 | Official brand demo |
| `apps/angular-custom-demo` | Angular | Custom | Consumer-owned brand demo |

## Current component scope

The platform ships **one stable primitive** (`ff-button`) and has **one roadmap primitive** (`ff-input`). Scope is governed by the **Source Alignment Gate** (see [`docs/governance.md`](./docs/governance.md)): a primitive ships only if it has an authoritative Figma source registered in [`fuggetlenfe-tokens/src/figma-source-manifest.json`](../fuggetlenfe-tokens/src/figma-source-manifest.json). Items without Figma source are not shipped, even if previous iterations of this PoC contained implementations.

| Component | Status | Role |
|---|---|---|
| `ff-button` | stable | Button primitive (Default, Hover, Active, Disabled states) |
| `ff-input` | roadmap | Text input primitive (Default, Hover, Active, Filled, Disabled states). Pending resolution of two design decisions recorded in the manifest before implementation. |

The `FormInput` composite (label + input) is in the Figma file but is intentionally **not** shipped as a platform primitive. It is trivially composable in two lines of consumer code, so it lives in `docs/patterns/` rather than on npm. This follows the governance rule that composites live in docs, primitives live in packages.

### Non-shipped inventory (audit trail)

The following components existed in earlier iterations of this PoC and have been removed because they lack Figma source. They are not re-introduced without a new Figma source. See `nonShippedInventory` in the manifest for the audit trail.

- `ff-dropdown` — removed 2026-04
- `ff-modal` — removed 2026-04
- `ff-data-table` — removed 2026-04

## SSR / SSG contract

The design system is server-rendering safe. The Stencil build emits a `dist-hydrate-script` output target into `packages/components/hydrate/`, which exposes a Node-runnable `renderToString(html, options)` that serializes every `<ff-*>` web component to **Declarative Shadow DOM** (`<template shadowrootmode="open">`). This lets consumer frameworks (Next.js, Remix, Astro, Angular Universal, or any Node renderer) produce fully static HTML that browsers hydrate without a flash of unstyled content.

The framework wrappers expose dedicated server entry points that re-export the hydrate API:

| Entry point | Purpose |
|---|---|
| `@fuggetlenfe/react-wrapper/server` | `renderToString` and `hydrateDocument` for React SSR/SSG pipelines |
| `@fuggetlenfe/angular-wrapper/server` | `renderToString` and `hydrateDocument` for Angular Universal pipelines |

Each showcase application has a `scripts/prerender.mjs` step that runs at build time and produces `dist/ssr-demo.html` — a fully static HTML file containing DSD markup for every `<ff-*>` component in the page.

### Author-time SSR rules

Every component in `@fuggetlenfe/components` must obey the following contract, which is what makes the hydrate output deterministic:

1. `render()` is a pure function of props. No DOM access, no `window`, `document`, `navigator`, `matchMedia`, or `localStorage` lookups.
2. `connectedCallback` and `componentWillLoad` may not touch any browser global. They run on the server.
3. Event listeners on `document` or `window` live only inside `componentDidLoad`, which is client-only.
4. State that differs between server and client (viewport, media queries, storage) is never read inside the component. The consumer passes it through props or `data-*` attributes on the shell.
5. Shadow DOM is serialized via Stencil hydrate's declarative-shadow-dom mode, which requires browser support for Declarative Shadow DOM (Chrome 111+, Safari 16.4+, Firefox 123+). For older browsers, a DSD polyfill is a viable migration option but is not shipped in the PoC.

## Figma Variables fallback plan

The token pipeline is designed to remain operational even if Figma is unavailable. Consumer apps read from the token contract, never from Figma directly, so a design-tool outage never requires code changes in consumer applications.

| Layer | Source | Purpose |
|---|---|---|
| 1. Primary | Figma Variables API via `scripts/sync-figma.mjs` | Normal path: sync variables into `contract.css`, `figma-preset.css`, and the brand packs |
| 2. Fallback 1 | `packages/tokens/tokens/figma-snapshot.json` (committed) | Last known-good export of the Variables API. The build can regenerate tokens from the snapshot if Figma is unreachable |
| 3. Fallback 2 | Hand-authored CSS overrides in `@fuggetlenfe/brand-styles` | Kept in git, exercised in CI, ship without any Figma connectivity |
| 4. Fallback 3 | Penpot migration path | Penpot exposes a comparable variables API; the sync script is written to abstract over the source tool |

The stability guarantee is that `contract.css` is the public API. As long as the contract variable names remain stable, a Figma outage, a Figma billing issue, or a full migration to Penpot does not require code changes in consumer apps.

## What counts as public contract

- Stencil component props, slots, and `::part` exports
- CSS custom property names in `packages/tokens/src/contract.css`
- Wrapper package public exports (`FfButton` today; additions must match primitives marked `status: "stable"` in [`figma-source-manifest.json`](../fuggetlenfe-tokens/src/figma-source-manifest.json)) and their `/server` entry points
- Shell context: `data-brand` and `data-theme` attributes on the consuming app shell

## What must not happen at platform level

- Brand or theme logic in wrapper libraries
- Consumer-specific layout or business logic in Stencil components
- Depending on internal DOM structure or undocumented class names
- Breaking changes to the public token contract without governance

## Quick start

```bash
pnpm install
pnpm build
pnpm test
```

## Local development

```bash
# Consumer apps
pnpm dev:react:brand-2
pnpm dev:react:custom
pnpm dev:angular:brand-1
pnpm dev:angular:custom

# Storybooks
pnpm storybook:dev:stencil
pnpm storybook:dev:react
pnpm storybook:dev:angular
```

## CI / Deploy

```bash
# Full site build (builds all packages, apps, storybooks, docs → .pages/)
pnpm pages:build

# Figma token sync (requires file_variables:read scope)
FIGMA_TOKEN=your_token pnpm figma:sync
```

Push to `main` triggers the GitHub Pages deploy workflow (`.github/workflows/pages.yml`).

## Documentation

- [Components package](./packages/components/README.md)
- [Tokens package](./packages/tokens/README.md)
- [Brand styles package](./packages/brand-styles/README.md)
- [React wrapper](./packages/react-wrapper/README.md)
- [Angular wrapper](./packages/angular-wrapper/README.md)
