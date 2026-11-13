import type { Request, Response } from "express"

import { loginSchema, registerSchema } from "./auth.schemas.js"
import { AuthService } from "./auth.service.js"

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  register = async (request: Request, response: Response): Promise<void> => {
    const input = registerSchema.parse(request.body)
    const session = await this.service.register(input)
    response.status(201).json({ data: session })
  }

  login = async (request: Request, response: Response): Promise<void> => {
    const input = loginSchema.parse(request.body)
    const session = await this.service.login(input)
    response.json({ data: session })
  }

  me = async (request: Request, response: Response): Promise<void> => {
    const user = await this.service.me(request.auth.userId)
    response.json({ data: user })
  }
}
