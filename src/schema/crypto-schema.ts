import { z } from "zod";

export const CoinTypeSchema = z.enum(["BITCOIN", "ETHEREUM", "MATIC_NETWORK"]);

export const CryptoCurrentDataSchema = z.object({
  currencyName: CoinTypeSchema,
  usd: z.number(),
  usdMarketCap: z.number(),
  usd24hChange: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type CoinType = z.infer<typeof CoinTypeSchema>;
export type CryptoCurrentData = z.infer<typeof CryptoCurrentDataSchema>;
