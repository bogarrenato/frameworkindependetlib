# Angular Custom Brand Demo

Consumer application that demonstrates the Angular wrapper with a consumer-owned custom brand pack. Same wrapper logic as the Brand 1 showcase, but proves that any team can create their own brand identity by implementing the token contract with different CSS values.

## How visual identity arrives

```
styles.css
  @import '@fuggetlenfe/tokens/contract.css';                ← stable token API
  @import '@fuggetlenfe/brand-styles/custom-brand-light.css'; ← custom overrides
  @import '@fuggetlenfe/brand-styles/custom-brand-dark.css';  ← custom overrides

app.ts
  import { FfButton } from '@fuggetlenfe/angular-wrapper';  ← same directive as Brand 1 app

app.html
  <main data-brand="custom-brand" [attr.data-theme]="activeTheme()">  ← different brand
    <ff-button>...</ff-button>                                          ← same component, new look
  </main>
```

The custom brand pack is not synced from Figma. It is hand-authored CSS that overrides the same `--ff-button-*` variables, proving that the token contract supports consumer-owned branding.

## Shell ownership

| Attribute | Value | Purpose |
|---|---|---|
| `data-brand` | `"custom-brand"` | Activates custom brand CSS overrides |
| `data-theme` | `"light"` or `"dark"` | Activates light or dark color scheme |

## Commands

```bash
pnpm dev:angular:custom
pnpm --filter @fuggetlenfe/angular-custom-demo build
```
