// src/server.ts
import process3 from "node:process";
import consola4 from "consola";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { mw as requestIp } from "request-ip";
import swaggerUi from "swagger-ui-express";

// swagger.json
var swagger_default = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation",
    version: "1.0.0"
  },
  paths: {
    "/": {
      get: {
        summary: "Welcome message",
        responses: {
          "200": {
            description: "A welcome message"
          }
        }
      }
    },
    "/healthcheck": {
      get: {
        summary: "Health check endpoint",
        responses: {
          "200": {
            description: "Server is running"
          }
        }
      }
    },
    "/api/v1/crypto/stats": {
      get: {
        summary: "Get crypto statistics",
        parameters: [
          {
            name: "coin",
            in: "query",
            required: true,
            schema: {
              type: "string"
            },
            description: "The name of the crypto coin"
          }
        ],
        responses: {
          "200": {
            description: "Successful response with crypto statistics"
          }
        }
      }
    },
    "/api/v1/crypto/deviation": {
      get: {
        summary: "Get crypto deviation",
        parameters: [
          {
            name: "coin",
            in: "query",
            required: true,
            schema: {
              type: "string"
            },
            description: "The name of the crypto coin"
          }
        ],
        responses: {
          "200": {
            description: "Successful response with crypto deviation"
          }
        }
      }
    },
    "/api/v2/crypto/": {
      get: {
        summary: "to be implemented in v2",
        responses: {
          "200": {
            description: "to be implemented in v2"
          }
        }
      }
    }
  }
};

// src/utils/logger.ts
import consola from "consola";
function logger(req, _res, next) {
  const ip = req.ip;
  const method = req.method;
  const url = req.url;
  const version = req.httpVersion;
  const userAgent = req.headers["user-agent"];
  const message = `${ip} [${method}] ${url} HTTP/${version} ${userAgent}`;
  consola.log(message);
  next();
}

// src/utils/errors.ts
import consola2 from "consola";
import { ZodError } from "zod";
function getStatusFromErrorCode(code) {
  switch (code) {
    case "BAD_REQUEST":
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHORIZED":
    case "INVALID_PASSWORD":
      return 401;
    case "NOT_FOUND":
    case "USER_NOT_FOUND":
      return 404;
    case "METHOD_NOT_ALLOWED":
      return 405;
    case "NOT_ACCEPTABLE":
      return 406;
    case "REQUEST_TIMEOUT":
      return 408;
    case "CONFLICT":
      return 409;
    case "GONE":
      return 410;
    case "LENGTH_REQUIRED":
      return 411;
    case "PRECONDITION_FAILED":
      return 412;
    case "PAYLOAD_TOO_LARGE":
      return 413;
    case "URI_TOO_LONG":
      return 414;
    case "UNSUPPORTED_MEDIA_TYPE":
      return 415;
    case "RANGE_NOT_SATISFIABLE":
      return 416;
    case "EXPECTATION_FAILED":
      return 417;
    case "TEAPOT":
      return 418;
    // I'm a teapot
    case "INTERNAL_ERROR":
      return 500;
    default:
      return 500;
  }
}
function getMessageFromErrorCode(code) {
  switch (code) {
    case "BAD_REQUEST":
      return "The request is invalid.";
    case "VALIDATION_ERROR":
      return "The request contains invalid or missing fields.";
    case "UNAUTHORIZED":
      return "You are not authorized to access this resource.";
    case "NOT_FOUND":
      return "The requested resource was not found.";
    case "USER_NOT_FOUND":
      return "The user was not found.";
    case "INTERNAL_ERROR":
      return "An internal server error occurred.";
    case "CONFLICT":
      return "The request conflicts with the current state of the server.";
    case "INVALID_PASSWORD":
      return "The password is incorrect.";
    default:
      return "An internal server error occurred.";
  }
}
function handleValidationError(err) {
  const invalidFields = [];
  const requiredFields = [];
  for (const error of err.errors) {
    if (error.code === "invalid_type") invalidFields.push(error.path.join("."));
    else if (error.message === "Required")
      requiredFields.push(error.path.join("."));
  }
  return {
    invalidFields,
    requiredFields
  };
}
var BackendError = class extends Error {
  code;
  details;
  constructor(code, {
    message,
    details
  } = {}) {
    super(message ?? getMessageFromErrorCode(code));
    this.code = code;
    this.details = details;
  }
};
function errorHandler(error, req, res, _next) {
  let statusCode = 500;
  let code;
  let message;
  let details;
  const ip = req.ip;
  const url = req.originalUrl;
  const method = req.method;
  if (error instanceof BackendError) {
    message = error.message;
    code = error.code;
    details = error.details;
    statusCode = getStatusFromErrorCode(code);
  }
  if (error instanceof ZodError) {
    code = "VALIDATION_ERROR";
    message = getMessageFromErrorCode(code);
    details = handleValidationError(error);
    statusCode = getStatusFromErrorCode(code);
  }
  if (error.code === "ECONNREFUSED") {
    code = "INTERNAL_ERROR";
    message = "The DB crashed maybe because they dont like you :p";
    details = error;
  }
  code = code ?? "INTERNAL_ERROR";
  message = message ?? getMessageFromErrorCode(code);
  details = details ?? error;
  consola2.error(`${ip} [${method}] ${url} ${code} - ${message}`);
  res.status(statusCode).json({
    code,
    message,
    details
  });
}
function handle404Error(_req, res) {
  const code = "NOT_FOUND";
  res.status(getStatusFromErrorCode(code)).json({
    code,
    message: "Route not found",
    details: "The route you are trying to access does not exist"
  });
}

