import { compare, hash } from "bcryptjs"
import jwt, { type SignOptions } from "jsonwebtoken"

import { env } from "../../config/env.js"
import { AppError } from "../../shared/errors/app-error.js"
import type { LoginInput, RegisterInput } from "./auth.schemas.js"
import { AuthRepository } from "./auth.repository.js"

export class AuthService {
  constructor(private readonly repository = new AuthRepository()) {}

  async register(input: RegisterInput) {
    const existingUser = await this.repository.findByEmail(input.email)

    if (existingUser) {
      throw new AppError("Este e-mail já está cadastrado", 409, "EMAIL_IN_USE")
    }

    const passwordHash = await hash(input.password, 12)
    const user = await this.repository.create(input, passwordHash)

    if (!user.store) {
      throw new AppError("Não foi possível criar o comércio", 500)
    }

    return this.createSession(user)
  }

  async login(input: LoginInput) {
    const user = await this.repository.findByEmail(input.email)

    if (!user || !(await compare(input.password, user.passwordHash))) {
      throw new AppError("E-mail ou senha incorretos", 401, "INVALID_CREDENTIALS")
    }

    if (!user.store) {
      throw new AppError("Usuário sem comércio associado", 403, "STORE_REQUIRED")
    }

    return this.createSession(user)
  }

  async me(userId: string) {
    const user = await this.repository.findById(userId)

    if (!user?.store) {
      throw new AppError("Usuário não encontrado", 404, "USER_NOT_FOUND")
    }

    return this.serializeUser(user)
  }

  private createSession(user: Awaited<ReturnType<AuthRepository["findById"]>>) {
    if (!user?.store) {
      throw new AppError("Usuário sem comércio associado", 403, "STORE_REQUIRED")
    }

    const token = jwt.sign({ storeId: user.store.id }, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    })

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN,
      ...this.serializeUser(user),
    }
  }

  private serializeUser(
    user: NonNullable<Awaited<ReturnType<AuthRepository["findById"]>>>,
  ) {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      store: user.store,
    }
  }
}
