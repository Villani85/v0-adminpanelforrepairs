import { cn } from "@/lib/utils"
import { PRIORITY_LABELS, PRIORITY_COLORS, type Priority } from "@/types/repairs"

interface PriorityBadgeProps {
  priority: Priority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        PRIORITY_COLORS[priority],
        className,
      )}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
