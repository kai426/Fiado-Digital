import { useMutation } from "@tanstack/react-query"

import { queryClient } from "../../app/query-client"
import { movementsApi, type MovementInput } from "./movements.api"

function invalidateFinancialData(customerId: string) {
  queryClient.invalidateQueries({ queryKey: ["customers"] })
  queryClient.invalidateQueries({ queryKey: ["customers", customerId] })
  queryClient.invalidateQueries({ queryKey: ["dashboard"] })
  queryClient.invalidateQueries({ queryKey: ["movements"] })
}

export function useCreateSale() {
  return useMutation({
    mutationFn: ({ customerId, input }: { customerId: string; input: MovementInput }) =>
      movementsApi.createSale(customerId, input),
    onSuccess: (_result, variables) => invalidateFinancialData(variables.customerId),
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: ({ customerId, input }: { customerId: string; input: MovementInput }) =>
      movementsApi.createPayment(customerId, input),
    onSuccess: (_result, variables) => invalidateFinancialData(variables.customerId),
  })
}
