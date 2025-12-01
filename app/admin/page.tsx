"use client"

import { useEffect, useState } from "react"
import { listRepairTickets } from "@/services/repairs"
import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { StatusOverview } from "@/components/admin/dashboard/status-overview"
import { UpcomingAppointments } from "@/components/admin/dashboard/upcoming-appointments"
import { RecentTickets } from "@/components/admin/dashboard/recent-tickets"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { ErrorMessage } from "@/components/admin/error-message"
import type { RepairTicket } from "@/types/repairs"

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listRepairTickets()
        setTickets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento dashboard..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Panoramica delle attività del negozio</p>
      </div>

      <StatsCards tickets={tickets} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTickets tickets={tickets} />
        </div>
        <div className="space-y-6">
          <StatusOverview tickets={tickets} />
          <UpcomingAppointments tickets={tickets} />
        </div>
      </div>
    </div>
  )
}
