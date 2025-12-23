"use client"

import * as React from "react"
import { ArrowLeftRight, RefreshCw } from "lucide-react"

import { UnifiedInput } from "@/components/number-converter/UnifiedInput"
import { CurrencySwitcher, type EntryCurrency } from "@/components/number-converter/CurrencySwitcher"
import { DEFAULT_RATE } from "@/lib/rates"
import { useExchangeRate } from "./use-exchange-rate"
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

type FieldKey = "entry" | "lakhs" | "crores"

const INITIAL_BASE_VALUE = 1_000_000

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

const formatRateDisplayValue = (value: number) => value.toFixed(4)

const formatEntryFromBase = (baseValue: number, currency: EntryCurrency, rate: number) => {
  if (currency === "inr") {
    return formatNumberDisplay(baseValue)
  }
  const usd = convertInrToUsd(baseValue, rate)
  return formatUsdDisplay(usd)
}

// Helper for subtext
const SubtextPill = ({ label, value }: { label: string, value: string }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-xs font-medium">
    <span className="opacity-70 uppercase tracking-wider">{label}</span>
    <span>{value}</span>
  </span>
)

// Status Bar Component
function StatusBar({
  rate,
  isLoading,
  error,
  lastUpdated,
}: {
  rate: number
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}) {
  const [whole, decimal] = rate.toFixed(4).split('.')
  const major = decimal.slice(0, 2)
  const minor = decimal.slice(2)

  return (
    <div className="flex items-center justify-between px-6 py-3 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground">
      <div className="flex items-center gap-3 font-mono text-sm">
        <span className="text-muted-foreground/50 font-medium text-xs">1 USD</span>
        <span className="text-border/50 mx-[-4px]">/</span>
        <div className="flex items-baseline">
          <span className="text-muted-foreground/70 mr-0.5 text-xs font-sans">₹</span>
          <span className="font-semibold text-foreground">{whole}.{major}</span>
          <span className="text-[10px] font-medium text-muted-foreground/60 ml-0.5 -translate-y-[1px]">{minor}</span>
        </div>
        {isLoading && <RefreshCw className="size-3 animate-spin ml-1 opacity-50" />}
        {error && <span className="text-destructive ml-2">{error}</span>}
      </div>
      {lastUpdated && (
        <span className="opacity-50 font-mono">
          Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </div>
  )
}

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

type NumberConverterProps = {
  initialRate?: number
}

export function NumberConverter({ initialRate = DEFAULT_RATE }: NumberConverterProps) {
  const [entryCurrency, setEntryCurrency] = React.useState<EntryCurrency>("inr")
  const { rate, isRateLoading, rateFetchError, lastRateFetchedAt } = useExchangeRate(initialRate)

  const [baseValue, setBaseValue] = React.useState(INITIAL_BASE_VALUE)
  const [activeField, setActiveField] = React.useState<FieldKey | null>(null)
  const [activeInput, setActiveInput] = React.useState<string>("")

  // Derived values
  const formattedIndian = formatIndianNumber(baseValue)
  const usdEquivalent = convertInrToUsd(baseValue, rate)
  const formattedUsd = formatUsdDisplay(usdEquivalent)
  const formattedInternational = formatInternationalNumber(baseValue)

  const getFieldValue = (field: FieldKey) => {
    if (activeField === field) return activeInput

    switch (field) {
      case "entry":
        return formatEntryFromBase(baseValue, entryCurrency, rate)
      case "lakhs":
        return formatWithPrecision(toLakhs(baseValue))
      case "crores":
        return formatWithPrecision(toCrores(baseValue), 4)
    }
  }

  const handleFocus = (field: FieldKey) => () => {
    setActiveField(field)
    // Initialize activeInput with the current value to avoid jumps,
    // but strip formatting for editing if needed (UnifiedInput handles display formatting)
    const currentVal = getFieldValue(field)
    // We want to strip commas for editing logic if we were storing raw numbers,
    // but here we are storing the formatted string as input for "entry" mostly.
    // Simple approach: just set it to what is displayed.
    setActiveInput(currentVal)
  }

  const handleBlur = () => {
    setActiveField(null)
    setActiveInput("")
  }

  const handleEntryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const sanitized = sanitizeNumericInput(raw)
    
    // Update the "transient" input state so the user sees exactly what they type
    setActiveInput(formatInternationalInputString(sanitized))

    const parsed = parseNumber(raw)
    if (parsed == null) {
      // If invalid, we just keep the transient input but don't update baseValue
      // (unless it's empty/cleared, maybe set baseValue to 0? Existing logic implied preserving old val or handling it)
       if (!isTransientNumericInput(sanitized)) {
           // Invalid non-transient input (e.g. multiple dots? handled by sanitize mostly)
       }
       return
    }

    const nextBase = entryCurrency === "inr" ? parsed : convertUsdToInr(parsed, rate)
    setBaseValue(nextBase)
  }

  const handleUnitChange = (field: Exclude<FieldKey, "entry">) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    const sanitized = sanitizeNumericInput(raw)
    
    setActiveInput(sanitized)

    const parsed = parseNumber(sanitized)
    if (parsed == null) return

    const nextBase = field === "lakhs" ? fromLakhs(parsed) : fromCrores(parsed)
    setBaseValue(nextBase)
  }

  const handleCurrencyToggle = () => {
    setEntryCurrency((prev) => (prev === "inr" ? "usd" : "inr"))
    setActiveField(null)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <StatusBar
        rate={rate}
        isLoading={isRateLoading}
        error={rateFetchError}
        lastUpdated={lastRateFetchedAt}
      />

      <div className="flex flex-col gap-4 sm:p-8 sm:bg-muted/50 sm:rounded-[2rem] sm:border sm:border-border/50">
        <UnifiedInput
          id="entry"
          label="Primary Currency"
          prefix={entryPrefixes[entryCurrency]}
          value={getFieldValue("entry")}
          onChange={handleEntryChange}
          onFocus={handleFocus("entry")}
          onBlur={handleBlur}
          isActive={activeField === "entry"}
          subtext={
            entryCurrency === "inr" ? (
              <>
                <SubtextPill label="USD" value={`$${formattedUsd}`} />
                <span className="text-muted-foreground/30">•</span>
                <span className="text-xs opacity-70">Intl: {formattedInternational}</span>
              </>
            ) : (
              <>
                <SubtextPill label="INR" value={`₹${formattedIndian}`} />
              </>
            )
          }
          controls={
            <CurrencySwitcher value={entryCurrency} onToggle={handleCurrencyToggle} />
          }
        />

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
          <UnifiedInput
            id="lakhs"
            label="Lakhs"
            suffix="L"
            value={getFieldValue("lakhs")}
            onChange={handleUnitChange("lakhs")}
            onFocus={handleFocus("lakhs")}
            onBlur={handleBlur}
            isActive={activeField === "lakhs"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Lakh = 100,000</span>}
          />

          <UnifiedInput
            id="crores"
            label="Crores"
            suffix="Cr"
            value={getFieldValue("crores")}
            onChange={handleUnitChange("crores")}
            onFocus={handleFocus("crores")}
            onBlur={handleBlur}
            isActive={activeField === "crores"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Crore = 100 Lakhs</span>}
          />
        </div>
      </div>
    </div>
  )
}
