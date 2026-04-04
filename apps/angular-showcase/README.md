# Angular Brand 1 Showcase

Consumer application that demonstrates the Angular wrapper with the official Brand 1 design pack. This app contains zero component logic. It imports the wrapper directive for template integration, the token contract for the stable CSS API, and the Brand 1 CSS pack for visual identity.

## How visual identity arrives

```
styles.css
  @import '@fuggetlenfe/tokens/contract.css';           ← stable token API (fallback values)
  @import '@fuggetlenfe/brand-styles/brand-1-light.css'; ← Brand 1 light overrides
  @import '@fuggetlenfe/brand-styles/brand-1-dark.css';  ← Brand 1 dark overrides

app.ts
  import { FfButton } from '@fuggetlenfe/angular-wrapper';  ← standalone directive (no styles)

  @Component({
    imports: [FfButton],        ← standalone import, no NgModule needed
  })

app.html
  <main data-brand="brand-1" [attr.data-theme]="activeTheme()">  ← shell activates brand+theme
    <ff-button>...</ff-button>                                     ← directive proxies to web component
  </main>
```

The `FfButton` directive proxies Angular template bindings to the underlying Stencil web component. The web component's shadow DOM CSS reads `--ff-button-*` custom properties, which are defined in `contract.css` and overridden by the brand pack. The `data-brand` and `data-theme` attributes on the shell activate the correct CSS cascade.

## Shell ownership

| Attribute | Value | Purpose |
|---|---|---|
| `data-brand` | `"brand-1"` | Activates Brand 1 CSS overrides |
| `data-theme` | `"light"` or `"dark"` | Activates light or dark color scheme |

Theme switching uses Angular signals: `activeTheme = signal<ThemeMode>('light')`.

## Per-instance customization

The app demonstrates three override mechanisms:
1. **class** on the host element for CSS class-based overrides
2. **[style.--ff-button-*]** for inline token overrides
3. **CSS `::part(button)`** for shadow DOM part styling

## Commands

```bash
pnpm dev:angular:brand-1
pnpm --filter @fuggetlenfe/angular-showcase build
```
