"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUS_LABELS, type RepairStatus } from "@/types/repairs"
import { Loader2 } from "lucide-react"

interface TicketStatusSelectorProps {
  currentStatus: RepairStatus
  onStatusChange: (status: RepairStatus) => Promise<void>
}

const statusOrder: RepairStatus[] = [
  "received",
  "under_diagnosis",
  "waiting_parts",
  "in_repair",
  "ready_for_pickup",
  "delivered",
]

export function TicketStatusSelector({ currentStatus, onStatusChange }: TicketStatusSelectorProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (value: string) => {
    setLoading(true)
    try {
      await onStatusChange(value as RepairStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentStatus} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-[200px]">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Aggiornamento...</span>
            </div>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {statusOrder.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
