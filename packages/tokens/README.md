# Tokens

Ez a csomag a design contractot tartalmazza.

## Felelossege

- stabil public CSS token contract
- Figma-bol szinkronizalt preset reteg
- token JSON export

## Retegek

1. `contract.css`
2. `figma-preset.css`
3. kulso brand override, peldaul a `brand-styles` csomagbol

## Fontos elv

A komponensek a contractot fogyasztjak, nem a konkret brand szineket.
Ez teszi lehetove, hogy ugyanaz a komponenslogika tobb arculattal fusson.

## Parancsok

```bash
FIGMA_TOKEN=your_token pnpm figma:sync
```

## Exportok

- `@fuggetlenfe/tokens/contract.css`
- `@fuggetlenfe/tokens/figma-preset.css`
- `@fuggetlenfe/tokens/theme.css`
- `@fuggetlenfe/tokens/tokens.json`
