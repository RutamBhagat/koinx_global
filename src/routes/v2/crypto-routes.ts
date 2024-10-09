import type { Router } from "express";
import { createRouter } from "@/utils/create";

export default createRouter((router: Router) => {
  router.get("/stats", async (req, res) => {
    res.json({
      message: "To be implemented in V2",
    });
  });
});
