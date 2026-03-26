# React Wrapper

Ez a package a `@fuggetlenfe/components` Stencil web component library React wrappere.

Ez a wrapper kifejezetten a React-specifikus reteget tartalmazza.
A React appok ezt a leforditott wrapper libraryt fogyasztjak, mikozben a design rendszer importja tovabbra is app-szinten tortenik.

Fogyasztas:

```tsx
import { FfButton } from '@fuggetlenfe/react-wrapper';
import '@fuggetlenfe/tokens/contract.css';
import '@fuggetlenfe/tokens/figma-preset.css';
import '@fuggetlenfe/brand-styles/demo.css';
```

Build:

```bash
pnpm --filter @fuggetlenfe/components build
pnpm --filter @fuggetlenfe/react-wrapper build
```
