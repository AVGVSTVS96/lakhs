"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const handleToggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark")
  }, [isDark, setTheme])

  return (
    <Button
      type="button"
      size="icon"
      variant="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {mounted ? (
        isDark ? <Sun className="size-5" /> : <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
