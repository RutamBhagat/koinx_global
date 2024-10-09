import type { Router } from "express";
import {
  handleGetDeviation,
  handleGetStats,
} from "@/controllers/crypto-controller";
import { createRouter } from "@/utils/create";

export default createRouter((router: Router) => {
  router.get("/stats", handleGetStats);
  router.get("/deviation", handleGetDeviation);
});
