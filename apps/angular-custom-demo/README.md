# Angular Custom App

Ez a consuming app ugyanazt az Angular wrapper logicat hasznalja, mint a Brand 1 app, de kulso custom brand packet importal.

## Import modell

```css
@import '@fuggetlenfe/tokens/contract.css';
@import '@fuggetlenfe/tokens/figma-preset.css';
@import '@fuggetlenfe/brand-styles/custom-brand-light.css';
@import '@fuggetlenfe/brand-styles/custom-brand-dark.css';
```

## Shell ownership

- `data-brand="custom-brand"`
- `data-theme="light" | "dark"`

## Inditas

```bash
pnpm dev:angular:custom
```
