"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  status?: "pending" | "completed" | "error";
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    const newSocket = io("https://api.pancho.ngrok.io", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("keyword_request1", (data: any) => {
      const status: Notification["status"] = data.keyword_request_finished === "Yes" ? "completed" : "pending";
      const action = data.keyword_request_finished === "Yes" ? "completed" : "pending";

      const notification = {
        id: Date.now().toString(),
        title: `Request #${data.keyword_request_id}`,
        message: `Keyword research ${action} for "${data.keyword_request_title || data.keyword_request_positive_keyword?.join(", ") || "Untitled Request"}"`,
        timestamp: new Date().toLocaleTimeString(),
        status,
      };

      setNotifications((prev) => [notification, ...prev]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    newSocket.on("notification", (data: Notification) => {
      setNotifications((prev) => [
        {
          ...data,
          status: data.status || "pending",
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    const handleOpenNotificationCenter = (event: CustomEvent) => {
      setSelectedRequest(event.detail.request);
      setIsOpen(true);
      setUnreadCount(0);
    };

    window.addEventListener("openNotificationCenter", handleOpenNotificationCenter as EventListener);

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      newSocket.disconnect();
      window.removeEventListener("openNotificationCenter", handleOpenNotificationCenter as EventListener);
    };
  }, [isOpen]);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setUnreadCount(0);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          {selectedRequest?.keyword_request_id && (
            <div className="bg-muted mt-2 rounded-md p-2">
              <p className="text-sm font-medium">Monitoring Request:</p>
              <p className="text-muted-foreground text-sm">
                Request #{selectedRequest.keyword_request_id} -{" "}
                {selectedRequest.keyword_request_title ||
                  selectedRequest.keyword_request_positive_keyword?.join(", ") ||
                  "Untitled Request"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">Type: {selectedRequest.keyword_request_type}</p>
            </div>
          )}
        </SheetHeader>
        <ScrollArea className="mt-4 h-[calc(100vh-8rem)]">
          <div className="flex flex-col gap-2 pr-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} onDismiss={handleDismiss} />
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
