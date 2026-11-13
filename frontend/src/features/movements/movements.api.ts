import { apiRequest } from "../../lib/api-client"
import type { ApiEnvelope, Movement } from "../../types/api"

export type MovementInput = {
  amount: number
  description?: string
  occurredOn?: string
}

type MovementResult = { movement: Movement; balance: number }

export const movementsApi = {
  createSale: (customerId: string, input: MovementInput) =>
    apiRequest<ApiEnvelope<MovementResult>>(`/customers/${customerId}/sales`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  createPayment: (customerId: string, input: MovementInput) =>
    apiRequest<ApiEnvelope<MovementResult>>(
      `/customers/${customerId}/payments`,
      { method: "POST", body: JSON.stringify(input) },
    ),
}
