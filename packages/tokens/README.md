# Tokens

Ez a csomag a design contractot tartalmazza.

## Felelossege

- stabil public CSS token contract
- Figma Variables API-bol szinkronizalt preset reteg
- token JSON export

## Retegek

1. `contract.css`
2. `figma-preset.css`
3. kulso brand override, peldaul a `brand-styles` csomagbol

## Fontos elv

A komponensek a contractot fogyasztjak, nem a konkret brand szineket.
Ez teszi lehetove, hogy ugyanaz a komponenslogika tobb arculattal fusson.

## Sync modell

- a Figma a source of truth
- a sync a Variables API-bol olvas
- a sync explicit, nev-alapu bindingokat old fel
- ha egy kotelezo token hianyzik, a sync hibaval leall

Ez tudatosan jobb, mint a node ID vagy frame sorrend alapjan torteno scraping, mert a contract review-zhato es stabilabb.

## Parancsok

```bash
FIGMA_TOKEN=your_token pnpm figma:sync
```

Megjegyzes:

- a tokennek rendelkeznie kell a `file_variables:read` scope-pal
- a sync a `packages/brand-styles/src` ala is generalja az official brand packeket

## Exportok

- `@fuggetlenfe/tokens/contract.css`
- `@fuggetlenfe/tokens/figma-preset.css`
- `@fuggetlenfe/tokens/theme.css`
- `@fuggetlenfe/tokens/tokens.json`
