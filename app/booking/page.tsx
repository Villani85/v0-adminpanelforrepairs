"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Gamepad2,
  User,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Copy,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { PublicLayout } from "@/components/public/public-layout"

const deviceTypes = [
  { value: "smartphone", label: "Smartphone", icon: Smartphone },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "laptop", label: "Laptop", icon: Laptop },
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "console", label: "Console", icon: Gamepad2 },
]

const issueTypes = [
  { value: "schermo", label: "Schermo rotto/danneggiato" },
  { value: "batteria", label: "Problema batteria" },
  { value: "connettore", label: "Porta di ricarica" },
  { value: "acqua", label: "Danni da liquidi" },
  { value: "software", label: "Problemi software" },
  { value: "altro", label: "Altro problema" },
]

const stores = [
  { value: "roma-centro", label: "Roma Centro - Via Roma 123" },
  { value: "roma-eur", label: "Roma EUR - Viale Europa 456" },
  { value: "milano", label: "Milano - Corso Buenos Aires 78" },
]

const timeSlots = [
  { value: "09:00-10:00", label: "09:00 - 10:00" },
  { value: "10:00-11:00", label: "10:00 - 11:00" },
  { value: "11:00-12:00", label: "11:00 - 12:00" },
  { value: "14:00-15:00", label: "14:00 - 15:00" },
  { value: "15:00-16:00", label: "15:00 - 16:00" },
  { value: "16:00-17:00", label: "16:00 - 17:00" },
  { value: "17:00-18:00", label: "17:00 - 18:00" },
]

interface FormData {
  device_type: string
  brand: string
  model: string
  issue_type: string
  issue_description: string
  customer_name: string
  customer_phone: string
  customer_email: string
  store: string
  date: string
  time_slot: string
}

