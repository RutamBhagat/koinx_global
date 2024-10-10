import type { CryptocurrencyEntry } from "@prisma/client";
import prisma from "@/utils/db";

export async function createCryptocurrencyEntry(
  data: Omit<CryptocurrencyEntry, "id" | "created_at" | "updated_at">
): Promise<CryptocurrencyEntry> {
  try {
    return await prisma.cryptocurrencyEntry.create({ data });
  } catch (error) {
    console.error("Error creating cryptocurrency entry:", error);
    throw new Error("Failed to create cryptocurrency entry");
  }
}

export async function getLatestEntry(
  currencyName: string
): Promise<CryptocurrencyEntry | null> {
  try {
    return await prisma.cryptocurrencyEntry.findFirst({
      where: { currencyName },
      orderBy: { created_at: "desc" },
    });
  } catch (error) {
    console.error(
      `Error fetching the latest entry for ${currencyName}:`,
      error
    );
    throw new Error(`Failed to fetch the latest entry for ${currencyName}`);
  }
}

export async function getEntries(
  currencyName: string,
  limit: number = 100
): Promise<CryptocurrencyEntry[]> {
  try {
    return await prisma.cryptocurrencyEntry.findMany({
      where: { currencyName },
      orderBy: { created_at: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error(`Error fetching entries for ${currencyName}:`, error);
    throw new Error(`Failed to fetch entries for ${currencyName}`);
  }
}
