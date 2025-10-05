import { ConverterShell } from "@/components/converter-shell"
import { NumberConverter } from "@/components/number-converter"

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
      <div className="pointer-events-none absolute inset-0 -z-10 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,100%,85%,0.7),transparent)] dark:bg-[radial-gradient(45%_60%_at_50%_20%,hsl(210,80%,20%,0.4),transparent)]" />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Understanding Indian numbers
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Convert between international, lakhs & crores, and USD ↔ INR in one place.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Lakhs gives you a quick sense of how Indian values map to familiar formats and currency amounts using elegant shadcn/ui components.
          </p>
        </header>

        <section>
          <ConverterShell
            title="Numbers & units"
            description="Move seamlessly between international numbers, lakhs, crores, and see live USD ↔ INR values in one cohesive view."
          >
            <NumberConverter />
          </ConverterShell>
        </section>
      </main>
    </div>
  )
}
