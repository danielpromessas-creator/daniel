"use client"

import { PixelButton } from "@/components/pixel-button"
import { WingmanScreen } from "@/components/wingman-screen"
import type { TrackInfo } from "@/hooks/use-soundcloud"

type WingmanDeviceProps = {
  track: TrackInfo
  playing: boolean
  ready: boolean
  progress: number
  position: number
  duration: number
  volume: number
  onTogglePlay: () => void
  onNext: () => void
  onPrev: () => void
  onVolumeUp: () => void
  onVolumeDown: () => void
}

export function WingmanDevice({
  track,
  playing,
  ready,
  progress,
  position,
  duration,
  volume,
  onTogglePlay,
  onNext,
  onPrev,
  onVolumeUp,
  onVolumeDown,
}: WingmanDeviceProps) {
  return (
    <div className="relative w-[240px] select-none sm:w-[260px]">
      {/* Carcaça externa */}
      <div className="relative rounded-[6px] border-4 border-shell-dark bg-shell p-3 shadow-[8px_8px_0_0_rgba(0,0,0,0.55)]">
        {/* Brilho superior da carcaça */}
        <div className="pointer-events-none absolute inset-x-1 top-1 h-2 bg-shell-light/40" />

        {/* Parafusos nos cantos */}
        <Screw className="left-1 top-1" />
        <Screw className="right-1 top-1" />
        <Screw className="bottom-1 left-1" />
        <Screw className="bottom-1 right-1" />

        {/* Topo: marca + alto-falante */}
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="font-pixel text-[8px] text-amber">WINGMAN</span>
          <div className="flex gap-[3px]" aria-hidden="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="size-[4px] rounded-full bg-shell-dark" />
            ))}
          </div>
        </div>

        {/* Moldura da tela */}
        <div className="rounded-[3px] border-4 border-shell-dark bg-shell-dark p-1">
          <WingmanScreen
            track={track}
            playing={playing}
            ready={ready}
            progress={progress}
            position={position}
            duration={duration}
            volume={volume}
          />
        </div>

        {/* Controles principais */}
        <div className="mt-4 flex items-center justify-between px-1">
          <PixelButton label="Faixa anterior" variant="small" onPress={onPrev}>
            {"\u23EE"}
          </PixelButton>

          <PixelButton
            label={playing ? "Pausar" : "Tocar"}
            variant="primary"
            onPress={onTogglePlay}
            className="size-14"
          >
            {playing ? "\u275A\u275A" : "\u25B6"}
          </PixelButton>

          <PixelButton label="Próxima faixa" variant="small" onPress={onNext}>
            {"\u23ED"}
          </PixelButton>
        </div>

        {/* Volume */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <PixelButton label="Diminuir volume" variant="small" onPress={onVolumeDown}>
            {"\u2212"}
          </PixelButton>
          <span className="font-pixel text-[7px] text-shell-light">VOL</span>
          <PixelButton label="Aumentar volume" variant="small" onPress={onVolumeUp}>
            {"+"}
          </PixelButton>
        </div>

        {/* Grade do alto-falante inferior */}
        <div className="mt-3 flex justify-center gap-[3px]" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-3 w-[3px] rounded-full bg-shell-dark" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Screw({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute size-[7px] rounded-full border-2 border-shell-dark bg-shell-light ${className ?? ""}`}
    />
  )
}
