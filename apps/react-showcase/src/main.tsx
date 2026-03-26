import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fuggetlenfe/tokens/contract.css'
import '@fuggetlenfe/tokens/figma-preset.css'
import '../../../examples/external-brand.css'
import '../../../examples/registry-installed/owned-brand-pack/owned-brand.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
