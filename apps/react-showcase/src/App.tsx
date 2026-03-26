import type { CSSProperties } from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';
import './App.css';

const instanceStyle = {
  '--ff-button-padding-inline': '1.6rem',
  '--ff-button-padding-block': '0.75rem'
} as CSSProperties;

function App() {
  return (
    <main className="consumer-shell" data-brand="brand-2" data-theme="light">
      <section className="hero-card">
        <p className="eyebrow">React app · external CSS brand pack</p>
        <h1>React consumes only the wrapper logic, then receives Brand 2 from CSS.</h1>
        <p className="body-copy">
          This app imports the compiled <code>@fuggetlenfe/react-wrapper</code>, then applies
          design through <code>@fuggetlenfe/tokens/contract.css</code> and
          <code> @fuggetlenfe/brand-styles/brand-2-light.css</code>. The Stencil component stays
          visually naked until the external brand stylesheet is present.
        </p>

        <div className="button-row">
          <FfButton brand="brand-2" className="brand-host">
            Brand 2 default
          </FfButton>
          <FfButton brand="brand-2" className="pill-host">
            Class-based override
          </FfButton>
          <FfButton brand="brand-2" className="inline-host" style={instanceStyle}>
            Inline CSS property
          </FfButton>
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">Consumer imports</p>
          <pre>{`import { FfButton } from '@fuggetlenfe/react-wrapper'
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/brand-styles/brand-2-light.css'`}</pre>
        </article>

        <article className="info-card">
          <p className="eyebrow">What proves the separation</p>
          <ul>
            <li>The wrapper package provides framework integration only.</li>
            <li>The component styling appears only after the brand CSS is imported.</li>
            <li>The host still accepts custom classes and per-instance CSS properties.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
