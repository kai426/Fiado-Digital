import { useDeferredValue, useState } from "react"

import Avatar from "../../components/ui/Avatar"
import Button from "../../components/ui/Button"
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Feedback"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { dateLabel, money } from "../../lib/format"
import { useUiStore } from "../../stores/ui-store"
import { useCustomers } from "./customers.hooks"

type Filter = "all" | "debt" | "clear"

export default function CustomersPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [page, setPage] = useState(1)
  const deferredQuery = useDeferredValue(query)
  const customers = useCustomers({ q: deferredQuery, status: filter, page, limit: 15 })
  const navigate = useUiStore((state) => state.navigate)
  const openCustomer = useUiStore((state) => state.openCustomer)

  return (
    <>
      <div className="page-heading">
        <div><span className="greeting-label">QUEM COMPRA COM VOCÊ</span><h1>Clientes {customers.data && <span className="heading-count">{customers.data.meta.total}</span>}</h1><p>Encontre um cliente e consulte o fiado em um toque.</p></div>
        <Button onClick={() => navigate("add-customer")}><Icon name="plus" /> Cadastrar cliente</Button>
      </div>
      <section className="panel customers-panel">
        <div className="customer-tools">
          <div className="search-field"><Icon name="search" /><input aria-label="Buscar cliente" placeholder="Buscar por nome ou telefone..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} />{query && <button aria-label="Limpar busca" onClick={() => setQuery("")}><Icon name="close" size={16} /></button>}</div>
          <div className="filter-tabs" aria-label="Filtrar clientes">
            {([{ id: "all", label: "Todos" }, { id: "debt", label: "Com débito" }, { id: "clear", label: "Em dia" }] as const).map((item) => <button key={item.id} className={filter === item.id ? "active" : ""} onClick={() => { setFilter(item.id); setPage(1) }} aria-pressed={filter === item.id}>{item.label}</button>)}
          </div>
        </div>
        <div className="client-table-heading"><span>CLIENTE / TELEFONE</span><span>ÚLTIMA COMPRA</span><span>TOTAL EM ABERTO</span><span>SITUAÇÃO</span></div>
        {customers.isLoading ? <LoadingState label="Buscando clientes..." /> : customers.isError ? <ErrorState message={errorMessage(customers.error)} onRetry={() => customers.refetch()} /> : customers.data!.data.length ? customers.data!.data.map((customer) => (
          <button className="client-list-row" key={customer.id} onClick={() => openCustomer(customer.id)}>
            <span className="customer-identity"><Avatar customer={customer} /><span><strong>{customer.name}</strong><small>{customer.phone}</small></span></span>
            <span className="client-last-date">{dateLabel(customer.lastSaleOn)}</span>
            <strong className="client-balance">{money(customer.balance)}<small className="mobile-only">Última compra: {dateLabel(customer.lastSaleOn)}</small></strong>
            <span className={`status-tag ${customer.balance > 0 ? "owed" : "settled"}`}><span />{customer.balance > 0 ? "Em aberto" : "Em dia"}</span>
            <Icon name="chevron" size={16} />
          </button>
        )) : <EmptyState title="Nenhum cliente encontrado" description={query ? "Tente buscar por outro nome ou telefone." : "Cadastre seu primeiro cliente para começar."} action={!query && <Button onClick={() => navigate("add-customer")}><Icon name="plus" /> Cadastrar cliente</Button>} />}
        {customers.data && customers.data.meta.totalPages > 1 && (
          <div className="pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}><Icon name="back" size={16} /> Anterior</button><span>Página {page} de {customers.data.meta.totalPages}</span><button disabled={page === customers.data.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Próxima <Icon name="arrow" size={16} /></button></div>
        )}
      </section>
    </>
  )
}
