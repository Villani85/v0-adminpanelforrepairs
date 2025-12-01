"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { STATUS_LABELS, type RepairStatus, type StaffMember } from "@/types/repairs"

interface TicketsFiltersProps {
  onFiltersChange: (filters: TicketsFilters) => void
  staff: StaffMember[]
}

export interface TicketsFilters {
  search: string
  status: RepairStatus | "all"
  technicianId: string | "all"
  dateFrom: string
  dateTo: string
}

const statusOptions: { value: RepairStatus | "all"; label: string }[] = [
  { value: "all", label: "Tutti gli stati" },
  { value: "received", label: STATUS_LABELS.received },
  { value: "under_diagnosis", label: STATUS_LABELS.under_diagnosis },
  { value: "waiting_parts", label: STATUS_LABELS.waiting_parts },
  { value: "in_repair", label: STATUS_LABELS.in_repair },
  { value: "ready_for_pickup", label: STATUS_LABELS.ready_for_pickup },
  { value: "delivered", label: STATUS_LABELS.delivered },
]

export function TicketsFilters({ onFiltersChange, staff }: TicketsFiltersProps) {
  const [filters, setFilters] = useState<TicketsFilters>({
    search: "",
    status: "all",
    technicianId: "all",
    dateFrom: "",
    dateTo: "",
  })

  const updateFilter = <K extends keyof TicketsFilters>(key: K, value: TicketsFilters[K]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: TicketsFilters = {
      search: "",
      status: "all",
      technicianId: "all",
      dateFrom: "",
      dateTo: "",
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    filters.search || filters.status !== "all" || filters.technicianId !== "all" || filters.dateFrom || filters.dateTo

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cerca per ID, cliente, dispositivo..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value as RepairStatus | "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.technicianId} onValueChange={(value) => updateFilter("technicianId", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tecnico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i tecnici</SelectItem>
            {staff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="w-[150px]"
            placeholder="Da"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="w-[150px]"
            placeholder="A"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Pulisci filtri
          </Button>
        )}
      </div>
    </div>
  )
}
