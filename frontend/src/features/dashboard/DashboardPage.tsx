import Avatar from "../../components/ui/Avatar"
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { dateLabel, money } from "../../lib/format"
import { useUiStore } from "../../stores/ui-store"
import { useDashboard } from "./dashboard.hooks"

export default function DashboardPage() {
  const dashboard = useDashboard()
  const navigate = useUiStore((state) => state.navigate)
  const openCustomer = useUiStore((state) => state.openCustomer)
  const openSale = useUiStore((state) => state.openSale)
  const openCharge = useUiStore((state) => state.openCharge)

  if (dashboard.isLoading) return <LoadingState label="Preparando seu resumo..." />
  if (dashboard.isError) return <ErrorState message={errorMessage(dashboard.error)} onRetry={() => dashboard.refetch()} />

  const data = dashboard.data!.data
  const summary = data.summary

  return (
    <>
      <div className="page-heading">
        <div><div className="greeting-label">SEU COMÉRCIO EM DIA</div><h1>Olá, comerciante! <span className="greeting-dot" /></h1><p>Um resumo claro para começar o dia.</p></div>
        <div className="date-chip"><Icon name="calendar" size={17} />{new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</div>
      </div>

      <section className="overview-grid" aria-label="Resumo financeiro">
        <div className="total-card">
          <div className="total-card-top"><span><Icon name="wallet" size={19} />Total em fiado</span><span className="total-tag">EM ABERTO</span></div>
          <div className="hero-amount">{money(summary.totalReceivable)}</div>
          <p>O total que você tem a receber neste momento.</p>
          <div className="total-card-bottom"><span><span className="light-dot" />{summary.customersWithDebt} clientes com valores em aberto</span><button onClick={() => navigate("customers")}>Ver detalhes <Icon name="arrow" size={17} /></button></div>
          <div className="card-decoration" aria-hidden="true" />
        </div>
        <button className="quick-sale-card" onClick={() => openSale()}>
          <span className="quick-plus"><Icon name="plus" size={27} /></span><strong>Vendeu no fiado?</strong><span>Registre agora.<br />Leva só alguns segundos.</span><span className="quick-sale-action">Registrar fiado <Icon name="arrow" size={20} /></span>
        </button>
      </section>

      <section className="stats-grid" aria-label="Indicadores">
        <Stat icon="users" color="peach" label="Clientes com débito" value={String(summary.customersWithDebt).padStart(2, "0")} detail={`de ${summary.totalCustomers} cadastrados`} />
        <Stat icon="receipt" color="blue" label="Vendas em aberto" value={String(summary.openSales).padStart(2, "0")} detail="compras registradas" />
        <Stat icon="download" color="green" label="Recebidos recentemente" value={money(summary.recentReceived)} detail="nos últimos 7 dias" />
      </section>

      <div className="dashboard-columns">
        <section className="panel pending-panel">
          <div className="section-heading"><div><h2>Cobranças pendentes <span className="count-badge">{summary.customersWithDebt}</span></h2><p>Um lembrete gentil faz a diferença.</p></div><button className="text-button" onClick={() => navigate("customers")}>Ver todos <Icon name="arrow" size={15} /></button></div>
          <div className="table-heading"><span>CLIENTE</span><span>EM ABERTO</span><span>AÇÃO</span></div>
          {data.pendingCustomers.length ? data.pendingCustomers.map((customer) => (
            <div className="pending-row" key={customer.id}>
              <button className="customer-identity" onClick={() => openCustomer(customer.id)}><Avatar customer={customer} /><span><strong>{customer.name}</strong><small>Última compra: {dateLabel(customer.lastSaleOn)}</small></span></button>
              <strong className="row-amount">{money(customer.balance)}</strong>
              <button className="charge-button" onClick={() => openCharge(customer.id)}><Icon name="whatsapp" size={17} /><span>Cobrar</span></button>
            </div>
          )) : <EmptyState title="Tudo em dia!" description="Nenhum cliente com fiado em aberto." />}
        </section>

        <div className="right-column">
          <section className="panel activity-panel">
            <div className="section-heading"><div><h2>Últimas movimentações</h2><p>O que aconteceu por aqui.</p></div><span className="subtle-icon"><Icon name="clock" size={19} /></span></div>
            <div className="activity-list">
              {data.recentMovements.map((movement) => (
                <button className="activity-item" key={movement.id} onClick={() => movement.customer && openCustomer(movement.customer.id)}>
                  <span className={`activity-icon ${movement.type === "PAYMENT" ? "green" : "peach"}`}><Icon name={movement.type === "PAYMENT" ? "check" : "receipt"} size={17} /></span>
                  <div><strong>{movement.type === "PAYMENT" ? "Pagamento recebido" : "Fiado registrado"}</strong><span>{movement.customer?.name} · {dateLabel(movement.occurredOn)}</span></div>
                  <strong className={movement.type === "PAYMENT" ? "positive-amount" : ""}>{movement.type === "PAYMENT" ? "− " : "+ "}{money(movement.amount)}</strong>
                </button>
              ))}
            </div>
          </section>
          <section className="gentle-card"><span className="gentle-icon"><Icon name="shield" size={23} /></span><div><span className="eyebrow">DADOS SINCRONIZADOS</span><h3>Seu tempo vale muito.</h3><p>Menos contas no papel.<br />Mais atenção para seus clientes.</p></div><div className="gentle-line" /></section>
        </div>
      </div>
    </>
  )
}

function Stat({ icon, color, label, value, detail }: { icon: "users" | "receipt" | "download"; color: string; label: string; value: string; detail: string }) {
  return <div className="stat-card"><span className={`stat-icon ${color}`}><Icon name={icon} size={22} /></span><div><span>{label}</span><strong>{value} <small>{detail}</small></strong></div></div>
}
