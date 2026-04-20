"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getTransactions() {
  return prisma.transaction.findMany({
    orderBy: { date: "desc" },
  })
}

export async function addTransaction(data: {
  type: string
  amount: number
  category: string
  date: string
  note?: string
}) {
  await prisma.transaction.create({
    data: {
      type: data.type,
      amount: data.amount,
      category: data.category,
      date: new Date(data.date),
      note: data.note ?? null,
    },
  })
  revalidatePath("/transactions")
  revalidatePath("/")
}

export async function deleteTransaction(id: number) {
  await prisma.transaction.delete({ where: { id } })
  revalidatePath("/transactions")
  revalidatePath("/")
}

export async function getTransactionSummary() {
  const transactions = await prisma.transaction.findMany()

  let totalIncome = 0
  let totalExpense = 0
  const expenseByCategory: Record<string, number> = {}

  for (const t of transactions) {
    if (t.type === "INCOME") {
      totalIncome += t.amount
    } else {
      totalExpense += t.amount
      expenseByCategory[t.category] =
        (expenseByCategory[t.category] ?? 0) + t.amount
    }
  }

  const cashBalance = totalIncome - totalExpense

  const expenseCategories = Object.entries(expenseByCategory).map(
    ([name, value]) => ({ name, value })
  )

  return { totalIncome, totalExpense, cashBalance, expenseCategories }
}
