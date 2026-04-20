"use client"

import { useTransition } from "react"
import { deleteTransaction } from "@/app/actions/transaction"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

interface Transaction {
  id: number
  type: string
  amount: number
  category: string
  date: Date
  note: string | null
}

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteTransaction(id)
    })
  }

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No transactions yet. Add one above.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="whitespace-nowrap">
              {new Date(t.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>
              <Badge variant={t.type === "INCOME" ? "default" : "secondary"}>
                {t.type === "INCOME" ? "Income" : "Expense"}
              </Badge>
            </TableCell>
            <TableCell>{t.category}</TableCell>
            <TableCell
              className={`text-right font-mono font-medium ${
                t.type === "INCOME" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {t.type === "INCOME" ? "+" : "-"}
              {fmt.format(t.amount)}
            </TableCell>
            <TableCell className="max-w-48 truncate text-muted-foreground">
              {t.note ?? "—"}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(t.id)}
                aria-label="Delete transaction"
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
