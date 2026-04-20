import { getTransactionSummary, getTransactions } from "@/app/actions/transaction"
import { getPortfolioItems } from "@/app/actions/portfolio"
import { fetchStockPrices } from "@/lib/finance"
import { SummaryCard } from "@/components/summary-card"
import { ExpensePieChart } from "@/components/expense-pie-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Briefcase, TrendingUp } from "lucide-react"

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default async function DashboardPage() {
  const [summary, allTransactions, portfolioItems] = await Promise.all([
    getTransactionSummary(),
    getTransactions(),
    getPortfolioItems(),
  ])

  const tickers = portfolioItems.map((p) => p.ticker)
  const prices =
    tickers.length > 0 ? await fetchStockPrices(tickers) : new Map<string, number>()

  const portfolioValue = portfolioItems.reduce((sum, item) => {
    const price = prices.get(item.ticker) ?? 0
    return sum + item.shares * price
  }, 0)

  const netWorth = summary.cashBalance + portfolioValue
  const recentTransactions = allTransactions.slice(0, 5)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Cash Balance"
          amount={summary.cashBalance}
          colorize
          icon={<DollarSign className="size-4" />}
        />
        <SummaryCard
          title="Portfolio Value"
          amount={portfolioValue}
          icon={<Briefcase className="size-4" />}
        />
        <SummaryCard
          title="Total Net Worth"
          amount={netWorth}
          colorize
          icon={<TrendingUp className="size-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Expense Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={summary.expenseCategories} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No transactions yet
              </p>
            ) : (
              <ul className="space-y-3">
                {recentTransactions.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={t.type === "INCOME" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {t.category}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(t.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-medium ${
                        t.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "INCOME" ? "+" : "-"}
                      {fmt.format(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
