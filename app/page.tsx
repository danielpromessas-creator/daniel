import { WingmanPlayer } from "@/components/wingman-player"

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-16">
      {/* Grade de fundo estilo cenário pixel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--screen-glow) 1px, transparent 1px), linear-gradient(to bottom, var(--screen-glow) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Vinheta */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Título */}
      <header className="relative z-10 mb-14 text-center">
        <h1 className="font-pixel text-xl text-amber sm:text-2xl">WINGMAN</h1>
        <p className="mt-3 font-pixel text-[8px] leading-relaxed text-screen-glow/70 sm:text-[10px]">
          POCKET PLAYER
        </p>
      </header>

      {/* Player */}
      <div className="relative z-10">
        <WingmanPlayer />
      </div>

      {/* Rodapé */}
      <footer className="relative z-10 mt-20 text-center">
        <p className="font-pixel text-[7px] leading-relaxed text-muted-foreground sm:text-[8px]">
          {"INSPIRADO NO JOGO REPLACED \u00B7 \u00C1UDIO VIA SOUNDCLOUD"}
        </p>
      </footer>
    </main>
  )
}
