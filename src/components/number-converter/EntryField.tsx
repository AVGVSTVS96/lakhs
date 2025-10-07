import * as React from "react"
import { Input } from "@/components/ui/input"

function combineIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined
}

export type EntryFieldProps = {
  id: string
  prefix: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  invalid?: boolean
  describedBy?: string
}

export function EntryField({ id, prefix, value, onChange, onFocus, onBlur, invalid, describedBy }: EntryFieldProps) {
  const errorId = invalid ? `${id}-error` : undefined
  const described = combineIds(describedBy, errorId)

  return (
    <div className="space-y-2">
      <div className="relative">
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-8 sm:w-10 text-muted-foreground text-xl sm:text-2xl">
          {prefix}
        </span>
        <Input
          id={id}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-invalid={invalid}
          aria-describedby={described}
          inputMode="decimal"
          placeholder="0"
          className="pl-12 sm:pl-14 pr-3 text-6xl sm:text-7xl font-semibold leading-none tracking-tight"
        />
      </div>
      {invalid ? (
        <p id={errorId} className="text-xs text-destructive">
          Enter a valid amount
        </p>
      ) : null}
    </div>
  )
}
