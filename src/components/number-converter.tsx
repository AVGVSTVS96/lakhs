"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  convertInrToUsd,
  convertUsdToInr,
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

type EntryCurrency = "inr" | "usd"
type FieldKey = "entry" | "lakhs" | "crores"

const INITIAL_BASE_VALUE = 1_000_000
const DEFAULT_RATE = 83

const entryPrefixes: Record<EntryCurrency, string> = {
  inr: "₹",
  usd: "$",
}

const formatNumberDisplay = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  })

const formatUsdDisplay = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const formatEntryFromBase = (baseValue: number, currency: EntryCurrency, rate: number) => {
  if (currency === "inr") {
    return formatNumberDisplay(baseValue)
  }
  const usd = convertInrToUsd(baseValue, rate)
  return formatUsdDisplay(usd)
}

const combineIds = (...ids: Array<string | undefined>) =>
  ids.filter(Boolean).join(" ") || undefined

const isTransientNumericInput = (value: string) =>
  value === "" || value === "-" || value === "." || value === "-." || value.endsWith(".")

const formatInternationalInputString = (value: string) => {
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
}

export function NumberConverter() {
  const [entryCurrency, setEntryCurrency] = React.useState<EntryCurrency>("inr")
  const [rate, setRate] = React.useState(DEFAULT_RATE)
  const [rateInput, setRateInput] = React.useState(String(DEFAULT_RATE))
  const [rateError, setRateError] = React.useState<string | null>(null)

  const [baseValue, setBaseValue] = React.useState(INITIAL_BASE_VALUE)
  const [fields, setFields] = React.useState<Record<FieldKey, string>>({
    entry: formatEntryFromBase(INITIAL_BASE_VALUE, "inr", DEFAULT_RATE),
    lakhs: formatWithPrecision(toLakhs(INITIAL_BASE_VALUE)),
    crores: formatWithPrecision(toCrores(INITIAL_BASE_VALUE), 4),
  })
  const [activeField, setActiveField] = React.useState<FieldKey | null>(null)
  const [invalidField, setInvalidField] = React.useState<FieldKey | null>(null)

  React.useEffect(() => {
    setFields((prev) => ({
      entry:
        activeField === "entry"
          ? prev.entry
          : formatEntryFromBase(baseValue, entryCurrency, rate),
      lakhs:
        activeField === "lakhs"
          ? prev.lakhs
          : formatWithPrecision(toLakhs(baseValue)),
      crores:
        activeField === "crores"
          ? prev.crores
          : formatWithPrecision(toCrores(baseValue), 4),
    }))
  }, [activeField, baseValue, entryCurrency, rate])

  const handleFocus = React.useCallback(
    (field: FieldKey) => () => {
      setActiveField(field)
    },
    []
  )

  const handleBlur = React.useCallback(
    (field: FieldKey) => () => {
      setActiveField((current) => (current === field ? null : current))
    },
    []
  )

  const handleEntryChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      const sanitized = sanitizeNumericInput(raw)
      setActiveField("entry")
      setFields((prev) => ({ ...prev, entry: formatInternationalInputString(sanitized) }))

      const parsed = parseNumber(raw)
      if (parsed == null) {
        setInvalidField(isTransientNumericInput(sanitized) ? null : "entry")
        return
      }

      const nextBase = entryCurrency === "inr" ? parsed : convertUsdToInr(parsed, rate)
      setInvalidField(null)
      setBaseValue(nextBase)
    },
    [entryCurrency, rate]
  )

  const handleUnitChange = React.useCallback(
    (field: Exclude<FieldKey, "entry">) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value
        const sanitized = sanitizeNumericInput(raw)
        setActiveField(field)
        setFields((prev) => ({ ...prev, [field]: sanitized }))

        const parsed = parseNumber(sanitized)
        if (parsed == null) {
          setInvalidField(isTransientNumericInput(sanitized) ? null : field)
          return
        }

        const nextBase = field === "lakhs" ? fromLakhs(parsed) : fromCrores(parsed)
        setInvalidField(null)
        setBaseValue(nextBase)
      },
    []
  )

  const handleCurrencyToggle = React.useCallback((value: string) => {
    if (value === entryCurrency) return
    const next = value === "usd" ? "usd" : "inr"
    setEntryCurrency(next)
    setInvalidField(null)
    setActiveField(null)
  }, [entryCurrency])

  const handleRateChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      const sanitized = sanitizeNumericInput(raw)
      setRateInput(sanitized)

      const parsed = parseNumber(sanitized)
      if (parsed == null) {
        setRateError(isTransientNumericInput(sanitized) ? null : "Enter a valid rate")
        return
      }

      if (parsed <= 0) {
        setRateError("Enter a rate greater than zero")
        return
      }

      setRateError(null)
      setRate(parsed)
    },
    []
  )

  const handleRateReset = React.useCallback(() => {
    setRate(DEFAULT_RATE)
    setRateInput(String(DEFAULT_RATE))
    setRateError(null)
  }, [])

  const formattedIndian = formatIndianNumber(baseValue)
  const formattedInternational = formatInternationalNumber(baseValue)
  const usdEquivalent = convertInrToUsd(baseValue, rate)
  const formattedUsd = formatUsdDisplay(usdEquivalent)
  const rateSummary = formatWithPrecision(rate, 4)
  const entryDescriptionId = "entry-description"

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Label htmlFor="entry" className="text-sm font-medium">
              Entry amount
            </Label>
            <p id={entryDescriptionId} className="text-xs text-muted-foreground sm:text-sm">
              Type in USD or INR and every representation updates instantly.
            </p>
          </div>
          <Tabs value={entryCurrency} onValueChange={handleCurrencyToggle} className="sm:self-end">
            <TabsList>
              <TabsTrigger value="inr">INR</TabsTrigger>
              <TabsTrigger value="usd">USD</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <EntryField
          id="entry"
          prefix={entryPrefixes[entryCurrency]}
          value={fields.entry}
          onChange={handleEntryChange}
          onFocus={handleFocus("entry")}
          onBlur={handleBlur("entry")}
          invalid={invalidField === "entry"}
          describedBy={entryDescriptionId}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="lakhs"
          label="Lakhs"
          description="Value expressed in lakhs"
          value={fields.lakhs}
          onChange={handleUnitChange("lakhs")}
          onFocus={handleFocus("lakhs")}
          onBlur={handleBlur("lakhs")}
          invalid={invalidField === "lakhs"}
        />
        <Field
          id="crores"
          label="Crores"
          description="Value expressed in crores"
          value={fields.crores}
          onChange={handleUnitChange("crores")}
          onFocus={handleFocus("crores")}
          onBlur={handleBlur("crores")}
          invalid={invalidField === "crores"}
        />
      </div>

      <Separator className="bg-border" />

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <StatBlock
          label="INR · Indian grouping"
          value={`₹${formattedIndian}`}
        />
        <StatBlock
          label="INR · International grouping"
          value={`₹${formattedInternational}`}
        />
        <StatBlock
          label="Lakhs"
          value={`${formatWithPrecision(toLakhs(baseValue))} L`}
        />
        <StatBlock
          label="Crores"
          value={`${formatWithPrecision(toCrores(baseValue), 4)} Cr`}
        />
        <StatBlock
          label="USD amount"
          value={`$${formattedUsd}`}
          hint="Recomputed with the rate below."
        />
        <StatBlock
          label="Exchange snapshot"
          value={`1 USD → ₹${rateSummary}`}
          hint="Tweak the rate to match today’s market."
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Label htmlFor="rate" className="text-xs uppercase tracking-wide">
            Exchange rate
          </Label>
          <p className="text-sm text-muted-foreground">
            This calculator assumes 1 USD converts to ₹{rateSummary}. Adjust it to reflect your context.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            id="rate"
            inputMode="decimal"
            value={rateInput}
            onChange={handleRateChange}
            aria-invalid={Boolean(rateError)}
            className="w-28"
            placeholder="0"
          />
          <Button type="button" variant="outline" onClick={handleRateReset}>
            Reset
          </Button>
        </div>
        {rateError ? (
          <p className="text-xs text-destructive sm:max-w-[14rem]">{rateError}</p>
        ) : null}
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
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = invalid ? `${id}-error` : undefined
  const describedBy = combineIds(descriptionId, errorId)

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
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
      />
      {description ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
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

type EntryFieldProps = {
  id: string
  prefix: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
  invalid?: boolean
  describedBy?: string
}

function EntryField({ id, prefix, value, onChange, onFocus, onBlur, invalid, describedBy }: EntryFieldProps) {
  const errorId = invalid ? `${id}-error` : undefined
  const described = combineIds(describedBy, errorId)

  return (
    <div className="space-y-2">
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
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
          className="pl-8 text-base sm:text-lg"
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

type StatBlockProps = {
  label: string
  value: string
  hint?: string
}

function StatBlock({ label, value, hint }: StatBlockProps) {
  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3 shadow-xs">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold sm:text-lg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
