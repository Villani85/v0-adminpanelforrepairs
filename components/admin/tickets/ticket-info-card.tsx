"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, Smartphone, Hash } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"
import { DEVICE_TYPE_LABELS } from "@/types/repairs"

interface TicketInfoCardProps {
  ticket: RepairTicket
}

export function TicketInfoCard({ ticket }: TicketInfoCardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Info Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informazioni Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-lg font-semibold">{ticket.customer_name}</p>
          </div>

          {ticket.customer_phone && (
            <a
              href={`tel:${ticket.customer_phone}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone className="h-4 w-4" />
              {ticket.customer_phone}
            </a>
          )}

          {ticket.customer_email && (
            <a
              href={`mailto:${ticket.customer_email}`}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="h-4 w-4" />
              {ticket.customer_email}
            </a>
          )}
        </CardContent>
      </Card>

      {/* Info Dispositivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informazioni Dispositivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ticket.device_type && (
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{DEVICE_TYPE_LABELS[ticket.device_type] || ticket.device_type}</span>
            </div>
          )}

          {(ticket.brand || ticket.model) && (
            <div>
              <p className="text-sm text-muted-foreground">Marca / Modello</p>
              <p className="font-medium">{[ticket.brand, ticket.model].filter(Boolean).join(" ")}</p>
            </div>
          )}

          {ticket.serial_number && (
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Numero Seriale</p>
                <p className="font-mono text-sm">{ticket.serial_number}</p>
              </div>
            </div>
          )}

          {ticket.device && (
            <div>
              <p className="text-sm text-muted-foreground">Descrizione dispositivo</p>
              <p className="text-sm">{ticket.device}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
