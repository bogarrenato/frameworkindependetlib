import { Config } from '@stencil/core';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { reactOutputTarget } from '@stencil/react-output-target';

/**
 * Stencil build configuration — enterprise architecture notes.
 *
 * This package is the single source of truth for every framework-independent primitive.
 * The output targets here fan out the same compiled component runtime to four
 * independent delivery channels:
 *
 *   1. `dist`                    — legacy ESM/CJS bundle used by CDN consumers.
 *   2. `dist-custom-elements`    — tree-shakeable per-component modules (browser runtime).
 *   3. `dist-hydrate-script`     — Node-compatible `hydrate` module exposing renderToString
 *                                  and hydrateDocument. This is what enables SSR / SSG for
 *                                  every consumer framework (Next.js, Nuxt, Angular Universal,
 *                                  SvelteKit, Vite pre-render scripts, etc.). Without this
 *                                  module, shadow DOM components cannot be pre-rendered and
 *                                  would produce hydration warnings in server contexts.
 *   4. React / Angular wrappers  — auto-generated bridge libraries kept in lockstep with
 *                                  the Stencil component API. Generated into sibling packages
 *                                  in the PoC monorepo, but each will graduate to its own
 *                                  git repository in production (polyrepo model).
 *
 * SSR contract enforcement:
 * - Every component in this package MUST be written with `typeof window` / `typeof document`
 *   guards around DOM access during connectedCallback / componentWillLoad.
 * - Interaction-time APIs (ResizeObserver, MutationObserver, click handlers on document) are
 *   only allowed inside componentDidLoad (client-only lifecycle hook).
 * - State that differs between server and client (matchMedia, localStorage) must be injected
 *   through props or attributes, never computed inline in render().
 */
export const config: Config = {
  namespace: 'fuggetlenfe',
  srcDir: 'src',
  outputTargets: [
    reactOutputTarget({
      outDir: '../react-wrapper/src/generated',
      stencilPackageName: '@fuggetlenfe/components'
    }),
    angularOutputTarget({
      componentCorePackage: '@fuggetlenfe/components',
      directivesProxyFile: '../angular-wrapper/src/lib/generated/components.ts',
      directivesArrayFile: '../angular-wrapper/src/lib/generated/index.ts',
      valueAccessorConfigs: [],
      outputType: 'standalone'
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
      // Write the tree-shakeable per-component modules to ./components/ at the
      // package root so both the Angular proxy directives (which default to
      // `${componentCorePackage}/components/...`) and the React wrapper
      // (configured to use the same path) resolve consistently.
      dir: 'components',
      externalRuntime: false
    },
    /*
     * dist-hydrate-script produces packages/components/hydrate/index.js — a Node-runnable
     * module that exposes renderToString(html, options) and hydrateDocument(doc, options).
     * Consumer SSR pipelines import this module to pre-render web components with
     * Declarative Shadow DOM (<template shadowrootmode="open">) so the first paint is
     * visually correct before JS hydration runs.
     */
    {
      type: 'dist-hydrate-script',
      dir: 'hydrate'
    },
    {
      type: 'docs-readme'
    }
  ],
  testing: {
    browserHeadless: 'shell'
  }
};
