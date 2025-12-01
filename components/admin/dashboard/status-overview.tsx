"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { STATUS_LABELS, type RepairTicket, type RepairStatus } from "@/types/repairs"

interface StatusOverviewProps {
  tickets: RepairTicket[]
}

const statusOrder: RepairStatus[] = [
  "received",
  "under_diagnosis",
  "waiting_parts",
  "in_repair",
  "ready_for_pickup",
  "delivered",
]

const statusColors: Record<RepairStatus, string> = {
  received: "bg-blue-500",
  under_diagnosis: "bg-yellow-500",
  waiting_parts: "bg-orange-500",
  in_repair: "bg-indigo-500",
  ready_for_pickup: "bg-green-500",
  delivered: "bg-gray-400",
}

export function StatusOverview({ tickets }: StatusOverviewProps) {
  const statusCounts = statusOrder.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: tickets.filter((t) => t.status === status).length,
    color: statusColors[status],
  }))

  const totalOpen = tickets.filter((t) => t.status !== "delivered").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Panoramica Stati</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {statusCounts.map(({ status, label, count, color }) => {
          const percentage = totalOpen > 0 ? (count / tickets.length) * 100 : 0
          return (
            <div key={status} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
