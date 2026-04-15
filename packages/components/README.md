# @fuggetlenfe/components

The behavioral core of the design system. This package contains framework-independent Stencil web components that own semantic logic, DOM structure, and a stable public contract. Visual identity is never defined here; it arrives at runtime through the external token contract and brand pack CSS.

## Architecture role

```
packages/tokens  ──>  contract.css (CSS custom properties)
                            |
packages/brand-styles ──>  brand pack CSS (overrides contract values)
                            |
                            v
packages/components  ──>  ff-button.css reads --ff-button-* vars
                          ff-button.tsx renders logic + DOM contract
                            |
                    ┌───────┴────────┐
                    v                v
           react-wrapper      angular-wrapper
```

Components consume token variables through CSS `var()` fallbacks. They never import brand styles directly. This means the same compiled component binary works with any brand, any theme, and any consumer-owned override.

## SSR / hydration contract

This package ships with an additional Stencil output target, `dist-hydrate-script`, written to `packages/components/hydrate/`. The hydrate bundle runs on Node and exposes `renderToString(html, options)` and `hydrateDocument(doc, options)`, which serialize every `<ff-*>` web component into **Declarative Shadow DOM** (`<template shadowrootmode="open">`). This is the foundation for server-rendered pages in the React and Angular wrappers (see `@fuggetlenfe/react-wrapper/server` and `@fuggetlenfe/angular-wrapper/server`).

Every component in this package must obey the SSR author-time rules below. All shipped primitives are designed against these rules from day one.

### Author-time SSR rules

1. `render()` is a pure function of props. No DOM access, no `window`, `document`, `navigator`, `matchMedia`, or `localStorage` lookups.
2. `connectedCallback` and `componentWillLoad` may not touch any browser global. They run on the server.
3. Event listeners on `document` or `window` live only inside `componentDidLoad`, which is client-only.
4. State that differs between server and client (viewport, media queries, storage) is never read inside the component. Consumers pass it through props or `data-*` attributes on the shell.
5. Shadow DOM is serialized via Stencil hydrate's declarative-shadow-dom mode, which requires browser support for DSD (Chrome 111+, Safari 16.4+, Firefox 123+). A DSD polyfill is a viable migration option but is not shipped in the PoC.

## Current components

The package ships a single stable primitive, `ff-button`, governed by the **Source Alignment Gate** (see [`docs/governance.md`](../../docs/governance.md)): only primitives with an authoritative Figma source listed in [`fuggetlenfe-tokens/src/figma-source-manifest.json`](../../../fuggetlenfe-tokens/src/figma-source-manifest.json) are shipped. `ff-input` is the next scheduled primitive (status `roadmap` in the manifest), pending resolution of the open design decisions recorded there.

`ff-button` is SSR-safe, reads exclusively from the token contract, and carries no brand values in its source files.

### `ff-button`

| File | Role |
|---|---|
| `src/components/ff-button/ff-button.tsx` | Component logic: props, Host class map, native `<button>` rendering, `<slot>` projection |
| `src/components/ff-button/ff-button.css` | Structural CSS: layout, transitions, state selectors. Token values arrive via `--ff-button-*` custom properties |
| `src/components/ff-button/ff-button.spec.tsx` | 14 unit tests covering all props, slot behavior, part exposure, and combined states |
| `src/stories/ff-button.stories.ts` | Storybook stories including a Variants overview |

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | `false` | Disables pointer and keyboard interaction |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type attribute |
| `fullWidth` | `boolean` | `false` | Expands host to 100% width |
| `label` | `string \| undefined` | `undefined` | Fallback text when no slotted content is provided |

### CSS custom property inputs

These variables are consumed by `ff-button.css` and must be defined by the token contract or a brand pack:

| Variable | State | Fallback |
|---|---|---|
| `--ff-button-bg-default` | Default | `transparent` |
| `--ff-button-fg-default` | Default | `inherit` |
| `--ff-button-bg-hover` | Hover | Falls back to default |
| `--ff-button-fg-hover` | Hover | Falls back to default |
| `--ff-button-bg-active` | Active | Falls back to default |
| `--ff-button-fg-active` | Active | Falls back to default |
| `--ff-button-bg-disabled` | Disabled | `transparent` |
| `--ff-button-fg-disabled` | Disabled | `inherit` |
| `--ff-button-radius` | All | `0px` |
| `--ff-button-padding-inline` | All | `0px` |
| `--ff-button-padding-block` | All | `0px` |
| `--ff-font-family-brand` | All | `inherit` |

### Shadow parts

| Part | Element | Purpose |
|---|---|---|
| `button` | Native `<button>` | Allows consumer apps to apply `::part(button)` overrides |

### Slots

| Slot | Description |
|---|---|
| Default | Projected content inside the button. Falls back to `label` prop value. |

### `ff-input` (roadmap)

Registered in the manifest with `status: "roadmap"`. The Figma component set `114:402` defines Default, Hover, Active, Filled, and Disabled states. Implementation is blocked on two design decisions recorded in the manifest:

1. Whether the `Filled` state is a distinct visual surface or a CSS-driven `:not(:placeholder-shown)` derivation of the Default state.
2. Whether the element exposes only `::part(input)` or additionally `::part(label)`. The `FormInput` composite in Figma implies the label is a separate DOM layer owned by the consumer, which argues for `::part(input)` only.

Until these are resolved, no `ff-input` source exists in this package and no wrapper export is published.

## Non-shipped inventory

Previously inventoried components that were removed because they lacked Figma source (see `nonShippedInventory` in the manifest):

- `ff-dropdown` — removed 2026-04
- `ff-modal` — removed 2026-04
- `ff-data-table` — removed 2026-04

Re-introduction requires a new Figma source and a manifest entry, per the Source Alignment Gate.

## What must not go here

- Brand selection or theme switching logic
- Dark/light mode detection
- Consumer-specific business logic
- Framework-specific workarounds (those belong in wrapper packages)

## Commands

```bash
pnpm --filter @fuggetlenfe/components build
pnpm --filter @fuggetlenfe/components test
pnpm --filter @fuggetlenfe/components storybook
pnpm --filter @fuggetlenfe/components build-storybook
```
