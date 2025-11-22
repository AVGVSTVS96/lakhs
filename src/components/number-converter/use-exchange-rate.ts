import * as React from "react"
import { fetchUsdInr } from "@/lib/rates"

const RATE_REFRESH_INTERVAL = 5 * 60 * 1000

export function useExchangeRate(initialRate: number) {
  const [rate, setRate] = React.useState(initialRate)
  const [isRateLoading, setIsRateLoading] = React.useState(false)
  const [rateFetchError, setRateFetchError] = React.useState<string | null>(null)
  const [lastRateFetchedAt, setLastRateFetchedAt] = React.useState<Date | null>(null)

  const fetchLiveRate = React.useCallback(async () => {
    setIsRateLoading(true)
    setRateFetchError(null)
    try {
      const nextRate = await fetchUsdInr({ headers: { Accept: "application/json" }, cache: "no-store" })
      if (typeof nextRate === "number") {
        setRate(nextRate)
        setLastRateFetchedAt(new Date())
        setIsRateLoading(false)
        return
      }
    } catch {}
    setRateFetchError("Live rate unavailable")
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

  return {
    rate,
    isRateLoading,
    rateFetchError,
    lastRateFetchedAt,
  }
}

