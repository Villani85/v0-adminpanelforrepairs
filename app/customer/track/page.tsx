"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Package,
  Stethoscope,
  Clock,
  Wrench,
  CheckCircle2,
  Truck,
  Smartphone,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PublicLayout } from "@/components/public/public-layout"
import type { RepairStatus } from "@/types/repairs"

interface MockTicket {
  id: string
  customer_name: string
  customer_email: string
  device_type: string
  brand: string
  model: string
  issue: string
  status: RepairStatus
  store_location: string
  created_at: string
  updated_at: string
}

const mockTickets: MockTicket[] = [
  {
    id: "TR-ABC123",
    customer_name: "Mario Rossi",
    customer_email: "mario.rossi@email.com",
    device_type: "smartphone",
    brand: "Apple",
    model: "iPhone 14 Pro",
    issue: "Sostituzione schermo",
    status: "in_repair",
    store_location: "Roma Centro",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-16T14:30:00Z",
  },
  {
    id: "TR-DEF456",
    customer_name: "Giulia Bianchi",
    customer_email: "giulia.bianchi@email.com",
    device_type: "laptop",
    brand: "Apple",
    model: 'MacBook Pro 14"',
    issue: "Sostituzione batteria",
    status: "ready_for_pickup",
    store_location: "Milano",
    created_at: "2024-01-14T09:00:00Z",
    updated_at: "2024-01-16T16:00:00Z",
  },
]

const statusSteps: { status: RepairStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "received", label: "Ricevuto", icon: Package },
  { status: "under_diagnosis", label: "In diagnosi", icon: Stethoscope },
  { status: "waiting_parts", label: "In attesa pezzi", icon: Clock },
  { status: "in_repair", label: "In riparazione", icon: Wrench },
  { status: "ready_for_pickup", label: "Pronto per il ritiro", icon: CheckCircle2 },
  { status: "delivered", label: "Consegnato", icon: Truck },
]

const getStatusIndex = (status: RepairStatus): number => {
  return statusSteps.findIndex((s) => s.status === status)
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const initialTicket = searchParams.get("ticket") || ""

  const [ticketId, setTicketId] = useState(initialTicket)
  const [email, setEmail] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchedTicket, setSearchedTicket] = useState<MockTicket | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!ticketId.trim()) return

    setIsSearching(true)
    setNotFound(false)
    setSearchedTicket(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const found = mockTickets.find((t) => t.id.toLowerCase() === ticketId.trim().toLowerCase())

    if (found) {
      setSearchedTicket(found)
    } else {
      setNotFound(true)
    }

    setHasSearched(true)
    setIsSearching(false)
  }

  const currentStatusIndex = searchedTicket ? getStatusIndex(searchedTicket.status) : -1

  return (
    <PublicLayout>
      {/* Header */}
      <section className="hero-gradient py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Segui la Tua <span className="gradient-text">Riparazione</span>
            </h1>
            <p
              className="animate-fade-up delay-100 mt-4 text-lg text-muted-foreground opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              Inserisci il tuo ID ticket per vedere lo stato della riparazione
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up rounded-3xl border border-border bg-card p-6 sm:p-10">
            <div className="space-y-4">
              <div>
                <label htmlFor="ticketId" className="block text-sm font-medium">
                  ID Ticket *
                </label>
                <Input
                  id="ticketId"
                  placeholder="es. TR-ABC123"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="mt-2"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email (opzionale)
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mario.rossi@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={handleSearch} disabled={isSearching || !ticketId.trim()} className="w-full rounded-full">
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ricerca in corso...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Cerca Riparazione
                  </>
                )}
              </Button>
            </div>

            {/* Demo hint */}
            <div className="mt-6 rounded-xl bg-secondary/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Demo:</span> Prova con{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">TR-ABC123</code> o{" "}
                <code className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">TR-DEF456</code>
              </p>
            </div>
          </div>

          {/* Not Found */}
          {notFound && hasSearched && (
            <div className="animate-fade-up mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
              <p className="font-medium text-destructive">Nessuna riparazione trovata</p>
              <p className="mt-2 text-sm text-muted-foreground">Verifica che l'ID ticket sia corretto e riprova.</p>
            </div>
          )}

          {/* Result */}
          {searchedTicket && (
            <div className="animate-fade-up mt-8 space-y-6">
              {/* Ticket Info */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold">
                        {searchedTicket.brand} {searchedTicket.model}
                      </h2>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {searchedTicket.id}
                      </span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{searchedTicket.issue}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Negozio:</span>
                    <span className="font-medium">{searchedTicket.store_location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Data:</span>
                    <span className="font-medium">
                      {new Date(searchedTicket.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold">Stato della Riparazione</h3>
                <div className="mt-8 space-y-0">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex
                    const Icon = step.icon

                    return (
                      <div key={step.status} className="relative flex gap-4">
                        {/* Line */}
                        {index < statusSteps.length - 1 && (
                          <div
                            className={`absolute left-5 top-10 h-full w-0.5 -translate-x-1/2 ${
                              index < currentStatusIndex ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-smooth ${
                            isCurrent
                              ? "border-primary bg-primary text-primary-foreground animate-pulse-glow"
                              : isCompleted
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <p
                            className={`font-medium ${
                              isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Ultimo aggiornamento: {new Date(searchedTicket.updated_at).toLocaleString("it-IT")}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button variant="outline" asChild className="rounded-full bg-transparent">
                  <Link href="/">Torna alla Home</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/booking">Nuova Prenotazione</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  )
}
