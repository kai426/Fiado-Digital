import { apiRequest } from "../../lib/api-client"
import type { ApiEnvelope, Customer, PaginationMeta } from "../../types/api"

export type CustomerInput = {
  name: string
  phone: string
  note?: string | null
  color?: string
}

export type CustomerFilters = {
  q?: string
  status?: "all" | "debt" | "clear"
  page?: number
  limit?: number
}

function queryString(filters: CustomerFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value))
  })
  return params.toString()
}

export const customersApi = {
  list: async (filters: CustomerFilters = {}) => {
    const query = queryString(filters)
    return apiRequest<ApiEnvelope<Customer[]> & { meta: PaginationMeta }>(
      `/customers${query ? `?${query}` : ""}`,
    )
  },
  show: (customerId: string) =>
    apiRequest<ApiEnvelope<Customer>>(`/customers/${customerId}`),
  create: (input: CustomerInput) =>
    apiRequest<ApiEnvelope<Customer>>("/customers", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (customerId: string, input: Partial<CustomerInput>) =>
    apiRequest<ApiEnvelope<Customer>>(`/customers/${customerId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  archive: (customerId: string) =>
    apiRequest<void>(`/customers/${customerId}`, { method: "DELETE" }),
}
