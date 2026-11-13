import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "../../app/query-client"
import { customersApi, type CustomerFilters } from "./customers.api"

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customersApi.list(filters),
  })
}

export function useCustomer(customerId: string | null) {
  return useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => customersApi.show(customerId!),
    enabled: Boolean(customerId),
  })
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  })
}

export function useUpdateCustomer(customerId: string) {
  return useMutation({
    mutationFn: (input: Parameters<typeof customersApi.update>[1]) =>
      customersApi.update(customerId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customers", customerId] })
    },
  })
}

export function useArchiveCustomer() {
  return useMutation({
    mutationFn: customersApi.archive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
