import { ErrorState, LoadingState } from "../../components/ui/Feedback"
import Avatar from "../../components/ui/Avatar"
import Button from "../../components/ui/Button"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { dateLabel, money } from "../../lib/format"
import { useUiStore } from "../../stores/ui-store"
import { useArchiveCustomer, useCustomer } from "./customers.hooks"

const statusLabel = { PAID: "Pago", PARTIAL: "Parcial", OPEN: "Em aberto", RECEIVED: "Recebido" } as const

export default function CustomerPage() {
  const customerId = useUiStore((state) => state.customerId)
  const navigate = useUiStore((state) => state.navigate)
  const openSale = useUiStore((state) => state.openSale)
  const openPayment = useUiStore((state) => state.openPayment)
  const openCharge = useUiStore((state) => state.openCharge)
  const notify = useUiStore((state) => state.notify)
  const customerQuery = useCustomer(customerId)
  const archive = useArchiveCustomer()

  if (!customerId) return <ErrorState message="Selecione um cliente para continuar." onRetry={() => navigate("customers")} />
  if (customerQuery.isLoading) return <LoadingState label="Carregando cliente..." />
  if (customerQuery.isError) return <ErrorState message={errorMessage(customerQuery.error)} onRetry={() => customerQuery.refetch()} />

  const customer = customerQuery.data!.data

  async function archiveCustomer() {
    if (!window.confirm(`Deseja arquivar ${customer.name}?`)) return
    try {
      await archive.mutateAsync(customer.id)
      notify("Cliente arquivado com sucesso.")
      navigate("customers")
    } catch (caught) {
      notify(errorMessage(caught), true)
    }
  }

  return (
    <>
      <button className="back-link" onClick={() => navigate("customers")}><Icon name="back" size={18} />Voltar para clientes</button>
      <div className="customer-page-heading">
        <Avatar customer={customer} /><div><h1>{customer.name}</h1><p><Icon name="phone" size={15} />{customer.phone}</p></div>
        <span className={`status-tag ${customer.balance > 0 ? "owed" : "settled"}`}><span />{customer.balance > 0 ? "Em aberto" : "Em dia"}</span>
      </div>
      <div className="detail-grid">
        <div className="total-card customer-total">
          <div className="total-card-top"><span><Icon name="wallet" size={19} />Total em aberto</span></div>
          <div className="hero-amount">{money(customer.balance)}</div>
          <p>{customer.balance > 0 ? `${customer.openSales} ${customer.openSales === 1 ? "compra em aberto" : "compras em aberto"}` : "Tudo em dia! Este cliente não tem dívidas."}</p>
          <div className="card-decoration" aria-hidden="true" />
        </div>
        <div className="customer-actions">
          <Button onClick={() => openSale(customer.id)}><Icon name="plus" />Registrar novo fiado</Button>
          <Button variant="whatsapp" onClick={() => openCharge(customer.id)} disabled={customer.balance === 0}><Icon name="whatsapp" />Cobrar pelo WhatsApp</Button>
          <Button variant="secondary" onClick={() => openPayment(customer.id)} disabled={customer.balance === 0}><Icon name="download" />Registrar pagamento</Button>
        </div>
      </div>
      {customer.note && <div className="customer-note"><Icon name="receipt" size={17} /><span>{customer.note}</span></div>}
      <section className="panel history-panel">
        <div className="section-heading"><div><h2>Histórico de movimentações</h2><p>As compras e os pagamentos, tudo no mesmo lugar.</p></div><span className="count-badge">{customer.movements?.length ?? 0}</span></div>
        {customer.movements?.length ? customer.movements.map((movement) => (
          <div className="history-row" key={movement.id}>
            <span className={`activity-icon ${movement.type === "PAYMENT" ? "green" : "peach"}`}><Icon name={movement.type === "PAYMENT" ? "check" : "receipt"} size={20} /></span>
            <div><strong>{movement.description}</strong><small>{dateLabel(movement.occurredOn)} · {movement.type === "SALE" ? "Compra no fiado" : "Pagamento registrado"}</small></div>
            <strong className={movement.type === "PAYMENT" ? "positive-amount" : ""}>{movement.type === "PAYMENT" ? "− " : "+ "}{money(movement.amount)}</strong>
            <span className={`status-tag ${movement.status === "PAID" || movement.status === "RECEIVED" ? "settled" : "owed"}`}>{movement.status ? statusLabel[movement.status] : ""}</span>
          </div>
        )) : <div className="empty-state"><h3>Um novo começo por aqui.</h3><p>Este cliente ainda não tem movimentações.</p><Button onClick={() => openSale(customer.id)}><Icon name="plus" />Registrar primeiro fiado</Button></div>}
      </section>
      {customer.balance === 0 && <div className="danger-zone"><span>Não precisa mais deste cadastro?</span><button onClick={archiveCustomer} disabled={archive.isPending}>Arquivar cliente</button></div>}
    </>
  )
}
