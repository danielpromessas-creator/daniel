"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type PixelButtonProps = {
  onPress: () => void
  label: string
  children: ReactNode
  variant?: "default" | "primary" | "small"
  className?: string
}

export function PixelButton({
  onPress,
  label,
  children,
  variant = "default",
  className,
}: PixelButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className={cn(
        "group relative flex select-none items-center justify-center rounded-full font-pixel text-shell-dark transition-transform duration-75 active:translate-y-[3px]",
        "border-2 border-shell-dark",
        variant === "primary"
          ? "bg-amber text-shell-dark shadow-[0_4px_0_0_var(--shell-dark)] active:shadow-[0_1px_0_0_var(--shell-dark)]"
          : "bg-shell-light text-shell-dark shadow-[0_4px_0_0_var(--shell-dark)] active:shadow-[0_1px_0_0_var(--shell-dark)]",
        variant === "small" ? "size-9 text-[8px]" : "size-12 text-[10px]",
        className,
      )}
    >
      <span className="pointer-events-none">{children}</span>
    </button>
  )
}