// src/routes/routes.ts
import { Router as Router6 } from "express";

// src/routes/v1/routes.ts
import { Router as Router3 } from "express";

// src/routes/v1/crypto-routes.ts
import "express";

// src/utils/create.ts
import { Router } from "express";
function createRouter(callback) {
  const router = Router();
  callback(router);
  return router;
}

// src/utils/db.ts
import process from "node:process";
import { PrismaClient } from "@prisma/client";
var prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
var db_default = prisma;

// src/services/crypto-services.ts
async function createCryptocurrencyEntry(data) {
  return await db_default.cryptocurrencyEntry.create({ data });
}
async function getLatestEntry(currencyName) {
  return await db_default.cryptocurrencyEntry.findFirst({
    where: { currencyName },
    orderBy: { timestamp: "desc" }
  });
}
async function getEntries(currencyName) {
  return await db_default.cryptocurrencyEntry.findMany({
    where: { currencyName },
    orderBy: { timestamp: "desc" }
  });
}

// src/controllers/crypto-controller.ts
var coinTypeMapping = {
  bitcoin: "BITCOIN",
  ethereum: "ETHEREUM",
  "matic-network": "MATIC_NETWORK"
};
function mapCoinType(apiValue) {
  return coinTypeMapping[apiValue.toLowerCase()];
}
function calculateStandardDeviation(values) {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((acc, val) => acc + val, 0) / n;
  const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  return Math.sqrt(variance);
}
async function handleGetStats(req, res) {
  const { coin } = req.query;
  if (typeof coin !== "string") {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }
  const mappedCoin = mapCoinType(coin);
  if (!mappedCoin) {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }
  const latestEntry = await getLatestEntry(mappedCoin);
  if (!latestEntry) {
    res.status(404).json({ error: "No data available for the specified coin" });
    return;
  }
  res.status(200).json({
    price: latestEntry.usd,
    marketCap: latestEntry.usdMarketCap,
    "24hChange": latestEntry.usd24hChange
  });
}
async function handleGetDeviation(req, res) {
  const { coin } = req.query;
  if (typeof coin !== "string") {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }
  const mappedCoin = mapCoinType(coin);
  if (!mappedCoin) {
    res.status(400).json({ error: "Invalid coin parameter" });
    return;
  }
  const entries = await getEntries(mappedCoin);
  if (entries.length === 0) {
    res.status(404).json({ error: "No data available for the specified coin" });
    return;
  }
  const prices = entries.map((entry) => entry.usd);
  const stdDeviation = calculateStandardDeviation(prices);
  res.status(200).json({
    stdDeviation
  });
}

// src/routes/v1/crypto-routes.ts
var crypto_routes_default = createRouter((router) => {
  router.get("/stats", handleGetStats);
  router.get("/deviation", handleGetDeviation);
});

// src/routes/v1/routes.ts
var v1Router = Router3();
v1Router.use("/crypto", crypto_routes_default);
var routes_default = v1Router;

// src/routes/v2/routes.ts
import { Router as Router5 } from "express";

// src/routes/v2/crypto-routes.ts
import "express";
var crypto_routes_default2 = createRouter((router) => {
  router.get("/", async (req, res) => {
    res.json({
      message: "To be implemented in V2"
    });
  });
});

