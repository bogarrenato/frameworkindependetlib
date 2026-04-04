import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const repoName = process.env.PAGES_REPO_NAME || 'frameworkindependetlib';
const siteRoot = path.join(repoRoot, '.pages');
const pagesBasePath = `/${repoName}/`;

await rm(siteRoot, { recursive: true, force: true });
await mkdir(siteRoot, { recursive: true });

await run('pnpm', ['--filter', '@fuggetlenfe/components', 'build'], { cwd: repoRoot });
await run('pnpm', ['--filter', '@fuggetlenfe/react-wrapper', 'build'], { cwd: repoRoot });
await run('pnpm', ['--filter', '@fuggetlenfe/angular-wrapper', 'build'], { cwd: repoRoot });
await run('pnpm', ['--filter', '@fuggetlenfe/react-showcase', 'build'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    VITE_BASE_PATH: `${pagesBasePath}react-brand-2/`
  }
});
await run('pnpm', ['--filter', '@fuggetlenfe/react-custom-demo', 'build'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    VITE_BASE_PATH: `${pagesBasePath}react-custom/`
  }
});
await run(
  'pnpm',
  [
    '--filter',
    '@fuggetlenfe/angular-showcase',
    'exec',
    'ng',
    'build',
    '--base-href',
    `${pagesBasePath}angular-brand-1/`,
    '--output-path',
    'dist/angular-pages'
  ],
  { cwd: repoRoot }
);
await run(
  'pnpm',
  [
    '--filter',
    '@fuggetlenfe/angular-custom-demo',
    'exec',
    'ng',
    'build',
    '--base-href',
    `${pagesBasePath}angular-custom/`,
    '--output-path',
    'dist/angular-custom-pages'
  ],
  { cwd: repoRoot }
);
await run('pnpm', ['--filter', '@fuggetlenfe/components', 'build-storybook'], { cwd: repoRoot });
await run('pnpm', ['--filter', '@fuggetlenfe/react-showcase', 'build-storybook'], { cwd: repoRoot });
await run('pnpm', ['--filter', '@fuggetlenfe/angular-showcase', 'build-storybook'], { cwd: repoRoot });

await cp(path.join(repoRoot, 'apps', 'react-showcase', 'dist'), path.join(siteRoot, 'react-brand-2'), {
  recursive: true
});

await cp(path.join(repoRoot, 'apps', 'react-custom-demo', 'dist'), path.join(siteRoot, 'react-custom'), {
  recursive: true
});

await cp(resolveAngularBrowserDir('angular-showcase', 'angular-pages'), path.join(siteRoot, 'angular-brand-1'), {
  recursive: true
});

await cp(resolveAngularBrowserDir('angular-custom-demo', 'angular-custom-pages'), path.join(siteRoot, 'angular-custom'), {
  recursive: true
});

await cp(path.join(repoRoot, 'storybook-static', 'stencil'), path.join(siteRoot, 'storybook', 'stencil'), {
  recursive: true
});
await cp(path.join(repoRoot, 'storybook-static', 'react'), path.join(siteRoot, 'storybook', 'react'), {
  recursive: true
});
await cp(path.join(repoRoot, 'storybook-static', 'angular'), path.join(siteRoot, 'storybook', 'angular'), {
  recursive: true
});
await cp(path.join(repoRoot, 'packages', 'react-wrapper', 'docs'), path.join(siteRoot, 'docs', 'react-wrapper'), {
  recursive: true
});
await cp(path.join(repoRoot, 'packages', 'angular-wrapper', 'docs'), path.join(siteRoot, 'docs', 'angular-wrapper'), {
  recursive: true
});

await writeFile(path.join(siteRoot, '.nojekyll'), '');

const landingPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fuggetlenfe Design System</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #111318;
        --panel: #181b22;
        --panel-soft: #20242d;
        --border: #313744;
        --text: #f6f7fb;
        --muted: #a7afc3;
        --accent: #ff5baa;
        --accent-soft: #ffd7ea;
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        font-family: Inter, Arial, sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(255, 91, 170, 0.22) 0, transparent 32%),
          radial-gradient(circle at right center, rgba(81, 71, 219, 0.2) 0, transparent 24%),
          var(--bg);
      }

      main {
        width: min(1120px, calc(100vw - 2rem));
        margin: 0 auto;
        padding: 3rem 0 4rem;
        display: grid;
        gap: 1.25rem;
      }

      .hero, .grid a, .section-panel, .arch-panel, .principle-card {
        border: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent), var(--panel);
      }

      .hero {
        padding: 2rem;
      }

      .eyebrow {
        margin: 0 0 0.45rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.75rem;
        color: var(--muted);
      }

      h1, h2, h3, p { margin: 0; }
      h1 { font-size: clamp(2.2rem, 5vw, 4.6rem); line-height: 0.96; max-width: 11ch; }
      h2 { font-size: 1.4rem; margin-bottom: 1rem; }
      h3 { font-size: 1.05rem; margin-bottom: 0.4rem; }
      .hero p + p { margin-top: 0.9rem; }
      .subcopy { max-width: 68ch; color: var(--muted); line-height: 1.7; }

      /* Section panels */
      .section-panel {
        padding: 2rem;
      }

      .section-label {
        display: block;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 0.72rem;
        color: var(--accent-soft);
        margin-bottom: 0.75rem;
      }

      /* Architecture diagram */
      .arch-panel {
        padding: 2rem;
        overflow-x: auto;
      }

      .arch-diagram {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
        font-size: 0.82rem;
        line-height: 1.55;
        color: var(--muted);
        white-space: pre;
        margin: 1rem 0 0;
        padding: 1.25rem;
        background: var(--panel-soft);
        border: 1px solid var(--border);
        border-radius: 6px;
      }

      .arch-diagram .highlight {
        color: var(--accent-soft);
      }

      /* Design Principles grid */
      .principles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 1rem;
      }

      .principle-card {
        padding: 1.25rem;
      }

      .principle-card h3 {
        color: var(--accent-soft);
      }

      .principle-card p {
        color: var(--muted);
        line-height: 1.6;
        font-size: 0.92rem;
      }

      /* Token list */
      .token-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.75rem;
        margin-top: 0.75rem;
      }

      .token-feature {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        color: var(--muted);
        line-height: 1.5;
        font-size: 0.92rem;
      }

      .token-feature .bullet {
        color: var(--accent);
        font-weight: 700;
        flex-shrink: 0;
        margin-top: 0.1rem;
      }

      /* Quick Start */
      .quick-start-blocks {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 1rem;
        margin-top: 0.75rem;
      }

      .code-block {
        background: var(--panel-soft);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 1rem 1.25rem;
      }

      .code-block .lang-label {
        display: block;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-size: 0.68rem;
        color: var(--accent);
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .code-block code {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
        font-size: 0.8rem;
        line-height: 1.6;
        color: var(--text);
        display: block;
        white-space: pre-wrap;
        word-break: break-all;
      }

      .code-note {
        margin-top: 0.75rem;
        padding: 0.75rem 1rem;
        background: rgba(255, 91, 170, 0.08);
        border: 1px solid rgba(255, 91, 170, 0.18);
        border-radius: 6px;
        color: var(--accent-soft);
        font-size: 0.85rem;
        line-height: 1.5;
      }

      .code-note code {
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
        font-size: 0.78rem;
        background: rgba(255,255,255,0.06);
        padding: 0.15em 0.35em;
        border-radius: 3px;
      }

      /* Links grid */
      .grid-heading {
        margin-top: 1rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .grid a {
        color: inherit;
        text-decoration: none;
        padding: 1rem;
        display: grid;
        gap: 0.55rem;
        transition: border-color 0.15s ease;
      }

      .grid a:hover {
        border-color: var(--accent);
      }

      .kicker {
        text-transform: uppercase;
        letter-spacing: 0.16em;
        font-size: 0.72rem;
        color: var(--accent-soft);
      }

      .grid span {
        color: var(--muted);
        line-height: 1.6;
      }

      .grid strong {
        font-size: 1.05rem;
      }

      /* Divider */
      .divider {
        border: none;
        border-top: 1px solid var(--border);
        margin: 1rem 0;
      }
    </style>
  </head>
  <body>
    <main>

      <!-- Hero -->
      <section class="hero">
        <p class="eyebrow">Enterprise Design System</p>
        <h1>Fuggetlenfe multi-brand design system</h1>
        <p class="subcopy">
          A framework-independent component library built on Stencil, with first-class React and Angular wrappers. Design tokens are synced from Figma, injected via CSS custom properties, and swapped per brand at build or runtime.
        </p>
      </section>

      <!-- Architecture -->
      <section class="arch-panel">
        <span class="section-label">Architecture</span>
        <h2>System layer overview</h2>
        <p class="subcopy">Every layer has a single responsibility. Components never import brand styles directly; the token contract is the only coupling point between design and code.</p>
        <div class="arch-diagram">Figma Design System
      |
      v
Sync Layer (Variables API)
      |
      v
+-------------------------------------+
|   Token Contract  (contract.css)    |
|   Brand Packs     (brand-*.css)     |
+-------------------------------------+
      |
      v
+-------------------------------------+
|  Stencil Web Components  (core)     |
+-------------------------------------+
      |                |
      v                v
React Wrapper    Angular Wrapper
      |                |
      v                v
React Apps       Angular Apps</div>
      </section>

      <!-- Design Principles -->
      <section class="section-panel">
        <span class="section-label">Design Principles</span>
        <h2>Foundation</h2>
        <div class="principles-grid">
          <div class="principle-card">
            <h3>Framework independent</h3>
            <p>Component logic lives in Stencil web components. React and Angular wrappers are thin bridges, not reimplementations.</p>
          </div>
          <div class="principle-card">
            <h3>Figma first</h3>
            <p>Design tokens are authored in Figma and synced through the Variables API. Code always reflects the source of truth.</p>
          </div>
          <div class="principle-card">
            <h3>Brand agnostic</h3>
            <p>Same components, different visual identity. Swap a single CSS import to change every color, radius, and spacing value.</p>
          </div>
          <div class="principle-card">
            <h3>Enterprise ready</h3>
            <p>Stable public contract surface, independently versioned packages, and automated CI pipelines from Figma to production.</p>
          </div>
        </div>
      </section>

      <!-- Token Contract -->
      <section class="section-panel">
        <span class="section-label">Token Contract</span>
        <h2>Design token system</h2>
        <p class="subcopy">The token layer defines a stable CSS custom property contract. Brand packs implement the contract with concrete values. Components only reference the contract, never raw colors or sizes.</p>
        <div class="token-features">
          <div class="token-feature">
            <span class="bullet">&bull;</span>
            <span>3 official brands (Brand 1, Brand 2, Brand 3)</span>
          </div>
          <div class="token-feature">
            <span class="bullet">&bull;</span>
            <span>Light and dark theme support</span>
          </div>
          <div class="token-feature">
            <span class="bullet">&bull;</span>
            <span>Figma Variables API sync</span>
          </div>
          <div class="token-feature">
            <span class="bullet">&bull;</span>
            <span>Stable CSS custom property contract</span>
          </div>
        </div>
      </section>

      <!-- Quick Start -->
      <section class="section-panel">
        <span class="section-label">Quick Start</span>
        <h2>Get started</h2>
        <div class="quick-start-blocks">
          <div class="code-block">
            <span class="lang-label">React</span>
            <code>import { FfButton } from '@fuggetlenfe/react-wrapper';</code>
          </div>
          <div class="code-block">
            <span class="lang-label">Angular</span>
            <code>import { FfButton } from '@fuggetlenfe/angular-wrapper';</code>
          </div>
        </div>
        <div class="code-note">
          Both frameworks require the token contract and a brand pack:<br/>
          <code>@fuggetlenfe/tokens/contract.css</code> + a brand pack CSS (e.g. <code>brand-1.css</code>)
        </div>
      </section>

      <hr class="divider" />

      <!-- Deployed Apps -->
      <section>
        <span class="section-label">Live Demos</span>
        <h2 class="grid-heading">Applications</h2>
        <div class="grid">
          <a href="./react-brand-2/">
            <p class="kicker">React</p>
            <strong>Brand 2 showcase</strong>
            <span>Consumes the React wrapper with a dedicated Brand 2 CSS pack.</span>
          </a>
          <a href="./react-custom/">
            <p class="kicker">React</p>
            <strong>Custom theme demo</strong>
            <span>Same wrapper logic styled by a separate custom CSS library.</span>
          </a>
          <a href="./angular-brand-1/">
            <p class="kicker">Angular</p>
            <strong>Brand 1 showcase</strong>
            <span>Consumes the Angular wrapper with a dedicated Brand 1 CSS pack.</span>
          </a>
          <a href="./angular-custom/">
            <p class="kicker">Angular</p>
            <strong>Custom theme demo</strong>
            <span>Same Angular wrapper logic styled by a separate custom CSS package.</span>
          </a>
        </div>
      </section>

      <!-- Storybooks -->
      <section>
        <span class="section-label">Component Documentation</span>
        <h2 class="grid-heading">Storybooks</h2>
        <div class="grid">
          <a href="./storybook/stencil/">
            <p class="kicker">Storybook</p>
            <strong>Stencil components</strong>
            <span>Raw web component documentation for the framework-independent core library.</span>
          </a>
          <a href="./storybook/react/">
            <p class="kicker">Storybook</p>
            <strong>React wrapper</strong>
            <span>React-facing stories, docs, and component playgrounds.</span>
          </a>
          <a href="./storybook/angular/">
            <p class="kicker">Storybook</p>
            <strong>Angular wrapper</strong>
            <span>Angular wrapper docs, playgrounds, and state matrix stories.</span>
          </a>
        </div>
      </section>

      <!-- Docs -->
      <section>
        <span class="section-label">Integration Guides</span>
        <h2 class="grid-heading">Wrapper documentation</h2>
        <div class="grid">
          <a href="./docs/react-wrapper/">
            <p class="kicker">Docs</p>
            <strong>React wrapper docs</strong>
            <span>Usage patterns, component API documentation, and style guidance for React consumers.</span>
          </a>
          <a href="./docs/angular-wrapper/">
            <p class="kicker">Docs</p>
            <strong>Angular wrapper docs</strong>
            <span>Angular-facing wrapper guidance, component documentation, and integration patterns.</span>
          </a>
        </div>
      </section>

    </main>
  </body>
</html>
`;

await writeFile(path.join(siteRoot, 'index.html'), landingPage);
await writeFile(path.join(siteRoot, '404.html'), landingPage);

console.log(`Built GitHub Pages site into ${siteRoot}`);

function resolveAngularBrowserDir(appDir, outputDir) {
  return path.join(repoRoot, 'apps', appDir, 'dist', outputDir, 'browser');
}

function run(command, commandArguments, options = {}) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, commandArguments, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    });

    childProcess.on('exit', (exitCode) => {
      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${commandArguments.join(' ')} failed with code ${exitCode ?? 'unknown'}`));
    });
  });
}
