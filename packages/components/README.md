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

Every component in this package must obey the SSR author-time rules below. The three new primitives (`ff-dropdown`, `ff-modal`, `ff-data-table`) were designed against these rules from day one.

### Author-time SSR rules

1. `render()` is a pure function of props. No DOM access, no `window`, `document`, `navigator`, `matchMedia`, or `localStorage` lookups.
2. `connectedCallback` and `componentWillLoad` may not touch any browser global. They run on the server.
3. Event listeners on `document` or `window` live only inside `componentDidLoad`, which is client-only.
4. State that differs between server and client (viewport, media queries, storage) is never read inside the component. Consumers pass it through props or `data-*` attributes on the shell.
5. Shadow DOM is serialized via Stencil hydrate's declarative-shadow-dom mode, which requires browser support for DSD (Chrome 111+, Safari 16.4+, Firefox 123+). A DSD polyfill is a viable migration option but is not shipped in the PoC.

## Current components

The package ships 4 primitives: `ff-button`, `ff-dropdown`, `ff-data-table`, and `ff-modal`. All four are SSR-safe, all four read exclusively from the token contract, and none of them carry brand values in their source files.

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

### `ff-dropdown`

A framework-agnostic single-select combobox with full keyboard navigation and ARIA combobox semantics. The `open` state is controlled via a prop so the host application can drive it (useful for forms and modals). Options may be passed as a real array via the property or as a JSON string through the attribute, which makes the component usable from plain HTML and from server-rendered markup.

Source: `src/components/ff-dropdown/`.

#### Key props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `FfDropdownOption[] \| string` | `[]` | Array of `{ value, label, disabled? }` or a JSON string with the same shape |
| `value` | `string \| undefined` | `undefined` | Currently selected option value (controlled) |
| `open` | `boolean` | `false` | Controlled open/close state |
| `disabled` | `boolean` | `false` | Disables the trigger and prevents interaction |
| `placeholder` | `string` | `'Select...'` | Label when no value is selected |

Emits `ffChange` with the new option value and `ffOpenChange` with the next open state.

#### Slots

| Slot | Description |
|---|---|
| `trigger` | Optional override for the trigger content. Defaults to the selected label or placeholder |

#### Shadow parts

| Part | Purpose |
|---|---|
| `trigger` | The button element that opens the list |
| `listbox` | The options container |
| `option` | Each option row |

#### SSR notes

The dropdown is fully SSR-safe. `render()` emits the listbox markup (with `aria-hidden` and `hidden` controlled by the `open` prop) so servers produce stable markup regardless of client state. Keyboard listeners are attached in `componentDidLoad`. Positioning uses CSS only — no measurements are read during render.

### `ff-modal`

A framework-agnostic modal dialog with focus trap, scroll lock, Escape handling, and a backdrop. The component intentionally uses a `div` with `role="dialog"` and `aria-modal="true"` rather than the native `<dialog>` element, because native `<dialog>` is not serializable through Declarative Shadow DOM and would break SSR.

Source: `src/components/ff-modal/`.

#### Key props

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Controlled visibility |
| `closeOnBackdrop` | `boolean` | `true` | Clicks on the backdrop close the modal |
| `closeOnEscape` | `boolean` | `true` | Escape key closes the modal |
| `label` | `string \| undefined` | `undefined` | Accessible name, mapped to `aria-label` if no slotted title is present |

Emits `ffClose` when the user dismisses the modal via backdrop, Escape, or the close button.

#### Slots

| Slot | Description |
|---|---|
| Default | Modal body content |
| `title` | Heading area, wired to `aria-labelledby` |
| `footer` | Optional footer area (action buttons) |

#### Shadow parts

| Part | Purpose |
|---|---|
| `backdrop` | The dimmed overlay behind the dialog |
| `dialog` | The dialog surface |
| `close` | The close affordance in the header |

#### SSR notes

`render()` is pure and produces the full dialog markup regardless of `open` state; visibility is driven by a CSS attribute selector, so the server output is deterministic. Focus trap wiring, scroll-lock application, and document-level key listeners all live in `componentDidLoad` / `disconnectedCallback` and never run on the server.

### `ff-data-table`

A framework-agnostic data table with sortable columns, row selection (none, single, multiple), per-column alignment, and controlled sort state. Sorting is computed inside `render()` as a pure function of `rows`, `sortKey`, and `sortDirection`, which means the server and client produce identical markup. This also makes the component trivially usable with server-driven sort: the consumer hands it pre-sorted rows and leaves `sortKey` / `sortDirection` unset.

Source: `src/components/ff-data-table/`.

#### Key props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `FfDataTableColumn[]` | `[]` | Column definitions: `{ key, label, sortable?, align? }` |
| `rows` | `FfDataTableRow[]` | `[]` | Data rows keyed by `id` |
| `sortKey` | `string \| undefined` | `undefined` | Currently sorted column key (controlled) |
| `sortDirection` | `'asc' \| 'desc' \| undefined` | `undefined` | Sort direction (controlled) |
| `selection` | `'none' \| 'single' \| 'multiple'` | `'none'` | Row selection mode |
| `selectedIds` | `string[]` | `[]` | Currently selected row ids (controlled) |

Emits `ffSortChange` with `{ key, direction }` and `ffSelectionChange` with the next list of selected ids.

#### Slots

| Slot | Description |
|---|---|
| `empty` | Rendered in place of the tbody when `rows` is empty |

#### Shadow parts

| Part | Purpose |
|---|---|
| `table` | The root `<table>` element |
| `header-cell` | Each header cell |
| `row` | Each data row |
| `cell` | Each data cell |

#### SSR notes

Sorting runs in `render()` on a shallow copy of `rows`, so the first server paint matches the client exactly. No DOM measurements are read during render. All event wiring (header click-to-sort, checkbox selection) happens through declarative JSX handlers that Stencil hydrate binds on the client during hydration.

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
