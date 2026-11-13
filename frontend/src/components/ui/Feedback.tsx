import type { ReactNode } from "react"

import Button from "./Button"
import Icon from "./Icon"

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return <div className="empty-state app-loading"><span className="loading-spinner" /> <p>{label}</p></div>
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name="close" size={27} /></span>
      <h3>Não foi possível carregar</h3>
      <p>{message}</p>
      {onRetry && <Button onClick={onRetry}>Tentar novamente</Button>}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name="users" size={30} /></span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}
