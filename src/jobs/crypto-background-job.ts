import schedule from "node-schedule";
import { fetchAndStoreCryptoData } from "@/utils/crypto-utils";

schedule.scheduleJob("0 */2 * * *", fetchAndStoreCryptoData);
fetchAndStoreCryptoData();
