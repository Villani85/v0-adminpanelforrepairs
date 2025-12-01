"use client"

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import { PriorityBadge } from "@/components/admin/priority-badge"
import type { RepairTicket } from "@/types/repairs"

interface TicketsTableProps {
  tickets: RepairTicket[]
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-muted-foreground">Nessun ticket trovato</p>
        <p className="text-sm text-muted-foreground">Prova a modificare i filtri di ricerca</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Dispositivo</TableHead>
            <TableHead>Problema</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Priorità</TableHead>
            <TableHead>Tecnico</TableHead>
            <TableHead className="text-right">Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer hover:bg-accent">
              <TableCell>
                <Link href={`/admin/tickets/${ticket.id}`} className="font-mono text-xs text-primary hover:underline">
                  #{ticket.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{ticket.customer_name}</span>
                  {ticket.customer_phone && (
                    <span className="text-xs text-muted-foreground">{ticket.customer_phone}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {ticket.device_type && <span className="capitalize">{ticket.device_type}</span>}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {[ticket.brand, ticket.model].filter(Boolean).join(" ")}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="line-clamp-2 text-sm max-w-[200px]">{ticket.issue}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>
              <TableCell>
                <span className="text-sm">{ticket.technician_name || "-"}</span>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(ticket.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
