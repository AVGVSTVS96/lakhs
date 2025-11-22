import { NumberConverter } from "@/components/number-converter"
import { ThemeToggle } from "@/components/theme-toggle"
import { DEFAULT_RATE, fetchUsdInr } from "@/lib/rates"

async function getExchangeRate() {
  const rate = await fetchUsdInr({ next: { revalidate: 300 } })
  return rate ?? DEFAULT_RATE
}

export default async function Home() {
  const initialRate = await getExchangeRate()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">

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

      <main className="mx-auto flex max-w-3xl flex-col px-6 py-8 sm:py-16" role="main">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-bold tracking-tighter">
            lakhs
          </h1>
          <ThemeToggle />
        </header>

        <section aria-label="Currency converter tool">
          <NumberConverter initialRate={initialRate} />
        </section>
      </main>
    </div>
  )
}
