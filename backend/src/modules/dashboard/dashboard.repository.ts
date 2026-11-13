import { prisma } from "../../lib/prisma.js"

export class DashboardRepository {
  findCustomersWithMovements(storeId: string) {
    return prisma.customer.findMany({
      where: { storeId, active: true },
      include: { movements: true },
    })
  }

  findRecentMovements(storeId: string, limit: number) {
    return prisma.movement.findMany({
      where: { customer: { storeId, active: true } },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
      take: limit,
    })
  }
}
