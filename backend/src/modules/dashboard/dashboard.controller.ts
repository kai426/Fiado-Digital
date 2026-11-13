import type { Request, Response } from "express"

import { DashboardService } from "./dashboard.service.js"

export class DashboardController {
  constructor(private readonly service = new DashboardService()) {}

  summary = async (request: Request, response: Response): Promise<void> => {
    const result = await this.service.summary(request.auth.storeId)
    response.json({ data: result })
  }
}
