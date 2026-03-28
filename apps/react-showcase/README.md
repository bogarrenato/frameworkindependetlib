# React Brand 2 App

Ez a consuming app a React wrapper libraryt hasznalja, a design reteg pedig kulso CSS importokbol jon.

## Import modell

```tsx
import { FfButton } from '@fuggetlenfe/react-wrapper';
import '@fuggetlenfe/tokens/contract.css';
import '@fuggetlenfe/tokens/figma-preset.css';
import '@fuggetlenfe/brand-styles/brand-2-light.css';
import '@fuggetlenfe/brand-styles/brand-2-dark.css';
```

## Shell ownership

- `data-brand="brand-2"`
- `data-theme="light" | "dark"`

## Inditas

```bash
pnpm dev:react:brand-2
```
