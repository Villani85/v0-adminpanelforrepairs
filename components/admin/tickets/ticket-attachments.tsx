"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, FileText } from "lucide-react"

export function TicketAttachments() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Foto e Allegati</CardTitle>
        <Button variant="outline" size="sm">
          <Upload className="mr-1 h-4 w-4" />
          Carica
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Placeholder per immagini */}
          <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 cursor-pointer hover:bg-muted/50">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">* Funzionalità di upload allegati - placeholder UI</p>
      </CardContent>
    </Card>
  )
}
