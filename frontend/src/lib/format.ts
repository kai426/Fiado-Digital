export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export const dateLabel = (date: string | null) => {
  if (!date) return "Sem compras"
  const today = new Date()
  const todayValue = localDate(today)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date === todayValue) return "Hoje"
  if (date === localDate(yesterday)) return "Ontem"
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")
}

export const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

export function parseAmount(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".")
  return Number(normalized)
}
