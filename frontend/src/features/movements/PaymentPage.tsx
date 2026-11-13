import { useState, type FormEvent } from "react"

import Avatar from "../../components/ui/Avatar"
import Button from "../../components/ui/Button"
import { ErrorState, LoadingState } from "../../components/ui/Feedback"
import Field from "../../components/ui/Field"
import Icon from "../../components/ui/Icon"
import { useCustomer } from "../customers/customers.hooks"
import { errorMessage } from "../../lib/api-client"
import { money, parseAmount } from "../../lib/format"
import { useUiStore } from "../../stores/ui-store"
import { useCreatePayment } from "./movements.hooks"

export default function PaymentPage() {
  const customerId = useUiStore((state) => state.customerId)
  const openCustomer = useUiStore((state) => state.openCustomer)
  const notify = useUiStore((state) => state.notify)
  const customerQuery = useCustomer(customerId)
  const payment = useCreatePayment()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")

  if (!customerId) return <ErrorState message="Selecione um cliente para registrar o pagamento." />
  if (customerQuery.isLoading) return <LoadingState label="Carregando saldo..." />
  if (customerQuery.isError) return <ErrorState message={errorMessage(customerQuery.error)} />
  const customer = customerQuery.data!.data
  const numericAmount = parseAmount(amount)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("")
    try {
      await payment.mutateAsync({ customerId: customer.id, input: { amount: numericAmount, description: description || undefined } })
      notify("Pagamento registrado com sucesso.")
      openCustomer(customer.id)
    } catch (caught) { setError(errorMessage(caught)) }
  }

  return (
    <div className="form-page">
      <button className="back-link" onClick={() => openCustomer(customer.id)}><Icon name="back" size={18} />Voltar para cliente</button>
      <div className="page-heading"><div><span className="greeting-label">UM PAGAMENTO, MAIS TRANQUILIDADE</span><h1>Registrar pagamento</h1><p>Recebeu uma parte ou o total? Registre aqui.</p></div></div>
      <form className="panel form-panel" onSubmit={submit}>
        <div className="payment-customer"><Avatar customer={customer} /><div><strong>{customer.name}</strong><span>Total em aberto: <b>{money(customer.balance)}</b></span></div></div>
        <Field label="Valor recebido"><div className="money-input"><span>R$</span><input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" autoFocus required maxLength={12} /></div></Field>
        <button type="button" className="pay-all" onClick={() => setAmount(customer.balance.toFixed(2).replace(".", ","))}><Icon name="check" size={16} />Receber o valor total de {money(customer.balance)}</button>
        <Field label="Observação" hint="opcional"><textarea rows={3} placeholder="Ex.: Pagamento em dinheiro" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={150} /></Field>
        <div className="sale-summary"><div><span>Saldo após o pagamento</span><strong>{money(Math.max(0, customer.balance - (Number.isFinite(numericAmount) ? numericAmount : 0)))}</strong></div></div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <Button type="submit" className="full-width" disabled={payment.isPending}><Icon name="check" />{payment.isPending ? "Confirmando..." : "Confirmar pagamento"}</Button>
        <p className="form-safe-note">O registro não realiza uma transferência de dinheiro.</p>
      </form>
    </div>
  )
}