function BookingContent() {
  const searchParams = useSearchParams()

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [ticketId, setTicketId] = useState("")
  const [copied, setCopied] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    device_type: searchParams.get("device_type") || "",
    brand: searchParams.get("brand") || "",
    model: "",
    issue_type: "",
    issue_description: searchParams.get("issue") || "",
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    store: "",
    date: "",
    time_slot: "",
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<FormData> = {}

    if (currentStep === 1) {
      if (!formData.device_type) newErrors.device_type = "Seleziona un dispositivo"
      if (!formData.brand) newErrors.brand = "Inserisci la marca"
      if (!formData.issue_description) newErrors.issue_description = "Descrivi il problema"
    }

    if (currentStep === 2) {
      if (!formData.customer_name) newErrors.customer_name = "Inserisci il tuo nome"
      if (!formData.customer_phone) newErrors.customer_phone = "Inserisci il telefono"
      if (!formData.customer_email) newErrors.customer_email = "Inserisci l'email"
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
        newErrors.customer_email = "Email non valida"
      }
    }

    if (currentStep === 3) {
      if (!formData.store) newErrors.store = "Seleziona un negozio"
      if (!formData.date) newErrors.date = "Seleziona una data"
      if (!formData.time_slot) newErrors.time_slot = "Seleziona un orario"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate fake ticket ID
    const fakeId = `TR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    setTicketId(fakeId)
    setIsComplete(true)
    setIsSubmitting(false)
  }

  const copyTicketId = async () => {
    await navigator.clipboard.writeText(ticketId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (isComplete) {
    return (
      <PublicLayout>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="animate-scale-in rounded-3xl border border-border bg-card p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Prenotazione Ricevuta!</h1>
              <p className="mt-4 text-muted-foreground">
                La tua richiesta di riparazione è stata registrata con successo.
              </p>

              <div className="mt-8 rounded-2xl bg-secondary/50 p-6">
                <p className="text-sm text-muted-foreground">Il tuo ID Ticket</p>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-bold gradient-text">{ticketId}</span>
                  <Button variant="ghost" size="icon" onClick={copyTicketId}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-left rounded-2xl border border-border p-6">
                <h3 className="font-semibold">Riepilogo</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dispositivo</span>
                    <span className="font-medium">
                      {formData.brand} {formData.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Problema</span>
                    <span className="font-medium">{formData.issue_description.substring(0, 30)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Negozio</span>
                    <span className="font-medium">
                      {stores.find((s) => s.value === formData.store)?.label.split(" - ")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {new Date(formData.date).toLocaleDateString("it-IT")} alle {formData.time_slot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-left">
                <h3 className="font-semibold text-primary">Cosa fare ora</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Presentati in negozio il giorno dell'appuntamento</li>
                  <li>• Porta un documento di identità valido</li>
                  <li>• Se possibile, esegui un backup dei dati</li>
                  <li>• Riceverai aggiornamenti via email sullo stato della riparazione</li>
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild variant="outline" className="rounded-full bg-transparent">
                  <Link href={`/customer/track?ticket=${ticketId}`}>Traccia Riparazione</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/">Torna alla Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      {/* Header */}
      <section className="hero-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up text-3xl font-bold tracking-tight sm:text-4xl">
              Prenota una <span className="gradient-text">Riparazione</span>
            </h1>
            <p
              className="animate-fade-up delay-100 mt-4 text-muted-foreground opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              Compila il modulo e fissa un appuntamento nel negozio più vicino
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="border-b border-border bg-card py-6">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Dispositivo", icon: Smartphone },
              { num: 2, label: "Dati", icon: User },
              { num: 3, label: "Appuntamento", icon: Calendar },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-3 ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-smooth ${
                      step > s.num
                        ? "border-primary bg-primary text-primary-foreground"
                        : step === s.num
                          ? "border-primary bg-primary/10"
                          : "border-muted"
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className="hidden font-medium sm:block">{s.label}</span>
                </div>
                {index < 2 && (
                  <div
                    className={`mx-4 h-0.5 w-12 sm:w-24 transition-smooth ${step > s.num ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up rounded-3xl border border-border bg-card p-6 sm:p-10">
            {/* Step 1: Device Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Informazioni Dispositivo</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Dicci quale dispositivo vuoi riparare</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Tipo di dispositivo *</Label>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {deviceTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => updateField("device_type", type.value)}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-smooth ${
                            formData.device_type === type.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <type.icon
                            className={`h-6 w-6 ${formData.device_type === type.value ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.device_type && <p className="mt-2 text-sm text-destructive">{errors.device_type}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="brand">Marca *</Label>
                      <Input
                        id="brand"
                        placeholder="es. Apple, Samsung"
                        value={formData.brand}
                        onChange={(e) => updateField("brand", e.target.value)}
                        className="mt-2"
                      />
                      {errors.brand && <p className="mt-1 text-sm text-destructive">{errors.brand}</p>}
                    </div>
                    <div>
                      <Label htmlFor="model">Modello</Label>
                      <Input
                        id="model"
                        placeholder="es. iPhone 15 Pro"
                        value={formData.model}
                        onChange={(e) => updateField("model", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Tipo di problema</Label>
                    <Select value={formData.issue_type} onValueChange={(v) => updateField("issue_type", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleziona il tipo di problema" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueTypes.map((issue) => (
                          <SelectItem key={issue.value} value={issue.value}>
                            {issue.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="issue_description">Descrizione del problema *</Label>
                    <Textarea
                      id="issue_description"
                      placeholder="Descrivi il problema in dettaglio..."
                      value={formData.issue_description}
                      onChange={(e) => updateField("issue_description", e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                    {errors.issue_description && (
                      <p className="mt-1 text-sm text-destructive">{errors.issue_description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Customer Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">I Tuoi Dati</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Inserisci i tuoi dati di contatto</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Nome e Cognome *</Label>
                    <Input
                      id="customer_name"
                      placeholder="Mario Rossi"
                      value={formData.customer_name}
                      onChange={(e) => updateField("customer_name", e.target.value)}
                      className="mt-2"
                    />
                    {errors.customer_name && <p className="mt-1 text-sm text-destructive">{errors.customer_name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="customer_phone">Telefono *</Label>
                    <Input
                      id="customer_phone"
                      type="tel"
                      placeholder="+39 333 1234567"
                      value={formData.customer_phone}
                      onChange={(e) => updateField("customer_phone", e.target.value)}
                      className="mt-2"
                    />
                    {errors.customer_phone && <p className="mt-1 text-sm text-destructive">{errors.customer_phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="customer_email">Email *</Label>
                    <Input
                      id="customer_email"
                      type="email"
                      placeholder="mario.rossi@email.com"
                      value={formData.customer_email}
                      onChange={(e) => updateField("customer_email", e.target.value)}
                      className="mt-2"
                    />
                    {errors.customer_email && <p className="mt-1 text-sm text-destructive">{errors.customer_email}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Appointment */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">Appuntamento</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Scegli dove e quando portare il dispositivo</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Negozio *</Label>
                    <Select value={formData.store} onValueChange={(v) => updateField("store", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleziona un negozio" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.value} value={store.value}>
                            {store.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.store && <p className="mt-1 text-sm text-destructive">{errors.store}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="date">Data *</Label>
                      <Input
                        id="date"
                        type="date"
                        min={getMinDate()}
                        value={formData.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        className="mt-2"
                      />
                      {errors.date && <p className="mt-1 text-sm text-destructive">{errors.date}</p>}
                    </div>

                    <div>
                      <Label>Orario *</Label>
                      <Select value={formData.time_slot} onValueChange={(v) => updateField("time_slot", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleziona orario" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value}>
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.time_slot && <p className="mt-1 text-sm text-destructive">{errors.time_slot}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={prevStep} className="rounded-full">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Indietro
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button onClick={nextStep} className="rounded-full">
                  Continua
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      Conferma Prenotazione
                      <CheckCircle2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
