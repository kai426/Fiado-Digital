import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

import { env } from "../../../config/env.js"
import { AppError } from "../../errors/app-error.js"

type AccessTokenPayload = jwt.JwtPayload & {
  sub: string
  storeId: string
}

export function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authorization = request.headers.authorization

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError("Token de acesso não informado", 401, "UNAUTHORIZED")
  }

  const token = authorization.slice(7)

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload

    if (!payload.sub || !payload.storeId) {
      throw new Error("Payload incompleto")
    }

    request.auth = {
      userId: payload.sub,
      storeId: payload.storeId,
    }
    next()
  } catch {
    throw new AppError("Token inválido ou expirado", 401, "INVALID_TOKEN")
  }
}
