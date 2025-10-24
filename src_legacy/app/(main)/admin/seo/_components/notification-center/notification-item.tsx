import React from "react";
import { X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status?: "pending" | "completed" | "error";
  onDismiss: (id: string) => void;
}

const statusIcons = {
  pending: Clock,
  completed: CheckCircle2,
  error: AlertCircle,
};

const statusStyles = {
  pending: "text-yellow-500",
  completed: "text-green-500",
  error: "text-red-500",
};

export const NotificationItem = ({
  id,
  title,
  message,
  timestamp,
  status = "pending",
  onDismiss,
}: NotificationItemProps) => {
  const StatusIcon = statusIcons[status];

  return (
    <div className="bg-card animate-in slide-in-from-right flex items-start gap-4 rounded-lg border p-4">
      <div className={cn("flex min-w-0 flex-1 items-start gap-3", statusStyles[status])}>
        <StatusIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-muted-foreground mt-1 text-sm break-words">{message}</p>
          <time className="text-muted-foreground mt-2 block text-xs">{timestamp}</time>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onDismiss(id)}>
        <X className="h-4 w-4" />
        <span className="sr-only">Dismiss notification</span>
      </Button>
    </div>
  );
};
