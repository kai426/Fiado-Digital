import { prisma } from "../../lib/prisma.js"
import type { UpdateStoreInput } from "./store.schemas.js"

export class StoreRepository {
  findById(id: string) {
    return prisma.store.findUnique({ where: { id } })
  }

  update(id: string, input: UpdateStoreInput) {
    return prisma.store.update({
      where: { id },
      data: input,
    })
  }
}
