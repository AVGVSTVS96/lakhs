export type StatBlockProps = {
  label: string
  value: string
  hint?: string
}

export function StatBlock({ label, value, hint }: StatBlockProps) {
  return (
    <div className="py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl sm:text-4xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
