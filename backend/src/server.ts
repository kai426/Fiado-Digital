import { app } from "./app.js"
import { env } from "./config/env.js"
import { logger } from "./lib/logger.js"
import { prisma } from "./lib/prisma.js"

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "API do Fiado Digital iniciada")
})

async function shutdown(signal: string) {
  logger.info({ signal }, "Encerrando a aplicação")
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))
