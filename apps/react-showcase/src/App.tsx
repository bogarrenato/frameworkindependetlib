import { useState } from 'react';
import type { CSSProperties } from 'react';
import { FfButton, FfDropdown } from '@fuggetlenfe/react-wrapper';
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

const brandTwoInlineTokenStyle = {
  '--ff-button-padding-inline': '8px',
  '--ff-button-padding-block': '2px',
  '--ff-button-radius': '6px'
} as CSSProperties;

const releaseTargetOptions = [
  {
    value: 'pilot-release',
    label: 'Pilot release',
    description: 'Small audience rollout with monitoring enabled.'
  },
  {
    value: 'production-rollout',
    label: 'Production rollout',
    description: 'Full audience release after final verification.'
  },
  {
    value: 'maintenance-window',
    label: 'Maintenance window',
    description: 'Restricted release reserved for after-hours work.'
  }
] as const;

function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>('light');
  const [selectedReleaseTargetLabel, setSelectedReleaseTargetLabel] = useState(
    'Pilot release'
  );
  const [selectedReleaseTargetValue, setSelectedReleaseTargetValue] = useState('pilot-release');

  return (
    <main className="consumer-shell" data-brand="brand-2" data-theme={activeTheme}>
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
          <FfButton className="brand-host">Brand 2 default</FfButton>
          <FfButton className="pill-host">Class-based override</FfButton>
          <FfButton style={brandTwoInlineTokenStyle}>Inline token tweak</FfButton>
        </div>
      </section>

      <section className="control-grid">
        <article className="info-card">
          <p className="eyebrow">Dropdown primitive</p>
          <div className="dropdown-demo">
            <FfDropdown
              fullWidth
              label="Release target"
              options={[...releaseTargetOptions]}
              placeholder="Choose a release target"
              value={selectedReleaseTargetValue}
              onFfValueChange={(customEvent) => {
                setSelectedReleaseTargetLabel(customEvent.detail.label);
                setSelectedReleaseTargetValue(customEvent.detail.value);
              }}
            />

            <div aria-live="polite" className="selection-card" role="status">
              <p className="selection-eyebrow">Selection status</p>
              <strong className="selection-value">
                Current selection: {selectedReleaseTargetLabel}
              </strong>
              <span className="selection-copy">
                Keyboard support stays in the shared primitive: Arrow keys, Enter, Escape, and Tab.
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="info-grid">
        <article className="info-card">
          <p className="eyebrow">Consumer imports</p>
          <div className="detail-block" aria-label="Consumer imports">
            <div className="detail-line">Import the React wrapper package.</div>
            <div className="detail-line">Import the shared token contract.</div>
            <div className="detail-line">Import the Brand 2 light stylesheet.</div>
            <div className="detail-line">Import the Brand 2 dark stylesheet.</div>
            <div className="detail-line detail-line--gap">
              Set <span>data-brand="brand-2"</span> and the active theme on the outer shell.
            </div>
            <div className="detail-line">Render the same FfButton logic inside that shell.</div>
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
            <div className="proof-item">
              The primitives styling appears only after the brand CSS is imported.
            </div>
            <div className="proof-item">
              The shared components still accept custom classes and per-instance CSS properties.
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
