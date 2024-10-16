import axios from "axios";
import consola from "consola";
import type { z } from "zod";
import type { CoinType, CoinTypeSchema } from "@/schema/crypto-schema";
import { CryptoCurrentDataSchema } from "@/schema/crypto-schema";
import { createCryptocurrencyEntry } from "@/services/crypto-services";
import type { CryptocurrencyEntry } from "@prisma/client";

const ids: z.infer<typeof CoinTypeSchema>[] = [
  "BITCOIN",
  "ETHEREUM",
  "MATIC_NETWORK",
];

const coinTypeMapping: { [key: string]: CoinType } = {
  bitcoin: "BITCOIN",
  ethereum: "ETHEREUM",
  "matic-network": "MATIC_NETWORK",
};

function mapCoinType(apiValue: string): CoinType | undefined {
  return coinTypeMapping[apiValue.toLowerCase()];
}

export async function fetchAndStoreCryptoData() {
  const url = "https://api.coingecko.com/api/v3/simple/price";
  const params = {
    ids: ids.map((coin) => coin.toLowerCase().replace("_", "-")).join(","),
    vs_currencies: "usd",
    include_market_cap: "true",
    include_24hr_change: "true",
  };

  try {
    const response = await axios.get(url, { params, timeout: 10000 });
    const data = response.data;

    const dbEntries: CryptocurrencyEntry[] = [];

    for (const coin of ids) {
      const apiCoinName = coin.toLowerCase().replace("_", "-");
      const coinData = data[apiCoinName];

      if (!coinData) {
        consola.error(`No data found for ${coin}`);
        continue;
      }

      const currentPriceInfo = {
        currencyName: mapCoinType(apiCoinName) as CoinType,
        usd: coinData.usd,
        usdMarketCap: coinData.usd_market_cap,
        usd24hChange: coinData.usd_24h_change,
      };

      const currentPriceInfoResult =
        CryptoCurrentDataSchema.safeParse(currentPriceInfo);

      if (!currentPriceInfoResult.success) {
        consola.error("Validation error:", currentPriceInfoResult.error);
        continue;
      }

      dbEntries.push(
        await createCryptocurrencyEntry(currentPriceInfoResult.data)
      );
    }
    return dbEntries;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      consola.error("Axios error:", error.message);
      if (error.response) {
        consola.error("Response data:", error.response.data);
        consola.error("Response status:", error.response.status);
      } else if (error.request) {
        consola.error("No response received:", error.request);
      } else {
        consola.error("Error message:", error.message);
      }
    } else {
      consola.error("Error fetching crypto data:", error);
    }
  }
}
