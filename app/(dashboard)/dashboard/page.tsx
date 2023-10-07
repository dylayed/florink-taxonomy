import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Accounts" text="Manage accounts" />
    </DashboardShell>
  )
}
