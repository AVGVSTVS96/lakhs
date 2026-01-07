import { notFound } from "next/navigation"
import { NumberConverter } from "@/components/number-converter"
import { ThemeToggle } from "@/components/theme-toggle"
import { getExchangeRate } from "@/lib/rates"
import { conversionPages } from "@/lib/routes"
import Link from "next/link"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return Object.keys(conversionPages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug
  const config = conversionPages[slug]
  if (!config) return {}

  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `/${slug}` },
  }
}

export default async function ConversionLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const config = conversionPages[slug]

  if (!config) {
    notFound()
  }

  const initialRate = await getExchangeRate()

  return (
    <main className="mx-auto flex max-w-2xl w-full flex-col px-4 py-8 sm:px-8 sm:py-16" role="main">
      <header className="flex items-center justify-between mb-12">
        <h1 className="sr-only">{config.title}</h1>
        <div className="text-2xl font-bold tracking-tighter" aria-hidden="true">
          {config.heading}
        </div>
        <ThemeToggle />
      </header>

      <p className="mb-8 text-center text-muted-foreground">
        {config.intro}
      </p>

      <section aria-label="Currency converter tool">
        <NumberConverter initialRate={initialRate} />
      </section>

      <div className="text-center mt-16">
        <Link href="/" className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
          ← Back to main converter
        </Link>
      </div>
    </main>
  )
}

