import type { Request, Response } from "express"

import { prisma } from "../../lib/prisma.js"

export class HealthController {
  check = (_request: Request, response: Response): void => {
    response.json({
      data: {
        status: "ok",
        service: "fiado-digital-api",
        timestamp: new Date().toISOString(),
      },
    })
  }

  readiness = async (_request: Request, response: Response): Promise<void> => {
    await prisma.$queryRaw`SELECT 1`
    response.json({
      data: {
        status: "ready",
        database: "connected",
        timestamp: new Date().toISOString(),
      },
    })
  }
}
