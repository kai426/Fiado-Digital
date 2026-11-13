import { apiRequest } from "../../lib/api-client"
import type { ApiEnvelope, Dashboard } from "../../types/api"

export const dashboardApi = {
  summary: () =>
    apiRequest<ApiEnvelope<Dashboard>>("/dashboard/summary"),
}
