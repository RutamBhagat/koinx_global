import { z } from "zod";

export const CoinTypeSchema = z.enum(["BITCOIN", "ETHEREUM", "MATIC_NETWORK"]);

export const CryptoCurrentDataSchema = z.object({
  currencyName: CoinTypeSchema,
  timestamp: z.date(),
  usd: z.number(),
  usdMarketCap: z.number(),
  usd24hChange: z.number(),
});

export type CoinType = z.infer<typeof CoinTypeSchema>;
export type CryptoCurrentData = z.infer<typeof CryptoCurrentDataSchema>;
