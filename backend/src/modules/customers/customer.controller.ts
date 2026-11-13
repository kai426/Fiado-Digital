import type { Request, Response } from "express"

import { CustomerService } from "./customer.service.js"
import {
  createCustomerSchema,
  customerIdSchema,
  listCustomersSchema,
  updateCustomerSchema,
} from "./customer.schemas.js"

export class CustomerController {
  constructor(private readonly service = new CustomerService()) {}

  list = async (request: Request, response: Response): Promise<void> => {
    const query = listCustomersSchema.parse(request.query)
    const result = await this.service.list(request.auth.storeId, query)
    response.json({ data: result.items, meta: result.meta })
  }

  show = async (request: Request, response: Response): Promise<void> => {
    const { customerId } = customerIdSchema.parse(request.params)
    const customer = await this.service.show(request.auth.storeId, customerId)
    response.json({ data: customer })
  }

  create = async (request: Request, response: Response): Promise<void> => {
    const input = createCustomerSchema.parse(request.body)
    const customer = await this.service.create(request.auth.storeId, input)
    response.status(201).json({ data: customer })
  }

  update = async (request: Request, response: Response): Promise<void> => {
    const { customerId } = customerIdSchema.parse(request.params)
    const input = updateCustomerSchema.parse(request.body)
    const customer = await this.service.update(
      request.auth.storeId,
      customerId,
      input,
    )
    response.json({ data: customer })
  }

  archive = async (request: Request, response: Response): Promise<void> => {
    const { customerId } = customerIdSchema.parse(request.params)
    await this.service.archive(request.auth.storeId, customerId)
    response.status(204).send()
  }
}
