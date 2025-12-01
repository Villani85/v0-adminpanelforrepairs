"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

// Dati placeholder per i ricambi
const mockParts = [
  { id: "1", name: "Schermo LCD", quantity: 1, unitPrice: 89.0 },
  { id: "2", name: "Batteria originale", quantity: 1, unitPrice: 45.0 },
]

export function TicketParts() {
  const total = mockParts.reduce((acc, part) => acc + part.quantity * part.unitPrice, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Ricambi Utilizzati</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Aggiungi
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ricambio</TableHead>
              <TableHead className="text-center">Qtà</TableHead>
              <TableHead className="text-right">Prezzo</TableHead>
              <TableHead className="text-right">Totale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockParts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.name}</TableCell>
                <TableCell className="text-center">{part.quantity}</TableCell>
                <TableCell className="text-right">{part.unitPrice.toFixed(2)} €</TableCell>
                <TableCell className="text-right">{(part.quantity * part.unitPrice).toFixed(2)} €</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-semibold text-right">
                Totale ricambi
              </TableCell>
              <TableCell className="font-semibold text-right">{total.toFixed(2)} €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p className="mt-2 text-xs text-muted-foreground">
          * Dati placeholder - La gestione ricambi verrà collegata all'inventario
        </p>
      </CardContent>
    </Card>
  )
}
