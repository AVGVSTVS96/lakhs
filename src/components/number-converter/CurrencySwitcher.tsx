"use client"

import { cn } from "@/lib/utils"

export type EntryCurrency = "inr" | "usd"

interface CurrencySwitcherProps {
  value: EntryCurrency
  onToggle: () => void
}

export function CurrencySwitcher({ value, onToggle }: CurrencySwitcherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex items-center bg-black/5 dark:bg-white/5 rounded-full p-0.5 border border-black/5 dark:border-white/10 isolate cursor-pointer group"
    >
      <div 
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] bg-background dark:bg-white/10 rounded-full shadow-sm ring-1 ring-black/5 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1.1)] -z-10",
          value === "usd" ? "translate-x-full" : "translate-x-0"
        )}
      />
      {(['inr', 'usd'] as EntryCurrency[]).map((curr) => (
        <span
          key={curr}
          className={cn(
            "relative px-3 py-1 w-12 text-[10px] font-bold tracking-widest uppercase transition-colors duration-200 ease-out text-center select-none",
            value === curr 
              ? "text-foreground" 
              : "text-muted-foreground/70"
          )}
        >
          {curr}
        </span>
      ))}
    </button>
  )
}
