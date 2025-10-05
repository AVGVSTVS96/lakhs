"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  formatIndianNumber,
  formatInternationalNumber,
  formatWithPrecision,
  fromCrores,
  fromLakhs,
  parseNumber,
  toCrores,
  toLakhs,
} from "@/lib/conversions"

type FieldKey = "number" | "lakhs" | "crores"

const formatNumberInput = (value: number, fractionDigits = 0) =>
  Number(value.toFixed(fractionDigits)).toString()

const formatters: Record<FieldKey, (value: number) => string> = {
  number: (value) => formatNumberInput(value, 0),
  lakhs: (value) => formatNumberInput(toLakhs(value), 2),
  crores: (value) => formatNumberInput(toCrores(value), 4),
}

const converters: Record<FieldKey, (value: number) => number> = {
  number: (value) => value,
  lakhs: (value) => fromLakhs(value),
  crores: (value) => fromCrores(value),
}

export function NumberConverter() {
  const [baseValue, setBaseValue] = React.useState(1_000_000)
  const [fields, setFields] = React.useState<Record<FieldKey, string>>({
    number: formatters.number(1_000_000),
    lakhs: formatters.lakhs(1_000_000),
    crores: formatters.crores(1_000_000),
  })
  const [invalidField, setInvalidField] = React.useState<FieldKey | null>(null)

  const updateFieldsFromBase = React.useCallback((value: number) => {
    setFields((prev) => ({
      number: invalidField === "number" ? prev.number : formatters.number(value),
      lakhs: invalidField === "lakhs" ? prev.lakhs : formatters.lakhs(value),
      crores: invalidField === "crores" ? prev.crores : formatters.crores(value),
    }))
  }, [invalidField])

  const handleChange = React.useCallback(
    (field: FieldKey) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        setFields((prev) => ({ ...prev, [field]: raw }))

        const parsed = parseNumber(raw)
        if (parsed == null) {
          setInvalidField(field)
          return
        }

        const nextBase = converters[field](parsed)
        setInvalidField(null)
        setBaseValue(nextBase)

        setFields({
          number: field === "number" ? raw : formatters.number(nextBase),
          lakhs: field === "lakhs" ? raw : formatters.lakhs(nextBase),
          crores: field === "crores" ? raw : formatters.crores(nextBase),
        })
      },
    []
  )

  React.useEffect(() => {
    updateFieldsFromBase(baseValue)
  }, [baseValue, updateFieldsFromBase])

  const formattedInternational = formatInternationalNumber(baseValue)
  const formattedIndian = formatIndianNumber(baseValue)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          id="number"
          label="Number"
          description="International format input"
          value={fields.number}
          onChange={handleChange("number")}
          invalid={invalidField === "number"}
        />
        <Field
          id="lakhs"
          label="Lakhs"
          description="Value expressed in lakhs"
          value={fields.lakhs}
          onChange={handleChange("lakhs")}
          invalid={invalidField === "lakhs"}
        />
        <Field
          id="crores"
          label="Crores"
          description="Value expressed in crores"
          value={fields.crores}
          onChange={handleChange("crores")}
          invalid={invalidField === "crores"}
        />
      </div>

      <Separator className="bg-border" />

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <StatBlock label="Indian grouping" value={formattedIndian} />
        <StatBlock label="International grouping" value={formattedInternational} />
        <StatBlock
          label="Equivalent in lakhs"
          value={`${formatWithPrecision(toLakhs(baseValue))} L`}
        />
        <StatBlock
          label="Equivalent in crores"
          value={`${formatWithPrecision(toCrores(baseValue), 4)} Cr`}
        />
      </div>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  description?: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  invalid?: boolean
}

function Field({ id, label, description, value, onChange, invalid }: FieldProps) {
  const describedBy = description ? `${id}-description` : undefined

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      </div>
      <Input
        id={id}
        value={value}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={onChange}
        inputMode="decimal"
        placeholder="0"
      />
      {description ? (
        <p id={describedBy} className="text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      {invalid ? (
        <p className="text-xs text-destructive">Enter a valid number</p>
      ) : null}
    </div>
  )
}

type StatBlockProps = {
  label: string
  value: string
}

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3 shadow-xs">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold sm:text-lg">{value}</p>
    </div>
  )
}
