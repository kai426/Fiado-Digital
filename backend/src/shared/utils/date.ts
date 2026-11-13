import { AppError } from "../errors/app-error.js"

export function parseDateOnly(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`)

  if (Number.isNaN(date.getTime())) {
    throw new AppError("Data inválida", 422, "INVALID_DATE")
  }

  return date
}

export function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10)
}
