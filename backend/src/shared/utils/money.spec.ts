import { describe, expect, it } from "vitest"

import { calculateBalance, calculateSaleStatuses } from "./money.js"

const date = (value: string) => new Date(`${value}T00:00:00.000Z`)

describe("regras financeiras", () => {
  it("calcula o saldo sem erros de ponto flutuante", () => {
    expect(
      calculateBalance([
        { type: "SALE", amount: 0.1 },
        { type: "SALE", amount: 0.2 },
        { type: "PAYMENT", amount: 0.3 },
      ]),
    ).toBe(0)
  })

  it("aplica pagamentos nas compras mais antigas primeiro", () => {
    const statuses = calculateSaleStatuses([
      {
        id: "sale-1",
        type: "SALE",
        amount: 100,
        occurredOn: date("2026-01-01"),
        createdAt: date("2026-01-01"),
      },
      {
        id: "sale-2",
        type: "SALE",
        amount: 100,
        occurredOn: date("2026-01-02"),
        createdAt: date("2026-01-02"),
      },
      {
        id: "payment-1",
        type: "PAYMENT",
        amount: 150,
        occurredOn: date("2026-01-03"),
        createdAt: date("2026-01-03"),
      },
    ])

    expect(statuses).toEqual({
      "sale-1": "PAID",
      "sale-2": "PARTIAL",
    })
  })
})
