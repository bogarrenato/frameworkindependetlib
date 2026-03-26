# React Showcase

React demo app, ami a kulon leforditott `@fuggetlenfe/react-wrapper` libraryt fogyasztja.

## Mire valo

Ez az app azt mutatja meg, hogyan hasznalhato a komponenskonyvtar React kornyezetben ugy, hogy:

- a Figma preset aktiv
- a dark/light tema valthato
- a brand valthato
- kulon consumer CSS override library is ra tud ulni a token contractra
- registrybol telepitett consumer-owned brand pack is behozhato

Az app nem kozvetlenul a Stencil source-generated fajlokat hasznalja, hanem ezt a lancot:

1. `@fuggetlenfe/components`
2. `@fuggetlenfe/react-wrapper`
3. `@fuggetlenfe/tokens` es `@fuggetlenfe/brand-styles`
4. `apps/react-showcase`

## Hogyan mukodik

Az app-szintu design layering:

1. `@fuggetlenfe/tokens/contract.css`
2. `@fuggetlenfe/tokens/figma-preset.css`
3. `@fuggetlenfe/brand-styles/demo.css`

Az app a brand/theme allapot alapjan a megfelelo `data-brand` es `data-theme` attributumokat alkalmazza, a komponensek pedig ezekbol a tokenekbol olvasnak.

Az aktualis demo tovabbi ket bizonyitast is ad:

- a hero CTA valodi launch allapotot frissit, tehat a wrapper nem csak statikus preview
- van egy elo token lab, ahol a `registry-owned` brand CSS valtozoi futasidoben hangolhatok

## Inditas

Workspace rootbol:

```bash
pnpm dev:react
```

Ebbol a mappabol:

```bash
pnpm dev
```

URL:

```text
http://localhost:5173
```

## Storybook

Workspace rootbol:

```bash
pnpm storybook:dev:react
```

Ebbol a mappabol:

```bash
pnpm storybook
```

URL:

```text
http://127.0.0.1:6007
```

Static build:

```bash
pnpm build-storybook
```

## Registry pelda

Workspace rootbol:

```bash
pnpm registry:list
pnpm registry:add ff-button-source ./src/owned/components/ff-button
pnpm registry:add owned-brand-pack ./src/owned/brands/registry-owned
```

A repo-ban mar van egy telepitett pelda is:

```text
examples/registry-installed/owned-brand-pack
```

## Build

Workspace rootbol:

```bash
pnpm --filter @fuggetlenfe/react-showcase build
```

Ebbol a mappabol:

```bash
pnpm build
```

## Fontos fajlok

- `src/main.tsx`: token stylesheet importok
- `src/App.tsx`: wrapper fogyasztas, theme es brand valtas, demo felulet
- `.storybook/`: React wrapper Storybook konfiguracio
