import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import {ApiProvider} from './context/ApiContext'

createRoot(document.getElementById('root')!).render(
  <ApiProvider>
    <App />
  </ApiProvider>,
)
