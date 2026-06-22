"use client"

import type { TrackInfo } from "@/hooks/use-soundcloud"

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

type WingmanScreenProps = {
  track: TrackInfo
  playing: boolean
  ready: boolean
  progress: number
  position: number
  duration: number
  volume: number
}

export function WingmanScreen({
  track,
  playing,
  ready,
  progress,
  position,
  duration,
  volume,
}: WingmanScreenProps) {
  // 16 colunas para a barra de progresso estilo blocos
  const blocks = 16
  const filled = Math.round(progress * blocks)

  // 12 colunas para o volume
  const volBlocks = 12
  const volFilled = Math.round((volume / 100) * volBlocks)

  return (
    <div className="crt-screen animate-screen-flicker relative w-full rounded-[2px] bg-screen-dim p-2 font-pixel text-[7px] leading-tight text-screen-glow sm:text-[8px]">
      {/* Header da tela */}
      <div className="relative z-[4] flex items-center justify-between border-b border-screen-glow/30 pb-1">
        <span className="tracking-tighter">WINGMAN</span>
        <span className="flex items-center gap-1">
          <span
            className={
              ready
                ? "inline-block size-[5px] bg-screen-glow"
                : "inline-block size-[5px] bg-screen-glow/30"
            }
            aria-hidden="true"
          />
          {ready ? "ON" : "..."}
        </span>
      </div>

      {/* Marquee do título */}
      <div className="relative z-[4] mt-2 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block"
          style={
            playing
              ? {
                  animation: "marquee 8s linear infinite",
                  paddingRight: "2rem",
                }
              : undefined
          }
        >
          {playing ? (
            <>
              <span className="pr-8">{track.title}</span>
              <span className="pr-8">{track.title}</span>
            </>
          ) : (
            <span className="block truncate">{track.title}</span>
          )}
        </div>
      </div>

      {/* Artista */}
      <div className="relative z-[4] mt-1 truncate text-screen-glow/60">
        {track.artist}
      </div>

      {/* Equalizer + status */}
      <div className="relative z-[4] mt-2 flex items-end gap-[3px]" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="w-[3px] origin-bottom bg-screen-glow"
            style={{
              height: "14px",
              animation: playing
                ? `eq-bounce ${0.6 + (i % 5) * 0.18}s ease-in-out ${i * 0.05}s infinite`
                : "none",
              transform: playing ? undefined : "scaleY(0.15)",
            }}
          />
        ))}
      </div>

      {/* Barra de progresso em blocos */}
      <div className="relative z-[4] mt-2 flex items-center gap-1">
        <span className="tabular-nums">{formatTime(position)}</span>
        <div className="flex flex-1 gap-[2px]">
          {Array.from({ length: blocks }).map((_, i) => (
            <span
              key={i}
              className={
                i < filled
                  ? "h-[8px] flex-1 bg-screen-glow"
                  : "h-[8px] flex-1 bg-screen-glow/15"
              }
            />
          ))}
        </div>
        <span className="tabular-nums">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div className="relative z-[4] mt-2 flex items-center gap-1">
        <span>VOL</span>
        <div className="flex flex-1 gap-[2px]">
          {Array.from({ length: volBlocks }).map((_, i) => (
            <span
              key={i}
              className={
                i < volFilled
                  ? "h-[6px] flex-1 bg-screen-glow"
                  : "h-[6px] flex-1 bg-screen-glow/15"
              }
            />
          ))}
        </div>
        <span>{playing ? "\u25B6" : "\u275A\u275A"}</span>
      </div>
    </div>
  )
}
