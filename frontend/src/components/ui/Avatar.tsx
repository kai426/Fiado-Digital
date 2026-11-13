import type { Customer } from "../../types/api"

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")

export default function Avatar({
  customer,
  small = false,
}: {
  customer: Pick<Customer, "name" | "color">
  small?: boolean
}) {
  return (
    <span className={`avatar ${customer.color} ${small ? "small" : ""}`}>
      {initials(customer.name)}
    </span>
  )
}
