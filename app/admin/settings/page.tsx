"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Save, Upload, Trash2, Plus, RefreshCw, CheckCircle2, XCircle } from "lucide-react"

interface ServiceCategory {
  id: string
  name: string
  basePrice: number
}

export default function SettingsPage() {
  const { toast } = useToast()

  // Stato impostazioni generali
  const [shopName, setShopName] = useState("TechRepair")
  const [contactEmail, setContactEmail] = useState("info@techrepair.it")
  const [contactPhone, setContactPhone] = useState("+39 02 1234567")
  const [address, setAddress] = useState("Via Roma 123, 20100 Milano")

  // Stato categorie servizi
  const [categories, setCategories] = useState<ServiceCategory[]>([
    { id: "1", name: "Sostituzione schermo", basePrice: 80 },
    { id: "2", name: "Sostituzione batteria", basePrice: 40 },
    { id: "3", name: "Riparazione connettore", basePrice: 35 },
    { id: "4", name: "Diagnostica completa", basePrice: 25 },
    { id: "5", name: "Recupero dati", basePrice: 60 },
  ])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryPrice, setNewCategoryPrice] = useState("")

  // Stato integrazione ERP
  const [erpBaseUrl, setErpBaseUrl] = useState("")
  const [erpApiKey, setErpApiKey] = useState("")
  const [syncCustomers, setSyncCustomers] = useState(false)
  const [syncTickets, setSyncTickets] = useState(false)
  const [syncInvoices, setSyncInvoices] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)

  const handleSaveGeneral = () => {
    toast({
      title: "Impostazioni salvate",
      description: "Le impostazioni generali sono state aggiornate",
    })
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: ServiceCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      basePrice: Number.parseFloat(newCategoryPrice) || 0,
    }

    setCategories((prev) => [...prev, newCategory])
    setNewCategoryName("")
    setNewCategoryPrice("")

    toast({
      title: "Categoria aggiunta",
      description: `"${newCategory.name}" è stata aggiunta`,
    })
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast({
      title: "Categoria eliminata",
      description: "La categoria è stata rimossa",
    })
  }

  const handleTestConnection = async () => {
    if (!erpBaseUrl || !erpApiKey) {
      toast({
        title: "Errore",
        description: "Inserisci URL e API Key prima di testare",
        variant: "destructive",
      })
      return
    }

    setTestingConnection(true)

    // Simulazione test connessione
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Risultato casuale per demo
    const success = Math.random() > 0.3

    setTestingConnection(false)

    if (success) {
      toast({
        title: "Connessione riuscita",
        description: "La connessione al gestionale ERP è stata verificata",
      })
    } else {
      toast({
        title: "Connessione fallita",
        description: "Impossibile connettersi al gestionale. Verifica le credenziali.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Impostazioni</h1>
        <p className="text-muted-foreground">Configura le impostazioni del negozio e le integrazioni</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Impostazioni Generali</TabsTrigger>
          <TabsTrigger value="services">Categorie Servizi</TabsTrigger>
          <TabsTrigger value="erp">Integrazione ERP</TabsTrigger>
        </TabsList>

        {/* Tab Impostazioni Generali */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informazioni Negozio</CardTitle>
              <CardDescription>Configura le informazioni di base del tuo negozio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="shopName">Nome Negozio</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Il mio negozio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input id="logo" type="file" accept="image/*" className="hidden" />
                    <Button variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Carica Logo
                    </Button>
                    <span className="text-sm text-muted-foreground">Nessun file selezionato</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email di Contatto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="info@negozio.it"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Telefono</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+39 02 1234567"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Via Roma 123, 20100 Milano"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>
                  <Save className="mr-2 h-4 w-4" />
                  Salva Impostazioni
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Categorie Servizi */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Categorie Servizi e Listini</CardTitle>
              <CardDescription>Definisci le categorie di servizi e i prezzi base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Form nuova categoria */}
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="newCategoryName">Nome Categoria</Label>
                  <Input
                    id="newCategoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Es. Sostituzione schermo"
                  />
                </div>
                <div className="w-32 space-y-2">
                  <Label htmlFor="newCategoryPrice">Prezzo Base (€)</Label>
                  <Input
                    id="newCategoryPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCategoryPrice}
                    onChange={(e) => setNewCategoryPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Aggiungi
                </Button>
              </div>

              {/* Tabella categorie */}
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Prezzo Base</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{category.basePrice.toFixed(2)} €</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <p className="text-xs text-muted-foreground">
                * I prezzi sono indicativi e possono variare in base al dispositivo
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Integrazione ERP */}
        <TabsContent value="erp">
          <Card>
            <CardHeader>
              <CardTitle>Integrazione Gestionale / ERP</CardTitle>
              <CardDescription>Configura la connessione con il tuo sistema gestionale esterno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="erpBaseUrl">ERP API Base URL</Label>
                  <Input
                    id="erpBaseUrl"
                    value={erpBaseUrl}
                    onChange={(e) => setErpBaseUrl(e.target.value)}
                    placeholder="https://api.erp.example.com/v1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="erpApiKey">API Key / Token</Label>
                  <Input
                    id="erpApiKey"
                    type="password"
                    value={erpApiKey}
                    onChange={(e) => setErpApiKey(e.target.value)}
                    placeholder="sk_live_..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Opzioni di Sincronizzazione</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Sincronizza Clienti</p>
                      <p className="text-sm text-muted-foreground">
                        Sincronizza l'anagrafica clienti con il gestionale
                      </p>
                    </div>
                    <Switch checked={syncCustomers} onCheckedChange={setSyncCustomers} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Sincronizza Ticket</p>
                      <p className="text-sm text-muted-foreground">Invia i ticket di riparazione al gestionale</p>
                    </div>
                    <Switch checked={syncTickets} onCheckedChange={setSyncTickets} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Sincronizza Fatture</p>
                      <p className="text-sm text-muted-foreground">Genera fatture automaticamente nel gestionale</p>
                    </div>
                    <Switch checked={syncInvoices} onCheckedChange={setSyncInvoices} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleTestConnection} disabled={testingConnection}>
                  {testingConnection ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Test in corso...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Test Connessione
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {erpBaseUrl && erpApiKey ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Credenziali configurate
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-amber-600" />
                      Credenziali non configurate
                    </>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                * Questa è un'anteprima UI. L'integrazione ERP reale richiede configurazione aggiuntiva.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
