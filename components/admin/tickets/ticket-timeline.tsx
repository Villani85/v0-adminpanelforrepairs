"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { STATUS_LABELS, type RepairTicket } from "@/types/repairs"
import { Clock, CheckCircle2 } from "lucide-react"

interface TicketTimelineProps {
  ticket: RepairTicket
}

export function TicketTimeline({ ticket }: TicketTimelineProps) {
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Timeline semplificata basata su created_at, updated_at e stato corrente
  const events = [
    {
      title: "Ticket creato",
      date: ticket.created_at,
      status: "received",
      completed: true,
    },
    {
      title: "Ultimo aggiornamento",
      date: ticket.updated_at,
      status: ticket.status,
      completed: true,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline Attività</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          <div className="absolute left-[11px] top-2 h-[calc(100%-24px)] w-0.5 bg-border" />

          {events.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background">
                {event.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(event.date)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Stato: {STATUS_LABELS[event.status as keyof typeof STATUS_LABELS]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
