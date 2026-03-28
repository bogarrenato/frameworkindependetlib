# Angular Wrapper

Ez a csomag csak az Angular integracios reteget adja a Stencil komponensekhez.

## Felelossege

- Angular standalone exportok
- Angular template kompatibilitas
- property es event bridge

## Ami nem ide valo

- styling
- theme valtas
- brand valasztas
- app-level business logika

## Fogyasztas

```ts
import { FfButton } from '@fuggetlenfe/angular-wrapper';
```

```css
@import '@fuggetlenfe/tokens/contract.css';
@import '@fuggetlenfe/tokens/figma-preset.css';
@import '@fuggetlenfe/brand-styles/brand-1-light.css';
@import '@fuggetlenfe/brand-styles/brand-1-dark.css';
```
