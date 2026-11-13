import { z } from "zod"

export const updateStoreSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    city: z.string().trim().min(2).max(100).nullable().optional(),
    state: z.string().trim().length(2).toUpperCase().nullable().optional(),
  })
  .refine((input) => Object.keys(input).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  })

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>
