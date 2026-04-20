"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { ticker: "asc" },
  })
}

export async function upsertPortfolioItem(ticker: string, shares: number) {
  await prisma.portfolioItem.upsert({
    where: { ticker: ticker.toUpperCase() },
    update: { shares },
    create: { ticker: ticker.toUpperCase(), shares },
  })
  revalidatePath("/portfolio")
  revalidatePath("/")
}

export async function deletePortfolioItem(id: number) {
  await prisma.portfolioItem.delete({ where: { id } })
  revalidatePath("/portfolio")
  revalidatePath("/")
}
