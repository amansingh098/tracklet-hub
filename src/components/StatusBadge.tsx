
import { OrderStatus } from "@/lib/types";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusColor,
        className
      )}
    >
      {statusLabel}
    </span>
  );
};

export default StatusBadge;
