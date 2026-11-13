import { useMutation, useQuery } from "@tanstack/react-query"

import { useAuthStore } from "../../stores/auth-store"
import { authApi } from "./auth.api"

export const useLogin = () => useMutation({ mutationFn: authApi.login })
export const useRegister = () => useMutation({ mutationFn: authApi.register })

export function useCurrentUser() {
  const token = useAuthStore((state) => state.session?.accessToken)
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: Boolean(token),
    retry: false,
  })
}
