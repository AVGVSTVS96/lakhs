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
  sanitizeNumericInput,
  toCrores,
  toLakhs,
} from "@/lib/conversions"

type FieldKey = "number" | "lakhs" | "crores"

const formatNumberDisplay = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })

const formatters: Record<FieldKey, (value: number) => string> = {
  number: (value) => formatNumberDisplay(value),
  lakhs: (value) => formatWithPrecision(toLakhs(value)),
  crores: (value) => formatWithPrecision(toCrores(value), 4),
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
  const [activeField, setActiveField] = React.useState<FieldKey | null>(null)
  const [invalidField, setInvalidField] = React.useState<FieldKey | null>(null)

  const updateFieldsFromBase = React.useCallback(
    (value: number) => {
      setFields((prev) => ({
        number: activeField === "number" ? prev.number : formatters.number(value),
        lakhs: activeField === "lakhs" ? prev.lakhs : formatters.lakhs(value),
        crores: activeField === "crores" ? prev.crores : formatters.crores(value),
      }))
    },
    [activeField]
  )

  const handleFocus = React.useCallback((field: FieldKey) => {
    setActiveField(field)
  }, [])

  const handleBlur = React.useCallback((field: FieldKey) => {
    setActiveField((current) => (current === field ? null : current))
  }, [])

  const isTransientNumericInput = React.useCallback((value: string) => {
    return (
      value === "" ||
      value === "-" ||
      value === "." ||
      value === "-." ||
      value.endsWith(".")
    )
  }, [])

  const formatInternationalInputString = React.useCallback((value: string) => {
    if (!value) return ""

    if (value === "-") return "-"

    const negative = value.startsWith("-")
    const unsigned = negative ? value.slice(1) : value
    const [integerPartRaw, ...decimalParts] = unsigned.split(".")
    const integerPart = integerPartRaw.replace(/^0+(?=\d)/, "") || "0"
    const decimalPart = decimalParts.length > 0 ? decimalParts.join("") : undefined
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const decimal = decimalPart !== undefined ? `.${decimalPart}` : ""
    return `${negative ? "-" : ""}${formattedInteger}${decimal}`
  }, [])

  const handleChange = React.useCallback(
    (field: FieldKey) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        setActiveField(field)

        if (field === "number") {
          const sanitized = sanitizeNumericInput(raw)
          setFields((prev) => ({
            ...prev,
            number: formatInternationalInputString(sanitized),
          }))
          const parsed = parseNumber(raw)
          if (parsed == null) {
            setInvalidField(isTransientNumericInput(sanitizeNumericInput(raw)) ? null : field)
            return
          }

          const nextBase = converters[field](parsed)
          setInvalidField(null)
          setBaseValue(nextBase)

          setFields({
            number: formatters.number(nextBase),
            lakhs: formatters.lakhs(nextBase),
            crores: formatters.crores(nextBase),
          })
          return
        }

        setFields((prev) => ({ ...prev, [field]: raw }))
        const parsed = parseNumber(raw)
        if (parsed == null) {
          setInvalidField(isTransientNumericInput(sanitizeNumericInput(raw)) ? null : field)
          return
        }

        const nextBase = converters[field](parsed)
        setInvalidField(null)
        setBaseValue(nextBase)

        setFields({
          number: formatters.number(nextBase),
          lakhs: field === "lakhs" ? raw : formatters.lakhs(nextBase),
          crores: field === "crores" ? raw : formatters.crores(nextBase),
        })
      },
    [formatInternationalInputString, isTransientNumericInput]
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
          onFocus={handleFocus("number")}
          onBlur={handleBlur("number")}
          invalid={invalidField === "number"}
        />
        <Field
          id="lakhs"
          label="Lakhs"
          description="Value expressed in lakhs"
          value={fields.lakhs}
          onChange={handleChange("lakhs")}
          onFocus={handleFocus("lakhs")}
          onBlur={handleBlur("lakhs")}
          invalid={invalidField === "lakhs"}
        />
        <Field
          id="crores"
          label="Crores"
          description="Value expressed in crores"
          value={fields.crores}
          onChange={handleChange("crores")}
          onFocus={handleFocus("crores")}
          onBlur={handleBlur("crores")}
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
  onFocus: () => void
  onBlur: () => void
  invalid?: boolean
}

function Field({ id, label, description, value, onChange, onFocus, onBlur, invalid }: FieldProps) {
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
        onFocus={onFocus}
        onBlur={onBlur}
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
