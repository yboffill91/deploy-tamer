"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

export function DeviceWarningModal() {
  const { device, mounted } = useDeviceDetection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!mounted) return;

    const hasSeenWarning = localStorage.getItem("device-warning-seen");
    if (device !== "desktop" && !hasSeenWarning) {
      setOpen(true);
      localStorage.setItem("device-warning-seen", "true");
    }
  }, [device, mounted]);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <DialogTitle className=" text-lg tracking-tighter">
              Optimal Experience Recommendation
            </DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {device === "mobile" ? (
              <>
                <span className="text-base font-medium text-foreground mb-3 block">
                  You are using a mobile device
                </span>
                <span className="text-sm leading-relaxed">
                  You can continue navigating and using all features of this
                  tool on your mobile device. However, we recommend using a
                  desktop or laptop computer for the best experience, as all
                  content and features are optimized for larger screens.
                </span>
              </>
            ) : (
              <>
                <span className="text-base font-medium text-foreground mb-3 block">
                  You are using a tablet
                </span>
                <span className="text-sm leading-relaxed">
                  You can continue navigating and using all features of this
                  tool on your tablet. However, we recommend using a desktop or
                  laptop computer for the best experience, as all content and
                  features are optimized for larger screens.
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1"
          >
            Continue on {device === "mobile" ? "Mobile" : "Tablet"}
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              localStorage.removeItem("device-warning-seen");
            }}
            className="flex-1"
          >
            Show Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
