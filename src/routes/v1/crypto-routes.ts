import { Router } from "express";
import { createRouter } from "@/utils/create";
import {
  handleGetDeviation,
  handleGetStats,
  handleFetchAndStoreData,
} from "@/controllers/crypto-controller";

export default createRouter((router: Router) => {
  router.get("/stats", handleGetStats);
  router.get("/deviation", handleGetDeviation);
  router.post("/fetch-and-store", handleFetchAndStoreData);
});
