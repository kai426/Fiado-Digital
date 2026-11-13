import type { MovementType } from "../../../generated/prisma/client.js"
import { formatDateOnly } from "../../shared/utils/date.js"
import {
  calculateBalance,
  calculateSaleStatuses,
  moneyToNumber,
} from "../../shared/utils/money.js"

type CustomerMovement = {
  id: string
  type: MovementType
  amount: { toString(): string } | number
  description: string
  occurredOn: Date
  createdAt: Date
}

type CustomerRecord = {
  id: string
  name: string
  phone: string
  note: string | null
  color: string
  createdAt: Date
  updatedAt: Date
  movements: CustomerMovement[]
}

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")
  }
  return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3")
}

export function presentCustomer(customer: CustomerRecord, includeHistory = false) {
  const sales = customer.movements.filter((movement) => movement.type === "SALE")
  const statuses = calculateSaleStatuses(customer.movements)
  const openSales = Object.values(statuses).filter((status) => status !== "PAID").length
  const lastSale = sales.sort(
    (a, b) => b.occurredOn.getTime() - a.occurredOn.getTime(),
  )[0]

  return {
    id: customer.id,
    name: customer.name,
    phone: formatPhone(customer.phone),
    phoneDigits: customer.phone,
    note: customer.note,
    color: customer.color,
    balance: calculateBalance(customer.movements),
    openSales,
    lastSaleOn: lastSale ? formatDateOnly(lastSale.occurredOn) : null,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt,
    ...(includeHistory && {
      movements: customer.movements.map((movement) => ({
        id: movement.id,
        type: movement.type,
        amount: moneyToNumber(movement.amount),
        description: movement.description,
        occurredOn: formatDateOnly(movement.occurredOn),
        status: movement.type === "PAYMENT" ? "RECEIVED" : statuses[movement.id],
        createdAt: movement.createdAt,
      })),
    }),
  }
}
