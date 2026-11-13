import type {
  MovementType,
  Prisma,
} from "../../../generated/prisma/client.js"
import { prisma } from "../../lib/prisma.js"

type DatabaseClient = typeof prisma | Prisma.TransactionClient

type CreateMovementData = {
  customerId: string
  type: MovementType
  amount: number
  description: string
  occurredOn: Date
}

type ListFilters = {
  type?: MovementType
  from?: Date
  to?: Date
  skip: number
  take: number
}

export class MovementRepository {
  transaction<T>(operation: (tx: Prisma.TransactionClient) => Promise<T>) {
    return prisma.$transaction(operation, { isolationLevel: "Serializable" })
  }

  findCustomer(
    storeId: string,
    customerId: string,
    database: DatabaseClient = prisma,
  ) {
    return database.customer.findFirst({
      where: { id: customerId, storeId, active: true },
      include: { movements: true },
    })
  }

  create(data: CreateMovementData, database: DatabaseClient = prisma) {
    return database.movement.create({ data })
  }

  async list(storeId: string, filters: ListFilters) {
    const where: Prisma.MovementWhereInput = {
      customer: { storeId, active: true },
      ...(filters.type && { type: filters.type }),
      ...((filters.from || filters.to) && {
        occurredOn: {
          ...(filters.from && { gte: filters.from }),
          ...(filters.to && { lte: filters.to }),
        },
      }),
    }

    const [items, total] = await prisma.$transaction([
      prisma.movement.findMany({
        where,
        include: { customer: { select: { id: true, name: true } } },
        orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
        skip: filters.skip,
        take: filters.take,
      }),
      prisma.movement.count({ where }),
    ])

    return { items, total }
  }
}
