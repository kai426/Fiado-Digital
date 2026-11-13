import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AuthSession, Store } from "../types/api"

type AuthState = {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  updateStore: (store: Store) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateStore: (store) =>
        set((state) => ({
          session: state.session ? { ...state.session, store } : null,
        })),
      clearSession: () => set({ session: null }),
    }),
    { name: "fiado-auth-v1" },
  ),
)
