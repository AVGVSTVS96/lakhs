"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

import { UnifiedInput } from "@/components/number-converter/UnifiedInput"
import { CurrencySwitcher, type EntryCurrency } from "@/components/number-converter/CurrencySwitcher"
import { DEFAULT_RATE } from "@/lib/rates"
import { useExchangeRate } from "./use-exchange-rate"
import {
  convertInrToUsd,
  convertUsdToInr,
  formatIndianNumber,
  formatInternationalNumber,
  formatNumberDisplay,
  formatOrEmpty,
  formatUsdDisplay,
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

// Hook to manage raw input state during editing
function useRawInput(
  formattedValue: string,
  onValidChange: (value: number | null) => void,
  isActive: boolean
) {
  const [rawInput, setRawInput] = React.useState<string | null>(null)

  // When field becomes inactive, clear raw input to show formatted value
  React.useEffect(() => {
    if (!isActive) {
      setRawInput(null)
    }
  }, [isActive])

  const displayValue = rawInput !== null ? rawInput : formattedValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Store raw input (sanitized to only valid characters)
    const sanitized = sanitizeNumericInput(value)
    setRawInput(sanitized)

    // Try to parse and update base value if valid
    const parsed = parseNumber(value)
    if (parsed !== null) {
      onValidChange(parsed)
    } else if (value.trim() === "") {
      onValidChange(null)
    }
    // For intermediate states like "123." we keep raw input but don't update baseValue
  }

  const handleBlur = () => {
    // On blur, clear raw input to show formatted value
    setRawInput(null)
  }

  return { displayValue, handleChange, handleBlur }
}

const formatEntryFromBase = (baseValue: number | null, currency: EntryCurrency, rate: number) => {
  if (baseValue === null) return ""
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

type NumberConverterProps = {
  initialRate?: number
}

export function NumberConverter({ initialRate = DEFAULT_RATE }: NumberConverterProps) {
  const [entryCurrency, setEntryCurrency] = React.useState<EntryCurrency>("inr")
  const { rate, isRateLoading, rateFetchError, lastRateFetchedAt } = useExchangeRate(initialRate)

  const [baseValue, setBaseValue] = React.useState<number | null>(INITIAL_BASE_VALUE)
  const [activeField, setActiveField] = React.useState<FieldKey | null>(null)

  // Derived display values - always formatted (show empty when null)
  const formattedIndian = formatOrEmpty(baseValue, formatIndianNumber)
  const usdEquivalent = baseValue !== null ? convertInrToUsd(baseValue, rate) : null
  const formattedUsd = formatOrEmpty(usdEquivalent, formatUsdDisplay)
  const formattedInternational = formatOrEmpty(baseValue, formatInternationalNumber)

  const entryFormattedValue = formatEntryFromBase(baseValue, entryCurrency, rate)
  const lakhsFormattedValue = formatOrEmpty(baseValue, (v) => formatWithPrecision(toLakhs(v)))
  const croresFormattedValue = formatOrEmpty(baseValue, (v) => formatWithPrecision(toCrores(v), 4))

  // Use raw input hooks to preserve user input during editing
  const entryInput = useRawInput(
    entryFormattedValue,
    (parsed) => {
      if (parsed !== null) {
        setBaseValue(entryCurrency === "inr" ? parsed : convertUsdToInr(parsed, rate))
      } else {
        setBaseValue(null)
      }
    },
    activeField === "entry"
  )

  const lakhsInput = useRawInput(
    lakhsFormattedValue,
    (parsed) => setBaseValue(parsed !== null ? fromLakhs(parsed) : null),
    activeField === "lakhs"
  )

  const croresInput = useRawInput(
    croresFormattedValue,
    (parsed) => setBaseValue(parsed !== null ? fromCrores(parsed) : null),
    activeField === "crores"
  )

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
          value={entryInput.displayValue}
          onChange={entryInput.handleChange}
          onFocus={() => setActiveField("entry")}
          onBlur={() => {
            entryInput.handleBlur()
            setActiveField(null)
          }}
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
            value={lakhsInput.displayValue}
            onChange={lakhsInput.handleChange}
            onFocus={() => setActiveField("lakhs")}
            onBlur={() => {
              lakhsInput.handleBlur()
              setActiveField(null)
            }}
            isActive={activeField === "lakhs"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Lakh = 100,000</span>}
          />

          <UnifiedInput
            id="crores"
            label="Crores"
            suffix="Cr"
            value={croresInput.displayValue}
            onChange={croresInput.handleChange}
            onFocus={() => setActiveField("crores")}
            onBlur={() => {
              croresInput.handleBlur()
              setActiveField(null)
            }}
            isActive={activeField === "crores"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Crore = 100 Lakhs</span>}
          />
        </div>
      </div>
    </div>
  )
}
