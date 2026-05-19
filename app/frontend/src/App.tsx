import { useEffect } from 'react'
import './App.css'

import {socket} from "./socket.js"




function App() {

    useEffect(() => {

socket.on("connection", () => {
console.log("connected to server")
})

socket.on("disconnect", () => {
  console.log("User disconnected");
});




}, [])


  return (
    <main className="workspace-shell">
      <section className="hero-panel">
        <p className="eyebrow">Frontend workspace</p>
        <h1>Build your websocket client here.</h1>
        <p className="hero-copy">
          A clean starting point for connection handling, message views, and any
          UI you want to layer on top.
        </p>
        <div className="chips" aria-label="Project focus">
          <span>React</span>
          <span>Vite</span>
          <span>WebSocket ready</span>
        </div>
      </section>

      <section className="content-grid" aria-label="Workspace sections">
        <article className="card">
          <h2>Connection</h2>
          <p>Drop your socket setup, URL controls, and reconnect logic here.</p>
          <div className="placeholder-box">
            <code>ws://localhost:8080</code>
            <span>Status, transport, and controls can live here.</span>
          </div>
        </article>

        <article className="card">
          <h2>Messages</h2>
          <p>Use this space for logs, payload previews, or a chat-style feed.</p>
          <div className="placeholder-box empty-state">
            <span>No messages yet.</span>
            <small>Wire up your client and stream events into this panel.</small>
          </div>
        </article>
      </section>
    </main>
  )
}

export default App
