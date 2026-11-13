import type { MovementType } from "../../../generated/prisma/client.js"

type BalanceMovement = {
  type: MovementType
  amount: { toString(): string } | number
}

export function moneyToNumber(value: { toString(): string } | number): number {
  return Number(value.toString())
}

export function calculateBalance(movements: BalanceMovement[]): number {
  const cents = movements.reduce((total, movement) => {
    const amount = Math.round(moneyToNumber(movement.amount) * 100)
    return total + (movement.type === "SALE" ? amount : -amount)
  }, 0)

  return Math.max(0, cents) / 100
}

export function calculateSaleStatuses(
  movements: Array<BalanceMovement & { id: string; occurredOn: Date; createdAt: Date }>,
): Record<string, "PAID" | "PARTIAL" | "OPEN"> {
  let paidCents = movements
    .filter((movement) => movement.type === "PAYMENT")
    .reduce(
      (sum, movement) =>
        sum + Math.round(moneyToNumber(movement.amount) * 100),
      0,
    )

  const statuses: Record<string, "PAID" | "PARTIAL" | "OPEN"> = {}
  const sales = movements
    .filter((movement) => movement.type === "SALE")
    .sort(
      (a, b) =>
        a.occurredOn.getTime() - b.occurredOn.getTime() ||
        a.createdAt.getTime() - b.createdAt.getTime(),
    )

  for (const sale of sales) {
    const saleCents = Math.round(moneyToNumber(sale.amount) * 100)
    statuses[sale.id] =
      paidCents >= saleCents ? "PAID" : paidCents > 0 ? "PARTIAL" : "OPEN"
    paidCents = Math.max(0, paidCents - saleCents)
  }

  return statuses
}
