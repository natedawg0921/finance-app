import YahooFinance from "yahoo-finance2"

const yf = new YahooFinance()

export async function fetchStockPrices(
  tickers: string[]
): Promise<Map<string, number>> {
  const prices = new Map<string, number>()

  await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const quote = await yf.quote(ticker)
        prices.set(ticker, quote.regularMarketPrice ?? 0)
      } catch {
        prices.set(ticker, 0)
      }
    })
  )

  return prices
}
