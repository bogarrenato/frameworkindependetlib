# Brand Styles

Ez a csomag a hivatalos design pack reteg.

## Felelossege

- tema- es brand-specifikus token ertekek
- kulso importkent hasznalhato arculati packek
- a component layer vizualis aktivalasa

## Hivatalos packek

- `@fuggetlenfe/brand-styles/brand-1-light.css`
- `@fuggetlenfe/brand-styles/brand-1-dark.css`
- `@fuggetlenfe/brand-styles/brand-2-light.css`
- `@fuggetlenfe/brand-styles/brand-2-dark.css`
- `@fuggetlenfe/brand-styles/brand-3-light.css`
- `@fuggetlenfe/brand-styles/brand-3-dark.css`
- `@fuggetlenfe/brand-styles/custom-brand-light.css`
- `@fuggetlenfe/brand-styles/custom-brand-dark.css`
- `@fuggetlenfe/brand-styles/custom-brand.css`
- `@fuggetlenfe/brand-styles/demo.css`

## Hasznalati elv

Import sorrend:

1. token contract
2. konkret brand pack

## Generalasi modell

- az official brand packek a Figma Variables syncbol generalodnak
- a `custom-brand` tovabbra is consumer-owned minta
- a consuming appnak nem a `figma-preset.css`-t kell elsodlegesen fogyasztania, hanem a contractot es a konkret official packeket

## Megjegyzes

A `custom-brand` a kulso styling ownership mintaja.
Nem a core library resze, hanem egy tudatos consumer-side override pelda.
