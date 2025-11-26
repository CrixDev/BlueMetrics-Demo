import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

// Utilidades de debugging (disponibles en window.testSupabaseConnection, window.clearAuthCache)
import './utils/testSupabaseConnection'
import './utils/clearAuthCache'

createRoot(document.getElementById('root')).render(
  // StrictMode desactivado temporalmente para evitar renders dobles durante desarrollo
  // <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </StrictMode>,
)
