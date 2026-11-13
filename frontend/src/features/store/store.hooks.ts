import { useMutation } from "@tanstack/react-query"

import { queryClient } from "../../app/query-client"
import { useAuthStore } from "../../stores/auth-store"
import { storeApi } from "./store.api"

export const useUpdateStore = () => {
  const updateStore = useAuthStore((state) => state.updateStore)
  return useMutation({
    mutationFn: storeApi.update,
    onSuccess: ({ data }) => {
      updateStore(data)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })
}
