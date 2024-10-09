import type { Router } from "express";
import v1Routes from "@/routes/v1/routes";
import v2Routes from "@/routes/v2/routes";
import { createRouter } from "@/utils/create";

export default createRouter((router: Router) => {
  router.use("/v1", v1Routes);
  router.use("/v2", v2Routes);
});
