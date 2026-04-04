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

## Current component

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
