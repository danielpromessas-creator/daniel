"use client"

import { useCallback, useEffect, useRef, useState } from "react"

// URL da playlist (set) do SoundCloud informada pelo usuário
const PLAYLIST_URL =
  "https://soundcloud.com/simpsom-daniel/sets/pkvs6jduxcj8"

const WIDGET_SRC =
  "https://w.soundcloud.com/player/?url=" +
  encodeURIComponent(PLAYLIST_URL) +
  "&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false"

type SCWidget = {
  bind: (event: string, listener: (e?: unknown) => void) => void
  play: () => void
  pause: () => void
  next: () => void
  prev: () => void
  seekTo: (ms: number) => void
  setVolume: (v: number) => void
  getCurrentSound: (cb: (sound: SCSound) => void) => void
  getDuration: (cb: (ms: number) => void) => void
  getPosition: (cb: (ms: number) => void) => void
}

type SCSound = {
  title?: string
  user?: { username?: string }
  artwork_url?: string | null
}

declare global {
  interface Window {
    SC?: {
      Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
        Events: {
          READY: string
          PLAY: string
          PAUSE: string
          FINISH: string
          PLAY_PROGRESS: string
        }
      }
    }
  }
}

export type TrackInfo = {
  title: string
  artist: string
}

const SCRIPT_ID = "soundcloud-widget-api"

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return
    if (window.SC) {
      resolve()
      return
    }
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener("load", () => resolve())
      return
    }
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    script.addEventListener("load", () => resolve())
    document.body.appendChild(script)
  })
}

export function useSoundcloud() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const widgetRef = useRef<SCWidget | null>(null)

  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [track, setTrack] = useState<TrackInfo>({
    title: "CARREGANDO...",
    artist: "WINGMAN",
  })
  const [progress, setProgress] = useState(0) // 0 - 1
  const [position, setPosition] = useState(0) // ms
  const [duration, setDuration] = useState(0) // ms
  const [volume, setVolumeState] = useState(80)

  const refreshTrack = useCallback(() => {
    const w = widgetRef.current
    if (!w) return
    w.getCurrentSound((sound) => {
      if (!sound) return
      setTrack({
        title: (sound.title || "FAIXA DESCONHECIDA").toUpperCase(),
        artist: (sound.user?.username || "WINGMAN").toUpperCase(),
      })
    })
    w.getDuration((ms) => setDuration(ms || 0))
  }, [])

  useEffect(() => {
    let cancelled = false
    loadScript().then(() => {
      if (cancelled || !iframeRef.current || !window.SC) return
      const widget = window.SC.Widget(iframeRef.current)
      widgetRef.current = widget
      const Events = window.SC.Widget.Events

      widget.bind(Events.READY, () => {
        setReady(true)
        refreshTrack()
        widget.setVolume(volume)
      })
      widget.bind(Events.PLAY, () => {
        setPlaying(true)
        refreshTrack()
      })
      widget.bind(Events.PAUSE, () => setPlaying(false))
      widget.bind(Events.FINISH, () => setPlaying(false))
      widget.bind(Events.PLAY_PROGRESS, (e) => {
        const data = e as { relativePosition?: number; currentPosition?: number }
        if (typeof data.relativePosition === "number") {
          setProgress(data.relativePosition)
        }
        if (typeof data.currentPosition === "number") {
          setPosition(data.currentPosition)
        }
      })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePlay = useCallback(() => {
    const w = widgetRef.current
    if (!w) return
    if (playing) w.pause()
    else w.play()
  }, [playing])

  const next = useCallback(() => {
    widgetRef.current?.next()
    setTimeout(refreshTrack, 600)
  }, [refreshTrack])

  const prev = useCallback(() => {
    widgetRef.current?.prev()
    setTimeout(refreshTrack, 600)
  }, [refreshTrack])

  const changeVolume = useCallback((delta: number) => {
    setVolumeState((prev) => {
      const v = Math.max(0, Math.min(100, prev + delta))
      widgetRef.current?.setVolume(v)
      return v
    })
  }, [])

  return {
    iframeRef,
    widgetSrc: WIDGET_SRC,
    ready,
    playing,
    track,
    progress,
    position,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    changeVolume,
  }
}
