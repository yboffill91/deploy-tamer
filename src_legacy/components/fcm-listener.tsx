"use client";
import { useEffect } from "react";
import { requestToken, onMessageListener } from "@/lib/firebase";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";

export default function FCMListener() {
  const setFcmToken = useAuthStore((s) => s.setFcmToken);

  useEffect(() => {
    console.log("🔄 Iniciando FCM listener...");

    requestToken().then((token) => {
      if (token) {
        console.log("el token: ", token);
        setFcmToken(token); // 🔑 Guardamos en store global
      } else {
        console.warn("❌ No se pudo obtener el token FCM");
      }
    });

    onMessageListener()
      .then((payload: any) => {
        console.log("📨 Notificación recibida:", payload);
        if (payload?.notification) {
          toast.info(`${payload.notification.title}\n${payload.notification.body}`);
        }
      })
      .catch((error) => {
        console.error("Error en onMessageListener:", error);
      });
  }, [setFcmToken]);

  return null;
}
