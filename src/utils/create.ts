import { Router } from "express";

export function createRouter(callback: (router: Router) => void): Router {
  const router = Router();
  callback(router);
  return router;
}
