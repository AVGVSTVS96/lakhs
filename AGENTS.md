# Project Conventions

## Package Manager

This project uses **Bun** exclusively. Do not use npm, pnpm, or yarn.

```bash
bun install          # Install dependencies
bun run dev          # Start dev server (Next.js + Turbopack)
bun run build        # Build for production
bun test             # Run tests (vitest)
```

## Version Control

This project uses **jj (Jujutsu)** for version control, not git directly.

```bash
jj status            # Check working copy state
jj log               # View history
jj new -m "message"  # Create new change with description
jj describe -m "msg" # Describe current change
```

## Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix primitives)
- **Testing**: Vitest

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # shadcn/ui primitives
│   └── number-converter/  # Main feature component
└── lib/           # Utilities and business logic
    ├── conversions.ts     # Number conversion functions
    └── rates.ts           # Exchange rate fetching
```

## Key Conventions

- `baseValue` in the converter is always stored in INR
- Lakhs/Crores are Indian number units (1 Lakh = 100,000, 1 Crore = 10,000,000)
- Exchange rates are fetched live and cached with ISR
