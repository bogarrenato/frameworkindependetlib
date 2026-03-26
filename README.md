# Fuggetlenfe Design System POC

Ez a monorepo azt a mintat mutatja be, hogy:

- a `@fuggetlenfe/components` csak a Stencil web component logikat adja
- a `@fuggetlenfe/react-wrapper` es `@fuggetlenfe/angular-wrapper` csak a framework-specifikus integraciot adja
- a visualis design kulso CSS-bol erkezik, akar kulon librarybol

## Fo retegzes

- `packages/components`: framework-fuggetlen web component library
- `packages/react-wrapper`: React wrapper lib
- `packages/angular-wrapper`: Angular wrapper lib
- `packages/tokens`: neutral token contract
- `packages/brand-styles`: kulon importalhato brand CSS library

## Demo appok

- `apps/react-showcase`: React Brand 2 app
- `apps/react-custom-demo`: React custom brand app
- `apps/angular-showcase`: Angular Brand 1 app
- `apps/angular-custom-demo`: Angular custom brand app

Mindegyik app ugyanazt a wrapper logikat fogyasztja, es kulso CSS importoktol kapja meg a vizualis identitast.

## Lokalis inditas

```bash
pnpm dev:react:brand-2
pnpm dev:react:custom
pnpm dev:angular:brand-1
pnpm dev:angular:custom
pnpm storybook:dev:stencil
pnpm storybook:dev:react
pnpm storybook:dev:angular
```

Lokalis URL-ek:

- React Brand 2: `http://localhost:5173`
- React custom: `http://localhost:5174`
- Angular Brand 1: `http://localhost:4200`
- Angular custom: `http://localhost:4201`
- Stencil Storybook: `http://127.0.0.1:6006`
- React Storybook: `http://127.0.0.1:6007`
- Angular Storybook: `http://127.0.0.1:6008`

## Build

```bash
pnpm build
pnpm storybook:build
pnpm pages:build
```

## GitHub Pages

A `pnpm pages:build` egy kozos `.pages/` kimenetet general, benne:

- `react-brand-2/`
- `react-custom/`
- `angular-brand-1/`
- `angular-custom/`
- `storybook/stencil/`
- `storybook/react/`
- `storybook/angular/`
