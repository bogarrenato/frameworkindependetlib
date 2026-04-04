# @fuggetlenfe/tokens

The design contract layer. This package defines the stable public CSS custom property API that every component reads from. Values are synced from the Figma Variables API and distributed as plain CSS files.

## Architecture role

```
Figma Variables API
      |
      v
sync-figma.mjs / sync-core.mjs
      |
      ├──> contract.css       Stable public API (--ff-button-*, --ff-color-*)
      ├──> figma-preset.css   Figma-derived default values
      ├──> theme.css           Theme layer
      ├──> tokens.json         Machine-readable token export
      └──> index.js + .d.ts   JS/TS token access
```

## Layers

The token system has three layers, applied in cascade order:

1. **`contract.css`** - The stable public API. Defines every `--ff-*` variable with safe fallback values. Components read only from this layer.
2. **`figma-preset.css`** - Figma-derived default values that fill the contract. This is the bridge between Figma and the token API.
3. **Brand pack CSS** (from `@fuggetlenfe/brand-styles`) - Per-brand, per-theme overrides that sit on top of the contract. These are what actually give the components a visual identity.

Consumer apps import `contract.css` + a brand pack. They do not need `figma-preset.css` directly.

## Key principle

Components consume the contract, never concrete brand colors. This is what makes the same component logic work across every brand and theme combination.

## Token categories

| Prefix | Scope | Example |
|---|---|---|
| `--ff-button-*` | Button component states | `--ff-button-bg-default`, `--ff-button-radius` |
| `--ff-color-*` | Global color palette | `--ff-color-canvas`, `--ff-color-text-primary` |
| `--ff-font-*` | Typography | `--ff-font-family-brand` |

## Figma sync

```bash
FIGMA_TOKEN=your_token pnpm figma:sync
```

Requirements:
- The Figma token must have the `file_variables:read` scope
- The sync reads Figma Variables and maps them to CSS custom properties through explicit name-based bindings defined in `sync-core.mjs`
- If a required token binding is missing in Figma, the sync fails with a clear error (not silently)

The sync also generates the official brand packs in `packages/brand-styles/src/`.

## Exports

| Export | Format | Purpose |
|---|---|---|
| `@fuggetlenfe/tokens/contract.css` | CSS | Stable public token API |
| `@fuggetlenfe/tokens/figma-preset.css` | CSS | Figma-derived defaults |
| `@fuggetlenfe/tokens/theme.css` | CSS | Theme layer |
| `@fuggetlenfe/tokens/tokens.json` | JSON | Machine-readable tokens |

## What must not go here

- Component-specific logic
- Brand selection or switching logic
- Consumer-specific overrides (those go in brand-styles or the consumer app)
