# Stencil Components

Framework-fuggetlen komponenskonyvtar StencilJS-szel.

## Mire valo

Ez a csomag tartalmazza a web komponenseket, es build kozben innen generalodnak a React es Angular wrapperek is.
A komponensek nem egy fix designra vannak egetve: a publikus token contractot hasznaljak, igy a vegso brand es tema kivulrol cserelheto.

## Hogyan mukodik

Fobb elemek:

- Stencil komponensek a `src/components/` alatt
- React wrapper generalas az `apps/react-showcase/src/stencil-generated/` mappaba
- Angular wrapper generalas az `apps/angular-showcase/src/stencil-generated/` mappaba
- Storybook a library ellenorzesere es dokumentalasara
- lokalis registry ownership flow a forras vagy brand pack atadasahoz

Az aktualis pelda komponens az `ff-button`.
Ez a `brand` es `theme` propokbol `data-brand` es `data-theme` attributumokat allit a hoston, a stilus pedig a CSS tokenekbol szamolodik.

## Inditas

Ez a csomag nem kulon app, hanem library. Fejlesztes kozben ket tipikus mod van:

Stencil watch build:

Workspace rootbol:

```bash
pnpm dev:stencil
```

Ebbol a mappabol:

```bash
pnpm dev
```

Ez a Stencil build watch modban ujraforditja a libraryt es a wrapper outputokat.

## Storybook

Workspace rootbol:

```bash
pnpm storybook:dev:stencil
```

Ebbol a mappabol:

```bash
pnpm storybook
```

URL:

```text
http://127.0.0.1:6006
```

Static build:

```bash
pnpm build-storybook
```

## Build

Workspace rootbol:

```bash
pnpm --filter @fuggetlenfe/components build
```

Ebbol a mappabol:

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## Fontos fajlok

- `stencil.config.ts`: output targetok es wrapper generalas
- `src/components/ff-button/`: aktualis button komponens
- `src/stories/`: Stencil Storybook sztorik
- `.storybook/`: Storybook konfiguracio

## Megjegyzes

Ha a komponenseket modositasz, utana a React es Angular showcase appok a generated wrapper outputokon keresztul kapjak meg a frissitest.

Consumer-owned forkhoz hasznalhato:

```bash
pnpm registry:add ff-button-source ./src/owned/components/ff-button
```
