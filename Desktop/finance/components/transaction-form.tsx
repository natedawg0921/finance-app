"use client"

import { useState, useTransition } from "react"
import { addTransaction } from "@/app/actions/transaction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const INCOME_CATEGORIES = ["Salary", "Freelance", "Dividends", "Rental", "Other Income"]
const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Education",
  "Other Expense",
]

export function TransactionForm() {
  const [type, setType] = useState<string>("EXPENSE")
  const [category, setCategory] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  function handleTypeChange(value: string | null) {
    if (value) setType(value)
    setCategory("")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const amount = parseFloat(data.get("amount") as string)
    const date = data.get("date") as string
    const note = data.get("note") as string

    if (!amount || !date || !category) return

    startTransition(async () => {
      await addTransaction({ type, amount, category, date, note: note || undefined })
      form.reset()
      setCategory("")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" name="note" type="text" placeholder="Description..." />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={isPending || !category} className="w-full">
              {isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
