import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-transparent border-0 h-12 w-full min-w-0 rounded-none px-2 md:px-3 py-1.5 text-lg md:text-xl shadow-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }
