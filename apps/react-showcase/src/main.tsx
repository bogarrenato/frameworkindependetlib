import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/brand-styles/brand-2-light.css'
import '@fuggetlenfe/brand-styles/brand-2-dark.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
