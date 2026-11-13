import AppShell from "../components/layout/AppShell"
import { ErrorState, LoadingState } from "../components/ui/Feedback"
import AuthPage from "../features/auth/AuthPage"
import { useCurrentUser } from "../features/auth/auth.hooks"
import AddCustomerPage from "../features/customers/AddCustomerPage"
import CustomerPage from "../features/customers/CustomerPage"
import CustomersPage from "../features/customers/CustomersPage"
import DashboardPage from "../features/dashboard/DashboardPage"
import NewSalePage from "../features/movements/NewSalePage"
import PaymentPage from "../features/movements/PaymentPage"
import SettingsPage from "../features/store/SettingsPage"
import { errorMessage } from "../lib/api-client"
import { useAuthStore } from "../stores/auth-store"
import { useUiStore } from "../stores/ui-store"

export default function App() {
  const session = useAuthStore((state) => state.session)
  return session ? <AuthenticatedApp /> : <AuthPage />
}

function AuthenticatedApp() {
  const currentUser = useCurrentUser()
  const page = useUiStore((state) => state.page)

  if (currentUser.isLoading) {
    return <div className="startup-screen"><LoadingState label="Abrindo seu comércio..." /></div>
  }
  if (currentUser.isError) {
    return <div className="startup-screen"><ErrorState message={errorMessage(currentUser.error)} onRetry={() => currentUser.refetch()} /></div>
  }

  return (
    <AppShell>
      {page === "dashboard" && <DashboardPage />}
      {page === "customers" && <CustomersPage />}
      {page === "add-customer" && <AddCustomerPage />}
      {page === "customer" && <CustomerPage />}
      {page === "new-sale" && <NewSalePage />}
      {page === "payment" && <PaymentPage />}
      {page === "settings" && <SettingsPage />}
    </AppShell>
  )
}
