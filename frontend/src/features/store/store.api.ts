import { apiRequest } from "../../lib/api-client"
import type { ApiEnvelope, Store } from "../../types/api"

export type UpdateStoreInput = {
  name?: string
  city?: string | null
  state?: string | null
}

export const storeApi = {
  update: (input: UpdateStoreInput) =>
    apiRequest<ApiEnvelope<Store>>("/store/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
}
