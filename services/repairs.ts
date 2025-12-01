import { getSupabaseClient } from "@/lib/supabase-client"
import type { RepairTicket, CreateRepairTicketInput, UpdateRepairTicketInput } from "@/types/repairs"

export async function listRepairTickets(): Promise<RepairTicket[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("repairs").select("*").order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Errore nel caricamento dei ticket: ${error.message}`)
  }

  return data || []
}

export async function getRepairTicket(id: string): Promise<RepairTicket | null> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("repairs").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw new Error(`Errore nel caricamento del ticket: ${error.message}`)
  }

  return data
}

export async function createRepairTicket(input: CreateRepairTicketInput): Promise<RepairTicket> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("repairs")
    .insert([
      {
        ...input,
        status: input.status || "received",
        priority: input.priority || "medium",
      },
    ])
    .select()
    .single()

  if (error) {
    throw new Error(`Errore nella creazione del ticket: ${error.message}`)
  }

  return data
}

export async function updateRepairTicket(id: string, input: UpdateRepairTicketInput): Promise<RepairTicket> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("repairs").update(input).eq("id", id).select().single()

  if (error) {
    throw new Error(`Errore nell'aggiornamento del ticket: ${error.message}`)
  }

  return data
}

export async function deleteRepairTicket(id: string): Promise<void> {
  const supabase = getSupabaseClient()

  const { error } = await supabase.from("repairs").delete().eq("id", id)

  if (error) {
    throw new Error(`Errore nell'eliminazione del ticket: ${error.message}`)
  }
}
