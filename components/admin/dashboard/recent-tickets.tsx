"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/status-badge"
import { ArrowRight } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"

interface RecentTicketsProps {
  tickets: RepairTicket[]
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  const recentTickets = tickets.slice(0, 5)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Ultimi Ticket</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/tickets">
            Vedi tutti
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/admin/tickets/${ticket.id}`}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">#{ticket.id.slice(0, 8)}</span>
                  <StatusBadge status={ticket.status} />
                </div>
                <p className="font-medium text-sm mt-1 truncate">{ticket.customer_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {ticket.device || `${ticket.brand || ""} ${ticket.model || ""}`}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">{formatDate(ticket.created_at)}</div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
