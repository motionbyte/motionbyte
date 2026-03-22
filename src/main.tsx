import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ScrollJourneyProvider } from './ScrollJourneyContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollJourneyProvider>
      <App />
    </ScrollJourneyProvider>
  </StrictMode>,
)
