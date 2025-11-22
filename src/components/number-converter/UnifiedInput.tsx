import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface UnifiedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  prefix?: string
  suffix?: string
  subtext?: React.ReactNode
  controls?: React.ReactNode
  isActive?: boolean
}

export const UnifiedInput = React.forwardRef<HTMLInputElement, UnifiedInputProps>(
  ({ className, label, prefix, suffix, subtext, controls, isActive, ...props }, ref) => {
    return (
      <div 
        className={cn(
          "group relative flex flex-col gap-1 rounded-2xl p-6 transition-all duration-300",
          isActive 
            ? "bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 shadow-lg shadow-black/5 scale-[1.01]" 
            : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <label 
            htmlFor={props.id} 
            className={cn(
              "text-sm font-bold uppercase tracking-widest transition-colors",
              // Reduced visual weight for labels when active vs inactive using CSS color-mix utilities
              isActive ? "text-label-active" : "text-label-inactive"
            )}
          >
            {label}
          </label>
          {controls}
        </div>

        <div className="relative flex items-baseline">
          {prefix && (
            <span className={cn(
              "mr-3 text-4xl sm:text-5xl font-light transition-colors select-none",
              isActive ? "text-primary" : "text-muted-foreground/60"
            )}>
              {prefix}
            </span>
          )}
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            className={cn(
              // added tabular-nums and caret-primary
              "h-auto border-0 bg-transparent p-0 md:p-0 text-5xl sm:text-6xl md:text-6xl font-semibold tracking-tight shadow-none transition-all placeholder:text-muted-foreground/20 focus-visible:ring-0 tabular-nums caret-primary",
              "w-full",
              isActive ? "text-primary" : "text-foreground"
            )}
            {...props}
          />
          {suffix && (
            <span className={cn(
              "ml-3 text-2xl sm:text-3xl font-light self-end mb-1.5 transition-colors select-none",
              isActive ? "text-primary" : "text-muted-foreground/60"
            )}>
              {suffix}
            </span>
          )}
        </div>

        {subtext && (
          <div className={cn(
            "mt-3 flex items-center gap-2 text-sm font-medium transition-colors",
            isActive ? "text-muted-foreground" : "text-muted-foreground/60"
          )}>
            {subtext}
          </div>
        )}
      </div>
    )
  }
)
UnifiedInput.displayName = "UnifiedInput"
