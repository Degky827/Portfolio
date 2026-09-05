import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './admin-manager/authentication/AuthContext'
import { SiteSettingsProvider } from './shared/context/SiteSettingsContext'
import { PublicSocketProvider } from './shared/context/PublicSocketContext'
import { IntroProvider } from './public-portfolio/intro/IntroContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <PublicSocketProvider>
          <SiteSettingsProvider>
            <IntroProvider>
              <App />
            </IntroProvider>
          </SiteSettingsProvider>
        </PublicSocketProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>,
)
