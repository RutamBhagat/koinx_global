import type { Router } from "express";
import cryptoRoutes from "@/routes/v1/crypto-routes";
import { createRouter } from "@/utils/create";

export default createRouter((router: Router) => {
  router.use("/crypto", cryptoRoutes);
});
