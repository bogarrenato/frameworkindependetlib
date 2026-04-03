# Angular Brand 1 App

Ez a consuming app az Angular wrapper libraryt hasznalja, a design reteg pedig kulso CSS importokbol jon.

## Import modell

```css
@import '@fuggetlenfe/tokens/contract.css';
@import '@fuggetlenfe/brand-styles/brand-1-light.css';
@import '@fuggetlenfe/brand-styles/brand-1-dark.css';
```

## Shell ownership

- `data-brand="brand-1"`
- `data-theme="light" | "dark"`

## Inditas

```bash
pnpm dev:angular:brand-1
```
