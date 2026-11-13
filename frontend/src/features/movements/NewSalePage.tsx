import { useMemo, useState, type FormEvent } from "react"

import Avatar from "../../components/ui/Avatar"
import Button from "../../components/ui/Button"
import Field from "../../components/ui/Field"
import Icon from "../../components/ui/Icon"
import { useCustomers } from "../customers/customers.hooks"
import { errorMessage } from "../../lib/api-client"
import { localDate, money, parseAmount } from "../../lib/format"
import { useUiStore } from "../../stores/ui-store"
import { useCreateSale } from "./movements.hooks"

export default function NewSalePage() {
  const initialCustomerId = useUiStore((state) => state.customerId)
  const navigate = useUiStore((state) => state.navigate)
  const openCustomer = useUiStore((state) => state.openCustomer)
  const notify = useUiStore((state) => state.notify)
  const [customerId, setCustomerId] = useState(initialCustomerId ?? "")
  const [query, setQuery] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(localDate())
  const [error, setError] = useState("")
  const customers = useCustomers({ limit: 100 })
  const createSale = useCreateSale()
  const items = customers.data?.data ?? []
  const selected = items.find((customer) => customer.id === customerId)
  const filtered = useMemo(() => items.filter((customer) => customer.name.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))).slice(0, query ? 8 : 5), [items, query])
  const numericAmount = parseAmount(amount)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    if (!customerId) return setError("Selecione um cliente para registrar o fiado.")
    try {
      await createSale.mutateAsync({ customerId, input: { amount: numericAmount, description: description || undefined, occurredOn: date } })
      notify("Fiado registrado com sucesso!")
      openCustomer(customerId)
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }

  return (
    <div className="form-page">
      <button className="back-link" onClick={() => initialCustomerId ? openCustomer(initialCustomerId) : navigate("dashboard")}><Icon name="back" size={18} />Voltar</button>
      <div className="page-heading"><div><span className="greeting-label">RÁPIDO, COMO O ATENDIMENTO NO BALCÃO</span><h1>Novo fiado</h1><p>Registre a compra. A gente faz as contas.</p></div><span className="page-icon peach"><Icon name="receipt" size={27} /></span></div>
      <form className="panel form-panel" onSubmit={submit}>
        <Field label="Cliente">
          <div className="search-field client-picker"><Icon name="search" /><input placeholder="Selecione ou busque um cliente..." value={selected ? selected.name : query} onChange={(event) => { setCustomerId(""); setQuery(event.target.value) }} />{selected && <button type="button" aria-label="Trocar cliente" onClick={() => { setCustomerId(""); setQuery("") }}><Icon name="close" size={16} /></button>}</div>
        </Field>
        {!selected && <div className="customer-options">{filtered.map((customer) => <button type="button" key={customer.id} onClick={() => { setCustomerId(customer.id); setQuery("") }}><Avatar customer={customer} small /><span>{customer.name}</span><small>{money(customer.balance)}</small><Icon name="chevron" size={14} /></button>)}</div>}
        <Field label="Valor"><div className="money-input"><span>R$</span><input inputMode="decimal" placeholder="0,00" value={amount} onChange={(event) => setAmount(event.target.value)} required maxLength={12} /></div></Field>
        <Field label="Descrição da compra" hint="opcional"><input placeholder="Ex.: Mercado e bebidas" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={150} /></Field>
        <div className="description-chips">{["Compras do dia", "Mercado", "Alimentos", "Bebidas"].map((item) => <button type="button" key={item} className={description === item ? "selected" : ""} onClick={() => setDescription(item)}>{item}</button>)}</div>
        <Field label="Data da compra"><input type="date" value={date} onChange={(event) => setDate(event.target.value)} max={localDate()} required /></Field>
        {selected && <div className="sale-summary"><span className="form-section-label">RESUMO DO FIADO</span><div><span>Cliente</span><strong>{selected.name}</strong></div><div><span>Valor da compra</span><strong>{money(Number.isFinite(numericAmount) ? numericAmount : 0)}</strong></div><div className="summary-total"><span>Total atualizado</span><strong>{money(selected.balance + (Number.isFinite(numericAmount) ? numericAmount : 0))}</strong></div></div>}
        {error && <div className="form-error" role="alert">{error}</div>}
        <Button type="submit" className="full-width" disabled={createSale.isPending}><Icon name="plus" />{createSale.isPending ? "Registrando..." : "Registrar fiado"}</Button>
        <p className="form-safe-note"><Icon name="shield" size={15} />Saldo atualizado e sincronizado automaticamente.</p>
      </form>
    </div>
  )
}
