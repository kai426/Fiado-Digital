/// <reference types="vite/client" />
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { AppProviders } from "./app/providers"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)

if (import.meta.env.MODE === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {
        console.warn("O modo offline não está disponível neste navegador.")
      })
  })
}
