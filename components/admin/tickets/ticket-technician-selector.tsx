"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StaffMember } from "@/types/repairs"
import { Loader2 } from "lucide-react"

interface TicketTechnicianSelectorProps {
  currentTechnicianId: string | null
  staff: StaffMember[]
  onTechnicianChange: (technicianId: string | null, technicianName: string | null) => Promise<void>
}

export function TicketTechnicianSelector({
  currentTechnicianId,
  staff,
  onTechnicianChange,
}: TicketTechnicianSelectorProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (value: string) => {
    setLoading(true)
    try {
      if (value === "none") {
        await onTechnicianChange(null, null)
      } else {
        const technician = staff.find((s) => s.id === value)
        await onTechnicianChange(value, technician?.name || null)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentTechnicianId || "none"} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-[200px]">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Aggiornamento...</span>
            </div>
          ) : (
            <SelectValue placeholder="Seleziona tecnico" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non assegnato</SelectItem>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
