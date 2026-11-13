import { useState, type FormEvent } from "react"

import { queryClient } from "../../app/query-client"
import Button from "../../components/ui/Button"
import Field from "../../components/ui/Field"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { useAuthStore } from "../../stores/auth-store"
import { useUiStore } from "../../stores/ui-store"
import { useUpdateStore } from "./store.hooks"

export default function SettingsPage() {
  const session = useAuthStore((state) => state.session)!
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useUiStore((state) => state.navigate)
  const notify = useUiStore((state) => state.notify)
  const update = useUpdateStore()
  const [error, setError] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("")
    const form = new FormData(event.currentTarget)
    try {
      await update.mutateAsync({
        name: String(form.get("name")),
        city: String(form.get("city") || "") || null,
        state: String(form.get("state") || "") || null,
      })
      notify("Dados do comércio atualizados.")
      navigate("dashboard")
    } catch (caught) { setError(errorMessage(caught)) }
  }

  function logout() {
    queryClient.clear()
    clearSession()
    navigate("dashboard")
  }

  return (
    <div className="form-page settings-page">
      <button className="back-link" onClick={() => navigate("dashboard")}><Icon name="back" size={18} />Voltar ao início</button>
      <div className="page-heading"><div><span className="greeting-label">SEU ESPAÇO</span><h1>Meu comércio</h1><p>Dados usados para identificar sua conta e suas cobranças.</p></div></div>
      <form className="panel form-panel" onSubmit={submit}>
        <span className="form-section-label"><Icon name="store" /> DADOS DO COMÉRCIO</span>
        <Field label="Nome do comércio"><input name="name" defaultValue={session.store.name} required minLength={2} maxLength={120} /></Field>
        <div className="auth-inline-fields"><Field label="Cidade"><input name="city" defaultValue={session.store.city ?? ""} /></Field><Field label="UF"><input name="state" defaultValue={session.store.state ?? ""} maxLength={2} /></Field></div>
        <div className="account-card"><span className="profile-avatar">{session.user.name.slice(0, 2).toUpperCase()}</span><div><strong>{session.user.name}</strong><span>{session.user.email}</span></div></div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <Button type="submit" className="full-width" disabled={update.isPending}><Icon name="check" />{update.isPending ? "Salvando..." : "Salvar alterações"}</Button>
      </form>
      <button className="logout-card" onClick={logout}><Icon name="logout" /><span><strong>Sair da conta</strong><small>Você precisará entrar novamente neste dispositivo.</small></span><Icon name="chevron" size={16} /></button>
    </div>
  )
}
