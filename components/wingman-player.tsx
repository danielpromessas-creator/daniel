"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { WingmanDevice } from "@/components/wingman-device"
import { useSoundcloud } from "@/hooks/use-soundcloud"

type FingerTarget = "play" | "next" | "prev" | "volup" | "voldown" | null

// posições do dedo sobre os botões (em % do container do aparelho)
const FINGER_POS: Record<Exclude<FingerTarget, null>, { left: string; top: string }> = {
  prev: { left: "12%", top: "62%" },
  play: { left: "44%", top: "60%" },
  next: { left: "76%", top: "62%" },
  voldown: { left: "30%", top: "78%" },
  volup: { left: "62%", top: "78%" },
}

export function WingmanPlayer() {
  const sc = useSoundcloud()
  const [finger, setFinger] = useState<FingerTarget>(null)
  const fingerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerFinger = useCallback((target: Exclude<FingerTarget, null>) => {
    setFinger(target)
    if (fingerTimeout.current) clearTimeout(fingerTimeout.current)
    fingerTimeout.current = setTimeout(() => setFinger(null), 350)
  }, [])

  const wrap = useCallback(
    (target: Exclude<FingerTarget, null>, fn: () => void) => () => {
      triggerFinger(target)
      fn()
    },
    [triggerFinger],
  )

  return (
    <div className="relative flex flex-col items-center">
      {/* Conjunto mão + aparelho */}
      <div className="animate-wingman-bob relative">
        {/* Aparelho */}
        <div className="relative z-20">
          <WingmanDevice
            track={sc.track}
            playing={sc.playing}
            ready={sc.ready}
            progress={sc.progress}
            position={sc.position}
            duration={sc.duration}
            volume={sc.volume}
            onTogglePlay={wrap("play", sc.togglePlay)}
            onNext={wrap("next", sc.next)}
            onPrev={wrap("prev", sc.prev)}
            onVolumeUp={wrap("volup", () => sc.changeVolume(10))}
            onVolumeDown={wrap("voldown", () => sc.changeVolume(-10))}
          />

          {/* Dedo que aperta os botões */}
          {finger && (
            <div
              key={finger + Date.now()}
              className="animate-finger-press pointer-events-none absolute z-30"
              style={{
                left: FINGER_POS[finger].left,
                top: FINGER_POS[finger].top,
                transform: "translate(-50%, 0)",
              }}
            >
              <Image
                src="/hand-finger.png"
                alt=""
                width={56}
                height={56}
                className="pixelated rotate-180 drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Mão segurando o aparelho (atrás, surgindo por baixo) */}
        <Image
          src="/hand-holding.png"
          alt="Mão pixel art segurando o player Wingman"
          width={150}
          height={150}
          className="pixelated absolute -bottom-12 -left-14 z-10 -rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,0.4)]"
          priority
        />
      </div>

      {/* iframe do SoundCloud (Widget API) escondido fora da tela.
          Mantemos um tamanho real para o navegador não tratar a mídia
          como "não renderizada" e bloquear a reprodução. */}
      <iframe
        ref={sc.iframeRef}
        title="SoundCloud Player"
        src={sc.widgetSrc}
        allow="autoplay; encrypted-media"
        width={300}
        height={166}
        className="pointer-events-none fixed -left-[9999px] top-0 h-[166px] w-[300px]"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
