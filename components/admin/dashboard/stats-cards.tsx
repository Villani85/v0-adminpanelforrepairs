"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Clock, CalendarCheck, AlertTriangle } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"

interface StatsCardsProps {
  tickets: RepairTicket[]
}

export function StatsCards({ tickets }: StatsCardsProps) {
  const today = new Date().toISOString().split("T")[0]

  // Ticket aperti (non consegnati)
  const openTickets = tickets.filter((t) => t.status !== "delivered")

  // Ticket ricevuti oggi
  const ticketsToday = tickets.filter((t) => t.created_at.split("T")[0] === today)

  // Tempo medio di lavorazione (approssimato)
  const deliveredTickets = tickets.filter((t) => t.status === "delivered")
  let avgDays = 0
  if (deliveredTickets.length > 0) {
    const totalDays = deliveredTickets.reduce((acc, t) => {
      const created = new Date(t.created_at)
      const updated = new Date(t.updated_at)
      const days = Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      return acc + days
    }, 0)
    avgDays = Math.round(totalDays / deliveredTickets.length)
  }

  // Ticket ad alta priorità aperti
  const highPriorityOpen = openTickets.filter((t) => t.priority === "high")

  const stats = [
    {
      title: "Ticket Aperti",
      value: openTickets.length,
      description: `${ticketsToday.length} ricevuti oggi`,
      icon: Ticket,
      iconColor: "text-blue-600",
    },
    {
      title: "Ricevuti Oggi",
      value: ticketsToday.length,
      description: "Nuovi ticket",
      icon: CalendarCheck,
      iconColor: "text-green-600",
    },
    {
      title: "Tempo Medio",
      value: `${avgDays}g`,
      description: "Giorni di lavorazione",
      icon: Clock,
      iconColor: "text-amber-600",
    },
    {
      title: "Alta Priorità",
      value: highPriorityOpen.length,
      description: "Ticket urgenti aperti",
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
