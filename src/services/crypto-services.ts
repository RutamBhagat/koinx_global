import type { CryptocurrencyEntry } from "@prisma/client";
import prisma from "@/utils/db";

export async function createCryptocurrencyEntry(
  data: Omit<CryptocurrencyEntry, "id">
): Promise<CryptocurrencyEntry> {
  return await prisma.cryptocurrencyEntry.create({ data });
}

export async function getLatestEntry(
  currencyName: string
): Promise<CryptocurrencyEntry | null> {
  return await prisma.cryptocurrencyEntry.findFirst({
    where: { currencyName },
    orderBy: { timestamp: "desc" },
  });
}

export async function getEntries(
  currencyName: string
): Promise<CryptocurrencyEntry[]> {
  return await prisma.cryptocurrencyEntry.findMany({
    where: { currencyName },
    orderBy: { timestamp: "desc" },
  });
}
