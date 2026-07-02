import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './themes.css'
import './index.css'
import App from './App.tsx'
import { ACTIVE_THEME } from './themes'

document.documentElement.dataset.theme = String(ACTIVE_THEME)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
