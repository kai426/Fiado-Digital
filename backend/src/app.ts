import cors from "cors"
import express from "express"
import helmet from "helmet"
import { pinoHttp } from "pino-http"

import { env } from "./config/env.js"
import { logger } from "./lib/logger.js"
import { routes } from "./routes/index.js"
import { errorHandler } from "./shared/http/middlewares/error-handler.js"
import { notFound } from "./shared/http/middlewares/not-found.js"

export const app = express()

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim())

app.disable("x-powered-by")
app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error("Origem não permitida pelo CORS"))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: "100kb" }))
app.use(pinoHttp({ logger }))

app.get("/", (_request, response) => {
  response.json({
    data: {
      name: "Fiado Digital API",
      version: "1.0.0",
      documentation: "/api/v1/health",
    },
  })
})
app.use("/api/v1", routes)
app.use(notFound)
app.use(errorHandler)
