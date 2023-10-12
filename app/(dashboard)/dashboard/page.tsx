import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { LinkAccountbutton } from "@/components/link-account-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Accounts",
  description: "Manage linked account.",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const posts = []
  return (
    <DashboardShell>
      <DashboardHeader heading="Accounts" text="Link and manage accounts.">
        <LinkAccountbutton />
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post, idx) => (
              <PostItem key={idx} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="accounts" />
            <EmptyPlaceholder.Title>No linked accounts</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You haven&apos;t linked any accounts yet.
            </EmptyPlaceholder.Description>
            <LinkAccountbutton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
