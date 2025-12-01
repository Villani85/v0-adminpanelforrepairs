"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  compatibleDevices: string
  quantity: number
  cost: number
  price: number
}

// Dati mock per l'inventario
const initialInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Schermo LCD iPhone 13",
    category: "Schermi",
    compatibleDevices: "iPhone 13, iPhone 13 Pro",
    quantity: 5,
    cost: 65.0,
    price: 89.0,
  },
  {
    id: "2",
    name: "Batteria iPhone 12",
    category: "Batterie",
    compatibleDevices: "iPhone 12, iPhone 12 Pro",
    quantity: 12,
    cost: 25.0,
    price: 45.0,
  },
  {
    id: "3",
    name: "Schermo Samsung Galaxy S21",
    category: "Schermi",
    compatibleDevices: "Galaxy S21, S21+",
    quantity: 3,
    cost: 85.0,
    price: 120.0,
  },
  {
    id: "4",
    name: "Connettore di ricarica USB-C",
    category: "Connettori",
    compatibleDevices: "Universale Android",
    quantity: 25,
    cost: 5.0,
    price: 15.0,
  },
  {
    id: "5",
    name: "Tastiera Laptop HP",
    category: "Tastiere",
    compatibleDevices: "HP Pavilion 15",
    quantity: 2,
    cost: 35.0,
    price: 55.0,
  },
  {
    id: "6",
    name: "SSD 256GB SATA",
    category: "Storage",
    compatibleDevices: "Laptop universale",
    quantity: 8,
    cost: 40.0,
    price: 65.0,
  },
]

const categories = ["Schermi", "Batterie", "Connettori", "Tastiere", "Storage", "Altro"]

export default function InventoryPage() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    compatibleDevices: "",
    quantity: 0,
    cost: 0,
    price: 0,
  })

  const filteredInventory = inventory.filter((item) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.compatibleDevices.toLowerCase().includes(searchLower)
    )
  })

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({
      name: "",
      category: "",
      compatibleDevices: "",
      quantity: 0,
      cost: 0,
      price: 0,
    })
    setModalOpen(true)
  }

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      compatibleDevices: item.compatibleDevices,
      quantity: item.quantity,
      cost: item.cost,
      price: item.price,
    })
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Errore",
        description: "Nome e categoria sono obbligatori",
        variant: "destructive",
      })
      return
    }

    if (editingItem) {
      // Modifica
      setInventory((prev) => prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)))
      toast({
        title: "Pezzo aggiornato",
        description: `${formData.name} è stato aggiornato`,
      })
    } else {
      // Nuovo pezzo
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
      }
      setInventory((prev) => [...prev, newItem])
      toast({
        title: "Pezzo aggiunto",
        description: `${formData.name} è stato aggiunto all'inventario`,
      })
    }

    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id))
    toast({
      title: "Pezzo eliminato",
      description: "Il pezzo è stato rimosso dall'inventario",
    })
  }

  const totalValue = inventory.reduce((acc, item) => acc + item.quantity * item.cost, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="text-muted-foreground">Gestione ricambi e pezzi di ricambio</p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Pezzo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Totale pezzi</p>
          <p className="text-2xl font-bold">{inventory.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Quantità totale</p>
          <p className="text-2xl font-bold">{inventory.reduce((acc, item) => acc + item.quantity, 0)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Valore magazzino</p>
          <p className="text-2xl font-bold">{totalValue.toFixed(2)} €</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca per nome, categoria, dispositivi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {filteredInventory.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nessun pezzo trovato</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Dispositivi Compatibili</TableHead>
                <TableHead className="text-center">Quantità</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead className="text-right">Prezzo</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.compatibleDevices}</TableCell>
                  <TableCell className="text-center">
                    <span className={item.quantity <= 3 ? "text-red-600 font-medium" : ""}>{item.quantity}</span>
                  </TableCell>
                  <TableCell className="text-right">{item.cost.toFixed(2)} €</TableCell>
                  <TableCell className="text-right">{item.price.toFixed(2)} €</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        * I dati dell'inventario sono salvati localmente. L'integrazione con Supabase verrà aggiunta in futuro.
      </p>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Modifica Pezzo" : "Nuovo Pezzo"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nome del pezzo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, category: v }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compatibleDevices">Dispositivi Compatibili</Label>
              <Input
                id="compatibleDevices"
                value={formData.compatibleDevices}
                onChange={(e) => setFormData((prev) => ({ ...prev, compatibleDevices: e.target.value }))}
                placeholder="iPhone 13, Galaxy S21..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantità</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number.parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Costo (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cost: Number.parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSubmit}>{editingItem ? "Salva Modifiche" : "Aggiungi"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
