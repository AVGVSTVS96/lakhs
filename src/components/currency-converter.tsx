"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  convertInrToUsd,
  convertUsdToInr,
  formatIndianNumber,
  formatInternationalNumber,
  formatWithPrecision,
  parseNumber,
} from "@/lib/conversions"

type CurrencyField = "usd" | "inr"

const formatCurrencyInput = (value: number) =>
  Number(value.toFixed(2)).toString()

export function CurrencyConverter() {
  const [rate, setRate] = React.useState(83)
  const [rateInput, setRateInput] = React.useState("83")
  const [rateError, setRateError] = React.useState<string | null>(null)
  const [fields, setFields] = React.useState({
    usd: "1.00",
    inr: formatCurrencyInput(convertUsdToInr(1, 83)),
  })
  const [invalidField, setInvalidField] = React.useState<CurrencyField | null>(
    null
  )

  const handleCurrencyChange = (field: CurrencyField) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value
      setFields((prev) => ({ ...prev, [field]: raw }))

      const parsed = parseNumber(raw)
      if (parsed == null) {
        setInvalidField(field)
        return
      }

      let nextUsd: number
      if (field === "usd") {
        nextUsd = parsed
      } else {
        nextUsd = convertInrToUsd(parsed, rate)
      }

      setInvalidField(null)
      const nextInr = convertUsdToInr(nextUsd, rate)

      setFields({
        usd: field === "usd" ? raw : formatCurrencyInput(nextUsd),
        inr: field === "inr" ? raw : formatCurrencyInput(nextInr),
      })
    }

  const handleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setRateInput(raw)
    const parsed = parseNumber(raw)
    if (parsed == null || parsed <= 0) {
      setRateError("Enter a rate greater than zero")
      return
    }
    setRateError(null)
    const nextRate = parsed
    setRate(nextRate)

    const usd = parseNumber(fields.usd)
    if (usd != null) {
      const nextInr = convertUsdToInr(usd, nextRate)
      setFields((prev) => ({
        ...prev,
        inr: formatCurrencyInput(nextInr),
      }))
    }
  }

  const usdValue = parseNumber(fields.usd) ?? 0
  const inrValue = convertUsdToInr(usdValue, rate)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <CurrencyField
          id="usd"
          label="USD"
          prefix="$"
          value={fields.usd}
          invalid={invalidField === "usd"}
          onChange={handleCurrencyChange("usd")}
        />

        <div className="hidden sm:flex flex-col justify-center text-center text-muted-foreground">
          <span className="text-sm font-medium">Rate</span>
          <span className="text-xs">1 USD → {formatWithPrecision(rate)} INR</span>
        </div>

        <CurrencyField
          id="inr"
          label="INR"
          prefix="₹"
          value={fields.inr}
          invalid={invalidField === "inr"}
          onChange={handleCurrencyChange("inr")}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-muted/40 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Label htmlFor="rate" className="text-xs uppercase tracking-wide">
            Exchange rate
          </Label>
          <p className="text-sm text-muted-foreground">
            Adjust to match the current USD ↔ INR market rate.
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
            min={0}
            step={0.01}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setRate(83)
              setRateInput("83")
              setRateError(null)
              const usd = parseNumber(fields.usd) ?? 1
              const nextInr = convertUsdToInr(usd, 83)
              setFields({
                usd: formatCurrencyInput(usd),
                inr: formatCurrencyInput(nextInr),
              })
            }}
          >
            Reset
          </Button>
        </div>
        {rateError ? (
          <p className="text-xs text-destructive">{rateError}</p>
        ) : null}
      </div>

      <Separator className="bg-border" />

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <Stat label="USD (international)" value={`$${formatInternationalNumber(usdValue)}`} />
        <Stat label="INR (Indian grouping)" value={`₹${formatIndianNumber(inrValue)}`} />
      </div>
    </div>
  )
}

type CurrencyFieldProps = {
  id: string
  label: string
  prefix: string
  value: string
  invalid?: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

function CurrencyField({ id, label, prefix, value, invalid, onChange }: CurrencyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          {prefix}
        </span>
        <Input
          id={id}
          value={value}
          onChange={onChange}
          aria-invalid={invalid}
          inputMode="decimal"
          className="pl-8"
          placeholder="0.00"
        />
      </div>
      {invalid ? (
        <p className="text-xs text-destructive">Enter a valid amount</p>
      ) : null}
    </div>
  )
}

type StatProps = {
  label: string
  value: string
}

function Stat({ label, value }: StatProps) {
  return (
    <div className="rounded-lg border bg-muted/40 px-4 py-3 shadow-xs">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold sm:text-lg">{value}</p>
    </div>
  )
}
