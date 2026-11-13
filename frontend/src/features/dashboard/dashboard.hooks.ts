import { useQuery } from "@tanstack/react-query"

import { dashboardApi } from "./dashboard.api"

export const useDashboard = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.summary })
