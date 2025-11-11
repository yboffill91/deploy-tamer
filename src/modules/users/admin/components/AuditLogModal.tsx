"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LogsEntity } from "@/core/entities";

interface AuditLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditLog: LogsEntity | null;
}

export function AuditLogModal({
  open,
  onOpenChange,
  auditLog,
}: AuditLogModalProps) {
  if (!auditLog) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parseData = (data: string | Record<string, any>) => {
    if (typeof data === "string") {
      return data || "No data";
    }
    return data;
  };

  const oldData = parseData(auditLog.oldData!);
  const newData = parseData(auditLog.newData!);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Audit Log Details
            <Badge
              variant={
                auditLog.action === "CREATE"
                  ? "default"
                  : auditLog.action === "UPDATE"
                  ? "secondary"
                  : "destructive"
              }
            >
              {auditLog.action}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground">Table Name</p>
              <p className="font-semibold">{auditLog.tableName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Record ID</p>
              <p className="font-semibold">{auditLog.recordId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Changed By</p>
              <p className="font-semibold">{auditLog.changedBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timestamp</p>
              <p className="font-semibold">
                {new Date(auditLog.timestamp!).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Old Data */}
          {auditLog.action !== "CREATE" && (
            <div>
              <h3 className="font-semibold mb-2">Old Data</h3>
              <div className="bg-secondary/30 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(oldData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* New Data */}
          {auditLog.action !== "DELETE" && (
            <div>
              <h3 className="font-semibold mb-2">New Data</h3>
              <div className="bg-primary/10 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(newData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
