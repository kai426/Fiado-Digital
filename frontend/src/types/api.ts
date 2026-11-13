export type Store = {
  id: string
  name: string
  city: string | null
  state: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
}

export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type AuthSession = {
  accessToken: string
  tokenType: "Bearer"
  expiresIn: string
  user: User
  store: Store
}

export type MovementType = "SALE" | "PAYMENT"
export type MovementStatus = "PAID" | "PARTIAL" | "OPEN" | "RECEIVED"

export type Movement = {
  id: string
  type: MovementType
  amount: number
  description: string
  occurredOn: string
  status?: MovementStatus
  createdAt: string
  customer?: Pick<Customer, "id" | "name">
}

export type Customer = {
  id: string
  name: string
  phone: string
  phoneDigits: string
  note: string | null
  color: string
  balance: number
  openSales: number
  lastSaleOn: string | null
  createdAt: string
  updatedAt: string
  movements?: Movement[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type Dashboard = {
  summary: {
    totalReceivable: number
    customersWithDebt: number
    totalCustomers: number
    openSales: number
    recentReceived: number
  }
  pendingCustomers: Customer[]
  recentMovements: Movement[]
}

export type ApiEnvelope<T> = {
  data: T
  meta?: PaginationMeta
}
