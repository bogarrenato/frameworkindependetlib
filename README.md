# Fuggetlenfe Design System

Enterprise-grade, framework-independent frontend UI library monorepo.

Stencil web components serve as the single source of component logic. React and Angular consume that logic through thin, auto-generated wrapper layers. Visual identity is injected externally via a CSS custom property token contract and brand-specific style packs synced from the Figma Variables API.

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
| `@fuggetlenfe/react-wrapper` | Auto-generated React component bridge | `FfButton` component export |
| `@fuggetlenfe/angular-wrapper` | Auto-generated Angular standalone directive bridge | `FfButton` directive export |

## Applications

| App | Framework | Brand | Purpose |
|---|---|---|---|
| `apps/react-showcase` | React | Brand 2 | Official brand demo |
| `apps/react-custom-demo` | React | Custom | Consumer-owned brand demo |
| `apps/angular-showcase` | Angular | Brand 1 | Official brand demo |
| `apps/angular-custom-demo` | Angular | Custom | Consumer-owned brand demo |

## Current component scope

The only component that exists in the Figma design system is the **button** (`ff-button`). This is intentional: the PoC validates the full pipeline (Figma sync, token contract, brand packs, Stencil core, framework wrappers, consumer apps) with a single primitive before scaling to a full component library.

## What counts as public contract

- Stencil component props, slots, and `::part` exports
- CSS custom property names in `packages/tokens/src/contract.css`
- Wrapper package public exports (`FfButton`)
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
