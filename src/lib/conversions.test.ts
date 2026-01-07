import { describe, expect, it } from "vitest"

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
} from "./conversions"

describe("number parsing", () => {
  it("parses strings with commas and text", () => {
    expect(parseNumber("1,23,456")).toBe(123456)
    expect(parseNumber("₹ 2.5")).toBe(2.5)
  })

  it("returns null for invalid input", () => {
    expect(parseNumber("")).toBeNull()
    expect(parseNumber("-")).toBeNull()
    expect(parseNumber("1234.")).toBeNull()
  })
})

describe("indian numbering", () => {
  it("formats using Indian grouping", () => {
    expect(formatIndianNumber(12345678)).toBe("1,23,45,678")
  })

  it("converts between lakhs and crores", () => {
    expect(toLakhs(1_000_000)).toBe(10)
    expect(fromLakhs(5)).toBe(500_000)
    expect(toCrores(50_000_000)).toBe(5)
    expect(fromCrores(1.2)).toBe(12_000_000)
  })
})

describe("international formatting", () => {
  it("uses standard grouping", () => {
    expect(formatInternationalNumber(12345678)).toBe("12,345,678")
  })

  it("respects precision helper", () => {
    expect(formatWithPrecision(1234.567, 2)).toBe("1,234.57")
  })
})

describe("currency conversions", () => {
  it("converts usd to inr and back", () => {
    const inr = convertUsdToInr(10, 82.5)
    expect(inr).toBeCloseTo(825)
    const usd = convertInrToUsd(inr, 82.5)
    expect(usd).toBeCloseTo(10)
  })
})

describe("formatting utilities", () => {
  it("formatOrEmpty returns empty string for null", () => {
    expect(formatOrEmpty(null, String)).toBe("")
  })

  it("formatOrEmpty applies formatter for non-null", () => {
    expect(formatOrEmpty(42, (n) => `$${n}`)).toBe("$42")
  })

  it("formatNumberDisplay formats with up to 6 decimals", () => {
    expect(formatNumberDisplay(1234567)).toBe("1,234,567")
    expect(formatNumberDisplay(1.123456)).toBe("1.123456")
  })

  it("formatUsdDisplay formats with exactly 2 decimals", () => {
    expect(formatUsdDisplay(1234.5)).toBe("1,234.50")
    expect(formatUsdDisplay(100)).toBe("100.00")
  })
})
