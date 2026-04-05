#!/usr/bin/env node
/*
 * Post-build patcher for components/index.d.ts.
 *
 * ## Why this exists
 * The @stencil/angular-output-target emits imports of the form
 *   import type { Components } from '@fuggetlenfe/components/components';
 * and expects the re-export to live inside the custom-elements directory.
 * Stencil itself does not emit the `Components` / `JSX` namespace re-export
 * into that directory — it only writes them to dist/types/components.d.ts
 * (the main package types entry).
 *
 * To keep the generated wrappers compiling without hand-editing them, we
 * append a thin re-export block to the auto-generated ./components/index.d.ts
 * after every Stencil build. The re-export is pure types — it adds no runtime
 * bytes.
 *
 * This script is idempotent. It can be run multiple times in a row without
 * corrupting the file.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const componentsDir = resolve(here, '..', 'components');
const dtsPath = resolve(componentsDir, 'index.d.ts');

const MARKER_START = '// --- BEGIN generated-types-reexport (patch-custom-elements-types.mjs) ---';
const MARKER_END = '// --- END generated-types-reexport ---';

const injectedBlock = [
  '',
  MARKER_START,
  '/**',
  ' * Re-export the Components and JSX namespaces from the main types entry so that',
  ' * consumers (including the auto-generated Angular directive proxies) can import',
  " * them via '@fuggetlenfe/components/components'.",
  ' *',
  ' * This block is written by scripts/patch-custom-elements-types.mjs after the',
  ' * Stencil build and is safe to regenerate.',
  ' */',
  "export type { Components, JSX } from '../dist/types/components';",
  MARKER_END,
  ''
].join('\n');

if (!existsSync(dtsPath)) {
  console.warn('[patch-custom-elements-types] file not found: ' + dtsPath);
  process.exit(0);
}

let content = readFileSync(dtsPath, 'utf8');

// Strip any previous injection (idempotent).
const startIdx = content.indexOf(MARKER_START);
if (startIdx !== -1) {
  const endIdx = content.indexOf(MARKER_END, startIdx);
  if (endIdx !== -1) {
    content = content.slice(0, startIdx).replace(/\n+$/, '') + content.slice(endIdx + MARKER_END.length);
  }
}

writeFileSync(dtsPath, content.trimEnd() + '\n' + injectedBlock);
console.log('[patch-custom-elements-types] components/index.d.ts patched.');
