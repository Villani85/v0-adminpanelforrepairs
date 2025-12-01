import { getSupabaseClient } from "@/lib/supabase-client"
import type { StaffMember } from "@/types/repairs"

export async function listStaff(): Promise<StaffMember[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("staff").select("*").order("name", { ascending: true })

  if (error) {
    throw new Error(`Errore nel caricamento dello staff: ${error.message}`)
  }

  return data || []
}

export async function getActiveStaff(): Promise<StaffMember[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.from("staff").select("*").eq("active", true).order("name", { ascending: true })

  if (error) {
    throw new Error(`Errore nel caricamento dello staff attivo: ${error.message}`)
  }

  return data || []
}
