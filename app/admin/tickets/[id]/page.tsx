"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { PriorityBadge } from "@/components/admin/priority-badge"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { ErrorMessage } from "@/components/admin/error-message"
import { TicketInfoCard } from "@/components/admin/tickets/ticket-info-card"
import { TicketStatusSelector } from "@/components/admin/tickets/ticket-status-selector"
import { TicketTechnicianSelector } from "@/components/admin/tickets/ticket-technician-selector"
import { TicketTimeline } from "@/components/admin/tickets/ticket-timeline"
import { TicketParts } from "@/components/admin/tickets/ticket-parts"
import { TicketAttachments } from "@/components/admin/tickets/ticket-attachments"
import { PrintModal } from "@/components/admin/tickets/print-modal"
import { SendUpdateModal } from "@/components/admin/tickets/send-update-modal"
import { getRepairTicket, updateRepairTicket } from "@/services/repairs"
import { getActiveStaff } from "@/services/staff"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Printer, FileText, Send } from "lucide-react"
import type { RepairTicket, StaffMember, RepairStatus } from "@/types/repairs"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<RepairTicket | null>(null)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [sendUpdateModalOpen, setSendUpdateModalOpen] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketData, staffData] = await Promise.all([getRepairTicket(ticketId), getActiveStaff()])

        if (!ticketData) {
          setError("Ticket non trovato")
          return
        }

        setTicket(ticketData)
        setStaff(staffData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore nel caricamento del ticket")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [ticketId])

  const handleStatusChange = async (status: RepairStatus) => {
    if (!ticket) return

    try {
      const updated = await updateRepairTicket(ticket.id, { status })
      setTicket(updated)
      toast({
        title: "Stato aggiornato",
        description: `Lo stato del ticket è stato aggiornato con successo`,
      })
    } catch (err) {
      toast({
        title: "Errore",
        description: err instanceof Error ? err.message : "Errore nell'aggiornamento dello stato",
        variant: "destructive",
      })
    }
  }

  const handleTechnicianChange = async (technicianId: string | null, technicianName: string | null) => {
    if (!ticket) return

    try {
      const updated = await updateRepairTicket(ticket.id, {
        technician_id: technicianId || undefined,
        technician_name: technicianName || undefined,
      })
      setTicket(updated)
      toast({
        title: "Tecnico assegnato",
        description: technicianName
          ? `Il ticket è stato assegnato a ${technicianName}`
          : "Il ticket non è più assegnato",
      })
    } catch (err) {
      toast({
        title: "Errore",
        description: err instanceof Error ? err.message : "Errore nell'assegnazione del tecnico",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento ticket..." />
      </div>
    )
  }

  if (error || !ticket) {
    return <ErrorMessage message={error || "Ticket non trovato"} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/tickets">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Ticket #{ticket.id.slice(0, 8)}</h1>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <p className="text-muted-foreground">
              Creato il{" "}
              {new Date(ticket.created_at).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setPrintModalOpen(true)}>
            <Printer className="mr-2 h-4 w-4" />
            Stampa Scheda
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "PDF generato",
                description: "Anteprima PDF riepilogo (funzionalità placeholder)",
              })
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Genera PDF
          </Button>
          <Button onClick={() => setSendUpdateModalOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Invia Aggiornamento
          </Button>
        </div>
      </div>

      {/* Selettori Stato e Tecnico */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Stato</label>
              <TicketStatusSelector currentStatus={ticket.status} onStatusChange={handleStatusChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tecnico Assegnato</label>
              <TicketTechnicianSelector
                currentTechnicianId={ticket.technician_id}
                staff={staff}
                onTechnicianChange={handleTechnicianChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Cliente e Dispositivo */}
      <TicketInfoCard ticket={ticket} />

      {/* Descrizione Problema */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descrizione Problema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm">{ticket.issue}</p>
          {ticket.notes && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-2">Note aggiuntive</p>
              <p className="whitespace-pre-wrap text-sm">{ticket.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sezioni aggiuntive */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TicketTimeline ticket={ticket} />
        <TicketParts />
      </div>

      <TicketAttachments />

      {/* Modals */}
      <PrintModal ticket={ticket} open={printModalOpen} onOpenChange={setPrintModalOpen} />
      <SendUpdateModal ticket={ticket} open={sendUpdateModalOpen} onOpenChange={setSendUpdateModalOpen} />
    </div>
  )
}
