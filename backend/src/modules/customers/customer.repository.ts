import type { Prisma } from "../../../generated/prisma/client.js"
import { prisma } from "../../lib/prisma.js"

type CustomerData = {
  name: string
  phone: string
  note?: string | null
  color?: string
}

export class CustomerRepository {
  findAll(storeId: string, query: string) {
    const where: Prisma.CustomerWhereInput = {
      storeId,
      active: true,
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { phone: { contains: query.replace(/\D/g, "") } },
        ],
      }),
    }

    return prisma.customer.findMany({
      where,
      include: { movements: true },
      orderBy: { name: "asc" },
    })
  }

  findById(storeId: string, customerId: string) {
    return prisma.customer.findFirst({
      where: { id: customerId, storeId, active: true },
      include: {
        movements: {
          orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
        },
      },
    })
  }

  create(storeId: string, data: CustomerData) {
    return prisma.customer.create({
      data: { ...data, storeId },
      include: { movements: true },
    })
  }

  update(storeId: string, customerId: string, data: Partial<CustomerData>) {
    return prisma.customer.update({
      where: { id: customerId, storeId },
      data,
      include: { movements: true },
    })
  }

  archive(storeId: string, customerId: string) {
    return prisma.customer.update({
      where: { id: customerId, storeId },
      data: { active: false },
    })
  }
}
