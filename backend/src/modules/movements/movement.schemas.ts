import { z } from "zod"

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD")

const amountSchema = z.coerce
  .number()
  .positive()
  .max(999_999)
  .refine((value) => Number.isInteger(value * 100), {
    message: "O valor deve ter no máximo duas casas decimais",
  })

export const createSaleSchema = z.object({
  amount: amountSchema,
  description: z.string().trim().max(150).optional(),
  occurredOn: dateOnlySchema.optional(),
})

export const createPaymentSchema = z.object({
  amount: amountSchema,
  description: z.string().trim().max(150).optional(),
  occurredOn: dateOnlySchema.optional(),
})

export const listMovementsSchema = z
  .object({
    type: z.enum(["ALL", "SALE", "PAYMENT"]).default("ALL"),
    from: dateOnlySchema.optional(),
    to: dateOnlySchema.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  })
  .refine((input) => !input.from || !input.to || input.from <= input.to, {
    message: "A data inicial deve ser anterior à data final",
  })

export type CreateSaleInput = z.infer<typeof createSaleSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type ListMovementsInput = z.infer<typeof listMovementsSchema>
