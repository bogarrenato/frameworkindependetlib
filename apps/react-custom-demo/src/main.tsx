import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
