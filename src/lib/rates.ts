export const DEFAULT_RATE = 83

const PRIMARY = "https://open.er-api.com/v6/latest/USD"
const FALLBACK = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR"

export async function fetchUsdInr(init?: RequestInit): Promise<number | null> {
  try {
    const r = await fetch(PRIMARY, { headers: { Accept: "application/json" }, ...init })
    if (r.ok) {
      const d = (await r.json()) as { rates?: { INR?: number } }
      if (typeof d?.rates?.INR === "number" && !Number.isNaN(d.rates.INR)) return d.rates.INR
    }
  } catch {}
  try {
    const r = await fetch(FALLBACK, { headers: { Accept: "application/json" }, ...init })
    if (r.ok) {
      const d = (await r.json()) as { rates?: { INR?: number } }
      if (typeof d?.rates?.INR === "number" && !Number.isNaN(d.rates.INR)) return d.rates.INR
    }
  } catch {}
  return null
}

// Server-side helper for fetching exchange rate with ISR caching
export async function getExchangeRate(): Promise<number> {
  const rate = await fetchUsdInr({ next: { revalidate: 300 } })
  return rate ?? DEFAULT_RATE
}
