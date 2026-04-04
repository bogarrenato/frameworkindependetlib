# React Custom Brand Demo

Consumer application that demonstrates the React wrapper with a consumer-owned custom brand pack. Same wrapper logic as the Brand 2 showcase, but proves that any team can create their own brand identity by implementing the token contract with different CSS values.

## How visual identity arrives

```
main.tsx
  import '@fuggetlenfe/tokens/contract.css'              ← stable token API
  import '@fuggetlenfe/brand-styles/custom-brand-light.css'  ← custom overrides
  import '@fuggetlenfe/brand-styles/custom-brand-dark.css'   ← custom overrides

App.tsx
  import { FfButton } from '@fuggetlenfe/react-wrapper'  ← same bridge as Brand 2 app

  <main data-brand="custom-brand" data-theme={activeTheme}>  ← different brand identity
    <FfButton>...</FfButton>                                   ← same component, new look
  </main>
```

The custom brand pack is not synced from Figma. It is hand-authored CSS that overrides the same `--ff-button-*` variables, proving that the token contract supports consumer-owned branding without touching the component library.

## Shell ownership

| Attribute | Value | Purpose |
|---|---|---|
| `data-brand` | `"custom-brand"` | Activates custom brand CSS overrides |
| `data-theme` | `"light"` or `"dark"` | Activates light or dark color scheme |

## Commands

```bash
pnpm dev:react:custom
pnpm --filter @fuggetlenfe/react-custom-demo build
```
