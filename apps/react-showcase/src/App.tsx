import { startTransition, useState, type CSSProperties } from 'react'
import { tokens } from '@fuggetlenfe/tokens'
import { FfButton } from './stencil-generated/components'
import './App.css'

const themeOptions = ['light', 'dark'] as const
const registryBrandKey = 'registry-owned'
const brandOptions = ['brand-1', 'brand-2', 'brand-3', 'client-acme', registryBrandKey] as const
const paletteOrder = ['brand-1', 'brand-2', 'brand-3', 'success', 'warning', 'error', 'info', 'neutral'] as const
const buttonStates = ['default', 'hover', 'active', 'disabled'] as const
const externalBrandPalette = {
  '10': '#FFF4E8',
  '20': '#FFE4C2',
  '30': '#FFD09A',
  '40': '#FFB56B',
  '50': '#FF8B3D',
  '60': '#E06F25',
  '70': '#B85714',
  '80': '#8F410A',
  '90': '#6E3207',
  '100': '#4A2000',
} as const
const registryOwnedPalette = {
  '10': '#FFF4FB',
  '20': '#FFD7EA',
  '30': '#FFB4D8',
  '40': '#FF8BC3',
  '50': '#FF5BAA',
  '60': '#E3388A',
  '70': '#B91F6C',
  '80': '#8F1050',
  '90': '#660739',
  '100': '#3C001F',
} as const

type ThemeName = (typeof themeOptions)[number]
type BrandName = (typeof brandOptions)[number]
type PaletteName = (typeof paletteOrder)[number]
type ButtonState = (typeof buttonStates)[number]
type OwnedPresetName = 'registry-default' | 'editorial' | 'brutalist'

type DemoBrand = {
  label: string
  fontFamily: string
  palette: Record<string, string>
  sourceLabel: string
  accent: string
  accentSoft: string
  accentDeep: string
}

type LaunchEvent = {
  brand: BrandName
  label: string
  theme: ThemeName
  launchedAt: string
}

type OwnedBrandRecipe = {
  fontFamily: string
  radius: number
  paddingInline: number
  paddingBlock: number
  bgDefault: string
  fgDefault: string
  bgHover: string
  fgHover: string
  bgActive: string
  fgActive: string
}

const stateLabels: Record<ButtonState, string> = {
  default: 'Default',
  hover: 'Hover',
  active: 'Active',
  disabled: 'Disabled',
}

