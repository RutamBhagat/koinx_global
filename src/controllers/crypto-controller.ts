import type { Request, Response } from "express";
import type { CryptocurrencyEntry } from "@prisma/client";
import { getEntries, getLatestEntry } from "@/services/crypto-services";
import type { CoinType } from "@/schema/crypto-schema";
import { fetchAndStoreCryptoData } from "@/utils/crypto-utils";

const coinTypeMapping: { [key: string]: CoinType } = {
  bitcoin: "BITCOIN",
  ethereum: "ETHEREUM",
  "matic-network": "MATIC_NETWORK",
};

function mapCoinType(apiValue: string): CoinType | undefined {
  return coinTypeMapping[apiValue.toLowerCase()];
}

function calculateStandardDeviation(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((acc, val) => acc + val, 0) / n;
  const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}

export async function handleGetStats(
  req: Request,
  res: Response
): Promise<void> {
  const { coin } = req.query;
  if (typeof coin !== "string") {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }

  const mappedCoin = mapCoinType(coin);
  if (!mappedCoin) {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }

  const latestEntry = await getLatestEntry(mappedCoin);
  if (!latestEntry) {
    res.status(404).json({ error: "No data available for the specified coin" });
    return;
  }

  res.status(200).json({
    price: latestEntry.usd,
    marketCap: latestEntry.usdMarketCap,
    "24hChange": latestEntry.usd24hChange,
    lastUpdated: latestEntry.updated_at,
  });
}

export async function handleGetDeviation(
  req: Request,
  res: Response
): Promise<void> {
  const { coin } = req.query;
  if (typeof coin !== "string") {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }

  const mappedCoin = mapCoinType(coin);
  if (!mappedCoin) {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }

  const entries = await getEntries(mappedCoin);
  if (entries.length === 0) {
    res.status(404).json({ error: "No data available for the specified coin" });
    return;
  }

  const prices = entries.map((entry: CryptocurrencyEntry) => entry.usd);
  const stdDeviation = calculateStandardDeviation(prices);

  res.status(200).json({
    stdDeviation,
    dataPoints: entries.length,
    lastUpdated: entries[0].updated_at,
  });
}

export async function handleFetchAndStoreData(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await fetchAndStoreCryptoData();
    res.status(200).json({ message: "Data fetched and stored successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch and store data" });
  }
}
