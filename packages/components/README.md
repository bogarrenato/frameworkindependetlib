# Stencil Components

Ez a csomag a platform viselkedesi magja.

## Felelossege

- frameworkfuggetlen web component logika
- stabil DOM, slot es `::part` contract
- wrapper generalas Reacthez es Angularhoz

## Ami nem ide valo

- brand valasztas
- dark/light tema valtas
- consumer app business logika
- framework-specifikus workaroundok

## Public API

- propok
- slotok
- `::part` exportok
- dokumentalt CSS token inputok

## Jelenlegi referencia komponens

- `ff-button`

Ez a komponens csak a gomb viselkedeset es allapotait biztosítja.
A vizualis megjelenes mindig kulso token contractbol es brand packbol jon.

## Fejlesztesi szabalyok

1. Uj komponens csak semantic logikat tartalmazhat.
2. Brand/theme ne keruljon propkent a komponensbe.
3. App-specifikus markup ne keruljon a librarybe.
4. A public contractot JSDoc es tesztek vedjek.

## Parancsok

```bash
pnpm --filter @fuggetlenfe/components build
pnpm --filter @fuggetlenfe/components test
pnpm --filter @fuggetlenfe/components storybook
pnpm --filter @fuggetlenfe/components build-storybook
```

## Fontos fajlok

- `stencil.config.ts`
- `src/components/ff-button/ff-button.tsx`
- `src/components/ff-button/ff-button.css`
- `src/components/ff-button/ff-button.spec.tsx`
- `src/stories/ff-button.stories.ts`
