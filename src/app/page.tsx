import { ConverterShell } from "@/components/converter-shell"
import { NumberConverter } from "@/components/number-converter"
import { ThemeToggle } from "@/components/theme-toggle"

const DEFAULT_RATE = 83

async function getExchangeRate() {
  // Try open.er-api.com first (6 decimal precision)
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    if (res.ok) {
      const data = await res.json() as { rates?: { INR?: number } }
      const rate = data.rates?.INR
      if (rate) return rate
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback to frankfurter.dev (2 decimal precision)
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR', {
      next: { revalidate: 300 }
    })

    if (res.ok) {
      const data = await res.json() as { rates?: { INR?: number } }
      const rate = data.rates?.INR
      if (rate) return rate
    }
  } catch {
    // Fall through to default
  }

  return DEFAULT_RATE
}

export default async function Home() {
  const initialRate = await getExchangeRate()

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,100%,85%,0.7),transparent)] dark:bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,80%,20%,0.4),transparent)]" />

      {/* SEO Content - Visually hidden but accessible to bots and screen readers */}
      <div className="sr-only">
        <h2>Understanding Lakhs and Crores</h2>
        <p>
          The Indian numbering system uses lakhs and crores for large numbers. One lakh equals 100,000 (one hundred thousand),
          and one crore equals 10,000,000 (ten million). This free online converter helps you convert between Indian and
          international number formats with live USD to INR exchange rates.
        </p>

        <h3>What is a Lakh?</h3>
        <p>
          A lakh is a unit in the Indian numbering system equal to 100,000 (one hundred thousand). It is commonly used in
          India, Pakistan, Bangladesh, and other South Asian countries. For example, 5 lakhs equals 500,000 in international notation.
        </p>

        <h3>What is a Crore?</h3>
        <p>
          A crore is equal to 10,000,000 (ten million) or 100 lakhs. It is widely used in financial contexts across South Asia.
          For example, 2 crores equals 20,000,000 or approximately $238,000 USD at current exchange rates.
        </p>

        <h3>How to Convert Lakhs to USD</h3>
        <ol>
          <li>Enter the amount in lakhs in the input field</li>
          <li>The converter automatically calculates the value in international notation (multiply by 100,000)</li>
          <li>View the USD equivalent using live exchange rates updated every 5 minutes</li>
          <li>Compare Indian grouping (lakhs/crores) with international grouping (thousands/millions)</li>
        </ol>

        <h3>Common Conversions</h3>
        <ul>
          <li>1 lakh = 100,000 = $1,125 USD (approx)</li>
          <li>10 lakhs = 1,000,000 = $11,250 USD (approx)</li>
          <li>1 crore = 10,000,000 = $112,500 USD (approx)</li>
          <li>10 crores = 100,000,000 = $1,125,000 USD (approx)</li>
        </ul>

        <h3>USD to INR Exchange Rate</h3>
        <p>
          Current exchange rate: 1 USD = {initialRate.toFixed(4)} INR. Our converter uses live exchange rates from reliable
          sources, updated every 5 minutes via ISR (Incremental Static Regeneration) for accuracy.
        </p>
      </div>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-12 pt-4 sm:gap-8 sm:pb-16 sm:pt-6" role="main">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            lakhs
          </h1>
          <ThemeToggle />
        </header>

        <section aria-label="Currency converter tool">
          <ConverterShell
            title="Converter"
            description="Numbers, lakhs, crores, and currency."
          >
            <NumberConverter initialRate={initialRate} />
          </ConverterShell>
        </section>
      </main>
    </div>
  )
}
