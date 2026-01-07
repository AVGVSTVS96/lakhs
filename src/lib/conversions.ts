const LAKH = 100_000;
const CRORE = 10_000_000;

export function sanitizeNumericInput(value: string) {
  return value.replace(/[^0-9.\-]/g, "");
}

export function parseNumber(input: string): number | null {
  if (!input.trim()) return null;
  const cleaned = sanitizeNumericInput(input);
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") {
    return null;
  }
  if (cleaned.endsWith(".")) return null;
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export function formatInternationalNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatIndianNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function toLakhs(value: number) {
  return value / LAKH;
}

export function fromLakhs(value: number) {
  return value * LAKH;
}

export function toCrores(value: number) {
  return value / CRORE;
}

export function fromCrores(value: number) {
  return value * CRORE;
}

export function formatWithPrecision(value: number, fractionDigits = 2) {
  if (!Number.isFinite(value)) return "";
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}

export function convertUsdToInr(usd: number, rate: number) {
  return usd * rate;
}

export function convertInrToUsd(inr: number, rate: number) {
  if (rate === 0) return 0;
  return inr / rate;
}

// Utility to handle null values in formatting
export function formatOrEmpty(
  value: number | null,
  formatter: (n: number) => string
): string {
  return value === null ? "" : formatter(value);
}

// Format for general number display (up to 6 decimal places)
export function formatNumberDisplay(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
}

// Format for USD currency display (exactly 2 decimal places)
export function formatUsdDisplay(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
