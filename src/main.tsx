import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.tsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import ScrollToTop from './components/ScrollToTop/ScrollToTop.tsx'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n.ts'
import Chat from './components/Chat/Chat.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ErrorBoundary>
            <ScrollToTop />
            <App />
            <Chat></Chat>
          </ErrorBoundary>
        </BrowserRouter>
      </CssVarsProvider>
    </I18nextProvider>
  </React.StrictMode>
)
