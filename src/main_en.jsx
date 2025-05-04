import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const lang = "english"
ReactDOM.hydrateRoot(document.getElementById('root'),
  <React.StrictMode>
    <App lang={lang} />
  </React.StrictMode>
)
