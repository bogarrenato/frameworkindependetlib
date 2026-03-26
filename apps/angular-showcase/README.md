# Angular Showcase

Angular demo app a Stencil komponenskonyvtar generated Angular wrappereivel.

## Mire valo

Ez az app azt mutatja meg, hogyan integralhato a komponenskonyvtar Angular standalone kornyezetbe ugy, hogy:

- a Figma design preset aktiv
- a dark/light tema valthato
- a brand runtime-ban valthato
- kulso CSS override-dal uj brand is behozhato
- registrybol telepitett consumer-owned brand pack is hasznalhato

## Hogyan mukodik

Az Angular app a generated directive proxykat hasznalja a `src/stencil-generated/` mappabol.
Az oldalszintu stilusok importaljak a token contractot, a Figma presetet es a consumer oldali override-ot.

Az aktualis demo ezen felul megmutatja:

- a wrapper kattintasra launch allapotot frissit
- a `registry-owned` brand elo token laborban hangolhato consumer-oldalon

## Inditas

Workspace rootbol:

```bash
pnpm dev:angular
```

Ebbol a mappabol:

```bash
pnpm start
```

URL:

```text
http://127.0.0.1:4200
```

## Storybook

Workspace rootbol:

```bash
pnpm storybook:dev:angular
```

Ebbol a mappabol:

```bash
pnpm storybook
```

URL:

```text
http://127.0.0.1:6008
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

## Build

Workspace rootbol:

```bash
pnpm --filter @fuggetlenfe/angular-showcase build
```

Ebbol a mappabol:

```bash
pnpm build
```

## Fontos fajlok

- `src/styles.css`: token stylesheet importok
- `src/app/app.ts`: theme/brand allapot es demo logika
- `src/app/app.html`: showcase markup
- `src/stencil-generated/`: generated Angular wrappers
- `.storybook/`: Angular Storybook konfiguracio
