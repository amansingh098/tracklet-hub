
import { StatusUpdate } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

interface OrderTimelineProps {
  statusHistory: StatusUpdate[];
}

const OrderTimeline = ({ statusHistory }: OrderTimelineProps) => {
  // Sort status history by timestamp (newest first for display)
  const sortedHistory = [...statusHistory].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <div className="space-y-6 py-2">
      {sortedHistory.map((update, index) => (
        <div key={index} className="relative pl-8">
          {/* Line connecting events */}
          {index !== sortedHistory.length - 1 && (
            <div className="absolute left-[0.9375rem] top-6 bottom-0 w-px bg-border -translate-x-1/2" />
          )}
          
          {/* Event icon */}
          <div className="absolute left-0 top-1">
            {index === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          
          {/* Event content */}
          <div className={cn(
            "space-y-1.5",
            index === 0 ? "opacity-100" : "opacity-80"
          )}>
            <p className="text-sm font-medium leading-none">
              {update.status.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </p>
            
            <div className="text-xs text-muted-foreground">
              {formatDate(update.timestamp)}
              {update.location && ` • ${update.location}`}
            </div>
            
            {update.note && (
              <p className="text-sm mt-1 text-muted-foreground">
                {update.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
