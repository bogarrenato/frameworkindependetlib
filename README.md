# Fuggetlenfe Frontend Platform

Ez a monorepo egy enterprise iranyba viheto frontend platform mintat mutat be:

- `Stencil` a frameworkfuggetlen komponenslogika forrasa
- `React` es `Angular` csak wrapper retegen keresztul kapcsolodik
- a design kulon `tokens` es `brand-styles` csomagokbol jon
- a consuming app shell adja a `data-brand` es `data-theme` kontextust

## Mi maradt meg tudatosan

- `packages/components`: logic-only web components
- `packages/react-wrapper`: React bridge layer
- `packages/angular-wrapper`: Angular bridge layer
- `packages/tokens`: stabil public token contract + Figma preset
- `packages/brand-styles`: hivatalos brand CSS packek
- `apps/react-showcase`: React consumer app, Brand 2
- `apps/react-custom-demo`: React consumer app, custom brand
- `apps/angular-showcase`: Angular consumer app, Brand 1
- `apps/angular-custom-demo`: Angular consumer app, custom brand
- Storybookok a library es wrapper ellenorzesere
- `registry/`: kontrollalt copy-ownership escape hatch

## Mit tekintunk public contractnak

- Stencil propok, slotok, es `::part` exportok
- a `packages/tokens/src/contract.css` valtozoi
- a wrapper package-ek publikus exportjai
- a consuming app shell `data-brand` es `data-theme` kontextusa

## Mit nem szabad platform-szinten tenni

- brand vagy theme logikat a wrapper librarykbe tenni
- consumer-specifikus layout vagy business logikat a Stencil komponensekbe tenni
- belso DOM szerkezetre vagy nem dokumentalt classnev-re epitkezni
- a public token contractot breaking governance nelkul valtoztatni

## Gyors inditas

```bash
pnpm install
pnpm build
pnpm test
```

## Lokalis fejlesztes

```bash
pnpm dev:react:brand-2
pnpm dev:react:custom
pnpm dev:angular:brand-1
pnpm dev:angular:custom
pnpm storybook:dev:stencil
pnpm storybook:dev:react
pnpm storybook:dev:angular
```

## Fo dokumentumok

- [Maintenance guide](./docs/MAINTENANCE.md)
- [RFC-000 platform architecture](./docs/RFC-000-platform-architecture.md)
- [Components package guide](./packages/components/README.md)
- [Tokens package guide](./packages/tokens/README.md)
- [Brand styles guide](./packages/brand-styles/README.md)

## Opcionális utilok

Ezek nem a core architektura reszei, hanem tamogato utilok:

- `pnpm figma:sync`
- `pnpm registry:list`
- `pnpm registry:add`
- `pnpm storybook:build`
- `pnpm pages:build`
