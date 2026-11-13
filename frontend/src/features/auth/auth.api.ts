import { apiRequest } from "../../lib/api-client"
import type { ApiEnvelope, AuthSession, Store, User } from "../../types/api"

export type LoginInput = { email: string; password: string }
export type RegisterInput = LoginInput & {
  name: string
  store: { name: string; city?: string; state?: string }
}

export const authApi = {
  login: (input: LoginInput) =>
    apiRequest<ApiEnvelope<AuthSession>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  register: (input: RegisterInput) =>
    apiRequest<ApiEnvelope<AuthSession>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  me: () =>
    apiRequest<ApiEnvelope<{ user: User; store: Store }>>("/auth/me"),
}
