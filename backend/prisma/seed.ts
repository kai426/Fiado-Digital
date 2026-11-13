import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { hash } from "bcryptjs"

import { PrismaClient } from "../generated/prisma/client.js"

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://fiado:fiado@localhost:5432/fiado_digital?schema=public"
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

function daysAgo(days: number): Date {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - days)
  return date
}

async function main() {
  const passwordHash = await hash("Demo@123", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@fiadodigital.com.br" },
    update: {},
    create: {
      name: "Comerciante Demo",
      email: "demo@fiadodigital.com.br",
      passwordHash,
    },
    include: { store: true },
  })

  const store =
    user.store ??
    (await prisma.store.create({
      data: {
        ownerId: user.id,
        name: "Mercadinho do Bairro",
        city: "Manaus",
        state: "AM",
      },
    }))

  const customers = [
    {
      id: "10000000-0000-4000-8000-000000000001",
      name: "Maria Silva",
      phone: "92991234567",
      note: "Cliente da vizinhança.",
      color: "peach",
      movements: [
        ["20000000-0000-4000-8000-000000000001", "SALE", 75, "Compras do dia", 5],
        ["20000000-0000-4000-8000-000000000002", "SALE", 110.9, "Mercado e bebidas", 0],
      ],
    },
    {
      id: "10000000-0000-4000-8000-000000000002",
      name: "João Santos",
      phone: "92992345678",
      note: null,
      color: "blue",
      movements: [
        ["20000000-0000-4000-8000-000000000003", "SALE", 142.5, "Produtos diversos", 4],
        ["20000000-0000-4000-8000-000000000004", "PAYMENT", 50, "Pagamento em dinheiro", 1],
      ],
    },
    {
      id: "10000000-0000-4000-8000-000000000003",
      name: "Carlos Oliveira",
      phone: "92993456789",
      note: null,
      color: "purple",
      movements: [
        ["20000000-0000-4000-8000-000000000005", "SALE", 200, "Alimentos", 7],
        ["20000000-0000-4000-8000-000000000006", "SALE", 140, "Compras do dia", 2],
      ],
    },
  ] as const

  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: {
        storeId_phone: {
          storeId: store.id,
          phone: customerData.phone,
        },
      },
      update: {},
      create: {
        id: customerData.id,
        storeId: store.id,
        name: customerData.name,
        phone: customerData.phone,
        note: customerData.note,
        color: customerData.color,
      },
    })

    await prisma.movement.createMany({
      data: customerData.movements.map(
        ([id, type, amount, description, days]) => ({
          id,
          customerId: customer.id,
          type,
          amount,
          description,
          occurredOn: daysAgo(days),
        }),
      ),
      skipDuplicates: true,
    })
  }

  console.log("Seed concluído.")
  console.log("Login: demo@fiadodigital.com.br / Demo@123")
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
