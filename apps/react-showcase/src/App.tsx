import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';
import './App.css';

const instanceStyle = {
  '--ff-button-padding-inline': '8px',
  '--ff-button-padding-block': '2px',
  '--ff-button-radius': '6px'
} as CSSProperties;

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <main className="consumer-shell" data-brand="brand-2" data-theme={theme}>
      <section className="hero-card">
        <p className="eyebrow">React app · external CSS brand pack</p>
        <h1>React consumes only the wrapper logic, then receives Brand 2 from Figma-based CSS.</h1>
        <p className="body-copy">
          This app imports the compiled React wrapper plus the Brand 2 light and dark packs that
          follow the Figma token set. Brand and theme live on the outer shell, so the Stencil
          primitive stays visually neutral until the external stylesheet is present.
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
          <FfButton className="brand-host">Brand 2 default</FfButton>
          <FfButton className="pill-host">Class-based override</FfButton>
          <FfButton style={instanceStyle}>Inline token tweak</FfButton>
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">Consumer imports</p>
          <div className="detail-block" aria-label="Consumer imports">
            <div className="detail-line">import &#123; FfButton &#125; from '@fuggetlenfe/react-wrapper'</div>
            <div className="detail-line">import '@fuggetlenfe/tokens/contract.css'</div>
            <div className="detail-line">import '@fuggetlenfe/brand-styles/brand-2-light.css'</div>
            <div className="detail-line">import '@fuggetlenfe/brand-styles/brand-2-dark.css'</div>
            <div className="detail-line detail-line--gap">&lt;main data-brand="brand-2" data-theme=&#123;theme&#125;&gt;</div>
            <div className="detail-line">&nbsp;&nbsp;&lt;FfButton /&gt;</div>
            <div className="detail-line">&lt;/main&gt;</div>
          </div>
        </article>

        <article className="info-card">
          <p className="eyebrow">Theme behavior</p>
          <div className="detail-block" aria-label="Theme behavior">
            <div className="detail-line">Light and dark are swapped only by the shell.</div>
            <div className="detail-line">The button keeps the same logic API in both modes.</div>
            <div className="detail-line">Brand 2 colors come from the Figma-derived CSS pack.</div>
          </div>
        </article>

        <article className="info-card">
          <p className="eyebrow">What proves the separation</p>
          <div className="proof-list">
            <div className="proof-item">The wrapper package provides framework integration only.</div>
            <div className="proof-item">The component styling appears only after the brand CSS is imported.</div>
            <div className="proof-item">The host still accepts custom classes and per-instance CSS properties.</div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
