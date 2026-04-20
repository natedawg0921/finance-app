import { getTransactions } from "@/app/actions/transaction"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionTable } from "@/components/transaction-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TransactionsPage() {
  const transactions = await getTransactions()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">Track your income and expenses</p>
      </div>

      <TransactionForm />

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionTable transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}
