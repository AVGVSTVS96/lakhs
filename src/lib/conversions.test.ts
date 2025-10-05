import { describe, expect, it } from "vitest"

import {
  convertInrToUsd,
  convertUsdToInr,
  formatIndianNumber,
  formatInternationalNumber,
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
