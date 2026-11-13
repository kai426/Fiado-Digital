import type { ErrorRequestHandler } from "express"
import { ZodError } from "zod"

import { env } from "../../../config/env.js"
import { logger } from "../../../lib/logger.js"
import { AppError } from "../../errors/app-error.js"

type DatabaseError = Error & { code?: string; meta?: unknown }

export const errorHandler: ErrorRequestHandler = (
  error: DatabaseError,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    })
    return
  }

  if (error instanceof ZodError) {
    response.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Os dados enviados são inválidos",
        details: error.flatten(),
      },
    })
    return
  }

  if (error.code === "P2002") {
    response.status(409).json({
      error: {
        code: "CONFLICT",
        message: "Já existe um registro com estes dados",
        details: error.meta,
      },
    })
    return
  }

  logger.error({ err: error }, "Erro não tratado")
  response.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ocorreu um erro interno no servidor",
      ...(env.NODE_ENV === "development" && { details: error.message }),
    },
  })
}
