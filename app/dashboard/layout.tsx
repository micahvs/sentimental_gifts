import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/actions"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login?next=/dashboard")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </SidebarProvider>
  )
}