// src/routes/v2/routes.ts
var v2Router = Router5();
v2Router.use("/crypto", crypto_routes_default2);
var routes_default2 = v2Router;

// src/routes/routes.ts
var mainRouter = Router6();
mainRouter.use("/v1", routes_default);
mainRouter.use("/v2", routes_default2);
var routes_default3 = mainRouter;

// src/utils/env.ts
import process2 from "node:process";
import { ZodError as ZodError2, z } from "zod";
import "dotenv/config";
var configSchema = z.object({
  PORT: z.string().regex(/^\d{4,5}$/).optional().default("3000"),
  API_BASE_URL: z.string().url().default("/api"),
  DATABASE_URL: z.string().url().refine(
    (url) => url.startsWith("mongodb+srv://"),
    "DATABASE_URL must be a valid mongodb url"
  )
});
try {
  configSchema.parse(process2.env);
} catch (error) {
  if (error instanceof ZodError2) console.error(error.errors);
  process2.exit(1);
}

// src/jobs/crypto-background-job.ts
import axios from "axios";
import consola3 from "consola";
import schedule from "node-schedule";

// src/schema/crypto_schema.ts
import { z as z2 } from "zod";
var CoinTypeSchema = z2.enum(["BITCOIN", "ETHEREUM", "MATIC_NETWORK"]);
var CryptoCurrentDataSchema = z2.object({
  currencyName: CoinTypeSchema,
  timestamp: z2.date(),
  usd: z2.number(),
  usdMarketCap: z2.number(),
  usd24hChange: z2.number()
});

// src/jobs/crypto-background-job.ts
var ids = [
  "BITCOIN",
  "ETHEREUM",
  "MATIC_NETWORK"
];
var coinTypeMapping2 = {
  bitcoin: "BITCOIN",
  ethereum: "ETHEREUM",
  "matic-network": "MATIC_NETWORK"
};
function mapCoinType2(apiValue) {
  return coinTypeMapping2[apiValue.toLowerCase()];
}
async function fetchCryptoData() {
  const url = "https://api.coingecko.com/api/v3/simple/price";
  const params = {
    ids: ids.map((coin) => coin.toLowerCase().replace("_", "-")).join(","),
    vs_currencies: "usd",
    include_market_cap: "true",
    include_24hr_change: "true"
  };
  try {
    const response = await axios.get(url, { params, timeout: 1e4 });
    const data = response.data;
    consola3.log("Fetched Crypto Data:", data);
    for (const coin of ids) {
      const apiCoinName = coin.toLowerCase().replace("_", "-");
      const coinData = data[apiCoinName];
      if (!coinData) {
        consola3.error(`No data found for ${coin}`);
        continue;
      }
      const currentPriceInfo = {
        currencyName: mapCoinType2(apiCoinName),
        timestamp: /* @__PURE__ */ new Date(),
        usd: coinData.usd,
        usdMarketCap: coinData.usd_market_cap,
        usd24hChange: coinData.usd_24h_change
      };
      const currentPriceInfoResult = CryptoCurrentDataSchema.safeParse(currentPriceInfo);
      if (!currentPriceInfoResult.success) {
        consola3.error("Validation error:", currentPriceInfoResult.error);
        continue;
      }
      await createCryptocurrencyEntry(currentPriceInfoResult.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      consola3.error("Axios error:", error.message);
      if (error.response) {
        consola3.error("Response data:", error.response.data);
        consola3.error("Response status:", error.response.status);
      } else if (error.request) {
        consola3.error("No response received:", error.request);
      } else {
        consola3.error("Error message:", error.message);
      }
    } else {
      consola3.error("Error fetching crypto data:", error);
    }
  }
}
schedule.scheduleJob("0 */2 * * *", fetchCryptoData);
fetchCryptoData();

// src/server.ts
var { PORT } = process3.env;
var app = express();
var corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(requestIp());
app.use(logger);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 100,
    handler: (req, res) => {
      consola4.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute."
      });
    }
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger_default));
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!"
  });
});
app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process3.uptime(),
    timestamp: Date.now()
  });
});
app.use("/api", routes_default3);
app.all("*", handle404Error);
app.use(errorHandler);
app.listen(PORT, () => {
  consola4.info(`Server running at http://localhost:${PORT}`);
});
