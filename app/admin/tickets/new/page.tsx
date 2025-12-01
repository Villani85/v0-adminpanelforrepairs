"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { createRepairTicket } from "@/services/repairs"
import { getActiveStaff } from "@/services/staff"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  DEVICE_TYPE_LABELS,
  type RepairStatus,
  type Priority,
  type DeviceType,
  type StaffMember,
  type CreateRepairTicketInput,
} from "@/types/repairs"

export default function NewTicketPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [deviceType, setDeviceType] = useState<DeviceType | "">("")
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [password, setPassword] = useState("")
  const [accessories, setAccessories] = useState("")
  const [issue, setIssue] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [status, setStatus] = useState<RepairStatus>("received")
  const [technicianId, setTechnicianId] = useState<string>("")

  useEffect(() => {
    async function loadStaff() {
      try {
        const staffData = await getActiveStaff()
        setStaff(staffData)
      } catch (err) {
        toast({
          title: "Errore",
          description: "Impossibile caricare la lista dei tecnici",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadStaff()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName.trim() || !issue.trim()) {
      toast({
        title: "Errore",
        description: "Nome cliente e descrizione problema sono obbligatori",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const technician = staff.find((s) => s.id === technicianId)

      // Combina password e accessori nelle note
      let notes = ""
      if (password) notes += `Password/PIN: ${password}\n`
      if (accessories) notes += `Accessori ricevuti: ${accessories}`

      const input: CreateRepairTicketInput = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim() || undefined,
        customer_email: customerEmail.trim() || undefined,
        device_type: deviceType || undefined,
        brand: brand.trim() || undefined,
        model: model.trim() || undefined,
        serial_number: serialNumber.trim() || undefined,
        issue: issue.trim(),
        priority,
        status,
        technician_id: technicianId || undefined,
        technician_name: technician?.name || undefined,
        notes: notes.trim() || undefined,
      }

      const newTicket = await createRepairTicket(input)

      toast({
        title: "Ticket creato",
        description: `Il ticket #${newTicket.id.slice(0, 8)} è stato creato con successo`,
      })

      router.push(`/admin/tickets/${newTicket.id}`)
    } catch (err) {
      toast({
        title: "Errore",
        description: err instanceof Error ? err.message : "Errore nella creazione del ticket",
        variant: "destructive",
      })
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/tickets">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuova Scheda di Riparazione</h1>
          <p className="text-muted-foreground">Compila i dati per aprire un nuovo ticket</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sezione Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dati Cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome e Cognome *</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Mario Rossi"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefono</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+39 333 1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="mario.rossi@email.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sezione Dispositivo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informazioni Dispositivo</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="deviceType">Tipo Dispositivo</Label>
              <Select value={deviceType} onValueChange={(v) => setDeviceType(v as DeviceType)}>
                <SelectTrigger id="deviceType">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DEVICE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Apple, Samsung, HP..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modello</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="iPhone 13, Galaxy S21..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Numero Seriale</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SN-XXXXX"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Password/PIN dispositivo</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PIN o password per accesso"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="accessories">Accessori ricevuti</Label>
              <Input
                id="accessories"
                value={accessories}
                onChange={(e) => setAccessories(e.target.value)}
                placeholder="Caricatore, custodia, cavo..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Sezione Problema */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Descrizione Problema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="issue">Descrizione dettagliata *</Label>
              <Textarea
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Descrivi il problema riportato dal cliente..."
                rows={5}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Sezione Impostazioni Ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impostazioni Ticket</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorità</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Stato Iniziale</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as RepairStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="technician">Tecnico Assegnato</Label>
              <Select value={technicianId} onValueChange={setTechnicianId}>
                <SelectTrigger id="technician">
                  <SelectValue placeholder="Non assegnato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non assegnato</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/tickets">Annulla</Link>
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creazione...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Crea Ticket
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
