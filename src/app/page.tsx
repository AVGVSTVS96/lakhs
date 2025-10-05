import { ConverterShell } from "@/components/converter-shell"
import { NumberConverter } from "@/components/number-converter"
import { ThemeToggle } from "@/components/theme-toggle"

const DEFAULT_RATE = 83

async function getExchangeRate() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR', {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    })

    if (!res.ok) {
      return DEFAULT_RATE
    }

    const data = await res.json() as { rates?: { INR?: number } }
    return data.rates?.INR ?? DEFAULT_RATE
  } catch {
    return DEFAULT_RATE
  }
}

export default async function Home() {
  const initialRate = await getExchangeRate()

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,100%,85%,0.7),transparent)] dark:bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,80%,20%,0.4),transparent)]" />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-12 pt-4 sm:gap-8 sm:pb-16 sm:pt-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            lakhs
          </h1>
          <ThemeToggle />
        </header>

        <section>
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
