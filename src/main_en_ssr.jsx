import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App.jsx'

const lang = "english"
export function render() {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <App lang={lang} />
    </React.StrictMode>
  )
  return html
}
