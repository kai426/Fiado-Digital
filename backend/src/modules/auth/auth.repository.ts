import { prisma } from "../../lib/prisma.js"
import type { RegisterInput } from "./auth.schemas.js"

export class AuthRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { store: true },
    })
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { store: true },
    })
  }

  create(input: RegisterInput, passwordHash: string) {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        store: {
          create: {
            name: input.store.name,
            city: input.store.city,
            state: input.store.state,
          },
        },
      },
      include: { store: true },
    })
  }
}
