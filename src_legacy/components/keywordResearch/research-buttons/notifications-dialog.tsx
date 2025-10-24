"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsDialog = ({ open, onOpenChange }: NotificationsDialogProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader className="pt-6 pr-8">
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>

        <div className="mt-6 px-4">
          <p className="text-muted-foreground">No new notifications</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
