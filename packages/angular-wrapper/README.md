# Angular Wrapper

Ez a package a `@fuggetlenfe/components` Stencil web component library Angular standalone wrappere.

Ez a wrapper csak az Angular-specifikus integracios reteget tartalmazza.
Az Angular app a leforditott wrapper libraryt fogyasztja, mikozben a design rendszer importja tovabbra is app-szinten tortenik.

Fogyasztas:

```ts
import { FfButton } from '@fuggetlenfe/angular-wrapper';
```

Globalis design reteg:

```css
@import '@fuggetlenfe/tokens/contract.css';
@import '@fuggetlenfe/tokens/figma-preset.css';
@import '@fuggetlenfe/brand-styles/demo.css';
```

Build:

```bash
pnpm --filter @fuggetlenfe/components build
pnpm --filter @fuggetlenfe/angular-wrapper build
```
