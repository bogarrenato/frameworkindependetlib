# React Brand 2 Showcase

Consumer application that demonstrates the React wrapper with the official Brand 2 design pack. This app contains zero component logic. It imports the wrapper for framework integration, the token contract for the stable CSS API, and the Brand 2 CSS pack for visual identity.

## How visual identity arrives

```
main.tsx
  import '@fuggetlenfe/tokens/contract.css'        ← stable token API (fallback values)
  import '@fuggetlenfe/brand-styles/brand-2-light.css'  ← Brand 2 light overrides
  import '@fuggetlenfe/brand-styles/brand-2-dark.css'   ← Brand 2 dark overrides

App.tsx
  import { FfButton } from '@fuggetlenfe/react-wrapper'  ← logic bridge only (no styles)

  <main data-brand="brand-2" data-theme={activeTheme}>   ← shell activates brand+theme
    <FfButton>...</FfButton>                              ← component reads token vars
  </main>
```

The `FfButton` component renders a Stencil web component inside shadow DOM. Its CSS reads `--ff-button-*` custom properties. Those properties are defined by `contract.css` and overridden by the brand pack CSS, which is activated by the `data-brand` and `data-theme` attributes on the shell element.

## Shell ownership

| Attribute | Value | Purpose |
|---|---|---|
| `data-brand` | `"brand-2"` | Activates Brand 2 CSS overrides |
| `data-theme` | `"light"` or `"dark"` | Activates light or dark color scheme |

Theme switching happens by changing the `data-theme` attribute. No JavaScript API is needed inside the component.

## Per-instance customization

The app demonstrates three override mechanisms:
1. **className** on the wrapper host for CSS class-based overrides
2. **style** with `CssTokenOverrides` type for inline token overrides (no `as CSSProperties` assertions)
3. **CSS `::part(button)`** for shadow DOM part styling

## Commands

```bash
pnpm dev:react:brand-2
pnpm --filter @fuggetlenfe/react-showcase build
```
