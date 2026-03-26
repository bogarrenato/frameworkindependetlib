# Fuggetlenfe Design System POC

Monorepo egy Figma-bol szinkronizalt, multi-brand design systemhez.
A workspace tartalmaz:

- egy Figma token csomagot
- egy Stencil alapu, framework-fuggetlen komponenskonyvtarat
- egy React showcase appot a generated React wrapperrel
- egy Angular showcase appot a generated Angular wrapperrel
- kulon Storybookokat a Stencil, React es Angular nezethez

## Workspace csomagok

- `packages/tokens`: Figma-bol generalt tokenek, publikus CSS contracttal
- `packages/components`: Stencil komponenskonyvtar es wrapper generalas
- `apps/react-showcase`: React demo app
- `apps/angular-showcase`: Angular demo app
- `registry`: lokalis registry manifestok es installalhato ownership itemek
- `examples/external-brand.css`: kulso consumer override pelda

## Hogyan mukodik

A design retegzett, hogy a komponensek ne legyenek egyetlen beégetett arculathoz kotve.

1. `@fuggetlenfe/tokens/contract.css`
2. `@fuggetlenfe/tokens/figma-preset.css`
3. sajat consumer override CSS

Ez a minta hasonlo a shadcn szemleletehez: a komponens a stabil token contractot hasznalja, a vegso kinezet pedig kivulrol felulirhato.

## Elofeltetelek

- Node.js 20+
- `pnpm` 10+

Telepites:

```bash
pnpm install
```

## Gyors inditas

Workspace rootbol:

```bash
pnpm dev:react
pnpm dev:angular
pnpm storybook:dev:stencil
pnpm storybook:dev:react
pnpm storybook:dev:angular
```

Elert pontok:

- React app: `http://localhost:5173`
- Angular app: `http://127.0.0.1:4200`
- Stencil Storybook: `http://127.0.0.1:6006`
- React Storybook: `http://127.0.0.1:6007`
- Angular Storybook: `http://127.0.0.1:6008`

## Fontos parancsok

Workspace rootbol:

```bash
pnpm build
pnpm lint
pnpm registry:list
pnpm registry:add ff-button-source ./src/owned/components/ff-button
pnpm registry:add owned-brand-pack ./src/owned/brands/registry-owned
pnpm test
pnpm storybook:build
```

Figma token ujraszinkron:

```bash
FIGMA_TOKEN=your_token_here pnpm figma:sync
```

## Storybook static build hostolas

Mindharom Storybook static output a `storybook-static/` mappaba kerul.

Build:

```bash
pnpm storybook:build
```

Hostolas:

```bash
python3 -m http.server 6006 --bind 127.0.0.1 --directory storybook-static/stencil
python3 -m http.server 6007 --bind 127.0.0.1 --directory storybook-static/react
python3 -m http.server 6008 --bind 127.0.0.1 --directory storybook-static/angular
```

## GitHub Pages hostolas

Ingyenesen hostolhato GitHub Pages-en egyetlen kozos statikus site-kent.

Build:

```bash
pnpm pages:build
```

Ez egy `.pages/` mappat general, amiben benne van:

- landing page
- React showcase
- Angular showcase
- Stencil Storybook
- React Storybook
- Angular Storybook

Lokalis ellenorzes:

```bash
python3 -m http.server 6010 --bind 127.0.0.1 --directory .pages
```

Ha a repo neve `frameworkindependetlib`, akkor a publikus URL-ek:

- `https://bogarrenato.github.io/frameworkindependetlib/`
- `https://bogarrenato.github.io/frameworkindependetlib/react/`
- `https://bogarrenato.github.io/frameworkindependetlib/angular/`
- `https://bogarrenato.github.io/frameworkindependetlib/storybook/stencil/`
- `https://bogarrenato.github.io/frameworkindependetlib/storybook/react/`
- `https://bogarrenato.github.io/frameworkindependetlib/storybook/angular/`

Az automatikus deploy workflow a `.github/workflows/pages.yml` fajlban van. Elso alkalommal a GitHub repo `Settings > Pages` reszen a source-ot erdemes `GitHub Actions`-ra allitani.

## Registry ownership

A workspace lokalis registryt is tartalmaz a shadcn-szeru ownership flow-hoz.

- `ff-button-source`: bemasolja a Stencil button forrasat egy consumer-owned mappaba
- `owned-brand-pack`: bemasol egy szerkesztheto CSS brand packet a `registry-owned` kulcshoz

A repo mar tartalmaz egy mintakent telepitett registry outputot is:

- `examples/registry-installed/ff-button-source`
- `examples/registry-installed/owned-brand-pack`

## Figma forras

- Figma file key: `scEvsCrwxBBllYGMaz4vKH`
- Sync script: `scripts/sync-figma.mjs`

A mostani sync a file jelenlegi struktura alapjan a palette-eket, a light/dark foundation tokeneket es a multi-brand button allapotokat olvassa ki.

## Reszletes dokumentacio

- Root szintu futtatas: ez a README
- React app: `apps/react-showcase/README.md`
- Angular app: `apps/angular-showcase/README.md`
- Stencil komponensek: `packages/components/README.md`
- Token csomag: `packages/tokens/README.md`
