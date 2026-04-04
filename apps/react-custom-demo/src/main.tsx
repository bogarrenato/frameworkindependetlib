import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
  Token and brand CSS imports — this is where the visual identity enters the app.

  1. contract.css: Defines the stable --ff-button-* and --ff-color-* CSS custom properties.
     Same contract as every other app. Components only know about these variable names.

  2. Custom brand pack CSS: Unlike the official brand packs (brand-1, brand-2, brand-3)
     which are auto-generated from the Figma Variables API, the custom-brand pack is
     hand-authored CSS. It overrides the same --ff-button-* variables, proving that any
     consumer team can create their own brand identity without touching the component library.

  These files use [data-brand='custom-brand'][data-theme='light'|'dark'] attribute selectors.
  The app shell (in App.tsx) sets data-brand="custom-brand" to activate them.
*/
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/brand-styles/custom-brand-light.css'
import '@fuggetlenfe/brand-styles/custom-brand-dark.css'

import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The React custom demo root element is missing from the document.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
