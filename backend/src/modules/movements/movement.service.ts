import { AppError } from "../../shared/errors/app-error.js"
import { parseDateOnly } from "../../shared/utils/date.js"
import { calculateBalance } from "../../shared/utils/money.js"
import { paginationMeta } from "../../shared/utils/pagination.js"
import { presentMovement } from "./movement.presenter.js"
import { MovementRepository } from "./movement.repository.js"
import type {
  CreatePaymentInput,
  CreateSaleInput,
  ListMovementsInput,
} from "./movement.schemas.js"

export class MovementService {
  constructor(private readonly repository = new MovementRepository()) {}

  async createSale(
    storeId: string,
    customerId: string,
    input: CreateSaleInput,
  ) {
    const customer = await this.repository.findCustomer(storeId, customerId)
    if (!customer) {
      throw new AppError("Cliente não encontrado", 404, "CUSTOMER_NOT_FOUND")
    }

    const occurredOn = this.resolveDate(input.occurredOn)
    const movement = await this.repository.create({
      customerId,
      type: "SALE",
      amount: input.amount,
      description: input.description || "Compras do dia",
      occurredOn,
    })

    return {
      movement: presentMovement(movement),
      balance: calculateBalance([...customer.movements, movement]),
    }
  }

  async createPayment(
    storeId: string,
    customerId: string,
    input: CreatePaymentInput,
  ) {
    return this.repository.transaction(async (transaction) => {
      const customer = await this.repository.findCustomer(
        storeId,
        customerId,
        transaction,
      )
      if (!customer) {
        throw new AppError("Cliente não encontrado", 404, "CUSTOMER_NOT_FOUND")
      }

      const currentBalance = calculateBalance(customer.movements)
      if (input.amount > currentBalance) {
        throw new AppError(
          "O pagamento não pode ser maior que o saldo em aberto",
          422,
          "PAYMENT_EXCEEDS_BALANCE",
          { currentBalance },
        )
      }

      const movement = await this.repository.create(
        {
          customerId,
          type: "PAYMENT",
          amount: input.amount,
          description: input.description || "Pagamento recebido",
          occurredOn: this.resolveDate(input.occurredOn),
        },
        transaction,
      )

      return {
        movement: presentMovement(movement),
        balance: calculateBalance([...customer.movements, movement]),
      }
    })
  }

  async list(storeId: string, input: ListMovementsInput) {
    const result = await this.repository.list(storeId, {
      type: input.type === "ALL" ? undefined : input.type,
      from: input.from ? parseDateOnly(input.from) : undefined,
      to: input.to ? parseDateOnly(input.to) : undefined,
      skip: (input.page - 1) * input.limit,
      take: input.limit,
    })

    return {
      items: result.items.map(presentMovement),
      meta: paginationMeta(input.page, input.limit, result.total),
    }
  }

  private resolveDate(value?: string): Date {
    const dateValue = value ?? new Date().toISOString().slice(0, 10)
    const today = new Date().toISOString().slice(0, 10)
    if (dateValue > today) {
      throw new AppError(
        "A data da movimentação não pode estar no futuro",
        422,
        "FUTURE_DATE",
      )
    }
    return parseDateOnly(dateValue)
  }
}
