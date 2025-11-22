import { NumberConverter } from "@/components/number-converter"
import { ThemeToggle } from "@/components/theme-toggle"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DEFAULT_RATE, fetchUsdInr } from "@/lib/rates"
import { ChevronDown } from "lucide-react"

async function getExchangeRate() {
  const rate = await fetchUsdInr({ next: { revalidate: 300 } })
  return rate ?? DEFAULT_RATE
}

export default async function Home() {
  const initialRate = await getExchangeRate()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="mx-auto flex max-w-3xl flex-col px-6 py-8 sm:py-16" role="main">
        <header className="flex items-center justify-between mb-12">
          {/* Visually hidden H1 for SEO and screen readers */}
          <h1 className="sr-only">
            Lakhs and Crores to USD Converter with Live Exchange Rates
          </h1>

          {/* The visible, branded "lakhs" title */}
          <div className="text-2xl font-bold tracking-tighter" aria-hidden="true">
            lakhs
          </div>

          <ThemeToggle />
        </header>

        <section aria-label="Currency converter tool">
          <NumberConverter initialRate={initialRate} />
        </section>

        <section className="mt-4" aria-label="About and FAQ">
          <Collapsible className="group w-full max-w-2xl mx-auto">
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-full border border-border/50 bg-muted/50 px-6 py-3 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground hover:border-border/80">
              <span>About & Conversions</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-50" />
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-8 text-sm text-muted-foreground data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
              <div className="mt-4 pt-6 pb-8 px-6 sm:px-8 bg-muted/30 rounded-[2rem] space-y-10">
                <div className="space-y-3">
                  <h2 className="font-medium text-foreground">Understanding Lakhs and Crores</h2>
                  <p className="leading-relaxed opacity-90">
                    The Indian numbering system uses lakhs (100,000) and crores (10,000,000). 
                    This tool converts between the Indian and international systems, showing live USD equivalents.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <li className="bg-background/50 px-4 py-3 rounded-xl text-xs border border-border/50">
                      <strong className="text-foreground block mb-0.5">1 Lakh</strong>
                      100,000 (one hundred thousand)
                    </li>
                    <li className="bg-background/50 px-4 py-3 rounded-xl text-xs border border-border/50">
                      <strong className="text-foreground block mb-0.5">1 Crore</strong>
                      100 Lakhs = 10,000,000 (ten million)
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h2 className="font-medium text-foreground">Live Conversions (1 USD = {initialRate.toFixed(2)} INR)</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-background/50 p-4 rounded-xl text-center border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">1 Lakh</div>
                      <div className="font-mono font-medium text-foreground">${(100000 / initialRate).toFixed(2)}</div>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl text-center border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">10 Lakhs</div>
                      <div className="font-mono font-medium text-foreground">${(1000000 / initialRate).toFixed(2)}</div>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl text-center border border-border/50">
                      <div className="text-xs text-muted-foreground mb-1">1 Crore</div>
                      <div className="font-mono font-medium text-foreground">${(10000000 / initialRate).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pb-2">
                  <h2 className="font-medium text-foreground">Common Questions</h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-foreground/80 font-medium text-xs">How much is 1 lakh in USD?</p>
                      <p className="leading-relaxed text-muted-foreground opacity-90 text-xs">
                        The exact value changes with the market. Use the converter above for the most current number.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-foreground/80 font-medium text-xs">How do I convert lakhs to dollars?</p>
                      <p className="leading-relaxed text-muted-foreground opacity-90 text-xs">
                        Multiply the lakh value by 100,000 to get the INR amount, then divide by the live USD/INR exchange rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </main>
    </div>
  )
}
