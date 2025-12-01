import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="ml-64">
        <AdminTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
