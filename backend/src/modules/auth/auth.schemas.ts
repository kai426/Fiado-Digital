import { z } from "zod"

const email = z.string().trim().email().toLowerCase()

export const registerSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email,
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Za-z]/, "A senha deve conter uma letra")
    .regex(/[0-9]/, "A senha deve conter um número"),
  store: z.object({
    name: z.string().trim().min(2).max(120),
    city: z.string().trim().min(2).max(100).optional(),
    state: z.string().trim().length(2).toUpperCase().optional(),
  }),
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
