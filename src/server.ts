import process from "node:process";
import consola from "consola";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { mw as requestIp } from "request-ip";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { logger } from "./utils/logger";

import "./utils/env";
import "./jobs/crypto-job";

const { PORT } = process.env;

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestIp());
app.use(logger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute.",
      });
    },
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
