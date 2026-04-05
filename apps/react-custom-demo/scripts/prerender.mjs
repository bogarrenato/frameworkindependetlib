#!/usr/bin/env node
/*
 * SSR / SSG demonstration prerender for the React showcase.
 *
 * ## What this does
 * Generates a dedicated static page at `dist/ssr-demo.html` that shows every
 * <ff-*> component from the library fully server-rendered with Declarative
 * Shadow DOM inlined. This proves that the hydrate module works end-to-end
 * and that first paint is visually correct before any client JS runs.
 *
 * ## Why a dedicated page (not a full React SPA SSR)
 * The main React showcase uses the auto-generated React wrappers, which are
 * marked `'use client'` and call defineCustomElement at import time. In a full
 * Next.js / Remix pipeline you would ship a separate RSC-friendly entry point
 * or use the @fuggetlenfe/react-wrapper/server helper with a dedicated Vite
 * SSR build. That full pipeline is orthogonal to what this PoC is trying to
 * prove: that the component runtime itself is SSR-safe.
 *
 * This script imports ONLY the Stencil hydrate module (exposed via
 * @fuggetlenfe/react-wrapper/server), feeds it a hand-written HTML template
 * with <ff-*> tags, and lets the hydrate module upgrade every custom element
 * to Declarative Shadow DOM in Node. The output is a complete HTML document
 * that any static host (GitHub Pages, S3, CDN) can serve with zero runtime.
 *
 * ## Verification contract
 *  - The process exits non-zero if the hydrate module reports any diagnostic
 *    of level "error". Warnings are printed but non-fatal.
 *  - The emitted HTML is checked for the `<template shadowrootmode="open">`
 *    substring before being written to disk. Missing DSD tags mean the build
 *    produced client-only output, which is a regression.
 */

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToString as hydrateToString } from '@fuggetlenfe/react-wrapper/server';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const distDir = resolve(appRoot, 'dist');
const outPath = resolve(distDir, 'ssr-demo.html');

