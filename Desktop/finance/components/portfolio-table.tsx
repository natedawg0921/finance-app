"use client"

import { useTransition } from "react"
import { deletePortfolioItem } from "@/app/actions/portfolio"
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

interface PortfolioRow {
  id: number
  ticker: string
  shares: number
  price: number | null
}

interface PortfolioTableProps {
  items: PortfolioRow[]
}

export function PortfolioTable({ items }: PortfolioTableProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: number) {
    startTransition(async () => {
      await deletePortfolioItem(id)
    })
  }

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No positions yet. Add one above.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Shares</TableHead>
          <TableHead className="text-right">Latest Price</TableHead>
          <TableHead className="text-right">Total Value</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const totalValue = item.price != null ? item.shares * item.price : null

          return (
            <TableRow key={item.id}>
              <TableCell className="font-mono font-bold">{item.ticker}</TableCell>
              <TableCell className="text-right">{item.shares.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                {item.price != null && item.price > 0 ? (
                  fmt.format(item.price)
                ) : (
                  <Badge variant="secondary">N/A</Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {totalValue != null && item.price != null && item.price > 0
                  ? fmt.format(totalValue)
                  : "—"}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isPending}
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete position"
                >
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
