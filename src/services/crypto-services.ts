import type { CryptocurrencyEntry } from "@prisma/client";

export async function createCryptocurrencyEntry(
  data: Omit<CryptocurrencyEntry, "id">
): Promise<CryptocurrencyEntry> {
  return await prisma.cryptocurrencyEntry.create({ data });
}
