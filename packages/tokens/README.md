# Tokens

Figma-bol szinkronizalt design token csomag.

## Mire valo

Ez a csomag tartalmazza:

- a nyers, JSON token exportot
- a publikus CSS token contractot
- a Figma preset stylesheetet
- a kompatibilitasi aggregalo stylesheetet

Ez adja azt az alapot, amire a Stencil komponensek, a React app es az Angular app epitenek.

## Hogyan mukodik

A design ket retegre van bontva:

1. `contract.css`
2. `figma-preset.css`

Erre johet ra egy harmadik, consumer oldali override reteg.

Ez a reteg az ownership registry itemekhez is illeszkedik, peldaul az `owned-brand-pack`
pont erre a contractra ul ra.

Exportok:

- `@fuggetlenfe/tokens/contract.css`
- `@fuggetlenfe/tokens/figma-preset.css`
- `@fuggetlenfe/tokens/theme.css`
- `@fuggetlenfe/tokens/tokens.json`

## Figma sync

Workspace rootbol:

```bash
FIGMA_TOKEN=your_token_here pnpm figma:sync
```

A sync script:

```text
scripts/sync-figma.mjs
```

Ez a script a megadott Figma file-bol olvassa ki a palette-eket, foundation theme tokeneket es a button allapotokat, majd ujrageneralja a `src/` tartalmat.

## Hasznalat

Pelda:

```ts
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/tokens/figma-preset.css'
import '../../../examples/external-brand.css'
```

## Fontos fajlok

- `src/tokens.json`: nyers token objektum
- `src/contract.css`: stabil publikus token contract
- `src/figma-preset.css`: Figma alapertelmezett branding es theme preset
- `src/theme.css`: aggregalo import
- `src/index.js`: package export entry
