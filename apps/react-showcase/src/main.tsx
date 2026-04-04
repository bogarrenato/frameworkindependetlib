import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
  Token and brand CSS imports — this is where the visual identity enters the app.

  1. contract.css: Defines the stable --ff-button-* and --ff-color-* CSS custom properties
     with safe fallback values. This is the public API between design and components.

  2. Brand pack CSS: Overrides the contract variables with Brand 2 specific values.
     These files use [data-brand='brand-2'][data-theme='light'|'dark'] attribute selectors.
     When the app shell sets data-brand="brand-2" and data-theme="light", the CSS cascade
     activates the Brand 2 light overrides automatically.

  The FfButton component (imported in App.tsx from @fuggetlenfe/react-wrapper) renders
  a Stencil web component whose shadow DOM CSS reads these --ff-button-* variables.
  No brand logic exists in the component itself.
*/
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/brand-styles/brand-2-light.css'
import '@fuggetlenfe/brand-styles/brand-2-dark.css'

import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The React showcase root element is missing from the document.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
