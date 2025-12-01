export type RepairStatus =
  | "received"
  | "under_diagnosis"
  | "waiting_parts"
  | "in_repair"
  | "ready_for_pickup"
  | "delivered"

export type Priority = "low" | "medium" | "high"

export type DeviceType = "smartphone" | "laptop" | "tablet" | "desktop" | "other"

export interface RepairTicket {
  id: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  device: string | null
  device_type: DeviceType | null
  brand: string | null
  model: string | null
  serial_number: string | null
  issue: string
  status: RepairStatus
  priority: Priority
  store_location: string | null
  appointment_date: string | null
  appointment_time: string | null
  technician_id: string | null
  technician_name: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateRepairTicketInput {
  customer_name: string
  customer_phone?: string
  customer_email?: string
  device?: string
  device_type?: DeviceType
  brand?: string
  model?: string
  serial_number?: string
  issue: string
  status?: RepairStatus
  priority?: Priority
  store_location?: string
  appointment_date?: string
  appointment_time?: string
  technician_id?: string
  technician_name?: string
  notes?: string
}

export interface UpdateRepairTicketInput {
  customer_name?: string
  customer_phone?: string
  customer_email?: string
  device?: string
  device_type?: DeviceType
  brand?: string
  model?: string
  serial_number?: string
  issue?: string
  status?: RepairStatus
  priority?: Priority
  store_location?: string
  appointment_date?: string
  appointment_time?: string
  technician_id?: string
  technician_name?: string
  notes?: string
}

export interface StaffMember {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: string
  active: boolean
  created_at: string
}

export const STATUS_LABELS: Record<RepairStatus, string> = {
  received: "Ricevuto",
  under_diagnosis: "In diagnosi",
  waiting_parts: "In attesa ricambi",
  in_repair: "In riparazione",
  ready_for_pickup: "Pronto per ritiro",
  delivered: "Consegnato",
}

export const STATUS_COLORS: Record<RepairStatus, string> = {
  received: "bg-blue-100 text-blue-800",
  under_diagnosis: "bg-yellow-100 text-yellow-800",
  waiting_parts: "bg-orange-100 text-orange-800",
  in_repair: "bg-indigo-100 text-indigo-800",
  ready_for_pickup: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Bassa",
  medium: "Media",
  high: "Alta",
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
}

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  smartphone: "Smartphone",
  laptop: "Laptop",
  tablet: "Tablet",
  desktop: "Desktop",
  other: "Altro",
}
