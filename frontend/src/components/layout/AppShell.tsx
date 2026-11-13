import { useEffect, useState, type ReactNode } from "react"

import { useCustomer } from "../../features/customers/customers.hooks"
import { money } from "../../lib/format"
import { useAuthStore } from "../../stores/auth-store"
import { type AppPage, useUiStore } from "../../stores/ui-store"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import Field from "../ui/Field"
import Icon, { type IconName } from "../ui/Icon"

const navItems: Array<{ page: AppPage; label: string; icon: IconName }> = [
  { page: "dashboard", label: "Início", icon: "home" },
  { page: "customers", label: "Clientes", icon: "users" },
  { page: "new-sale", label: "Novo fiado", icon: "plus" },
]

const pageTitles: Record<AppPage, string> = {
  dashboard: "Visão geral",
  customers: "Seus clientes",
  "add-customer": "Cadastrar cliente",
  customer: "Detalhes do cliente",
  "new-sale": "Registrar fiado",
  payment: "Registrar pagamento",
  settings: "Meu comércio",
}

function currentNav(page: AppPage) {
  if (["customer", "add-customer", "payment"].includes(page)) return "customers"
  return page
}

export default function AppShell({ children }: { children: ReactNode }) {
  const page = useUiStore((state) => state.page)
  const navigate = useUiStore((state) => state.navigate)
  const openSale = useUiStore((state) => state.openSale)
  const store = useAuthStore((state) => state.session!.store)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("dashboard")} aria-label="Fiado Digital, página inicial">
          <span className="brand-icon"><Icon name="receipt" size={27} /></span>
          <span>fiado<span className="brand-dot">.</span><small>GERENCIADOR DIGITAL</small></span>
        </button>
        <div className="store-card">
          <span className="store-icon"><Icon name="store" size={21} /></span>
          <div><strong>{store.name}</strong><span>{[store.city, store.state].filter(Boolean).join(", ") || "Meu comércio"}</span></div>
          <span className="online-dot" />
        </div>
        <span className="nav-label">SEU DIA A DIA</span>
        <nav className="side-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <button key={item.page} className={currentNav(page) === item.page ? "active" : ""} onClick={() => item.page === "new-sale" ? openSale() : navigate(item.page)}>
              <Icon name={item.icon} /><span>{item.label}</span>
              {item.page === "new-sale" && <span className="nav-shortcut">+</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Icon name="shield" size={23} /></span>
            <strong>Seus dados estão sincronizados.</strong>
            <p>Acesse seu comércio com segurança em qualquer dispositivo.</p>
            <span>SIMPLES. SEGURO. DIGITAL.</span>
          </div>
          <button className="merchant-profile" onClick={() => navigate("settings")}>
            <span className="profile-avatar">{store.name.slice(0, 2).toUpperCase()}</span>
            <span><strong>Meu comércio</strong><small>Conta do comerciante</small></span>
            <Icon name="settings" size={18} />
          </button>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><Icon name="store" size={17} /><span>Meu comércio</span><Icon name="chevron" size={12} /><strong>{pageTitles[page]}</strong></div>
          <button className="mobile-brand" onClick={() => navigate("dashboard")}><span className="brand-icon"><Icon name="receipt" size={21} /></span>fiado<span className="brand-dot">.</span></button>
          <div className="topbar-actions">
            <span className="local-badge"><span className="online-dot" /> Dados sincronizados</span>
            <button className="top-profile" aria-label="Configurações" onClick={() => navigate("settings")}>{store.name.slice(0, 2).toUpperCase()}</button>
          </div>
        </header>
        <main className={`main-content ${page !== "dashboard" ? "inner-content" : ""}`}>{children}</main>
      </div>

      <nav className="bottom-nav" aria-label="Navegação móvel">
        {navItems.map((item) => (
          <button key={item.page} className={`${currentNav(page) === item.page ? "active" : ""} ${item.page === "new-sale" ? "new-sale-nav" : ""}`} onClick={() => item.page === "new-sale" ? openSale() : navigate(item.page)}>
            <span><Icon name={item.icon} size={22} /></span>{item.label}
          </button>
        ))}
      </nav>
      <ChargeModal />
      <Toast />
    </div>
  )
}

function ChargeModal() {
  const customerId = useUiStore((state) => state.chargeCustomerId)
  const close = useUiStore((state) => state.closeCharge)
  const notify = useUiStore((state) => state.notify)
  const store = useAuthStore((state) => state.session!.store)
  const customerQuery = useCustomer(customerId)
  const customer = customerQuery.data?.data
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!customer) return
    setMessage(`Olá, ${customer.name.split(" ")[0]}! Tudo bem? Passando para lembrar que ficou um valor de ${money(customer.balance)} em aberto referente às suas compras no ${store.name}. Quando puder, entre em contato para combinarmos o pagamento. Obrigado!`)
  }, [customer, store.name])

  if (!customerId) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="charge-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close icon-button" aria-label="Fechar" onClick={close}><Icon name="close" /></button>
        <span className="modal-symbol green"><Icon name="whatsapp" size={29} /></span>
        <h2 id="charge-title">Enviar cobrança</h2>
        <p>Um lembrete gentil, direto no WhatsApp.</p>
        {customer ? (
          <>
            <div className="charge-summary">
              <div className="customer-identity"><Avatar customer={customer} small /><span><strong>{customer.name}</strong><small>{customer.phone}</small></span></div>
              <div><span>Valor em aberto</span><strong>{money(customer.balance)}</strong></div>
            </div>
            <Field label="Mensagem sugerida" hint="você pode editar"><textarea rows={7} value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Button variant="whatsapp" className="full-width" disabled={!message.trim()} onClick={() => {
              window.open(`https://wa.me/55${customer.phoneDigits}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
              close(); notify("Mensagem pronta para envio no WhatsApp.")
            }}><Icon name="whatsapp" /> Enviar pelo WhatsApp <Icon name="arrow" size={17} /></Button>
          </>
        ) : <div className="app-loading"><span className="loading-spinner" /></div>}
      </div>
    </div>
  )
}

function Toast() {
  const toast = useUiStore((state) => state.toast)
  const clear = useUiStore((state) => state.clearToast)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(clear, 4500)
    return () => window.clearTimeout(timer)
  }, [toast, clear])

  if (!toast) return null
  return (
    <div className={`toast ${toast.error ? "error-toast" : ""}`} role="status">
      <span><Icon name={toast.error ? "close" : "check"} size={19} /></span>{toast.message}
      <button aria-label="Fechar mensagem" onClick={clear}><Icon name="close" size={16} /></button>
    </div>
  )
}
