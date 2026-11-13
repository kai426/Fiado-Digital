import type { Request, Response } from "express"

import { customerIdSchema } from "../customers/customer.schemas.js"
import {
  createPaymentSchema,
  createSaleSchema,
  listMovementsSchema,
} from "./movement.schemas.js"
import { MovementService } from "./movement.service.js"

export class MovementController {
  constructor(private readonly service = new MovementService()) {}

  createSale = async (request: Request, response: Response): Promise<void> => {
    const { customerId } = customerIdSchema.parse(request.params)
    const input = createSaleSchema.parse(request.body)
    const result = await this.service.createSale(
      request.auth.storeId,
      customerId,
      input,
    )
    response.status(201).json({ data: result })
  }

  createPayment = async (
    request: Request,
    response: Response,
  ): Promise<void> => {
    const { customerId } = customerIdSchema.parse(request.params)
    const input = createPaymentSchema.parse(request.body)
    const result = await this.service.createPayment(
      request.auth.storeId,
      customerId,
      input,
    )
    response.status(201).json({ data: result })
  }

  list = async (request: Request, response: Response): Promise<void> => {
    const query = listMovementsSchema.parse(request.query)
    const result = await this.service.list(request.auth.storeId, query)
    response.json({ data: result.items, meta: result.meta })
  }
}
