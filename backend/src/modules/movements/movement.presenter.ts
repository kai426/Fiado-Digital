import type { MovementType } from "../../../generated/prisma/client.js"
import { formatDateOnly } from "../../shared/utils/date.js"
import { moneyToNumber } from "../../shared/utils/money.js"

type MovementRecord = {
  id: string
  type: MovementType
  amount: { toString(): string } | number
  description: string
  occurredOn: Date
  createdAt: Date
  customer?: {
    id: string
    name: string
  }
}

export function presentMovement(movement: MovementRecord) {
  return {
    id: movement.id,
    type: movement.type,
    amount: moneyToNumber(movement.amount),
    description: movement.description,
    occurredOn: formatDateOnly(movement.occurredOn),
    createdAt: movement.createdAt,
    ...(movement.customer && { customer: movement.customer }),
  }
}
