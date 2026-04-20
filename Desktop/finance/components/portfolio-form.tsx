"use client"

import { useTransition } from "react"
import { upsertPortfolioItem } from "@/app/actions/portfolio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PortfolioForm() {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const ticker = (data.get("ticker") as string).toUpperCase().trim()
    const shares = parseFloat(data.get("shares") as string)

    if (!ticker || !shares || shares <= 0) return

    startTransition(async () => {
      await upsertPortfolioItem(ticker, shares)
      form.reset()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add / Update Position</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ticker">Ticker</Label>
            <Input
              id="ticker"
              name="ticker"
              type="text"
              placeholder="AAPL"
              className="w-32 uppercase"
              maxLength={8}
              required
              onInput={(e) => {
                const el = e.currentTarget
                el.value = el.value.toUpperCase()
              }}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="shares">Shares</Label>
            <Input
              id="shares"
              name="shares"
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0"
              className="w-32"
              required
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Position"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
