import type { Request, Response } from "express"

import { updateStoreSchema } from "./store.schemas.js"
import { StoreService } from "./store.service.js"

export class StoreController {
  constructor(private readonly service = new StoreService()) {}

  show = async (request: Request, response: Response): Promise<void> => {
    const store = await this.service.show(request.auth.storeId)
    response.json({ data: store })
  }

  update = async (request: Request, response: Response): Promise<void> => {
    const input = updateStoreSchema.parse(request.body)
    const store = await this.service.update(request.auth.storeId, input)
    response.json({ data: store })
  }
}
