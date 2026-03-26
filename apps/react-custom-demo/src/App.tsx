import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';
import './App.css';

const customInstanceStyle = {
  '--ff-button-radius': '28px',
  '--ff-button-padding-inline': '1.8rem'
} as CSSProperties;

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <main className="consumer-shell" data-brand="custom-brand" data-theme={theme}>
      <section className="hero-card">
        <p className="eyebrow">React app · custom brand CSS lib</p>
        <h1>The same React wrapper gets a completely custom identity from external CSS.</h1>
        <p className="body-copy">
          No design comes from the wrapper package itself. This application only imports the
          neutral contract and <code>@fuggetlenfe/brand-styles/custom-brand-light.css</code>,
          <code> @fuggetlenfe/brand-styles/custom-brand-dark.css</code>, then the same
          <code> ff-button</code> logic immediately picks up a different font, radius, and color
          system.
        </p>

        <div className="theme-bar" role="group" aria-label="Theme switcher">
          <p className="theme-label">Theme pack</p>
          <div className="theme-actions">
            <button
              type="button"
              className="theme-button"
              data-selected={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className="theme-button"
              data-selected={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="button-row">
          <FfButton brand="custom-brand" className="custom-shadow">
            Custom brand default
          </FfButton>
          <FfButton brand="custom-brand" className="poster-host">
            Host class override
          </FfButton>
          <FfButton brand="custom-brand" className="inline-host" style={customInstanceStyle}>
            Inline CSS property
          </FfButton>
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">Consumer imports</p>
          <pre>{`import { FfButton } from '@fuggetlenfe/react-wrapper'
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/brand-styles/custom-brand-light.css'
import '@fuggetlenfe/brand-styles/custom-brand-dark.css'`}</pre>
        </article>

        <article className="info-card">
          <p className="eyebrow">Theme behavior</p>
          <pre>{`<main data-theme={theme}>`}</pre>
        </article>

        <article className="info-card">
          <p className="eyebrow">Why this matters</p>
          <ul>
            <li>The wrapper stays reusable across every React product.</li>
            <li>A separate CSS library swaps in a different identity without touching logic.</li>
            <li>The same wrapper logic swaps between light and dark with CSS alone.</li>
            <li>Per-instance classes and CSS properties still let the consumer tune details.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
