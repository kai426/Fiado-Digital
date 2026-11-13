import { create } from "zustand"

export type AppPage =
  | "dashboard"
  | "customers"
  | "add-customer"
  | "customer"
  | "new-sale"
  | "payment"
  | "settings"

type Toast = { message: string; error?: boolean }

type UiState = {
  page: AppPage
  customerId: string | null
  chargeCustomerId: string | null
  toast: Toast | null
  navigate: (page: AppPage) => void
  openCustomer: (customerId: string) => void
  openSale: (customerId?: string) => void
  openPayment: (customerId: string) => void
  openCharge: (customerId: string) => void
  closeCharge: () => void
  notify: (message: string, error?: boolean) => void
  clearToast: () => void
}

export const useUiStore = create<UiState>((set) => ({
  page: "dashboard",
  customerId: null,
  chargeCustomerId: null,
  toast: null,
  navigate: (page) =>
    set({ page, ...(page === "new-sale" ? { customerId: null } : {}) }),
  openCustomer: (customerId) => set({ page: "customer", customerId }),
  openSale: (customerId) =>
    set({ page: "new-sale", customerId: customerId ?? null }),
  openPayment: (customerId) => set({ page: "payment", customerId }),
  openCharge: (chargeCustomerId) => set({ chargeCustomerId }),
  closeCharge: () => set({ chargeCustomerId: null }),
  notify: (message, error = false) => set({ toast: { message, error } }),
  clearToast: () => set({ toast: null }),
}))
