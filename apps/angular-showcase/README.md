# Angular Showcase

Angular demo app, ami a kulon leforditott `@fuggetlenfe/angular-wrapper` libraryt fogyasztja.

## Mire valo

Ez az app azt mutatja meg, hogyan integralhato a komponenskonyvtar Angular standalone kornyezetbe ugy, hogy:

- a Figma design preset aktiv
- a dark/light tema valthato
- a brand runtime-ban valthato
- kulon CSS brand libraryvel uj brand is behozhato
- registrybol telepitett consumer-owned brand pack is hasznalhato

## Hogyan mukodik

Az Angular app nem appon beluli generated wrapper source-t hasznal, hanem ezt a lancot:

1. `@fuggetlenfe/components`
2. `@fuggetlenfe/angular-wrapper`
3. `@fuggetlenfe/tokens` es `@fuggetlenfe/brand-styles`
4. `apps/angular-showcase`

Az oldalszintu stilusok a token contractot, a Figma presetet es a consumer oldali override libraryt importaljak.

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
- `.storybook/`: Angular Storybook konfiguracio
