import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This is the single entry point of the app.
// Vite loads this file first, React takes over the <div id="root"> from
// index.html, and everything else (App, Header, Workspace...) is rendered
// inside it from here on.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
