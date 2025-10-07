import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function combineIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined
}

export type FieldProps = {
  id: string
  label: string
  description?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  invalid?: boolean
}

export function Field({ id, label, description, value, onChange, onFocus, onBlur, invalid }: FieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = invalid ? `${id}-error` : undefined
  const describedBy = combineIds(descriptionId, errorId)

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        inputMode="decimal"
        placeholder="0"
        className="text-4xl sm:text-5xl font-medium leading-tight"
      />
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-lighter">
          {description}
        </p>
      ) : null}
      {invalid ? (
        <p id={errorId} className="text-xs text-destructive">
          Enter a valid number
        </p>
      ) : null}
    </div>
  )
}
