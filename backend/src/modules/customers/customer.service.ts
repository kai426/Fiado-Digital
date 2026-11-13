import { AppError } from "../../shared/errors/app-error.js"
import { calculateBalance } from "../../shared/utils/money.js"
import { paginationMeta } from "../../shared/utils/pagination.js"
import { presentCustomer } from "./customer.presenter.js"
import { CustomerRepository } from "./customer.repository.js"
import type {
  CreateCustomerInput,
  ListCustomersInput,
  UpdateCustomerInput,
} from "./customer.schemas.js"

export class CustomerService {
  constructor(private readonly repository = new CustomerRepository()) {}

  async list(storeId: string, input: ListCustomersInput) {
    const customers = await this.repository.findAll(storeId, input.q)
    const filtered = customers.filter((customer) => {
      const balance = calculateBalance(customer.movements)
      return (
        input.status === "all" ||
        (input.status === "debt" ? balance > 0 : balance === 0)
      )
    })
    const start = (input.page - 1) * input.limit
    const items = filtered
      .slice(start, start + input.limit)
      .map((customer) => presentCustomer(customer))

    return {
      items,
      meta: paginationMeta(input.page, input.limit, filtered.length),
    }
  }

  async show(storeId: string, customerId: string) {
    const customer = await this.repository.findById(storeId, customerId)
    if (!customer) {
      throw new AppError("Cliente não encontrado", 404, "CUSTOMER_NOT_FOUND")
    }
    return presentCustomer(customer, true)
  }

  async create(storeId: string, input: CreateCustomerInput) {
    const customer = await this.repository.create(storeId, {
      ...input,
      phone: this.normalizePhone(input.phone),
    })
    return presentCustomer(customer, true)
  }

  async update(
    storeId: string,
    customerId: string,
    input: UpdateCustomerInput,
  ) {
    await this.show(storeId, customerId)
    const customer = await this.repository.update(storeId, customerId, {
      ...input,
      ...(input.phone && { phone: this.normalizePhone(input.phone) }),
    })
    return presentCustomer(customer, true)
  }

  async archive(storeId: string, customerId: string) {
    const customer = await this.repository.findById(storeId, customerId)
    if (!customer) {
      throw new AppError("Cliente não encontrado", 404, "CUSTOMER_NOT_FOUND")
    }
    if (calculateBalance(customer.movements) > 0) {
      throw new AppError(
        "Não é possível remover um cliente com saldo em aberto",
        409,
        "CUSTOMER_HAS_DEBT",
      )
    }
    await this.repository.archive(storeId, customerId)
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, "")
  }
}
