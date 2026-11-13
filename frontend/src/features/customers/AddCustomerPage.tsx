import { useState, type FormEvent } from "react"

import Button from "../../components/ui/Button"
import Field from "../../components/ui/Field"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { useUiStore } from "../../stores/ui-store"
import { useCreateCustomer } from "./customers.hooks"

export default function AddCustomerPage() {
  const createCustomer = useCreateCustomer()
  const navigate = useUiStore((state) => state.navigate)
  const openCustomer = useUiStore((state) => state.openCustomer)
  const notify = useUiStore((state) => state.notify)
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const form = new FormData(event.currentTarget)
    try {
      const result = await createCustomer.mutateAsync({
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        note: String(form.get("note") || "") || undefined,
      })
      notify("Cliente cadastrado com sucesso!")
      openCustomer(result.data.id)
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }

  return (
    <div className="form-page">
      <button className="back-link" onClick={() => navigate("customers")}><Icon name="back" size={18} />Voltar para clientes</button>
      <div className="page-heading"><div><span className="greeting-label">MAIS PROXIMIDADE, MENOS PAPEL</span><h1>Cadastrar cliente</h1><p>Só o essencial para começar a vender no fiado.</p></div></div>
      <form className="panel form-panel" onSubmit={submit}>
        <span className="form-section-label"><Icon name="users" /> DADOS DO CLIENTE</span>
        <Field label="Nome completo"><input name="name" placeholder="Ex.: Maria Silva" autoComplete="name" required autoFocus maxLength={100} /></Field>
        <Field label="Telefone / WhatsApp"><input name="phone" type="tel" placeholder="(92) 99999-9999" autoComplete="tel" required maxLength={18} /><small>Inclua o DDD para enviar cobranças pelo WhatsApp.</small></Field>
        <Field label="Observação" hint="opcional"><textarea name="note" placeholder="Algo que você gostaria de lembrar sobre o cliente" rows={3} maxLength={500} /></Field>
        {error && <div className="form-error" role="alert">{error}</div>}
        <Button type="submit" className="full-width" disabled={createCustomer.isPending}><Icon name="check" />{createCustomer.isPending ? "Salvando..." : "Salvar cliente"}</Button>
        <p className="form-safe-note"><Icon name="shield" size={15} />As informações ficam sincronizadas com sua conta.</p>
      </form>
    </div>
  )
}
