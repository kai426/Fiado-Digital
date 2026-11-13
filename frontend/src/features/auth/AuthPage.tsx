import { useState, type FormEvent } from "react"

import Button from "../../components/ui/Button"
import Field from "../../components/ui/Field"
import Icon from "../../components/ui/Icon"
import { errorMessage } from "../../lib/api-client"
import { useAuthStore } from "../../stores/auth-store"
import { useLogin, useRegister } from "./auth.hooks"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const setSession = useAuthStore((state) => state.setSession)
  const login = useLogin()
  const register = useRegister()
  const pending = login.isPending || register.isPending

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    const form = new FormData(event.currentTarget)

    try {
      const result =
        mode === "login"
          ? await login.mutateAsync({
              email,
              password,
            })
          : await register.mutateAsync({
              name: String(form.get("name")),
              email,
              password,
              store: {
                name: String(form.get("storeName")),
                city: String(form.get("city") || "") || undefined,
                state: String(form.get("state") || "") || undefined,
              },
            })
      setSession(result.data)
    } catch (caught) {
      setError(errorMessage(caught))
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-intro">
        <div className="welcome-brand">
          <span className="brand-icon"><Icon name="receipt" size={29} /></span>
          <span>fiado<span className="brand-dot">.</span></span>
        </div>
        <div>
          <span className="eyebrow">SEU CADERNO, AGORA DIGITAL</span>
          <h1>Menos papel.<br />Mais tranquilidade<span className="orange-text">.</span></h1>
          <p>Organize clientes, vendas e pagamentos em um único lugar, com seus dados seguros na nuvem.</p>
        </div>
        <div className="auth-benefits">
          <span><Icon name="check" /> Saldos sempre atualizados</span>
          <span><Icon name="whatsapp" /> Cobrança pelo WhatsApp</span>
          <span><Icon name="shield" /> Dados separados por comércio</span>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <form className="auth-panel" onSubmit={submit}>
          <div className="auth-heading">
            <span className="greeting-label">BEM-VINDO</span>
            <h2>{mode === "login" ? "Entre no seu comércio" : "Crie seu espaço"}</h2>
            <p>{mode === "login" ? "Continue de onde parou." : "Comece a organizar seu fiado hoje."}</p>
          </div>

          {mode === "register" && (
            <>
              <Field label="Seu nome"><input name="name" required minLength={3} autoComplete="name" /></Field>
              <Field label="Nome do comércio"><input name="storeName" required minLength={2} /></Field>
              <div className="auth-inline-fields">
                <Field label="Cidade"><input name="city" placeholder="Manaus" /></Field>
                <Field label="UF"><input name="state" placeholder="AM" maxLength={2} /></Field>
              </div>
            </>
          )}

          <Field label="E-mail">
            <input name="email" type="email" required autoComplete="email" placeholder="voce@comercio.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Senha">
            <input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} />
          </Field>

          {error && <div className="form-error" role="alert">{error}</div>}
          <Button type="submit" className="full-width" disabled={pending}>
            {pending ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar minha conta"}
            {!pending && <Icon name="arrow" size={18} />}
          </Button>

          {mode === "login" && (
            <button
              type="button"
              className="demo-access"
              onClick={() => {
                setEmail("demo@fiadodigital.com.br")
                setPassword("Demo@123")
              }}
            >
              Usar acesso de demonstração
            </button>
          )}

          <div className="auth-switch">
            {mode === "login" ? "Ainda não tem conta?" : "Já possui uma conta?"}
            <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setPassword("") }}>
              {mode === "login" ? "Cadastre-se" : "Entrar"}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
