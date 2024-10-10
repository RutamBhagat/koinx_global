import type { CryptocurrencyEntry } from "@prisma/client";
import prisma from "@/utils/db";

export async function createCryptocurrencyEntry(
  data: Omit<CryptocurrencyEntry, "id" | "created_at" | "updated_at">
): Promise<CryptocurrencyEntry> {
  return await prisma.cryptocurrencyEntry.create({ data });
}

export async function getLatestEntry(
  currencyName: string
): Promise<CryptocurrencyEntry | null> {
  return await prisma.cryptocurrencyEntry.findFirst({
    where: { currencyName },
    orderBy: { created_at: "desc" },
  });
}

export async function getEntries(
  currencyName: string
): Promise<CryptocurrencyEntry[]> {
  return await prisma.cryptocurrencyEntry.findMany({
    where: { currencyName },
    orderBy: { created_at: "desc" },
  });
}
