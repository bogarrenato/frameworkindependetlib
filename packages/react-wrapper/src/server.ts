/**
 * Server entry point for @fuggetlenfe/react-wrapper.
 *
 * ## Why a separate entry
 * The main entry (./index.ts) is marked with `'use client'` by the Stencil React
 * output target. That directive pulls the whole module into the client bundle of
 * any React Server Component tree that imports it. For SSR / SSG pipelines that
 * need to PRE-RENDER the component HTML with Declarative Shadow DOM, this is not
 * enough — we need a server-safe helper that runs in Node and emits correct markup
 * that the consumer can stream to the browser before client JS hydrates.
 *
 * This file is that helper. It does NOT import any React component wrappers. It
 * only re-exports the Stencil hydrate module, which is the single place where
 * renderToString / hydrateDocument live.
 *
 * ## Typical usage (Next.js App Router example)
 *
 * ```ts
 * // app/layout.tsx (server component)
 * import { renderToString } from '@fuggetlenfe/react-wrapper/server';
 *
 * export async function generateStaticParams() {
 *   // pre-render any static route that contains <ff-*> web components
 * }
 *
 * // In a server-only file:
 * const rendered = await renderToString(htmlWithFfTags, {
 *   fullDocument: false,
 *   serializeShadowRoot: 'declarative-shadow-dom',
 *   prettyHtml: false
 * });
 * // rendered.html now contains <template shadowrootmode="open"> markup
 * // ready to stream to the browser.
 * ```
 *
 * ## Typical usage (Vite prerender script example)
 *
 * ```ts
 * import { readFileSync, writeFileSync } from 'node:fs';
 * import { renderToString } from '@fuggetlenfe/react-wrapper/server';
 *
 * const template = readFileSync('dist/index.html', 'utf8');
 * const { html } = await renderToString(template, {
 *   fullDocument: true,
 *   serializeShadowRoot: 'declarative-shadow-dom'
 * });
 * writeFileSync('dist/index.html', html);
 * ```
 *
 * ## What this does NOT do
 * - It does NOT render React components. Use react-dom/server for that.
 * - It does NOT manage brand / theme selection. The data-brand and data-theme
 *   attributes must already be present on the shell element in the HTML string
 *   passed in — they flow through the token contract CSS cascade naturally.
 * - It does NOT polyfill customElements on the server. The Stencil hydrate
 *   module ships its own minimal DOM shim.
 */
export { renderToString, hydrateDocument } from '@fuggetlenfe/components/hydrate';
