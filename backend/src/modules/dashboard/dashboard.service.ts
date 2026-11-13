import { calculateBalance, calculateSaleStatuses, moneyToNumber } from "../../shared/utils/money.js"
import { presentCustomer } from "../customers/customer.presenter.js"
import { presentMovement } from "../movements/movement.presenter.js"
import { DashboardRepository } from "./dashboard.repository.js"

export class DashboardService {
  constructor(private readonly repository = new DashboardRepository()) {}

  async summary(storeId: string) {
    const [customers, recentMovements] = await Promise.all([
      this.repository.findCustomersWithMovements(storeId),
      this.repository.findRecentMovements(storeId, 5),
    ])

    const customersWithBalance = customers.map((customer) => ({
      customer,
      balance: calculateBalance(customer.movements),
    }))
    const debts = customersWithBalance.filter((item) => item.balance > 0)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setUTCHours(0, 0, 0, 0)
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7)

    const totalReceivable = debts.reduce((sum, item) => sum + item.balance, 0)
    const openSales = debts.reduce(
      (total, item) =>
        total +
        Object.values(calculateSaleStatuses(item.customer.movements)).filter(
          (status) => status !== "PAID",
        ).length,
      0,
    )
    const recentReceived = customers
      .flatMap((customer) => customer.movements)
      .filter(
        (movement) =>
          movement.type === "PAYMENT" && movement.occurredOn >= sevenDaysAgo,
      )
      .reduce((sum, movement) => sum + moneyToNumber(movement.amount), 0)

    return {
      summary: {
        totalReceivable: Math.round(totalReceivable * 100) / 100,
        customersWithDebt: debts.length,
        totalCustomers: customers.length,
        openSales,
        recentReceived: Math.round(recentReceived * 100) / 100,
      },
      pendingCustomers: debts
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5)
        .map((item) => presentCustomer(item.customer)),
      recentMovements: recentMovements.map(presentMovement),
    }
  }
}
