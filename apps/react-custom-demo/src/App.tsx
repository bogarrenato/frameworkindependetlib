import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FfButton } from '@fuggetlenfe/react-wrapper';
import './App.css';

type ThemeMode = 'light' | 'dark';

type ThemeToggleOption = {
  label: string;
  value: ThemeMode;
};

const themeToggleOptions: readonly ThemeToggleOption[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
];

const customBrandInlineTokenStyle = {
  '--ff-button-radius': '20px',
  '--ff-button-padding-inline': '1.3rem',
  '--ff-button-padding-block': '0.68rem'
} as CSSProperties;

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('light');

  return (
    <main className="consumer-shell" data-brand="custom-brand" data-theme={activeTheme}>
      <section className="hero-card">
        <p className="eyebrow">React app · custom brand CSS lib</p>
        <h1>The same React wrapper gets a completely custom identity from external CSS.</h1>
        <p className="body-copy">
          No design comes from the wrapper package itself. This application only imports the
          neutral contract and the custom brand light and dark packs, then the same button logic
          immediately picks up a different font, radius, and color system from the outer shell.
        </p>

        <div className="theme-bar" role="group" aria-label="Theme switcher">
          <p className="theme-label">Theme pack</p>
          <div className="theme-actions">
            {themeToggleOptions.map((themeToggleOption) => (
              <button
                key={themeToggleOption.value}
                type="button"
                className="theme-button"
                data-selected={activeTheme === themeToggleOption.value}
                onClick={() => setActiveTheme(themeToggleOption.value)}
              >
                {themeToggleOption.label}
              </button>
            ))}
          </div>
        </div>

        <div className="button-row">
          <FfButton className="custom-shadow">Custom brand default</FfButton>
          <FfButton className="poster-host">Host class override</FfButton>
          <FfButton style={customBrandInlineTokenStyle}>Inline token tweak</FfButton>
        </div>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">Consumer imports</p>
          <div className="detail-block" aria-label="Consumer imports">
            <div className="detail-line">Import the React wrapper package.</div>
            <div className="detail-line">Import the shared token contract.</div>
            <div className="detail-line">Import the custom-brand light stylesheet.</div>
            <div className="detail-line">Import the custom-brand dark stylesheet.</div>
            <div className="detail-line detail-line--gap">
              Set <span>data-brand="custom-brand"</span> and the active theme on the outer shell.
            </div>
            <div className="detail-line">Render the same FfButton logic inside that shell.</div>
          </div>
        </article>

        <article className="info-card">
          <p className="eyebrow">Theme behavior</p>
          <div className="detail-block" aria-label="Theme behavior">
            <div className="detail-line">The shell flips between light and dark.</div>
            <div className="detail-line">The button keeps the same logic API in both modes.</div>
            <div className="detail-line">Only the imported custom CSS pack changes the look.</div>
            <div className="detail-line">
              This stays outside the official sync and proves that a consumer-owned brand can style the same button.
            </div>
          </div>
        </article>

        <article className="info-card">
          <p className="eyebrow">Why this matters</p>
          <div className="proof-list">
            <div className="proof-item">The wrapper stays reusable across every React product.</div>
            <div className="proof-item">
              A separate CSS library swaps in a different identity without touching logic.
            </div>
            <div className="proof-item">
              The same wrapper logic swaps between light and dark with CSS alone.
            </div>
            <div className="proof-item">
              Per-instance classes and CSS properties still let the consumer tune details.
            </div>
            <div className="proof-item">
              The shared runtime still ships only the primitive that exists in Figma: the button.
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
