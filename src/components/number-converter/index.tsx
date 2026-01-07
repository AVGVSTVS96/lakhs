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
  toCrores,
  toLakhs,
} from "@/lib/conversions"

type FieldKey = "entry" | "lakhs" | "crores"

const INITIAL_BASE_VALUE = 1_000_000

const entryPrefixes: Record<EntryCurrency, string> = {
  inr: "₹",
  usd: "$",
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

  const entryValue = formatEntryFromBase(baseValue, entryCurrency, rate)
  const lakhsValue = formatOrEmpty(baseValue, (v) => formatWithPrecision(toLakhs(v)))
  const croresValue = formatOrEmpty(baseValue, (v) => formatWithPrecision(toCrores(v), 4))

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
          value={entryValue}
          onChange={(e) => {
            const parsed = parseNumber(e.target.value)
            if (parsed !== null) {
              setBaseValue(entryCurrency === "inr" ? parsed : convertUsdToInr(parsed, rate))
            } else {
              setBaseValue(null)
            }
          }}
          onFocus={() => setActiveField("entry")}
          onBlur={() => setActiveField(null)}
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
            value={lakhsValue}
            onChange={(e) => {
              const parsed = parseNumber(e.target.value)
              setBaseValue(parsed !== null ? fromLakhs(parsed) : null)
            }}
            onFocus={() => setActiveField("lakhs")}
            onBlur={() => setActiveField(null)}
            isActive={activeField === "lakhs"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Lakh = 100,000</span>}
          />

          <UnifiedInput
            id="crores"
            label="Crores"
            suffix="Cr"
            value={croresValue}
            onChange={(e) => {
              const parsed = parseNumber(e.target.value)
              setBaseValue(parsed !== null ? fromCrores(parsed) : null)
            }}
            onFocus={() => setActiveField("crores")}
            onBlur={() => setActiveField(null)}
            isActive={activeField === "crores"}
            subtext={<span className="text-xs text-muted-foreground/70">1 Crore = 100 Lakhs</span>}
          />
        </div>
      </div>
    </div>
  )
}
