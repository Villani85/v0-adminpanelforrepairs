"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { ErrorMessage } from "@/components/admin/error-message"
import { listRepairTickets } from "@/services/repairs"
import { ArrowLeft, Phone, Mail, Smartphone } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"

interface Device {
  key: string
  type: string | null
  brand: string | null
  model: string | null
}

export default function CustomerDetailPage() {
  const params = useParams()
  const customerKey = decodeURIComponent(params.id as string)

  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await listRepairTickets()
        setTickets(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento dei dati")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filtra i ticket del cliente
  const customerTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const key = `${ticket.customer_name.toLowerCase()}_${ticket.customer_email?.toLowerCase() || ""}`
      return key === customerKey
    })
  }, [tickets, customerKey])

  // Estrai info cliente
  const customerInfo = useMemo(() => {
    if (customerTickets.length === 0) return null

    const firstTicket = customerTickets[0]
    return {
      name: firstTicket.customer_name,
      phone: customerTickets.find((t) => t.customer_phone)?.customer_phone || null,
      email: customerTickets.find((t) => t.customer_email)?.customer_email || null,
    }
  }, [customerTickets])

  // Estrai dispositivi unici
  const devices = useMemo(() => {
    const deviceMap = new Map<string, Device>()

    customerTickets.forEach((ticket) => {
      const key = `${ticket.device_type || ""}_${ticket.brand || ""}_${ticket.model || ""}`
      if (key !== "__" && !deviceMap.has(key)) {
        deviceMap.set(key, {
          key,
          type: ticket.device_type,
          brand: ticket.brand,
          model: ticket.model,
        })
      }
    })

    return Array.from(deviceMap.values())
  }, [customerTickets])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento dati cliente..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!customerInfo) {
    return <ErrorMessage message="Cliente non trovato" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/customers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{customerInfo.name}</h1>
          <p className="text-muted-foreground">{customerTickets.length} ticket di riparazione</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info Contatto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informazioni di Contatto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customerInfo.phone && (
              <a
                href={`tel:${customerInfo.phone}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {customerInfo.phone}
              </a>
            )}
            {customerInfo.email && (
              <a
                href={`mailto:${customerInfo.email}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {customerInfo.email}
              </a>
            )}
            {!customerInfo.phone && !customerInfo.email && (
              <p className="text-sm text-muted-foreground">Nessun contatto disponibile</p>
            )}
          </CardContent>
        </Card>

        {/* Dispositivi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dispositivi</CardTitle>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun dispositivo registrato</p>
            ) : (
              <div className="space-y-3">
                {devices.map((device) => (
                  <div key={device.key} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {[device.brand, device.model].filter(Boolean).join(" ") || "Dispositivo"}
                      </p>
                      {device.type && <p className="text-xs text-muted-foreground capitalize">{device.type}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Storico Ticket */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Storico Riparazioni</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customerTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Link
                      href={`/admin/tickets/${ticket.id}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      #{ticket.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {[ticket.brand, ticket.model].filter(Boolean).join(" ") || ticket.device || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1 text-sm max-w-[200px]">{ticket.issue}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatDate(ticket.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
