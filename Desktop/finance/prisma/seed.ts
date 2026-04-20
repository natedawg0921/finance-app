import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.transaction.deleteMany()
  await prisma.portfolioItem.deleteMany()

  // Seed transactions
  await prisma.transaction.createMany({
    data: [
      {
        type: "INCOME",
        amount: 5500.00,
        category: "Salary",
        date: new Date("2026-04-01"),
        note: "Monthly salary",
      },
      {
        type: "INCOME",
        amount: 750.00,
        category: "Freelance",
        date: new Date("2026-04-05"),
        note: "Web design project",
      },
      {
        type: "EXPENSE",
        amount: 1500.00,
        category: "Housing",
        date: new Date("2026-04-01"),
        note: "Monthly rent",
      },
      {
        type: "EXPENSE",
        amount: 320.00,
        category: "Food",
        date: new Date("2026-04-07"),
        note: "Groceries and dining",
      },
      {
        type: "EXPENSE",
        amount: 85.00,
        category: "Utilities",
        date: new Date("2026-04-08"),
        note: "Electric and internet",
      },
      {
        type: "EXPENSE",
        amount: 145.00,
        category: "Transportation",
        date: new Date("2026-04-10"),
        note: "Gas and parking",
      },
      {
        type: "INCOME",
        amount: 200.00,
        category: "Dividends",
        date: new Date("2026-04-12"),
        note: "Quarterly dividend",
      },
      {
        type: "EXPENSE",
        amount: 60.00,
        category: "Entertainment",
        date: new Date("2026-04-14"),
        note: "Streaming services",
      },
      {
        type: "EXPENSE",
        amount: 200.00,
        category: "Healthcare",
        date: new Date("2026-04-15"),
        note: "Doctor visit copay",
      },
      {
        type: "EXPENSE",
        amount: 95.00,
        category: "Shopping",
        date: new Date("2026-04-18"),
        note: "Clothing",
      },
    ],
  })

  // Seed portfolio items
  await prisma.portfolioItem.createMany({
    data: [
      { ticker: "AAPL", shares: 10 },
      { ticker: "MSFT", shares: 5 },
      { ticker: "NVDA", shares: 8 },
    ],
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
