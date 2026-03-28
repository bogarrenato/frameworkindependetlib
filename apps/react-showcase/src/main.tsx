import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
