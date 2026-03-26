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

      .hero, .grid a {
        border: 1px solid var(--border);
        background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent), var(--panel);
      }

      .hero {
        padding: 1.4rem;
      }

      .eyebrow {
        margin: 0 0 0.45rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 0.75rem;
        color: var(--muted);
      }

      h1, h2, p { margin: 0; }
      h1 { font-size: clamp(2.2rem, 5vw, 4.6rem); line-height: 0.96; max-width: 11ch; }
      .hero p + p { margin-top: 0.9rem; }
      .subcopy { max-width: 68ch; color: var(--muted); line-height: 1.7; }

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
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <p class="eyebrow">GitHub Pages deployment</p>
        <h1>Fuggetlenfe multi-brand design system</h1>
        <p class="subcopy">
          This static site hosts two React apps, two Angular apps, and the wrapper Storybooks. The component library stays logic-only, while separate CSS packages inject the actual brand identity.
        </p>
      </section>

      <section class="grid">
        <a href="./react-brand-2/">
          <p class="kicker">App</p>
          <strong>React Brand 2 app</strong>
          <span>Consumes the React wrapper and a dedicated Brand 2 CSS pack.</span>
        </a>
        <a href="./react-custom/">
          <p class="kicker">App</p>
          <strong>React custom app</strong>
          <span>Consumes the same wrapper logic, but styling arrives from a different custom CSS library.</span>
        </a>
        <a href="./angular-brand-1/">
          <p class="kicker">App</p>
          <strong>Angular Brand 1 app</strong>
          <span>Consumes the Angular wrapper and a dedicated Brand 1 CSS pack.</span>
        </a>
        <a href="./angular-custom/">
          <p class="kicker">App</p>
          <strong>Angular custom app</strong>
          <span>Consumes the same Angular wrapper logic, styled by a separate custom CSS package.</span>
        </a>
        <a href="./storybook/stencil/">
          <p class="kicker">Storybook</p>
          <strong>Stencil components</strong>
          <span>Raw web component documentation for the framework-independent library.</span>
        </a>
        <a href="./storybook/react/">
          <p class="kicker">Storybook</p>
          <strong>React wrapper</strong>
          <span>React-facing stories and docs using the generated wrapper layer.</span>
        </a>
        <a href="./storybook/angular/">
          <p class="kicker">Storybook</p>
          <strong>Angular wrapper</strong>
          <span>Angular wrapper docs, playgrounds, and state matrix stories.</span>
        </a>
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

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      ...options
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with code ${code ?? 'unknown'}`));
    });
  });
}
