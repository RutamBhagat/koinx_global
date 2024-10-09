import axios from "axios";
import consola from "consola";
import schedule from "node-schedule";
import type { z } from "zod";
import type { CoinType, CoinTypeSchema } from "@/schema/crypto_schema";
import { CryptoCurrentDataSchema } from "@/schema/crypto_schema";
import { createCryptocurrencyEntry } from "@/services/crypto-services";

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

async function fetchCryptoData() {
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

    consola.log("Fetched Crypto Data:", data);

    for (const coin of ids) {
      const apiCoinName = coin.toLowerCase().replace("_", "-");
      const coinData = data[apiCoinName];

      if (!coinData) {
        consola.error(`No data found for ${coin}`);
        continue;
      }

      const currentPriceInfo = {
        currencyName: mapCoinType(apiCoinName) as CoinType,
        timestamp: new Date(),
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

      await createCryptocurrencyEntry(currentPriceInfoResult.data);
    }
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

schedule.scheduleJob("0 */2 * * *", fetchCryptoData);
fetchCryptoData();
