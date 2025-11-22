"use client"

import * as React from "react"
import { ArrowLeftRight, RefreshCw } from "lucide-react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UnifiedInput } from "@/components/number-converter/UnifiedInput"
import { DEFAULT_RATE, fetchUsdInr } from "@/lib/rates"
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
import { cn } from "@/lib/utils"

type EntryCurrency = "inr" | "usd"
type FieldKey = "entry" | "lakhs" | "crores"

const INITIAL_BASE_VALUE = 1_000_000
const RATE_REFRESH_INTERVAL = 5 * 60 * 1000

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

//

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
  const [rate, setRate] = React.useState(initialRate)
  const [rateDisplay, setRateDisplay] = React.useState(formatRateDisplayValue(initialRate))
  const [isRateLoading, setIsRateLoading] = React.useState(false)
  const [rateFetchError, setRateFetchError] = React.useState<string | null>(null)
  const [lastRateFetchedAt, setLastRateFetchedAt] = React.useState<Date | null>(null)

  const [baseValue, setBaseValue] = React.useState(INITIAL_BASE_VALUE)
  const [fields, setFields] = React.useState<Record<FieldKey, string>>({
    entry: formatEntryFromBase(INITIAL_BASE_VALUE, "inr", initialRate),
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

    // Keep the displayed number the same, but adjust baseValue for the new currency
    if (entryCurrency === "inr" && next === "usd") {
      // Switching from INR to USD: same number now means USD, so baseValue *= rate
      setBaseValue((current) => current * rate)
    } else if (entryCurrency === "usd" && next === "inr") {
      // Switching from USD to INR: same number now means INR, so baseValue /= rate
      setBaseValue((current) => current / rate)
    }

    setEntryCurrency(next)
    setInvalidField(null)
    setActiveField(null)
  }, [entryCurrency, rate])

  const fetchLiveRate = React.useCallback(async () => {
    setIsRateLoading(true)
    setRateFetchError(null)
    try {
      const nextRate = await fetchUsdInr({ headers: { Accept: "application/json" }, cache: "no-store" })
      if (typeof nextRate === "number") {
        setRate(nextRate)
        setRateDisplay(formatRateDisplayValue(nextRate))
        setLastRateFetchedAt(new Date())
        setIsRateLoading(false)
        return
      }
    } catch {}
    setRateFetchError("Live rate unavailable. Try again shortly.")
    setIsRateLoading(false)
  }, [])

  React.useEffect(() => {
    fetchLiveRate()
  }, [fetchLiveRate])

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      fetchLiveRate()
    }, RATE_REFRESH_INTERVAL)
    return () => window.clearInterval(timer)
  }, [fetchLiveRate])

  const formattedIndian = formatIndianNumber(baseValue)
  const usdEquivalent = convertInrToUsd(baseValue, rate)
  const formattedUsd = formatUsdDisplay(usdEquivalent)
  const formattedInternational = formatInternationalNumber(baseValue)

  // Helper for subtext
  const SubtextPill = ({ label, value }: { label: string, value: string }) => (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/5 dark:bg-white/10 text-xs font-medium">
      <span className="opacity-70 uppercase tracking-wider">{label}</span>
      <span>{value}</span>
    </span>
  )

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col gap-4 sm:p-8 sm:bg-muted/30 sm:rounded-[2rem]">
        <UnifiedInput
          id="entry"
          label="Primary Currency"
          prefix={entryPrefixes[entryCurrency]}
          value={fields.entry}
          onChange={handleEntryChange}
          onFocus={handleFocus("entry")}
          onBlur={handleBlur("entry")}
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
            <Tabs value={entryCurrency} onValueChange={handleCurrencyToggle}>
              <TabsList className="h-8 w-fit bg-black/5 dark:bg-white/10">
                <TabsTrigger value="inr" className="text-xs px-3 h-7 rounded-sm">INR</TabsTrigger>
                <TabsTrigger value="usd" className="text-xs px-3 h-7 rounded-sm">USD</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
          <UnifiedInput
            id="lakhs"
            label="Lakhs"
            suffix="L"
            value={fields.lakhs}
            onChange={handleUnitChange("lakhs")}
            onFocus={handleFocus("lakhs")}
            onBlur={handleBlur("lakhs")}
            isActive={activeField === "lakhs"}
            subtext={
              <span className="text-xs text-muted-foreground/70">
                 1 Lakh = 100,000
              </span>
            }
          />

          <UnifiedInput
            id="crores"
            label="Crores"
            suffix="Cr"
            value={fields.crores}
            onChange={handleUnitChange("crores")}
            onFocus={handleFocus("crores")}
            onBlur={handleBlur("crores")}
            isActive={activeField === "crores"}
            subtext={
              <span className="text-xs text-muted-foreground/70">
                 1 Crore = 100 Lakhs
              </span>
            }
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 text-primary/80">
             <ArrowLeftRight className="size-3.5" />
             <span>1 USD = ₹{rateDisplay}</span>
           </div>
           {isRateLoading && <RefreshCw className="size-3 animate-spin" />}
           {rateFetchError && <span className="text-destructive">{rateFetchError}</span>}
        </div>
        {lastRateFetchedAt && (
          <span className="opacity-50 font-mono">
             Updated {lastRateFetchedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        )}
      </div>
    </div>
  )
}
