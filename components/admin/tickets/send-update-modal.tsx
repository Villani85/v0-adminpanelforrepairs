"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Mail, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { STATUS_LABELS, type RepairTicket } from "@/types/repairs"

interface SendUpdateModalProps {
  ticket: RepairTicket
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendUpdateModal({ ticket, open, onOpenChange }: SendUpdateModalProps) {
  const { toast } = useToast()
  const [channel, setChannel] = useState<"email" | "sms">("email")
  const [message, setMessage] = useState(
    `Gentile ${ticket.customer_name},\n\nLa informiamo che lo stato della sua riparazione è stato aggiornato a: ${STATUS_LABELS[ticket.status]}.\n\nPer qualsiasi domanda non esiti a contattarci.\n\nCordiali saluti,\nTechRepair`,
  )

  const handleSend = () => {
    // Simulazione invio (solo UI)
    toast({
      title: "Messaggio inviato",
      description: `Notifica inviata via ${channel === "email" ? "email" : "SMS"} a ${ticket.customer_name}`,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invia Aggiornamento al Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Canale di invio</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as "email" | "sms")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email ({ticket.customer_email || "non disponibile"})
                  </div>
                </SelectItem>
                <SelectItem value="sms">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS ({ticket.customer_phone || "non disponibile"})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Messaggio</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Scrivi il messaggio..."
            />
          </div>

          <p className="text-xs text-muted-foreground">
            * Funzionalità di invio messaggi - solo anteprima UI, nessun invio reale
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Invia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
