# React Custom App

Ez a consuming app ugyanazt a React wrapper logicat hasznalja, mint a Brand 2 app, de kulso custom brand packet importal.

## Import modell

```tsx
import { FfButton } from '@fuggetlenfe/react-wrapper';
import '@fuggetlenfe/tokens/contract.css';
import '@fuggetlenfe/tokens/figma-preset.css';
import '@fuggetlenfe/brand-styles/custom-brand-light.css';
import '@fuggetlenfe/brand-styles/custom-brand-dark.css';
```

## Shell ownership

- `data-brand="custom-brand"`
- `data-theme="light" | "dark"`

## Inditas

```bash
pnpm dev:react:custom
```
