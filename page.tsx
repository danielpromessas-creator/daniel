```tsx
"use client"

import { useSoundcloud } from "./hooks/use-soundcloud"

export default function Home() {
  const { iframeRef, widgetSrc, track, playing, togglePlay, next, prev, volume, changeVolume } = useSoundcloud()

  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#111",
      color: "#fff",
      fontFamily: "sans-serif",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#222",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        textAlign: "center",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#888" }}>WINGMAN PLAYER</h2>
        <h1 style={{ margin: "0 0 5px 0", fontSize: "20px" }}>{track.title}</h1>
        <p style={{ margin: "0 0 20px 0", color: "#ffa500", fontWeight: "bold" }}>{track.artist}</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginBottom: "20px" }}>
          <button onClick={prev} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "6px", border: "none" }}>⏮ Voltar</button>
          <button onClick={togglePlay} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "6px", border: "none", backgroundColor: "#ffa500", fontWeight: "bold" }}>
            {playing ? "⏸ Pausar" : "▶ Tocar"}
          </button>
          <button onClick={next} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "6px", border: "none" }}>⏭ Avançar</button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          <span>Vol: {volume}%</span>
          <button onClick={() => changeVolume(-10)} style={{ cursor: "pointer" }}>🔉</button>
          <button onClick={() => changeVolume(10)} style={{ cursor: "pointer" }}>🔊</button>
        </div>
      </div>

      {/* O iframe invisível do SoundCloud que faz a mágica acontecer por trás */}
      <iframe
        ref={iframeRef}
        src={widgetSrc}
        style={{ display: "none" }}
        allow="autoplay"
      />
    </main>
  )
}
