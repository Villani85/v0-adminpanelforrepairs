"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Calendar, Clock } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"

interface UpcomingAppointmentsProps {
  tickets: RepairTicket[]
}

export function UpcomingAppointments({ tickets }: UpcomingAppointmentsProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayStr = today.toISOString().split("T")[0]
  const tomorrowStr = tomorrow.toISOString().split("T")[0]

  const upcomingAppointments = tickets
    .filter((t) => t.appointment_date && (t.appointment_date === todayStr || t.appointment_date === tomorrowStr))
    .sort((a, b) => {
      if (a.appointment_date === b.appointment_date) {
        return (a.appointment_time || "").localeCompare(b.appointment_time || "")
      }
      return (a.appointment_date || "").localeCompare(b.appointment_date || "")
    })
    .slice(0, 5)

  const formatDate = (dateStr: string) => {
    if (dateStr === todayStr) return "Oggi"
    if (dateStr === tomorrowStr) return "Domani"
    return new Date(dateStr).toLocaleDateString("it-IT", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Appuntamenti in Arrivo</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessun appuntamento per oggi o domani</p>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-2 py-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">{formatDate(ticket.appointment_date!)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{ticket.customer_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {ticket.device || `${ticket.brand} ${ticket.model}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {ticket.appointment_time && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {ticket.appointment_time}
                      </span>
                    )}
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
