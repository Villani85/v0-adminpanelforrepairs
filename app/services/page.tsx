"use client"

import type React from "react"

import { useState, useMemo, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Filter, Smartphone, Tablet, Laptop, Monitor, Gamepad2, Clock, Euro, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PublicLayout } from "@/components/public/public-layout"
import { servicesCatalog, deviceTypes, brands } from "@/data/services-catalog"

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
  console: Gamepad2,
}

function ServicesContent() {
  const searchParams = useSearchParams()
  const initialDevice = searchParams.get("device") || "all"

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDevice, setSelectedDevice] = useState(initialDevice)
  const [selectedBrand, setSelectedBrand] = useState("all")

  const filteredServices = useMemo(() => {
    return servicesCatalog.filter((service) => {
      const matchesSearch =
        service.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDevice = selectedDevice === "all" || service.device_type === selectedDevice
      const matchesBrand = selectedBrand === "all" || service.brand === selectedBrand

      return matchesSearch && matchesDevice && matchesBrand
    })
  }, [searchQuery, selectedDevice, selectedBrand])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedDevice("all")
    setSelectedBrand("all")
  }

  const hasActiveFilters = searchQuery || selectedDevice !== "all" || selectedBrand !== "all"

  return (
    <PublicLayout>
      {/* Header */}
      <section className="hero-gradient py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              I Nostri <span className="gradient-text">Servizi</span>
            </h1>
            <p
              className="animate-fade-up delay-100 mt-4 text-lg text-muted-foreground opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              Scopri tutti i servizi di riparazione disponibili per i tuoi dispositivi
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card py-6 sticky top-20 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 sm:flex-row">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cerca servizio, marca, problema..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="w-full sm:w-44">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Dispositivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i dispositivi</SelectItem>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le marche</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="shrink-0">
                Cancella filtri
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredServices.length}</span> servizi trovati
            </p>
          </div>

          {filteredServices.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">Nessun servizio trovato con i filtri selezionati.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                Cancella filtri
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service, index) => {
                const DeviceIcon = deviceIcons[service.device_type] || Smartphone
                return (
                  <div
                    key={service.id}
                    className="animate-fade-up opacity-0 group rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
                        <DeviceIcon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {service.brand}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{service.issue}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Euro className="h-4 w-4 text-primary" />
                        <span>
                          Da <span className="font-semibold text-foreground">{service.price_from}€</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{service.estimated_time}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-6 w-full rounded-full bg-transparent" variant="outline">
                      <Link
                        href={`/booking?device_type=${service.device_type}&brand=${service.brand}&issue=${encodeURIComponent(service.issue)}`}
                      >
                        Prenota Intervento
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  )
}
