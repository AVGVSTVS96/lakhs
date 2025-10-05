import { type ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ConverterShellProps = {
  title: string
  description: string
  headerContent?: ReactNode
  children: ReactNode
}

export function ConverterShell({
  title,
  description,
  headerContent,
  children,
}: ConverterShellProps) {
  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <CardHeader className="gap-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {headerContent ? (
          <div className="text-sm text-muted-foreground">{headerContent}</div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6 pb-8">{children}</CardContent>
    </Card>
  )
}
