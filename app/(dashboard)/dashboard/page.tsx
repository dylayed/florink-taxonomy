import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Accounts",
  description: "Manage linked account.",
}

export default async function AccountPage() {
  const subscriptionPlan = {
    name: "foo",
    description: "foobar",
    stripePriceId: "abc",
  }
  return (
    <DashboardShell>
      <DashboardHeader heading="Accounts" text="Manage accounts" />
      <div className="grid gap-10">
        <BillingForm
          subscriptionPlan={{
            ...subscriptionPlan,
            isCanceled: true,
          }}
        />
      </div>
    </DashboardShell>
  )
}
