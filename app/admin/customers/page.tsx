"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { ErrorMessage } from "@/components/admin/error-message"
import { listRepairTickets } from "@/services/repairs"
import { Search, Phone, Mail } from "lucide-react"
import type { RepairTicket } from "@/types/repairs"

interface Customer {
  key: string
  name: string
  phone: string | null
  email: string | null
  ticketCount: number
}

export default function CustomersPage() {
  const [tickets, setTickets] = useState<RepairTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

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

  // Raggruppa i ticket per cliente (customer_name + customer_email)
  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>()

    tickets.forEach((ticket) => {
      const key = `${ticket.customer_name.toLowerCase()}_${ticket.customer_email?.toLowerCase() || ""}`

      if (customerMap.has(key)) {
        const existing = customerMap.get(key)!
        existing.ticketCount++
        // Aggiorna i dati se mancanti
        if (!existing.phone && ticket.customer_phone) {
          existing.phone = ticket.customer_phone
        }
        if (!existing.email && ticket.customer_email) {
          existing.email = ticket.customer_email
        }
      } else {
        customerMap.set(key, {
          key,
          name: ticket.customer_name,
          phone: ticket.customer_phone,
          email: ticket.customer_email,
          ticketCount: 1,
        })
      }
    })

    return Array.from(customerMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [tickets])

  const filteredCustomers = useMemo(() => {
    if (!search) return customers

    const searchLower = search.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower),
    )
  }, [customers, search])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Caricamento clienti..." />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clienti</h1>
        <p className="text-muted-foreground">
          Elenco clienti derivato dalle riparazioni ({filteredCustomers.length} di {customers.length})
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca per nome, email, telefono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <p className="text-muted-foreground">Nessun cliente trovato</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Ticket</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.key} className="cursor-pointer hover:bg-accent">
                  <TableCell>
                    <Link
                      href={`/admin/customers/${encodeURIComponent(customer.key)}`}
                      className="font-medium hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {customer.phone ? (
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.email ? (
                      <a
                        href={`mailto:${customer.email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
                      {customer.ticketCount}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