// Minimal document template. Uses the same brand pack as the runtime React SPA
// (brand-2 light) so the visual identity matches byte-for-byte.
const template = /* html */ `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SSR demo · Fuggetlenfe DS</title>
    <style>
      /* inline minimal host layout; real apps would link their design system CSS */
      body {
        margin: 0;
        padding: 2.5rem 1.5rem;
        min-height: 100vh;
        background: #f6f7fb;
        color: #0f172a;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      }
      .ssr-shell {
        max-width: 960px;
        margin: 0 auto;
        display: grid;
        gap: 2rem;
      }
      h1 { margin: 0; font-size: 1.5rem; }
      h2 { margin: 2rem 0 0.75rem; font-size: 1.125rem; }
      p { margin: 0.5rem 0 1rem; line-height: 1.55; color: #475569; }
      .swatch-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
      .note {
        border-left: 3px solid #6366f1;
        padding: 0.5rem 1rem;
        background: #eef2ff;
        border-radius: 8px;
        color: #312e81;
      }
    </style>
    <!--
      NOTE: the real token contract + brand pack CSS is wired up by the main SPA's
      bundler (Vite) into assets/index-*.css. The SSR demo purposefully keeps its
      <head> lean so reviewers can see the declarative-shadow-dom output clearly
      without external CSS distracting from the hydrate module's work.
    -->
  </head>
  <body data-brand="custom-brand" data-theme="light">
    <main class="ssr-shell">
      <header>
        <h1>Server-rendered primitives · Declarative Shadow DOM</h1>
        <p>
          Every component below was rendered in Node through the Stencil hydrate
          module. Open DevTools on any element and look for
          <code>&lt;template shadowrootmode="open"&gt;</code> — the full shadow tree and
          its scoped CSS are inlined so first paint is already correct.
        </p>
        <div class="note">
          Hydrate output is byte-deterministic. The same input HTML produces the
          same output on every build, which means CI can diff the rendered bytes as
          a cheap regression gate.
        </div>
      </header>

      <section>
        <h2>ff-button — all variants</h2>
        <div class="swatch-row">
          <ff-button variant="primary">Primary</ff-button>
          <ff-button variant="secondary">Secondary</ff-button>
          <ff-button variant="ghost">Ghost</ff-button>
          <ff-button variant="danger">Danger</ff-button>
          <ff-button disabled>Disabled</ff-button>
          <ff-button full-width>Full width</ff-button>
        </div>
      </section>

      <section>
        <h2>ff-dropdown — SSR-safe open/close contract</h2>
        <p>
          The dropdown is rendered in the default (closed) state. The listbox is
          present in the DOM but hidden via <code>aria-hidden="true"</code>, so the
          server and client agree on the initial markup and there is zero hydration
          mismatch when the dropdown is later opened on the client.
        </p>
        <ff-dropdown
          placeholder="Select reporting period"
          value="qtr"
          options='[{"value":"qtr","label":"This quarter"},{"value":"hly","label":"Half year"},{"value":"yr","label":"Full year"},{"value":"all","label":"All time","disabled":true}]'
        ></ff-dropdown>
      </section>

      <section>
        <h2>ff-data-table — sorted on the server</h2>
        <p>
          Rows are sorted in Node during the hydrate pass, so the table arrives in
          the browser pre-sorted. No client-side shuffle is required, which keeps
          LCP tight and eliminates post-hydration reflows for large tables.
        </p>
        <ff-data-table
          sort-key="mrr"
          sort-direction="desc"
          columns='[{"key":"name","label":"Customer","width":"2fr"},{"key":"plan","label":"Plan","width":"1fr"},{"key":"seats","label":"Seats","width":"0.6fr","align":"end"},{"key":"mrr","label":"MRR","width":"0.8fr","align":"end"},{"key":"active","label":"Active","width":"0.5fr","align":"center"}]'
          rows='[{"id":"c-1","name":"Aurora Partners","plan":"Enterprise","seats":420,"mrr":18400,"active":true},{"id":"c-2","name":"Northwind Labs","plan":"Growth","seats":84,"mrr":3960,"active":true},{"id":"c-3","name":"Helix Cooperative","plan":"Growth","seats":61,"mrr":2820,"active":false},{"id":"c-4","name":"Lumen & Stone","plan":"Starter","seats":12,"mrr":480,"active":true},{"id":"c-5","name":"Portside Logistics","plan":"Enterprise","seats":310,"mrr":12600,"active":true}]'
        ></ff-data-table>
      </section>

      <section>
        <h2>ff-modal — closed on first paint</h2>
        <p>
          The modal is present in the document but starts closed (<code>aria-hidden="true"</code>,
          <code>display:none</code>), which is the only safe default for SSR. Opening and
          closing is driven by client-side props after hydration.
        </p>
        <ff-modal ff-title="Confirm action">
          <p>This modal is pre-rendered in its closed state.</p>
        </ff-modal>
      </section>
    </main>
  </body>
</html>`;

async function main() {
  const { html, diagnostics } = await hydrateToString(template, {
    fullDocument: true,
    serializeShadowRoot: 'declarative-shadow-dom',
    removeUnusedStyles: false,
    prettyHtml: false
  });

  const errors = diagnostics.filter((diag) => diag.level === 'error');
  const warnings = diagnostics.filter((diag) => diag.level === 'warn');

  if (warnings.length > 0) {
    console.warn('[prerender] Stencil hydrate warnings:');
    for (const warning of warnings) {
      console.warn('  -', warning.messageText);
    }
  }

  if (errors.length > 0) {
    console.error('[prerender] Stencil hydrate reported errors:');
    for (const error of errors) {
      console.error('  -', error.messageText);
    }
    process.exit(1);
  }

  if (!html.includes('<template shadowrootmode="open">')) {
    console.error('[prerender] Output missing <template shadowrootmode="open"> — SSR contract broken.');
    process.exit(1);
  }

  writeFileSync(outPath, html);
  console.log('[prerender] dist/ssr-demo.html written with Declarative Shadow DOM markup.');
}

main().catch((error) => {
  console.error('[prerender] fatal:', error);
  process.exit(1);
});