const brandCatalog = {
  'brand-1': {
    ...tokens.brands['brand-1'],
    palette: tokens.palettes['brand-1'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-1']['50'],
    accentSoft: tokens.palettes['brand-1']['10'],
    accentDeep: tokens.palettes['brand-1']['100'],
  },
  'brand-2': {
    ...tokens.brands['brand-2'],
    palette: tokens.palettes['brand-2'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-2']['50'],
    accentSoft: tokens.palettes['brand-2']['10'],
    accentDeep: tokens.palettes['brand-2']['100'],
  },
  'brand-3': {
    ...tokens.brands['brand-3'],
    palette: tokens.palettes['brand-3'],
    sourceLabel: 'Figma preset',
    accent: tokens.palettes['brand-3']['50'],
    accentSoft: tokens.palettes['brand-3']['10'],
    accentDeep: tokens.palettes['brand-3']['100'],
  },
  'client-acme': {
    label: 'Client Acme',
    fontFamily: '"Space Grotesk", Inter, Arial, sans-serif',
    palette: externalBrandPalette,
    sourceLabel: 'External CSS override',
    accent: externalBrandPalette['50'],
    accentSoft: externalBrandPalette['10'],
    accentDeep: externalBrandPalette['100'],
  },
  'registry-owned': {
    label: 'Registry Owned',
    fontFamily: '"Sora", Inter, Arial, sans-serif',
    palette: registryOwnedPalette,
    sourceLabel: 'Registry installed override',
    accent: registryOwnedPalette['50'],
    accentSoft: registryOwnedPalette['10'],
    accentDeep: registryOwnedPalette['100'],
  },
} satisfies Record<BrandName, DemoBrand>

const ownedBrandPresets = {
  'registry-default': {
    fontFamily: '"Sora", Inter, Arial, sans-serif',
    radius: 22,
    paddingInline: 22,
    paddingBlock: 10,
    bgDefault: '#FF5BAA',
    fgDefault: '#FFF4FB',
    bgHover: '#E3388A',
    fgHover: '#FFF4FB',
    bgActive: '#FFD7EA',
    fgActive: '#660739',
  },
  editorial: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    radius: 6,
    paddingInline: 20,
    paddingBlock: 8,
    bgDefault: '#100B53',
    fgDefault: '#F6F2FF',
    bgHover: '#5147DB',
    fgHover: '#F6F2FF',
    bgActive: '#CECBFF',
    fgActive: '#100B53',
  },
  brutalist: {
    fontFamily: '"Courier New", monospace',
    radius: 0,
    paddingInline: 16,
    paddingBlock: 12,
    bgDefault: '#0E610E',
    fgDefault: '#F3FFF3',
    bgHover: '#4DC74D',
    fgHover: '#F3FFF3',
    bgActive: '#DAFFDA',
    fgActive: '#0E610E',
  },
} satisfies Record<OwnedPresetName, OwnedBrandRecipe>

const fontChoices = [
  { value: '"Sora", Inter, Arial, sans-serif', label: 'Sora' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Editorial serif' },
  { value: '"Courier New", monospace', label: 'Mono utility' },
] as const

function paletteEntries(name: PaletteName) {
  return Object.entries(tokens.palettes[name]).toSorted((left, right) => Number(right[0]) - Number(left[0]))
}

function paletteEntriesFromScale(scale: Record<string, string>) {
  return Object.entries(scale).toSorted((left, right) => Number(right[0]) - Number(left[0]))
}

function titleFromKey(key: string) {
  return key.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function cloneOwnedRecipe(name: OwnedPresetName): OwnedBrandRecipe {
  return { ...ownedBrandPresets[name] }
}

function buildOwnedBrandStyle(recipe: OwnedBrandRecipe): CSSProperties {
  return {
    '--ff-font-family-brand': recipe.fontFamily,
    '--ff-button-radius': `${recipe.radius}px`,
    '--ff-button-padding-inline': `${recipe.paddingInline}px`,
    '--ff-button-padding-block': `${recipe.paddingBlock}px`,
    '--ff-button-bg-default': recipe.bgDefault,
    '--ff-button-fg-default': recipe.fgDefault,
    '--ff-button-bg-hover': recipe.bgHover,
    '--ff-button-fg-hover': recipe.fgHover,
    '--ff-button-bg-active': recipe.bgActive,
    '--ff-button-fg-active': recipe.fgActive,
  } as CSSProperties
}

function buildOwnedBrandSnippet(recipe: OwnedBrandRecipe, theme: ThemeName) {
  return `[data-brand='registry-owned'] {
  --ff-font-family-brand: ${recipe.fontFamily};
  --ff-button-radius: ${recipe.radius}px;
  --ff-button-padding-inline: ${recipe.paddingInline}px;
  --ff-button-padding-block: ${recipe.paddingBlock}px;
}

[data-brand='registry-owned'][data-theme='${theme}'] {
  --ff-button-bg-default: ${recipe.bgDefault};
  --ff-button-fg-default: ${recipe.fgDefault};
  --ff-button-bg-hover: ${recipe.bgHover};
  --ff-button-fg-hover: ${recipe.fgHover};
  --ff-button-bg-active: ${recipe.bgActive};
  --ff-button-fg-active: ${recipe.fgActive};
}`
}

function formatLaunchTime(timestamp: Date) {
  return timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function App() {
  const [theme, setTheme] = useState<ThemeName>('light')
  const [brand, setBrand] = useState<BrandName>('brand-1')
  const [launches, setLaunches] = useState<LaunchEvent[]>([])
  const [ownedPreset, setOwnedPreset] = useState<OwnedPresetName | 'custom'>('registry-default')
  const [ownedBrandRecipe, setOwnedBrandRecipe] = useState<OwnedBrandRecipe>(() => cloneOwnedRecipe('registry-default'))

  const brandMeta = brandCatalog[brand]
  const latestLaunch = launches[0]
  const heroStyle = {
    '--hero-accent': brandMeta.accent,
    '--hero-accent-soft': brandMeta.accentSoft,
    '--hero-accent-deep': brandMeta.accentDeep,
  } as CSSProperties
  const ownedBrandStyle = buildOwnedBrandStyle(ownedBrandRecipe)
  const ownedBrandSnippet = buildOwnedBrandSnippet(ownedBrandRecipe, theme)

  function queueLaunch(selectedBrand: BrandName) {
    const selectedBrandMeta = brandCatalog[selectedBrand]
    const launchEvent = {
      brand: selectedBrand,
      label: selectedBrandMeta.label,
      theme,
      launchedAt: formatLaunchTime(new Date()),
    } satisfies LaunchEvent

    setLaunches((current) => [launchEvent, ...current].slice(0, 4))
  }

  function handleOwnedFieldChange<Key extends keyof OwnedBrandRecipe>(key: Key, value: OwnedBrandRecipe[Key]) {
    setOwnedPreset('custom')
    setOwnedBrandRecipe((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function applyOwnedPreset(name: OwnedPresetName) {
    startTransition(() => {
      setOwnedPreset(name)
      setOwnedBrandRecipe(cloneOwnedRecipe(name))
    })
  }

  return (
    <div className="showcase" data-theme={theme} data-brand={brand} style={heroStyle}>
      <header className="topbar">
        <div>
          <p className="eyebrow">Figma sourced · Stencil core · React wrapper</p>
          <h1 className="topbar-title">React showcase</h1>
        </div>

        <div className="topbar-controls">
          <div className="segmented" aria-label="Theme selector">
            {themeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={option === theme ? 'is-active' : undefined}
                onClick={() => setTheme(option)}
              >
                {titleFromKey(option)}
              </button>
            ))}
          </div>

          <div className="segmented" aria-label="Brand selector">
            {brandOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={option === brand ? 'is-active' : undefined}
                onClick={() => setBrand(option)}
              >
                {brandCatalog[option].label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="content">
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-kicker">{brandMeta.label}</p>
            <h2>One component runtime. Five brand identities. Two visual modes.</h2>
            <p className="hero-text">
              The same Stencil runtime drives the React wrapper, while the active design can come
              from the shipped Figma preset, a consumer CSS override, or a registry-installed brand
              pack that the app fully owns after checkout.
            </p>
            <div className="hero-actions">
              <FfButton theme={theme} brand={brand} onClick={() => queueLaunch(brand)}>
                Launch selected brand
              </FfButton>
              <FfButton
                theme={theme}
                brand="client-acme"
                previewState="hover"
                onClick={() => setBrand('client-acme')}
              >
                Switch to external override
              </FfButton>
            </div>

            <div className="launch-panel" role="status" aria-live="polite">
              <p className="launch-label">Launch status</p>
              {latestLaunch ? (
                <>
                  <strong>
                    {latestLaunch.label} launched in {titleFromKey(latestLaunch.theme)} mode.
                  </strong>
                  <span>
                    Captured through the React wrapper at {latestLaunch.launchedAt}. Latest queued
                    target: <code>{latestLaunch.brand}</code>.
                  </span>
                  <code>{`pnpm registry:add owned-brand-pack ./src/owned/brands/${latestLaunch.brand}`}</code>
                </>
              ) : (
                <>
                  <strong>No launch captured yet.</strong>
                  <span>
                    Click the primary CTA to prove the wrapper is interactive and to generate the
                    next ownership command.
                  </span>
                  <code>pnpm registry:add owned-brand-pack ./src/owned/brands/registry-owned</code>
                </>
              )}
            </div>
          </div>

          <div className="hero-poster">
            <div className="poster-brand">
              <span>Typeface</span>
              <strong>{brandMeta.fontFamily.replace(/"/g, '').split(',')[0]}</strong>
            </div>

            <div className="poster-brand">
              <span>Source</span>
              <strong>{brandMeta.sourceLabel}</strong>
            </div>

            <div className="poster-brand">
              <span>Latest launch count</span>
              <strong>{launches.length}</strong>
            </div>

            <div className="poster-ribbon">
              {paletteEntriesFromScale(brandMeta.palette).map(([step, color]) => (
                <div key={step} className="poster-swatch" style={{ backgroundColor: color }}>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ownership-stage">
          <article className="ownership-card">
            <div className="section-heading">
              <p className="eyebrow">Registry ownership</p>
              <h2>Pull source or brand packs into your own codebase.</h2>
            </div>

            <p className="card-copy">
              The local registry behaves like a shadcn-style handoff. Teams can keep consuming the
              published package, or copy the component source and brand starter into their app and
              then customize it at their own responsibility.
            </p>

            <div className="command-stack">
              <code>pnpm registry:list</code>
              <code>pnpm registry:add ff-button-source ./src/owned/components/ff-button</code>
              <code>pnpm registry:add owned-brand-pack ./src/owned/brands/registry-owned</code>
            </div>

            <div className="file-pills">
              <span>registry/index.json</span>
              <span>registry/items/ff-button-source.json</span>
              <span>registry/items/owned-brand-pack.json</span>
              <span>examples/registry-installed/ff-button-source</span>
              <span>examples/registry-installed/owned-brand-pack</span>
            </div>

            <p className="card-copy">
              This repo already contains an installed sample brand pack under{' '}
              <code>examples/registry-installed/owned-brand-pack</code>, and the selector above can
              switch to <strong>Registry Owned</strong> immediately.
            </p>
          </article>

          <article className="ownership-card">
            <div className="section-heading">
              <p className="eyebrow">Consumer token lab</p>
              <h2>Edit the owned brand live without touching the upstream component package.</h2>
            </div>

            <div className="preset-row">
              {(['registry-default', 'editorial', 'brutalist'] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={ownedPreset === preset ? 'is-active' : undefined}
                  onClick={() => applyOwnedPreset(preset)}
                >
                  {titleFromKey(preset)}
                </button>
              ))}
            </div>

            <div className="control-grid">
              <label className="control-field">
                <span>Font profile</span>
                <select
                  value={ownedBrandRecipe.fontFamily}
                  onChange={(event) => handleOwnedFieldChange('fontFamily', event.target.value)}
                >
                  {fontChoices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="control-field">
                <span>Radius: {ownedBrandRecipe.radius}px</span>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={ownedBrandRecipe.radius}
                  onChange={(event) => handleOwnedFieldChange('radius', Number(event.target.value))}
                />
              </label>

              <label className="control-field">
                <span>Inline padding: {ownedBrandRecipe.paddingInline}px</span>
                <input
                  type="range"
                  min="8"
                  max="30"
                  value={ownedBrandRecipe.paddingInline}
                  onChange={(event) =>
                    handleOwnedFieldChange('paddingInline', Number(event.target.value))
                  }
                />
              </label>

              <label className="control-field">
                <span>Block padding: {ownedBrandRecipe.paddingBlock}px</span>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={ownedBrandRecipe.paddingBlock}
                  onChange={(event) =>
                    handleOwnedFieldChange('paddingBlock', Number(event.target.value))
                  }
                />
              </label>

              <label className="control-field">
                <span>Default background</span>
                <input
                  type="color"
                  value={ownedBrandRecipe.bgDefault}
                  onChange={(event) => handleOwnedFieldChange('bgDefault', event.target.value)}
                />
              </label>

              <label className="control-field">
                <span>Hover background</span>
                <input
                  type="color"
                  value={ownedBrandRecipe.bgHover}
                  onChange={(event) => handleOwnedFieldChange('bgHover', event.target.value)}
                />
              </label>

              <label className="control-field">
                <span>Default foreground</span>
                <input
                  type="color"
                  value={ownedBrandRecipe.fgDefault}
                  onChange={(event) => handleOwnedFieldChange('fgDefault', event.target.value)}
                />
              </label>
            </div>

            <div
              className="lab-preview"
              data-brand={registryBrandKey}
              data-theme={theme}
              style={ownedBrandStyle}
            >
              <div className="lab-preview-head">
                <p>Registry Owned preview</p>
                <span>{ownedPreset === 'custom' ? 'Custom tuning' : titleFromKey(ownedPreset)}</span>
              </div>

              <div className="button-stack">
                {buttonStates.map((state) => (
                  <div key={`registry-preview-${state}`} className="button-row">
                    <span>{stateLabels[state]}</span>
                    <FfButton
                      brand={registryBrandKey}
                      theme={theme}
                      disabled={state === 'disabled'}
                      fullWidth
                      previewState={state === 'disabled' ? 'auto' : state}
                    >
                      Registry Owned
                    </FfButton>
                  </div>
                ))}
              </div>
            </div>

            <pre className="code-block">{ownedBrandSnippet}</pre>
          </article>
        </section>

        <section className="state-stage">
          <div className="section-heading">
            <p className="eyebrow">Wrapper usage</p>
            <h2>Generated React wrappers render the shipped presets and consumer-owned brands.</h2>
          </div>

          <div className="state-grid">
            {brandOptions.map((item) => (
              <article key={item} className="state-column">
                <div className="state-column-head">
                  <p>{brandCatalog[item].label}</p>
                  <h3>{brandCatalog[item].fontFamily.replace(/"/g, '').split(',')[0]}</h3>
                </div>

                <div className="button-stack">
                  {buttonStates.map((state) => (
                    <div key={`${item}-${state}`} className="button-row">
                      <span>{stateLabels[state]}</span>
                      <FfButton
                        brand={item}
                        theme={theme}
                        disabled={state === 'disabled'}
                        previewState={state === 'disabled' ? 'auto' : state}
                      >
                        {brandCatalog[item].label}
                      </FfButton>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="palette-stage">
          <div className="section-heading">
            <p className="eyebrow">Token output</p>
            <h2>All palette families extracted from the Figma foundations page remain intact.</h2>
          </div>

          <div className="palette-list">
            {paletteOrder.map((paletteName) => (
              <div key={paletteName} className="palette-row">
                <div className="palette-label">
                  <strong>{titleFromKey(paletteName)}</strong>
                  <span>{paletteName.startsWith('brand') ? 'Brand identity' : 'Shared semantic scale'}</span>
                </div>

                <div className="palette-swatches">
                  {paletteEntries(paletteName).map(([step, color]) => (
                    <div key={`${paletteName}-${step}`} className="palette-swatch" style={{ backgroundColor: color }}>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="meta-strip">
          <p>
            Synced from Figma file <code>{tokens.meta.source.figmaFileKey}</code> at{' '}
            <strong>{new Date(tokens.meta.source.syncedAt).toLocaleString()}</strong>.
          </p>
          <p>
            Current canvas tokens: <strong>{titleFromKey(theme)}</strong> mode with{' '}
            <strong>{brandMeta.label}</strong> from <strong>{brandMeta.sourceLabel}</strong>.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
