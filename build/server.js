// src/server.ts
import process2 from "node:process";
import consola2 from "consola";
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
    "/api/v1/crypto/fetch-and-store": {
      post: {
        summary: "Fetch and store crypto data",
        responses: {
          "200": {
            description: "Successful response"
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

// src/server.ts
import { errorHandler, handle404Error } from "@/utils/errors";
import mainRouter from "@/routes/routes";

// src/utils/env.ts
import process from "node:process";
import { ZodError, z } from "zod";
import"dotenv/config";
var configSchema = z.object({
  PORT: z.string().regex(/^\d{4,5}$/).optional().default("3000"),
  API_BASE_URL: z.string().url().default("/api"),
  DATABASE_URL: z.string().url().refine((url) => url.startsWith("mongodb+srv://"), "DATABASE_URL must be a valid mongodb url")
});
try {
  configSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError)
    console.error(error.errors);
  process.exit(1);
}

// src/jobs/crypto-background-job.ts
import schedule from "node-schedule";
import { fetchAndStoreCryptoData } from "@/utils/crypto-utils";
schedule.scheduleJob("0 */2 * * *", fetchAndStoreCryptoData);
fetchAndStoreCryptoData();

// src/server.ts
var { PORT } = process2.env;
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
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    consola2.warn(`DDoS Attempt from ${req.ip}`);
    res.status(429).json({
      error: "Too many requests in a short time. Please try in a minute."
    });
  }
}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger_default));
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!"
  });
});
app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process2.uptime(),
    timestamp: Date.now()
  });
});
app.use("/api", mainRouter);
app.all("*", handle404Error);
app.use(errorHandler);
app.listen(PORT, () => {
  consola2.info(`Server running at http://localhost:${PORT}`);
});
