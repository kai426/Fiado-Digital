import { z } from "zod"

const phoneSchema = z
  .string()
  .trim()
  .refine((value) => [10, 11].includes(value.replace(/\D/g, "").length), {
    message: "Informe um telefone com DDD",
  })

export const customerIdSchema = z.object({
  customerId: z.string().uuid(),
})

export const listCustomersSchema = z.object({
  q: z.string().trim().max(100).default(""),
  status: z.enum(["all", "debt", "clear"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const createCustomerSchema = z.object({
  name: z.string().trim().min(3).max(100),
  phone: phoneSchema,
  note: z.string().trim().max(500).nullable().optional(),
  color: z.string().trim().min(2).max(20).default("peach"),
})

export const updateCustomerSchema = z
  .object({
    name: z.string().trim().min(3).max(100).optional(),
    phone: phoneSchema.optional(),
    note: z.string().trim().max(500).nullable().optional(),
    color: z.string().trim().min(2).max(20).optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  })

export type ListCustomersInput = z.infer<typeof listCustomersSchema>
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
