"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { STATUS_LABELS, PRIORITY_LABELS, type RepairTicket } from "@/types/repairs"

interface PrintModalProps {
  ticket: RepairTicket
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrintModal({ ticket, open, onOpenChange }: PrintModalProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scheda Lavoro - #{ticket.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4 border border-border rounded-lg bg-white text-black">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">TechRepair</h2>
            <p className="text-sm">Centro Assistenza Dispositivi Elettronici</p>
          </div>

          {/* Info Ticket */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Numero Ticket:</p>
              <p className="font-mono">{ticket.id}</p>
            </div>
            <div>
              <p className="font-semibold">Data Apertura:</p>
              <p>{formatDate(ticket.created_at)}</p>
            </div>
            <div>
              <p className="font-semibold">Stato:</p>
              <p>{STATUS_LABELS[ticket.status]}</p>
            </div>
            <div>
              <p className="font-semibold">Priorità:</p>
              <p>{PRIORITY_LABELS[ticket.priority]}</p>
            </div>
          </div>

          {/* Cliente */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Dati Cliente</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Nome:</strong> {ticket.customer_name}
              </p>
              {ticket.customer_phone && (
                <p>
                  <strong>Telefono:</strong> {ticket.customer_phone}
                </p>
              )}
              {ticket.customer_email && (
                <p>
                  <strong>Email:</strong> {ticket.customer_email}
                </p>
              )}
            </div>
          </div>

          {/* Dispositivo */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Dispositivo</h3>
            <div className="text-sm space-y-1">
              {ticket.device_type && (
                <p>
                  <strong>Tipo:</strong> {ticket.device_type}
                </p>
              )}
              {ticket.brand && (
                <p>
                  <strong>Marca:</strong> {ticket.brand}
                </p>
              )}
              {ticket.model && (
                <p>
                  <strong>Modello:</strong> {ticket.model}
                </p>
              )}
              {ticket.serial_number && (
                <p>
                  <strong>Seriale:</strong> {ticket.serial_number}
                </p>
              )}
            </div>
          </div>

          {/* Problema */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Descrizione Problema</h3>
            <p className="text-sm whitespace-pre-wrap">{ticket.issue}</p>
          </div>

          {/* Note */}
          {ticket.notes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Note</h3>
              <p className="text-sm whitespace-pre-wrap">{ticket.notes}</p>
            </div>
          )}

          {/* Firma */}
          <div className="border-t pt-8 mt-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm mb-8">Firma cliente:</p>
                <div className="border-b border-black" />
              </div>
              <div>
                <p className="text-sm mb-8">Firma tecnico:</p>
                <div className="border-b border-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Chiudi
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Stampa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
