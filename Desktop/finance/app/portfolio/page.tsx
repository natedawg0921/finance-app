import { getPortfolioItems } from "@/app/actions/portfolio"
import { fetchStockPrices } from "@/lib/finance"
import { PortfolioForm } from "@/components/portfolio-form"
import { PortfolioTable } from "@/components/portfolio-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PortfolioPage() {
  const items = await getPortfolioItems()
  const tickers = items.map((i) => i.ticker)
  const prices =
    tickers.length > 0 ? await fetchStockPrices(tickers) : new Map<string, number>()

  const rows = items.map((item) => ({
    id: item.id,
    ticker: item.ticker,
    shares: item.shares,
    price: prices.get(item.ticker) ?? null,
  }))

  const totalValue = rows.reduce((sum, r) => {
    if (r.price != null && r.price > 0) return sum + r.shares * r.price
    return sum
  }, 0)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Portfolio</h2>
        <p className="text-muted-foreground">Your stock holdings</p>
      </div>

      <PortfolioForm />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Holdings</CardTitle>
          {rows.length > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              Total:{" "}
              <span className="text-foreground font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(totalValue)}
              </span>
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <PortfolioTable items={rows} />
        </CardContent>
      </Card>
    </div>
  )
}
