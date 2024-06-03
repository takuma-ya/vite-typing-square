import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const lang = "english"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App lang={lang} />
  </React.StrictMode>,
)
