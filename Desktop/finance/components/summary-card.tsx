import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

interface SummaryCardProps {
  title: string
  amount: number
  colorize?: boolean
  icon?: React.ReactNode
}

export function SummaryCard({ title, amount, colorize = false, icon }: SummaryCardProps) {
  const positive = amount >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-bold",
            colorize && (positive ? "text-emerald-600" : "text-red-600")
          )}
        >
          {fmt.format(amount)}
        </p>
      </CardContent>
    </Card>
  )
}
