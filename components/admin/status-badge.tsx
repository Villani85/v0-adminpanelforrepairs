import { cn } from "@/lib/utils"
import { STATUS_LABELS, STATUS_COLORS, type RepairStatus } from "@/types/repairs"

interface StatusBadgeProps {
  status: RepairStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        STATUS_COLORS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
