"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TicketsFilters, type TicketsFilters as FiltersType } from "@/components/admin/tickets/tickets-filters"
import { TicketsTable } from "@/components/admin/tickets/tickets-table"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { ErrorMessage } from "@/components/admin/error-message"
import { listRepairTickets } from "@/services/repairs"
import { listStaff } from "@/services/staff"
import { Plus } from "lucide-react"
import type { RepairTicket, StaffMember } from "@/types/repairs"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    status: "all",
    technicianId: "all",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketsData, staffData] = await Promise.all([listRepairTickets(), listStaff()])
        setTickets(ticketsData)
        setStaff(staffData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Ricerca testuale
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          ticket.id.toLowerCase().includes(searchLower) ||
          ticket.customer_name.toLowerCase().includes(searchLower) ||
          ticket.customer_phone?.toLowerCase().includes(searchLower) ||
          ticket.customer_email?.toLowerCase().includes(searchLower) ||
          ticket.device?.toLowerCase().includes(searchLower) ||
          ticket.brand?.toLowerCase().includes(searchLower) ||
          ticket.model?.toLowerCase().includes(searchLower) ||
          ticket.issue.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      // Filtro stato
      if (filters.status !== "all" && ticket.status !== filters.status) {
        return false
      }

      // Filtro tecnico
      if (filters.technicianId !== "all" && ticket.technician_id !== filters.technicianId) {
        return false
      }

      // Filtro data da
      if (filters.dateFrom) {
        const ticketDate = ticket.created_at.split("T")[0]
        if (ticketDate < filters.dateFrom) return false
      }

      // Filtro data a
      if (filters.dateTo) {
        const ticketDate = ticket.created_at.split("T")[0]
        if (ticketDate > filters.dateTo) return false
      }

      return true
    })
  }, [tickets, filters])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento ticket..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Riparazioni</h1>
          <p className="text-muted-foreground">
            Gestione ticket di riparazione ({filteredTickets.length} di {tickets.length})
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tickets/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuova Scheda
          </Link>
        </Button>
      </div>

      <TicketsFilters onFiltersChange={setFilters} staff={staff} />

      <TicketsTable tickets={filteredTickets} />
    </div>
  )
}
