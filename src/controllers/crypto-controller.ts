import type { Request, Response } from "express";

export async function handleGetDeviation(req: Request, res: Response) {
  res.json({
    message: "Hello World",
  });
}

export async function handleGetStats(req: Request, res: Response) {
  res.json({
    message: "Hello World",
  });
}
